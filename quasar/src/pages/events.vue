<template>
<q-page q-pa-md row no-wrap items-center justify-around>
<!-- <template>
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Data NOT Available!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Click OK to return to ALL events<br>
          Data for this device might not belong to this user
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn flat label="OK" v-close-popup @click="($event) => { rack_handle(props) }"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template> -->

 <div class="q-pa-md">
    <q-table
      title="Device Events"
      class="my-sticky-header-table"
      :data="data"
      :columns="columns"
      row-key="timestamp"
      :filter="filter"
      dense
      style="height:auto;"
    >
    <template v-slot:top-left>
      <q-btn-toggle
        v-model="model"
        push
        glossy
        toggle-color="grey"
        size ='12px'
        :options="[
          {label: '', value: 'onlyalert', slot: 'one'},
          {label: '', value: 'allevents', slot: 'two'},
        ]"
      >
        <template v-slot:one>
          <q-tooltip>Only Alerts!</q-tooltip>
          <q-icon name="warning" />
        </template>
        <template v-slot:two >
          <q-tooltip>Show all Events!</q-tooltip>
          <q-icon name="select_all" />
        </template>
      </q-btn-toggle>
    </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter"  placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td style="max-width:40px">
           <q-icon :color="props.row.oaAlertColor" name="warning" style="font-size: 2em" />
          </q-td>
          <!-- <q-td :props="props" key="Warning" style="min-width:120px">
              {{ props.row.oaAlertStatusInt }}
          </q-td> -->
          <q-td key="timeStr" :props="props" style="min-width:100px; text-align:right;">
             {{ props.row.timeStr }}
          </q-td>
          <q-td style="min-width:120px;" key="MAC" :props="props">
              {{ props.row.MAC }}
          </q-td>
          <q-td style="max-width:40px" key="rackName" :props="props">
              {{ props.row.rackName }}
          </q-td>
          <q-td key="cageID" :props="props">
              {{ props.row.cageID }}
          </q-td>
          <q-td style="min-width:100px" key="deathAccuTimeRead" :props="props">
              {{ props.row.oaAlertAccuTimeRead }}
          </q-td>
          <q-td  style="text-align:center;">
            <q-btn
             flat
             rounded
             :color="props.row.voltAlertColor"
             dense
             :label='props.row.volt'
             size ='10px'/>
          </q-td>
          
          <q-td style="text-align:center;">
            <q-btn
             flat
             rounded
             :color="props.row.voltAlertColor"
             dense
             :label='props.row.voltAlert_str'
             size ='10px'/>
          </q-td>
          <q-td style="text-align:center;">
            <q-btn
             flat
             rounded
             :color="props.row.blobAlertColor"
             dense
             :label='props.row.blobAlert_str'
             size ='10px'/>
          </q-td>
          <q-td style="min-width:80px; text-align:center;">
            <q-btn
             flat
             rounded
             :color="props.row.feederAlertColor"
             dense
             :label='props.row.feederAlert_str'
             size ='10px'/>
          </q-td>
          <q-td style="min-width:80px; text-align:center;">
            <q-btn
             flat
             rounded
             :color="props.row.deathAlertInfoColor"
             dense
             :label='props.row.deathAlertInfo'
             size ='10px'/>
          </q-td>
          <q-td>
            <div class="col-4">
              <q-img
                :src="props.row.imgURL"
                :ratio="16/12"
                style="width: 50px;"
                @click=" ($event) => { URL_handle(props)} "
              />
                  <q-dialog
                  v-model="card"
                  persistent>
                    <q-card class="my-card q-pa-md" align="center">
                      <q-img
                      :src="specialURL"
                      style="width: 400px;"
                      />
                      <q-card-section>
                        <div class="row no-wrap items-center">
                          <div class="col text-h8 ellipsis">
                           {{specialURL}}
                          </div>
                          <q-card-actions align="right">
                            <q-btn label="OK" color="grey-5" v-close-popup />
                          </q-card-actions>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>
            </div>
          </q-td>

          <!-- <q-td key="remarks" :props="props">{{ props.row.remarks }}</q-td> -->
          <!-- <q-td>
            <div class="col-4">
              <q-img
                :src="props.row.IRimgURL"
                :ratio="16/12"
                style="width: 50px"
                @click=" ($event) => { IRURL_handle(props) } "
              />
                  <q-dialog
                  v-model="card1"
                  persistent>
                    <q-card class="my-card">
                      <q-img
                      :src="data[0].specialIRURL"
                      />
                      <q-card-section>
                        <div class="row no-wrap items-center">
                          <div class="col text-h8 ellipsis">
                           {{data[0].specialIRURL}}
                          </div>
                          <q-card-actions align="right">
                            <q-btn label="OK" color="grey-5" v-close-popup />
                          </q-card-actions>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>
            </div>
          </q-td> -->

        </q-tr>
      </template>
    </q-table>
  </div>
