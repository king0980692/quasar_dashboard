<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>

    <q-dialog v-model="newrackDialog">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Create New Racks</div>
          </br>
          <q-input              
            filled
            v-model="rack_data"
            type="text"
            placeholder="New Racks"
            :rules="[ val => verify_columns('rack', val)]">
            <template v-slot:prepend>
              <q-icon name = "grid_on"></q-icon>
            </template>
          </q-input>
          </br>
          <q-btn color="primary" align="left" :disable="toDisable" style="margin-right:40px" label="Submit" @click="addnewRack" />
          <q-btn color="white" text-color="black" style="margin-left:40px" align="right" label="Cancel" @click="control_dialog('close_newrack')" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="register_fail" persistent >
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Add New Rack failed. Please check again!
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="register_suc" persistent >
      <q-card>
        <q-card-section>
          <div class="text-h6">Congratulation!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Add New Rack Success!
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" persistent v-close-popup @click="suc_reload" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <div class="row items-start">
      <div class="col">
          <q-space />
        {{timestr}}
          <q-space />
          <q-space />
    </div>
    </div>

   <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
        <q-avatar icon="report_off" color="primary" text-color="white" />
          No data available from this device
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
 <div class="q-pa-md">
    <q-table
      title="Rack List"
      :data="data"
      :columns="columns"
      row-key="group"
      :filter="filter"
      class="my-sticky-virtscroll-table"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="group"
          :props="props"
          @click="($event) => { rack_handle(props) }"
          >
          <q-btn flat color="white" text-color="primary" :label="props.row.group" />
          </q-td>
          <q-td key="qty" :props="props">
            <q-badge color="purple" class="text-h7">
              {{ props.row.qty }}
            </q-badge>
          </q-td>
          <q-td key="cages" :props="props">
            <div class="text-right">{{ props.row.cages }}</div>
          </q-td>
          <q-td key="shortmac" :props="props">
            <div class="text-right">{{ props.row.shortmac }}</div>
          </q-td>
          <q-td>
            <q-btn
             flat
             rounded
             color="primary"
             dense
             @click="($event) => { rack_handle(props) }"
             icon="dashboard"
             :label="props.row.group"
             class="text-right" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[25, 25]">
      <q-fab
        icon="add"
        direction="up"
        color="primary"
      >
        <q-fab-action @click="control_dialog('open_newrack')" color="primary" icon="grid_on">
          <q-tooltip anchor="center left" self="center right">New Rack</q-tooltip>
        </q-fab-action>
        <!-- <q-fab-action @click="onClick" color="primary" icon="mail" /> -->
      </q-fab>
    </q-page-sticky>

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
var exist_rack = ["0"]
var tblogin_useremail = ''
var check_flag = false
var test = false
var addnewRackURL = 'https://mk100.frrut.net:1880/addnewRack'

