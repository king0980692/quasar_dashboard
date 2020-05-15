<template>
<q-page q-pa-md row no-wrap items-center justify-around>
<template>
  <div class="q-pa-md q-gutter-sm">
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
          <q-btn flat label="OK" v-close-popup @click="($event) => { url_handle(props) }"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<div>
 <h4 class="flex flex-center" v-if="showmsg === 'yes'"></h4>
  <div class="q-pa-md">
    <q-table
      title="Device Messages"
      class="my-sticky-header-table"
      :dense="$q.screen.lt.md"
      :data="data"
      :columns="columns"
      :filter="filter"
      row-key="index"
      style="font-size:5px"
      dense
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      
      <template v-slot:body="props">
        <q-tr :props="props" >
          <q-td key="fromNow" :props="props" style="min-width:75px; font-size:9px;">{{ props.row.fromNow }}</q-td>
          <q-td key="timeStr" :props="props" style="min-width:80px; font-size:9px;">{{ props.row.timeStr }}</q-td>
          <q-td key="MAC" :props="props" style="min-width:110px; font-size:9px;">{{ props.row.MAC }}</q-td>
          <q-td key="rackName" :props="props" style="width:80px;">{{props.row.rackName}}</q-td>
          <q-td key="cageID" :props="props" style="max-width:40px; font-size:8px;">{{ props.row.cageID }}</q-td>     
          <q-td key="volt" :props="props" style="max-width:40px; font-size:8px;">{{ props.row.volt }}</q-td>  
          <q-td key="blob" :props="props" >{{ props.row.blob }}</q-td>    
          <q-td key="feeder" :props="props">{{ props.row.feeder }}</q-td>    
          <q-td key="result" :props="props" style="min-width:60px; font-size:8px;">{{ props.row.result }}</q-td>
          <q-td key="deathAlertInfo" :props="props" style="min-width:50px; font-size:8px;">{{ props.row.deathAlertInfo }}</q-td>
          <q-td key="gas1" :props="props" style="min-width:50px; font-size:8px;">{{ props.row.gas1 }}</q-td>
          <q-td key="gas2" :props="props">{{ props.row.gas2 }}</q-td>
          <q-td key="gas3" :props="props" style="max-width:50px; font-size:8px;">{{ props.row.gas3 }}</q-td>
          <q-td key="gas4" :props="props" style="min-width:60px; font-size:8px;">{{ props.row.gas4 }}</q-td>
          <q-td key="gas5" :props="props" style="min-width:60px; font-size:8px;">{{ props.row.gas5 }}</q-td>
          <q-td key="gas6" :props="props" style="min-width:60px; font-size:8px;">{{ props.row.gas6 }}</q-td>
          <q-td key="gas7" :props="props" style="min-width:60px; font-size:8px;">{{ props.row.gas7 }}</q-td>
          <q-td key="gas8" :props="props" style="min-width:40px; font-size:8px;">{{ props.row.gas8 }}</q-td>
        </q-tr>
      </template>

    </q-table>
  </div>
</div>
</q-page>
</template>