</q-page>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import {
  Loading,
  QSpinnerGears
} from 'quasar'
export default {
  name: 'app',
  data () {
    return {
      specialURL: '',
      okaudio: '',
      lostcontactaudio: '',
      alleventsvalue: false,
      persistent: false,
      model: 'onlyalert',
      genre: null,
      submitEmpty: false,
      submitResult: [],
      timestr: '',
      filter: '',
      card: false,
      card1: false,
      selected: [],
      sincelastUpdate: '',
      thisUpdateTS: '',
      dataArray: [],
      testobj: {},
      test1: {},
      count: '',
      fromNow: '',
      data: [],
      showmsg: 'yes',
      columns: [
        { name: 'icon', field: 'warning' },
        // { name: 'Warning', label: 'Warning', field: 'oaAlertStatusInt', sortable: true, align: 'center' },
        { name: 'timeStr', label: 'Update Time', field: 'timeStr', sortable: true },
        { name: 'MAC', label: 'MAC', field: 'MAC', sortable: true },
        { name: 'rackName', label: 'Rack Name', field: 'rackName', sortable: true },
        { name: 'cageID', label: 'Cage ID', field: 'cageID', sortable: true },
        // { name: 'deathAccuTimeRead', label: 'Alert Accumulated', field: 'oaAlertAccuTimeRead' },
        { name: 'volt', label: 'Batt%', field: 'volt', align: 'center' },
        { name: 'voltAlert_str', label: 'Batt Alert', field: 'voltAlert_str', align: 'center' },
        { name: 'blobAlert_str', label: 'Dirt Alert', field: 'blobAlert_str', align: 'center', sortable: true},
        { name: 'feederAlert_str', label: 'Feeder Alert', field: 'feederAlert_str', align: 'center', sortable: true },
        { name: 'deathAlertInfo', label: 'deathAlertInfo', field: 'deathAlertInfo', align: 'center', sortable: true },
        { name: 'image', label: 'image', field: 'image', align: 'left', align: 'center' },
        // { name: 'remarks', label: '備註標籤', field: 'remarks', align: 'left', align: 'center', sortable: true},
        // { name: 'IRimage', label: 'IRimage', field: 'IRimage', align: 'left', align: 'center' }
      ]
    }
  },
  created () {
    this.okaudio = new Audio('https://mk100.frrut.net/when.mp3')
    this.lostcontactaudio = new Audio('https://mk100.frrut.net/lostcontact.mp3')
    //console.log(this.$route.query)
    this.MAC = this.$route.query.MAC
    //console.log(this.MAC)
    this.topicmqtt = 'topic/event/#'
    this.$mqtt.subscribe(this.topicmqtt)
    //console.log(this.topicmqtt)
    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })

    const requestOne = axios.get('https://api.frrut.net/device-collections')
    // const requestTwo = axios.get('http://strapi.frrut.net:1337/event-lasts')
    const requestTwo = axios.get('https://api.frrut.net/last-data')
    const requestThree = axios.get('https://api.frrut.net/mk-100-users')
    // const requestFour = axios.get('https://api.frrut.net/all-data?_limit=300&_sort=timestamp:DESC')
    const requestFour = axios.get('https://api.frrut.net/all-data?_limit=1000&_sort=timestamp:DESC&MAC_ncontains=111111111111')
    axios.all([requestOne, requestTwo, requestThree, requestFour]).then(axios.spread((...responses) => {
      this.deviceCollection = responses[0].data
      this.eventLasts = responses[1].data
      var mk100users = responses[2].data
      var apiData = responses[3].data

      var userInfo = [JSON.parse(localStorage.getItem('loginInfo'))]

      //console.log('====Users Collection====')
      //console.log(JSON.stringify(userInfo))

      for (var e = 0; e < userInfo.length; e++) {
        for (var f = 0; f < mk100users.length; f++) {
          if (userInfo[e].id === mk100users[f]._id) {
            userInfo[e].role = mk100users[f].role
          }
        }
      }
      // console.log('====Userinfo====')
      // console.log(JSON.stringify(userInfo))
      // var racks = userInfo[0].rackName
      // console.log(racks)
      var role = userInfo[0].role
      // console.log(role)
      var userMAC = []
      var device_remarks = []
      if (role === 'admin') {
        this.deviceCollection.map(function (a) {
          // if (a.rackName === rack) {
          userMAC.push(a.MAC)
          device_remarks.push(a.remarks)
          // }
        })
        // console.log(userMAC)
        this.userMACList = userMAC
      }
      else {
        this.deviceCollection.map(function (a) {
          if (a.registerUserID === userInfo[0].id) {
            userMAC.push(a.MAC)
            device_remarks.push(a.remarks)
          }
        })
        // console.log(userMAC)
        this.userMACList = userMAC
      }
      //console.log('this.userMACList, userMAC')
      console.log("this.userMACList: ", this.userMACList)
      console.log("device_remarks: ", device_remarks)

      if (this.MAC !== undefined) {
        var ifMACIn = this.userMACList.filter(test => test === this.MAC).toString()
        //console.log(ifMACIn.length)

        if (ifMACIn.length === 12) {
          //console.log('this MAC is In')
          this.userMACList = [this.MAC]
          userMAC = [this.MAC]
          //console.log('update this.userMACList')
          //console.log(this.userMACList)
        } 
        else {
          console.log('Not In show warning')
          this.userMACList = []
          userMAC = []
          // this.persistent = true
        }
      }
      // console.log('*******this.deviceCollection**********')
      // console.log(JSON.stringify(this.deviceCollection))
      var fllterdeviceCollection = []
      for (var n = 0; n < userMAC.length; n++) {
        this.deviceCollection.map(function (a) {
          if (a.MAC === userMAC[n]) {
            fllterdeviceCollection.push(a)
          }
        })
      }
      // console.log("userMACList: ", this.userMACList)
      //console.log(fllterdeviceCollection.length)
      this.deviceCollection = fllterdeviceCollection
      console.log("this.deviceCollection:::::::::", this.deviceCollection)
      // console.log('*******this.eventLasts**********')
      // console.log(JSON.stringify(this.eventLasts))
      var qty = 0
      for (var a = 0; a < this.deviceCollection.length; a++) {
        for (var b = 0; b < this.eventLasts.length; b++) {
          if (this.deviceCollection[a].MAC === this.eventLasts[b].MAC) {
            qty = qty + 1
          }
        }
      }
      console.log('***qty***')
      console.log(qty)
      if (qty === 0) {
        // this.persistent = true
      }
      //console.log("api data")
      //console.log(JSON.stringify(apiData))
      console.log("userMAC: ", userMAC)
      console.log("apiData: ", apiData)

      var testdata = []
      for (var k = 0; k < userMAC.length; k++) {
        apiData.map(function (a) {
          if (a.MAC === userMAC[k]) {
            testdata.push(a)
          }
        })
      }
      // console.log(this.deviceCollection[0].MAC)
      // console.log(typeof(this.deviceCollection[0].MAC))
      // console.log(this.deviceCollection.length)
      // console.log(userMAC[0])
      // console.log(typeof(userMAC[0]))
      // console.log(userMAC.length)

      // console.log("apiData: ", apiData)
      // for (var k = 0; k < this.deviceCollection.length; k++) {
      //   apiData.map(function (a) {
      //     if (a.MAC === this.deviceCollection[k].MAC) {
      //       testdata.push(a)
      //     }
      //   })
      // }


      console.log("testdata: ", testdata)

      //console.log(testdata.length)
      //console.log("b-data")      
      
      //console.log(data)
      this.data = testdata

      // console.log(JSON.stringify(this.data))
      this.showmsg = 'no'
      Loading.hide()
      if (this.data.length === 0) {
        console.log('nothing here')
        this.alert = true
      } else {
        for (var j = 0; j < this.data.length; j++) {
          this.data[j].fromNow = moment(this.data[j].timestamp * 1000).locale('zh-TW').fromNow()
          this.data[j].timeStr = moment(this.data[j].timestamp * 1000).locale('zh-TW').format('YYYY/MM/DD HH:mm:ss')
          this.data[j].volt = parseFloat(this.data[j].volt.toFixed(2))
        }
      }
      this.data = this.data.sort((a, b) => b.timestamp - a.timestamp)

      // this.data = this.data.filter(test => test.oaAlertStatus === true)
      //console.log('this.data before done')
      
      
      // this.data = this.data.filter(test => test.oaAlertStatus === true)  #################################
      
      
      // return this.data
      // console.log(this.data)
      // this.data = this.buffArray
    })).catch(errors => {
    })

    // this.data = this.data.filter(test => test.oaAlertStatus === false)
    // this.init()
  },
  mounted () {
  },
  mqtt: {
    'topic/event/#' (data1, topic) {
      this.obj = JSON.parse(data1)
      console.log('original this.obj print')
      console.log(this.obj)
      this.timestr = this.obj.timeStr
      console.log('this.userMACList, userMAC')
      console.log(this.userMACList)
      var checkMAC = this.userMACList.filter(test => test === this.obj.MAC).toString()
      console.log(checkMAC.length)

      if (checkMAC.length === 12) {
        this.buffArray = this.data
        this.buffArray.unshift(this.obj)
        // console.log(this.buffArray.length)

        if (this.model === 'onlyalert') {
          // this.buffArray = this.buffArray.filter(test => test.oaAlertStatus === true)  #################################
          // this.data = this.data.filter(test => test.MAC !== '111111111111')
          console.log(this.model)
        }
        else if (this.model === 'allevents') {
          // this.data = this.data.filter(test => test.MAC !== '111111111111')
          console.log(this.model)
        }
        for (var j = 0; j < this.buffArray.length; j++) {
          this.buffArray[j].timeStr = moment(this.buffArray[j].timestamp * 1000).locale('zh-TW').format('YYYY/MM/DD HH:mm:ss')
          this.buffArray[j].volt = parseFloat(this.buffArray[j].volt.toFixed(2))
        }
        // this.data = this.buffArray
        var qtyMax = 300
        if (this.buffArray.length > qtyMax) {
          var temparray = []
          for (let i = 0; i < qtyMax; i++) {
            temparray.push(this.buffArray[i])
          }
          this.data = temparray
          this.playOKSound()
        } 
        else {
          console.log(this.buffArray.length)
          this.data = this.buffArray
          this.playOKSound()
        }
      } 
      else {
        console.log('not for this user, NO show')
        // this.playLostcontactSound()
      }
    }
  },
  methods: {
    playOKSound () {
      console.log('Play OK sound')
      const okaudioPromise = this.okaudio.play()
      if (okaudioPromise !== undefined) {
        okaudioPromise.then(() => {
          console.log("Finished Play OK sound")
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }
    },
    playLostcontactSound () {
      console.log(' Play Lost Contact Sound')
      const lostcontactaudioPromise = this.lostcontactaudio.play()
      if (lostcontactaudioPromise !== undefined) {
        lostcontactaudioPromise.then(() => {
          console.log("Finished Play Lost Contact sound")
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }
    },
    userInfo () {

    },
    test () {
      console.log(this.alleventsvalue)
    },
    showLoading () {
      this.$q.loading.show({
        delay: 400,
        spinner: QSpinnerGears,
        message: 'Waiting for  <b> next event </b>coming....  <br/><span class="text-primary">Please wait until message comes!</span>'
      })

      // hiding in 3s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
        this.showmsg = 'yes'
      }, 5000)
    },
    URL_handle (props) {
      if(this.card == false){
        this.card = true
      //   this.$router.push(
          console.log(props.row.imgURL)
      //     this.card = true,
          this.specialURL = props.row.imgURL
      // )
      }
      else{
        console.log('noooooooooooooooooo')
        // this.card = false
      }
    },
    rack_handle (props) {
      this.$router.push(
        { path: '/events' }
      )
    },
    // URL_handleIR (props) {
    //   this.$router.push(
    //     //console.log(props.row.imgIRURL),
    //     // { path: '/mqtttable?MAC=' + props.row.MAC }
    //     this.card1 = true,
    //     this.data[0].specialIRURL = props.row.imgIRURL
    //   )
    // }
  },

  beforeDestroy () {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  },
  computed: {}
}
</script>

<style lang="sass">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle

  .q-table__top,
  .q-table__bottom,

  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ebebeb

  thead tr th
    position: sticky
    z-index: 2
    max-width: 150px;
    font-size: 10px;
    white-space: normal;

  tbody td
    position: sticky
    z-index: 1
    max-width: 150px;
    font-size: 10px;
    white-space: normal;
    word-break: break-word;

  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
