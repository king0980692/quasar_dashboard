<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>
    <q-dialog v-model="newrackDialog">
      <q-card class="q-pa-md" style="min-width:400px;">
        <q-card-section >
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
          <div class="center">
            <q-btn color="primary" align="left" :disable="toDisable" style="left:20%" label="Submit" @click="addnewRack" />
            <q-btn color="white" text-color="black" style="left:35%" align="right" label="Cancel" @click="control_dialog('close_newrack')" />
          </div>
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
          <!-- <q-td key="rackname"
          :props="props"
          @click="($event) => { rack_handle(props) }"
          >
          <q-btn flat color="white" text-color="primary" :label="props.row.rackname" />
          </q-td> -->
          <q-td key="rackname" :props="props">
              {{ props.row.rackname }}
          </q-td>
          <q-td key="user" :props="props">
              {{ props.row.user }}
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
          <!-- <q-td>
            <q-btn
             flat
             rounded
             color="primary"
             dense
             @click="($event) => { rack_handle(props) }"
             icon="dashboard"
             :label="props.row.rackname"
             class="text-right" />
          </q-td> -->
          <q-td>
            <q-btn
             flat
             rounded
             color="primary"
             dense
             @click="($event) => { rack_handle(props) }"
             icon="dashboard"
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
        <q-fab-action @click="control_dialog('open_newrack')" color="orange" icon="grid_on">
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
      toDisable: true,
      alert: false,
      alleventsvalue: false,
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
        { name: 'rackname', label: 'Rack', field: 'rackname', sortable: true },
        { name: 'user', label: 'User', field: 'user', sortable: true },
        { name: 'qty', label: 'Activated cages', field: 'qty', sortable: true },
        { name: 'cages', label: 'Cages #', field: 'cages', sortable: true },
        { name: 'shortmac', label: 'Dev ID', field: 'shortmac', sortable: true },
        { name: 'detail', label: 'Detail', field: 'MAC', align: 'left', sortable: true }
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
        console.log("tblogin_useremail: ", this.tblogin_useremail)
      })
    console.log("route.query: ", this.$route.query)
    this.MAC = this.$route.query.MAC
    console.log("MAC: ", this.MAC)
    if (this.MAC === undefined) {
      this.topicmqtt = 'topic/event/#'
    } else {
      this.topicmqtt = 'topic/event/' + this.MAC
    }
    this.$mqtt.subscribe(this.topicmqtt)
    console.log("topicmqtt: ", this.topicmqtt)
    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })
    const requestOne = axios.get('http://strapi.frrut.net:1337/device-collections')
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
      Loading.hide()
      exist_rack = Array.from(new Set(exist_rack));
      console.log('exist_rack: ', exist_rack)

      var userInfo = [JSON.parse(localStorage.getItem('loginInfo'))]

      console.log('====Users Collection====')
      console.log(JSON.stringify(userInfo))

      for (var e = 0; e < userInfo.length; e++) {
        for (var f = 0; f < mk100users.length; f++) {
          if (userInfo[e].id === mk100users[f]._id) {
            // userInfo[e].groups = mk100users[f].groups
            userInfo[e].role = mk100users[f].role
          }
        }
      }
      console.log('====Userinfo====')
      console.log(userInfo)
      // var racks = userInfo[0].groups
      // console.log(racks)
      var role = userInfo[0].role
      console.log(role)
      var userID = userInfo[0].id
      console.log(userID)

      var fllterMAC = []
      var fllterDevices = []

      if (role === 'admin') {
        this.deviceCollection.map(function (a) {
          fllterMAC.push(a.MAC)
        })
        this.deviceCollection.map(function (a) {
          fllterDevices.push(a)
        })
      } else {
        this.deviceCollection.map(function (a) {
          if (a.registerUserID === userID) {
            fllterMAC.push(a.MAC)
          }
        })
        this.deviceCollection.map(function (a) {
          if (a.registerUserID === userID) {
            fllterDevices.push(a)
          }
        })
      }
      
      console.log('====fllterMAC====')
      console.log(fllterMAC)
      console.log(fllterMAC.length)

      for (var a = 0; a < fllterDevices.length; a++) {
        fllterDevices[a].rackUser = fllterDevices[a].rackName + fllterDevices[a].registerUserID
      }
      for (var c = 0; c < fllterDevices.length; c++) {
        for (var d = 0; d < mk100users.length; d++) {
          if (fllterDevices[c].registerUserID === mk100users[d]._id) {
            fllterDevices[c].username = mk100users[d].username
          }
        }
      }
      fllterDevices = fllterDevices.filter(e => e.deviceRegiStatus === true)
      console.log('====fllterDevices====')
      console.log(fllterDevices)

      var group = fllterDevices.map((item) => item.rackUser).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
        let rackList = fllterDevices.filter(itm => itm.rackUser === item).map(itm => itm.rackName)
        let userList = fllterDevices.filter(itm => itm.rackUser === item).map(itm => itm.username)

        let maclist = fllterDevices.filter(itm => itm.rackUser === item).map(itm => itm.MAC)

        var qty = maclist.length
        let cageid = JSON.stringify(fllterDevices.filter(itm => itm.rackUser === item).map(itm => itm.cageID))
        cageid = cageid.replace('[', '')
        cageid = cageid.replace(']', '')
        if (cageid.length > 15) {
          cageid = cageid.substring(0, 15) + ' ...'
        }
        let shortmac = JSON.stringify(fllterDevices.filter(itm => itm.rackUser === item).map(itm => itm.MAC.slice(-3)))
        shortmac = shortmac.replace('[', '')
        shortmac = shortmac.replace(']', '')
        shortmac = shortmac.replace(/['"]+/g, '')
        if (shortmac.length > 15) {
          shortmac = shortmac.substring(0, 15) + ' ...'
        }
        return { rackname: rackList[0], user: userList[0], qty: qty, cages: cageid, shortmac: shortmac}
      })

      console.log("==== Group ====")
      console.log("Group: ", group)
      console.log("Group length: ", group.length)
/*
// ######################################################################################################################

//######################################################################################################################
*/
      this.data = group
      this.showmsg = 'no'
      Loading.hide()
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
    })).catch(errors => {
    })
    console.log("DATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: ", this.data.length)
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
        { path: '/cagedash?rack=' + props.row.rackname }
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