<style>
</style>

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
      pagination: {
        rowsPerPage: 1000
      },
      okaudio: '',
      lostcontactaudio: '',
      filter: '',
      persistent: false,
      buff: 'Sub1:<br>',
      data: [ {} ],
      deviceList: [],
      columns: [
        { name: 'fromNow', label: 'Last Update', field: 'fromNow' },
        { name: 'timeStr', label: 'Time', field: 'timeStr', sortable: true,},
        { name: 'MAC', label: 'MAC', field: 'MAC', sortable: true,},
        { name: 'rackName', label: 'rackName', field: 'rackName', sortable: true,},
        { name: 'cageID', label: 'cageID', field: 'cageID', sortable: true,},
        { name: 'volt', label: 'Batt%', field: 'volt' },
        { name: 'blob', label: 'Excrement', field: 'blob' },
        { name: 'feeder', label: 'Feeder', field: 'feeder' },
        // { name: 'bbox_count', label: 'QTY', field: 'bbox_count' },
        // { name: 'stillQty', label: 'Still QTY', field: 'stillQty' },
        { name: 'result', label: 'Still Msg', field: 'result' },
        { name: 'deathAlertInfo', label: 'Alert Status', field: 'deathAlertInfo' },
        { name: 'gas1', label: 'CO', field: 'gas1' },
        { name: 'gas2', label: 'NO2', field: 'gas2' },
        { name: 'gas3', label: 'C2H6OH', field: 'gas3' },
        { name: 'gas4', label: 'H2', field: 'gas4' },
        { name: 'gas5', label: 'NH3', field: 'gas5' },
        { name: 'gas6', label: 'CH4', field: 'gas6' },
        { name: 'gas7', label: 'C3H8', field: 'gas7' },
        { name: 'gas8', label: 'C4H10', field: 'gas8' }
      ]
    }
  },
  created () {
    this.okaudio = new Audio('https://mk100.frrut.net/when.mp3')
    this.lostcontactaudio = new Audio('https://mk100.frrut.net/lostcontact.mp3')
    if (localStorage.getItem('reloaded')) {
      localStorage.removeItem('reloaded')
    } else {
      localStorage.setItem('reloaded', '1')
      location.reload()
    }
    console.log(this.$route.query)
    this.MAC = this.$route.query.MAC
    console.log(this.MAC)
    this.topicmqtt = 'topic/event/#'
    this.$mqtt.subscribe(this.topicmqtt)
    console.log(this.topicmqtt)
    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })

    const requestOne = axios.get('http://strapi.frrut.net:1337/device-collections')
    const requestTwo = axios.get('http://strapi.frrut.net:1337/last-data')
    // const requestTwo = axios.get('http://strapi.frrut.net:1337/event-lasts')
    const requestThree = axios.get('http://strapi.frrut.net:1337/mk-100-users')
    axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      this.deviceCollection = responses[0].data
      var apiData = responses[1].data
      var mk100users = responses[2].data

      var userInfo = [JSON.parse(localStorage.getItem('loginInfo'))]

      console.log('====Users Collection====')
      console.log(JSON.stringify(userInfo))

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
      if (role === 'admin') {
        this.deviceCollection.map(function (a) {
          userMAC.push(a.MAC)
        })
        console.log(userMAC)
        this.userMACList = userMAC
      } 
      else {
        this.deviceCollection.map(function (a) {
          if (a.registerUserID === userInfo[0].id) {
            userMAC.push(a.MAC)
          }
        })
        // console.log(userMAC)
        this.userMACList = userMAC
      }
      console.log('this.userMACList, userMAC')
      console.log(this.userMACList)

      if (this.MAC !== undefined) {
        var ifMACIn = this.userMACList.filter(test => test === this.MAC).toString()
        console.log(ifMACIn.length)

        if (ifMACIn.length === 12) {
          console.log('this MAC is In')
          this.userMACList = [this.MAC]
          userMAC = [this.MAC]
          console.log('update this.userMACList')
          console.log(this.userMACList)
        } else {
          console.log('Not In show warning')
          this.userMACList = []
          userMAC = []
          this.persistent = true
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
      console.log(fllterdeviceCollection.length)
      this.deviceCollection = fllterdeviceCollection
      console.log("this.deviceCollection: ", this.deviceCollection)

      console.log("apiData: ", apiData)
      var qty = 0
      for (var a = 0; a < this.deviceCollection.length; a++) {
        for (var b = 0; b < apiData.length; b++) {
          if (apiData[b].MAC === this.deviceCollection[a].MAC) {
            qty = qty + 1
            apiData[b].cageID = this.deviceCollection[a].cageID
            apiData[b].rackName = this.deviceCollection[a].rackName
          }
        }
      }
      console.log('***qty***')
      console.log(qty)
      if (qty === 0) {
        this.persistent = true
      }

      // console.log(JSON.stringify(apiData))
      var testdata = []
      for (var k = 0; k < userMAC.length; k++) {
        apiData.map(function (apiData) {
          if (apiData.MAC === userMAC[k]) {
            testdata.push(apiData)
          }
        })
      }

      console.log("testdata_length: ",testdata.length)
      // this.data = testdata

      // console.log(JSON.stringify(this.data))
      this.showmsg = 'no'
      Loading.hide()
      if (testdata.length === 0) {
        console.log('nothing here')
        this.alert = true
      } else {
        for (var j = 0; j < testdata.length; j++) {
          testdata[j].fromNow = moment(testdata[j].timestamp * 1000).locale('zh-TW').fromNow()
          testdata[j].timeStr = moment(testdata[j].timestamp * 1000).locale('zh-TW').format('YYYY/MM/DD HH:mm:ss')
          // testdata[j].gas6 = testdata[j].gas6 * 1000
          // testdata[j].gas7 = testdata[j].gas7 * 1000
          testdata[j].gas6 = parseFloat(testdata[j].gas6.toFixed(6))
          testdata[j].gas7 = parseFloat(testdata[j].gas7.toFixed(6))
          testdata[j].gas8 = parseFloat(testdata[j].gas8.toFixed(6))

        }
      }
      
      this.data = testdata
      this.data = this.data.sort((a, b) => b.timestamp - a.timestamp)
      this.buffArray = testdata
      
      console.log("this.data: ", this.data)
      // this.data = this.data.filter(test => test.oaAlertStatus === true)
      // console.log('this.data before done')
      // this.data = this.data.filter(test => test.oaAlertStatus === true)
      // return this.data
      // console.log(this.data)

      // this.data = this.buffArray
    })).catch(errors => {
    })
  },
  mounted () {
  },
  // mqtt: {
  //   // 'topic/mac/#' (data, topic) {
  // 'topic/event/#' (data, topic) {
  //     this.obj = JSON.parse(data)
  //     var checkMAC = this.userMACList.filter(test => test === this.obj.MAC).toString()
  //     console.log(checkMAC.length)
  //     if (checkMAC.length === 12) {
  //       this.array = [this.obj]
  //       console.log(JSON.stringify(this.array))
  //       console.log('print thisbuffarray')
  //       console.log(this.buffArray)
  //       this.tempbuffarray = this.buffArray
  //       this.buffArray2 = this.tempbuffarray.concat(this.array)
  //       // console.log('*****Add print thisbuffarray*******')
  //       // console.log(JSON.stringify(this.buffArray2))
  //       // console.log(JSON.stringify(this.buffArray2.length))
  //       // this.buff = JSON.stringify(this.buffArray)
  //       this.buffArray1 = this.buffArray2.sort((a, b) => b.timestamp - a.timestamp)
  //       // this.data1 = this.buffArray1
  //       // this.buffArray = this.buffArray1
  //       for (var j = 0; j < this.buffArray1.length; j++) {
  //         this.buffArray1[j].fromNow = moment(this.buffArray1[j].timestamp * 1000).locale('zh-TW').fromNow()
  //         this.buffArray1[j].timeStr = moment(this.buffArray1[j].timestamp * 1000).locale('zh-TW').format('YYYY/MM/DD HH:mm:ss')
  //         this.buffArray1[j].gas6 = parseFloat(this.buffArray1[j].gas6.toFixed(6))
  //         this.buffArray1[j].gas7 = parseFloat(this.buffArray1[j].gas7.toFixed(6))
  //         this.buffArray1[j].gas8 = parseFloat(this.buffArray1[j].gas8.toFixed(6))

  //       }
  //       // this.data = this.buffArray1
  //       // this.buffArray = this.buffArray1
  //       // console.log(JSON.stringify(this.data))
  //       // console.log(JSON.stringify(this.data.length))
  //       // console.log(JSON.stringify(this.data))
  //       var qtyMax = 100
  //       if (this.buffArray1.length > qtyMax) {
  //         var temparray = []
  //         for (let i = 0; i < qtyMax; i++) {
  //           temparray.push(this.buffArray1[i])
  //         }
  //         console.log(temparray.length)
  //         this.data = temparray
  //         this.buffArray = temparray
  //         console.log(JSON.stringify(this.data))
  //         console.log(JSON.stringify(this.data.length))
  //         this.playOKSound()
  //       } 
  //       else {
  //         console.log(this.buffArray1.length)
  //         this.data = this.buffArray1
  //         this.buffArray = this.buffArray1
  //         this.playOKSound()
  //       }
  //       // console.log(temparray.length)
  //       // this.buffArray = temparray
  //     } 
  //     else {
  //       console.log('not for this user, NO show')
  //       this.playLostcontactSound()
  //     }
  //   }
  // },
  methods: {
    url_handle (props) {
      this.$router.push(
        { path: '/' }
      )
    },
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
  },
  computed: {}
}
</script>

<style lang="sass" >
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    max-height: 800px

  .q-table__top,
  .q-table__bottom,

  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ebebeb

  thead tr th
    position: sticky
    z-index: 2
    max-width: 200px;
    font-size: 9px;
    white-space: normal;

  tbody td
    position: sticky
    z-index: 1
    max-width: 200px;
    font-size: 9px;
    white-space: normal;
    word-break: break-word;


  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

</style>