export default {
  name: 'app',
  data () {
    return {
      rack_data: '',
      newrackDialog: false,
      register_fail: false,
      register_suc: false,
      alleventsvalue: false,
      toDisable: true,
      alert: false,
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
        { name: 'group', label: 'Rack', field: 'group', sortable: true },
        { name: 'qty', label: 'activated cages', field: 'qty', sortable: true },
        { name: 'cages', label: 'cages #', field: 'cages', sortable: true },
        { name: 'shortmac', label: 'ID last 3', field: 'shortmac', sortable: true },
        { name: 'detail', label: 'Rack', field: 'MAC', align: 'left', sortable: true }
      ],
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  created () {
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    axios.get('http://strapi.frrut.net:1337/mk-100-users/')
      .then(response => {
        this.getdata = response.data
        this.tblogin_useremail = this.getdata.find(x => x.id === this.loginInfo.id).email
        console.log(this.tblogin_useremail)
      })
    console.log(this.$route.query)
    this.MAC = this.$route.query.MAC
    console.log(this.MAC)
    if (this.MAC === undefined) {
      this.topicmqtt = 'topic/event/#'
    } else {
      this.topicmqtt = 'topic/event/' + this.MAC
    }
    this.$mqtt.subscribe(this.topicmqtt)
    console.log(this.topicmqtt)
    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })

    const requestOne = axios.get('http://strapi.frrut.net:1337/device-collections?MAC_ne=111111111111')
    const requestTwo = axios.get('http://strapi.frrut.net:1337/event-lasts')
    const requestThree = axios.get('http://strapi.frrut.net:1337/mk-100-users')
    axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      this.deviceCollection = responses[0].data
      this.eventLasts = responses[1].data
      var mk100users = responses[2].data
      var user_rack = responses[2].data
      console.log('user_info: ', user_rack)
      user_rack = user_rack.filter(e => e.id === this.loginInfo.id)
      console.log('user_rack: ', user_rack)
      for (var i = 0; i < user_rack.length; i++) {
        for (var j = 0; j < user_rack[i].respRack.length; j++) {
            exist_rack.push(user_rack[i].respRack[j])
        }
      }
      // exist_rack = Set(exist_rack)
      exist_rack = Array.from(new Set(exist_rack));
      console.log('exist_rack: ', exist_rack)
      //console.log(response.data)
      // console.log('====deviceCollection====')
      // console.log(JSON.stringify(this.deviceCollection))
      console.log('====Users Collection====')
      console.log(JSON.stringify(mk100users))

      var userInfo = [JSON.parse(localStorage.getItem('loginInfo'))]

      console.log('====Users Collection====')
      console.log(JSON.stringify(userInfo))

      for (var e = 0; e < userInfo.length; e++) {
        for (var f = 0; f < mk100users.length; f++) {
          if (userInfo[e].id === mk100users[f]._id) {
            userInfo[e].groups = mk100users[f].groups
            userInfo[e].role = mk100users[f].role
          }
        }
      }
      console.log('====Userinfo====')
      console.log(userInfo)
      var racks = userInfo[0].groups
      console.log(racks)
      var role = userInfo[0].role
      console.log(role)

      for (var m = 0; m < this.deviceCollection.length; m++) {
        for (var j = 0; j < this.eventLasts.length; j++) {
          if (this.deviceCollection[m].MAC === this.eventLasts[j].MAC) {
            this.deviceCollection[m].cageID = this.eventLasts[j].cageID
            this.deviceCollection[m].fromNow = moment(this.eventLasts[j].timestamp * 1000).locale('zh-TW').fromNow()
            this.deviceCollection[m].timeRead = this.eventLasts[j].timeRead
            this.deviceCollection[m].deathAccuTimeRead = this.eventLasts[j].deathAccuTimeRead
            this.deviceCollection[m].timestamp = this.eventLasts[j].timestamp
            // this.deviceCollection[m].shortMac = this.deviceCollection[m].MAC.slice(-3)
            this.showmsg = 'no'
            Loading.hide()
          }
        }
      }
      // console.log('====2nd this.deviceCollection====')
      // console.log(JSON.stringify(this.deviceCollection))
      this.deviceCollection.map(function (a) {
        a.shortMac = a.MAC.slice(-3)
      })
      // console.log('====deviceCollection*******====')
      // console.log(JSON.stringify(this.deviceCollection))

      let group = this.deviceCollection.map((item) => item.group).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
        let maclist = this.deviceCollection.filter(itm => itm.group === item).map(itm => itm.MAC)
        var qty = maclist.length
        let cageid = JSON.stringify(this.deviceCollection.filter(itm => itm.group === item).map(itm => itm.cageID))
        cageid = cageid.replace('[', '')
        cageid = cageid.replace(']', '')
        let shortmac = JSON.stringify(this.deviceCollection.filter(itm => itm.group === item).map(itm => itm.shortMac))
        shortmac = shortmac.replace('[', '')
        shortmac = shortmac.replace(']', '')
        shortmac = shortmac.replace(/['"]+/g, '')
        return { group: item, maclist: maclist, cages: cageid, qty: qty, shortmac: shortmac }
      })
      console.log(JSON.stringify(group))
      // this.data = group
      if (role !== 'admin') {
        var fllterRacks = []
        for (var n = 0; n < racks.length; n++) {
          group.map(function (a) {
            if (a.group === racks[n]) {
              fllterRacks.push(a)
            }
          })
        }
      } else {
        fllterRacks = group
        console.log('filterRacks')
      }
      console.log(fllterRacks)
      console.log(fllterRacks.length)
      this.data = fllterRacks
      // we generate lots of rows here
      let data = []
      for (let i = 0; i < 1000; i++) {
        data = data.concat(this.data.slice(0).map(r => ({ ...r })))
      }
      data.forEach((row, index) => {
        row.index = index
      })
      Object.freeze(data)
      data = this.data
      // this.data.cages = this.data.cages.replace('[', '')
      // this.data.cages = this.data.cages.replace(']', '')
      // console.log('====this.data====')
      // console.log(JSON.stringify(this.data))
    })).catch(errors => {
    })
  },
  mounted () {
  },
  mqtt: {
    'topic/event/#' (data1, topic) {
      console.log('topic(this.topicmqtt): ' + this.topicmqtt)
      this.obj = JSON.parse(data1)
      // console.log('original this.obj print')
      // console.log(this.obj)
      if (this.buffArray === undefined) {
        for (var m = 0; m < this.dataArray.length; m++) {
          for (var j = 0; j < this.deviceCollection.length; j++) {
            if (this.dataArray[m].cageID === this.deviceCollection[j].cageID) {
              this.dataArray[m].MAC = this.deviceCollection[j].MAC
              this.dataArray[m].id = this.deviceCollection[j].id
              // this.dataArray[m].testtest = this.deviceCollection[j].id
            }
          }
        }
        console.log('new this.dataArray.length')
        console.log(JSON.stringify(this.dataArray))
        console.log(this.dataArray.length)

        this.showmsg = 'no'
        Loading.hide()
        this.dataArray[0].initTS = Date.now()
        this.dataArray[0].thisUpdateTS = Date.now()
        this.dataArray[0].count = 1
        this.sincelastUpdate = 'just now'
        this.fromNow = 'just now'
        this.count = 1
        console.log('print this.data')
        console.log(this.dataArray)
        console.log(' first****** this.obj print')
        console.log(this.obj)
        this.dataArray[this.obj.cageID - 1] = this.obj
        console.log('print ******first array this.data')
        console.log(this.dataArray)
        console.log(Array.isArray(this.dataArray))
        this.buffArray = this.dataArray
        // stange to have this to work
        this.test1 = JSON.stringify(Math.floor(Math.random() * 10))
      } else {
        this.buffArray[this.obj.cageID - 1] = this.obj
        this.dataArray = this.buffArray
        console.log('print 2nd + this.data')
        console.log(this.dataArray)
        console.log(Array.isArray(this.dataArray))
        this.count = this.count + 1
        this.dataArray[0].count = this.count
        this.sincelastUpdate = moment(this.dataArray[0].thisUpdateTS).locale('zh-TW').fromNow()
        this.fromNow = moment(this.dataArray[0].initTS).locale('zh-TW').fromNow()
        this.test1 = JSON.stringify(Math.floor(Math.random() * 10))
        this.dataArray[0].thisUpdateTS = Date.now()
      }
    }
  },
  methods: {
    MAC_handle (MAC) {
      console.log(MAC)
      this.$router.push(
        { path: '/events?MAC=' + MAC }
      )
    },
    EventHistory (MAC) {
      console.log(MAC)
      this.$router.push(
        { path: '/eventshistory?MAC=' + MAC }
      )
    },
    RealTimeSignal (MAC) {
      console.log(MAC)
      this.$router.push(
        { path: '/mqttall?MAC=' + MAC }
      )
    },
    rack_handle (props) {
      this.$router.push(
        { path: '/cagedash?rack=' + props.row.group }
      )
    },
    getId () {
      var getinfo = localStorage.getItem('loginInfo')
      if (getinfo) {
        var jsoninfo = JSON.parse(getinfo)
        var userId = jsoninfo.id
        this.userId = userId
        console.log(userId)
      } else {
        console.log('NO ID, not login')
      }
    },
    control_dialog(input){
      switch(input){
        case 'open_newrack':
          this.newrackDialog = true
          this.rack_data = ''
          break;
        case 'close_newrack':
          this.newrackDialog = false
          this.rack_data = ''
          break;
        default:
          this.newrackDialog = false
          this.rack_data = ''
          break;
      }
    },
    verify_columns(which, val){
      switch(which)
      {
        case 'rack':
          function existRack(rack){
            if(exist_rack.includes(rack))
              return false
            else{
              return true
            }
          }
          
          return new Promise((resolve, reject) => {
            if (test){
              resolve(test)
              test = false
              this.toDisable = true
            }
            else if(!val){
              resolve(!!val || 'Can\'t be empty.')
              check_flag = false
              this.toDisable = true}
            else if(!existRack(val.toLowerCase())){
              resolve(existRack(val.toLowerCase()) || 'The Rack has already exist.')
              check_flag = false
              this.toDisable = true}
            else{
              resolve(val=> val || '')
              check_flag = true
              this.toDisable = false}
          })
          break;
 
        default:
          alert("Something wrong.");
      }
    },
    addnewRack() {
      if(check_flag){
        var rack_list = exist_rack
        // console.log(exist_rack.length)
        // for(var i = 0; i < exist_rack + 1; i++){
        //   rack_list.push(exist_rack[i])
        // }
        console.log(rack_list)
        rack_list.push(this.rack_data)
        console.log(rack_list)
        var object1 = {"respRack": rack_list}
        var object2 = {"email": this.tblogin_useremail}

        var postdata = Object.assign(object1, object2) 
        console.log(postdata)
        console.log('exist_rack: ', exist_rack)
        axios.post(addnewRackURL, postdata)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
        this.register_suc = true
        this.toDisable = true
        // this.rack_data = ''
      }
      else{
        this.register_fail = true
        return false
        }
      
    },
    suc_reload(){
      blur()
      test = true
      this.control_dialog('open_newrack')
      
      // this.rack_data = ''
      
      // window.location.reload()
    }
  },
  computed: {}
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 280px
  min-height: 70px
</style>
