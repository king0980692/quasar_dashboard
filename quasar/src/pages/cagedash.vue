<template>
<q-page class="q-pa-md" q-pa-md row no-wrap items-center justify-around>
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">No Data!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Click OK to return to rack list<br>
          No history data for these cages
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn flat label="OK" v-close-popup @click="($event) => { rack_handle(props) }"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<div>
    <div class="row items-start">
      <div class="col">
<div class="text-h8 text-grey">{{fromNow}} / {{sincelastUpdate}} / {{count}}</div>
<div class="text-h6">
        <!-- <q-item to="/racks" clickable> -->
        <q-btn color="white" text-color="black" icon="grid_on" label="" to="/racks"/> 　{{rack}}
        <!-- </q-item> -->
</div>
          <q-space />
          <q-space />
    </div>
    </div>

    <div class="row items-start">
      <div class="col">
        <div class="q-pa-xs q-ma-xs row items-start q-gutter-xs">
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%) max-width: 200px"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n-1].cageID}}  <q-icon :color="buffArray[n-1].oaAlertColor" name="warning" style="font-size: 1em" >
              <q-tooltip content-class="bg-Primary">Overall Alert</q-tooltip>
              </q-icon>
              </div>

              <q-icon :color="buffArray[n-1].deathAlertColor" name="local_hotel" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Dead Mice Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n-1].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Low Battery Level Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n-1].blobAlertColor" name="gradient" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">In Cage Environment Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n-1].feederAlertColor" name="local_dining" style="font-size: 1.5em">
              <q-tooltip content-class="bg-Primary">Feeder Empty Alert</q-tooltip>
              </q-icon>
              <div class="text-subtitle5 text-grey">{{buffArray[n-1].oaAlertAccuTimeRead}}    {{buffArray[n-1].fromNow}}
              <q-tooltip content-class="bg-Primary">Alert Accumulated Time</q-tooltip>
              </div>

              <q-btn flat round dense :color="buffArray[n-1].signalBnColor" icon="timeline" @click="($event) => { RealTimeSignal(buffArray[n-1].MAC) }">
              <q-tooltip content-class="bg-Primary">Real Time Signal</q-tooltip>
              </q-btn>
              <q-btn flat round :color="buffArray[n-1].eventBnColor" icon="notification_important" @click="($event) => { MAC_handle(buffArray[n-1].MAC) }"  >
              <q-tooltip content-class="bg-Primary">Events</q-tooltip>
              </q-btn>

            </q-card-section>
          </q-card>
          </div>
      </div>

      <div class="col ">
        <div class="q-pa-xs q-ma-xs row items-start q-gutter-xs">
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n+7].cageID}}  <q-icon :color="buffArray[n+7].oaAlertColor" name="warning" style="font-size: 1em" >
              <q-tooltip content-class="bg-Primary">Overall Alert</q-tooltip>
              </q-icon>
              </div>

              <q-icon :color="buffArray[n+7].deathAlertColor" name="local_hotel" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Dead Mice Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+7].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Low Battery Level Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+7].blobAlertColor" name="gradient" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">In Cage Environment Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+7].feederAlertColor" name="local_dining" style="font-size: 1.5em">
              <q-tooltip content-class="bg-Primary">Feeder Empty Alert</q-tooltip>
              </q-icon>
              <div class="text-subtitle5 text-grey">{{buffArray[n+7].oaAlertAccuTimeRead}}    {{buffArray[n+7].fromNow}}
              <q-tooltip content-class="bg-Primary">Alert Accumulated Time</q-tooltip>
              </div>

              <q-btn flat round dense :color="buffArray[n+7].signalBnColor" icon="timeline" @click="($event) => { RealTimeSignal(buffArray[n+7].MAC) }">
              <q-tooltip content-class="bg-Primary">Real Time Signal</q-tooltip>
              </q-btn>
              <q-btn flat round :color="buffArray[n+7].eventBnColor" icon="notification_important" @click="($event) => { MAC_handle(buffArray[n+7].MAC) }"  >
              <q-tooltip content-class="bg-Primary">Events</q-tooltip>
              </q-btn>

            </q-card-section>
          </q-card>
          </div>
      </div>

      <div class="col">
        <div
          class="q-pa-xs q-ma-xs row items-start q-gutter-xs"
        >
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%) max-width: 200px"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n+15].cageID}}  <q-icon :color="buffArray[n+15].oaAlertColor" name="warning" style="font-size: 1em" >
              <q-tooltip content-class="bg-Primary">Overall Alert</q-tooltip>
              </q-icon>
              </div>

              <q-icon :color="buffArray[n+15].deathAlertColor" name="local_hotel" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Dead Mice Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+15].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Low Battery Level Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+15].blobAlertColor" name="gradient" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">In Cage Environment Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+15].feederAlertColor" name="local_dining" style="font-size: 1.5em">
              <q-tooltip content-class="bg-Primary">Feeder Empty Alert</q-tooltip>
              </q-icon>
              <div class="text-subtitle5 text-grey">{{buffArray[n+15].oaAlertAccuTimeRead}}    {{buffArray[n+15].fromNow}}
              <q-tooltip content-class="bg-Primary">Alert Accumulated Time</q-tooltip>
              </div>

              <q-btn flat round dense :color="buffArray[n+15].signalBnColor" icon="timeline" @click="($event) => { RealTimeSignal(buffArray[n+15].MAC) }">
              <q-tooltip content-class="bg-Primary">Real Time Signal</q-tooltip>
              </q-btn>
              <q-btn flat round :color="buffArray[n+15].eventBnColor" icon="notification_important" @click="($event) => { MAC_handle(buffArray[n+15].MAC) }"  >
              <q-tooltip content-class="bg-Primary">Events</q-tooltip>
              </q-btn>

            </q-card-section>
          </q-card>
          </div>
      </div>
      <div class="col">
        <div
          class="q-pa-xs q-ma-xs row items-start q-gutter-xs"
        >
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%) max-width: 200px"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n+23].cageID}}  <q-icon :color="buffArray[n+23].oaAlertColor" name="warning" style="font-size: 1em" >
              <q-tooltip content-class="bg-Primary">Overall Alert</q-tooltip>
              </q-icon>
              </div>

              <q-icon :color="buffArray[n+23].deathAlertColor" name="local_hotel" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Dead Mice Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+23].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Low Battery Level Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+23].blobAlertColor" name="gradient" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">In Cage Environment Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+23].feederAlertColor" name="local_dining" style="font-size: 1.5em">
              <q-tooltip content-class="bg-Primary">Feeder Empty Alert</q-tooltip>
              </q-icon>
              <div class="text-subtitle5 text-grey">{{buffArray[n+23].oaAlertAccuTimeRead}}    {{buffArray[n+23].fromNow}}
              <q-tooltip content-class="bg-Primary">Alert Accumulated Time</q-tooltip>
              </div>

              <q-btn flat round dense :color="buffArray[n+23].signalBnColor" icon="timeline" @click="($event) => { RealTimeSignal(buffArray[n+23].MAC) }">
              <q-tooltip content-class="bg-Primary">Real Time Signal</q-tooltip>
              </q-btn>
              <q-btn flat round :color="buffArray[n+23].eventBnColor" icon="notification_important" @click="($event) => { MAC_handle(buffArray[n+23].MAC) }"  >
              <q-tooltip content-class="bg-Primary">Events</q-tooltip>
              </q-btn>

            </q-card-section>
          </q-card>
          </div>
      </div>

      <div class="col">
        <div
          class="q-pa-xs q-ma-xs row items-start q-gutter-xs"
        >
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%) max-width: 200px"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n+31].cageID}}  <q-icon :color="buffArray[n+31].oaAlertColor" name="warning" style="font-size: 1em" >
              <q-tooltip content-class="bg-Primary">Overall Alert</q-tooltip>
              </q-icon>
              </div>

              <q-icon :color="buffArray[n+31].deathAlertColor" name="local_hotel" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Dead Mice Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+31].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Low Battery Level Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+31].blobAlertColor" name="gradient" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">In Cage Environment Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+31].feederAlertColor" name="local_dining" style="font-size: 1.5em">
              <q-tooltip content-class="bg-Primary">Feeder Empty Alert</q-tooltip>
              </q-icon>
              <div class="text-subtitle5 text-grey">{{buffArray[n+31].oaAlertAccuTimeRead}}    {{buffArray[n+31].fromNow}}
              <q-tooltip content-class="bg-Primary">Alert Accumulated Time</q-tooltip>
              </div>

              <q-btn flat round dense :color="buffArray[n+31].signalBnColor" icon="timeline" @click="($event) => { RealTimeSignal(buffArray[n+31].MAC) }">
              <q-tooltip content-class="bg-Primary">Real Time Signal</q-tooltip>
              </q-btn>
              <q-btn flat round :color="buffArray[n+31].eventBnColor" icon="notification_important" @click="($event) => { MAC_handle(buffArray[n+31].MAC) }"  >
              <q-tooltip content-class="bg-Primary">Events</q-tooltip>
              </q-btn>

            </q-card-section>
          </q-card>
          </div>
      </div>

      <div class="col">
        <div
          class="q-pa-xs q-ma-xs row items-start q-gutter-xs"
        >
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%) max-width: 200px"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n+39].cageID}}  <q-icon :color="buffArray[n+39].oaAlertColor" name="warning" style="font-size: 1em" >
              <q-tooltip content-class="bg-Primary">Overall Alert</q-tooltip>
              </q-icon>
              </div>

              <q-icon :color="buffArray[n+39].deathAlertColor" name="local_hotel" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Dead Mice Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+39].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Low Battery Level Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+39].blobAlertColor" name="gradient" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">In Cage Environment Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+39].feederAlertColor" name="local_dining" style="font-size: 1.5em">
              <q-tooltip content-class="bg-Primary">Feeder Empty Alert</q-tooltip>
              </q-icon>
              <div class="text-subtitle5 text-grey">{{buffArray[n+39].oaAlertAccuTimeRead}}    {{buffArray[n+39].fromNow}}
              <q-tooltip content-class="bg-Primary">Alert Accumulated Time</q-tooltip>
              </div>

              <q-btn flat round dense :color="buffArray[n+39].signalBnColor" icon="timeline" @click="($event) => { RealTimeSignal(buffArray[n+39].MAC) }">
              <q-tooltip content-class="bg-Primary">Real Time Signal</q-tooltip>
              </q-btn>
              <q-btn flat round :color="buffArray[n+39].eventBnColor" icon="notification_important" @click="($event) => { MAC_handle(buffArray[n+39].MAC) }"  >
              <q-tooltip content-class="bg-Primary">Events</q-tooltip>
              </q-btn>

            </q-card-section>
          </q-card>
          </div>
      </div>
      <div class="col">
        <div
          class="q-pa-xs q-ma-xs row items-start q-gutter-xs"
        >
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%) max-width: 200px"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n+47].cageID}}  <q-icon :color="buffArray[n+47].oaAlertColor" name="warning" style="font-size: 1em" >
              <q-tooltip content-class="bg-Primary">Overall Alert</q-tooltip>
              </q-icon>
              </div>

              <q-icon :color="buffArray[n+47].deathAlertColor" name="local_hotel" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Dead Mice Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+47].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">Low Battery Level Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+47].blobAlertColor" name="gradient" style="font-size: 1.5em" >
              <q-tooltip content-class="bg-Primary">In Cage Environment Alert</q-tooltip>
              </q-icon>
              <q-icon :color="buffArray[n+47].feederAlertColor" name="local_dining" style="font-size: 1.5em">
              <q-tooltip content-class="bg-Primary">Feeder Empty Alert</q-tooltip>
              </q-icon>
              <div class="text-subtitle5 text-grey">{{buffArray[n+47].oaAlertAccuTimeRead}}    {{buffArray[n+47].fromNow}}
              <q-tooltip content-class="bg-Primary">Alert Accumulated Time</q-tooltip>
              </div>

              <q-btn flat round dense :color="buffArray[n+47].signalBnColor" icon="timeline" @click="($event) => { RealTimeSignal(buffArray[n+47].MAC) }">
              <q-tooltip content-class="bg-Primary">Real Time Signal</q-tooltip>
              </q-btn>
              <q-btn flat round :color="buffArray[n+47].eventBnColor" icon="notification_important" @click="($event) => { MAC_handle(buffArray[n+47].MAC) }"  >
              <q-tooltip content-class="bg-Primary">Events</q-tooltip>
              </q-btn>

            </q-card-section>
          </q-card>
          </div>
      </div>
    </div>
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
      persistent: false,
      rack: '',
      selected: [],
      sincelastUpdate: '',
      // userMACList: [],
      thisUpdateTS: '',
      dataArray: [],
      testobj: {},
      test1: {},
      count: '',
      fromNow: '',
      data: [],
      showmsg: 'yes',
      buffArray: [],
      columns: [
        { name: 'cageID', label: 'cageID', field: 'cageID' },
        { name: 'random1', label: 'random1', field: 'random1' },
        { name: 'deathAccuTimeRead', label: 'deathAccuTimeRead', field: 'deathAccuTimeRead' }
      ]
    }
  },
  created () {
    if (localStorage.getItem('reloaded')) {
      localStorage.removeItem('reloaded')
    } else {
      localStorage.setItem('reloaded', '1')
      location.reload()
    }
    console.log(this.$route.query)
    var rack = this.$route.query.rack
    this.rack = rack
    console.log(rack)
    // if (this.rack === undefined) {
    this.topicmqtt = 'topic/event/#'
    // } else {
    //   this.topicmqtt = 'topic/event/' + this.MAC
    // }
    this.$mqtt.subscribe(this.topicmqtt)
    console.log(this.topicmqtt)
    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })
    const requestOne = axios.get('https://api.frrut.net/device-collections')
    // const requestTwo = axios.get('http://strapi.frrut.net:1337/event-lasts')
    const requestTwo = axios.get('https://api.frrut.net/last-data')
    const requestThree = axios.get('https://api.frrut.net/mk-100-users')
    axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      this.deviceCollection = responses[0].data
      this.eventLasts = responses[1].data
      var mk100users = responses[2].data
      console.log('====deviceCollection====')
      console.log(JSON.stringify(this.deviceCollection))
      console.log('====Users Collection====')
      console.log(JSON.stringify(mk100users))

      console.log('====Users Collection====')
      console.log(JSON.stringify(mk100users))

      var userInfo = [JSON.parse(localStorage.getItem('loginInfo'))]

      console.log('====Users Collection====')
      console.log(JSON.stringify(userInfo))

      for (var e = 0; e < userInfo.length; e++) {
        for (var f = 0; f < mk100users.length; f++) {
          if (userInfo[e].id === mk100users[f]._id) {
            // userInfo[e].groups = mk100users[f].groups
            // userInfo[e].rackNames = mk100users[f].rackNames
            userInfo[e].role = mk100users[f].role
          }
        }
      }
      console.log('====Userinfo====')
      console.log(JSON.stringify(userInfo))
      // var racks = userInfo[0].rackName
      // console.log(racks)
      var role = userInfo[0].role
      console.log(role)
      var userMAC = []
      if (role === 'admin') {
        this.deviceCollection.map(function (a) {
          if (a.rackName === rack) {
            userMAC.push(a.MAC)
          }
        })
        console.log(userMAC)
        this.userMACList = userMAC
      } else {
        this.deviceCollection.map(function (a) {
          if (a.registerUserID === userInfo[0].id && a.rackName === rack) {
            userMAC.push(a.MAC)
          }
        })
        console.log(userMAC)
        this.userMACList = userMAC
      }
      console.log('this.userMACList')
      console.log(this.userMACList)
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
        this.persistent = true
      }
      for (var i = 0; i <= 56; i++) {
        var Objprototype = {
          'cageID': i,
          'volt_2': '',
          'bbox_count': '',
          'volt_2AlertColor': 'grey',
          'fromNow': '',
          'timeRead': '',
          'deathAccuTimeRead': '',
          'deathAlertColor': 'grey',
          'blobAlertColor': 'grey',
          'feederAlertColor': 'grey',
          'eventBnColor': 'grey',
          'signalBnColor': 'grey',
          'random1': ''
        }
        this.dataArray.push(Objprototype)
      }
      this.dataArray.shift()
      // console.log('====created blank this.dataArray====')
      // console.log(JSON.stringify(this.dataArray))
      // console.log(this.dataArray.length)
      for (var p = 0; p < this.dataArray.length; p++) {
        for (var q = 0; q < this.deviceCollection.length; q++) {
          if (this.dataArray[p].cageID === this.deviceCollection[q].cageID) {
            this.dataArray[p].MAC = this.deviceCollection[q].MAC
            this.dataArray[p].id = this.deviceCollection[q].id
          }
        }
      }
      // console.log('---------------------')
      // console.log(JSON.stringify(this.dataArray))
      // console.log(this.dataArray.length)

      for (var m = 0; m < this.dataArray.length; m++) {
        for (var j = 0; j < this.eventLasts.length; j++) {
          if (this.dataArray[m].MAC === this.eventLasts[j].MAC) {
            this.dataArray[m].cageID = this.eventLasts[j].cageID
            this.dataArray[m].volt_2 = this.eventLasts[j].volt_2
            this.dataArray[m].bbox_count = this.eventLasts[j].bbox_count
            this.dataArray[m].fromNow = moment(this.eventLasts[j].timestamp * 1000).locale('zh-TW').fromNow()
            this.dataArray[m].volt_2AlertColor = 'orange'
            this.dataArray[m].timeRead = this.eventLasts[j].timeRead
            this.dataArray[m].deathAccuTimeRead = this.eventLasts[j].deathAccuTimeRead
            this.dataArray[m].deathAlertColor = 'orange'
            this.dataArray[m].feederAlertColor = 'orange'
            this.dataArray[m].blobAlertColor = 'orange'
            this.dataArray[m].eventBnColor = 'primary'
            this.dataArray[m].signalBnColor = 'primary'
            this.dataArray[m].timestamp = this.eventLasts[j].timestamp
            // this.dataArray[m].MAC = this.eventLasts[j].MAC
            this.showmsg = 'no'
            Loading.hide()
            this.dataArray[0].initTS = Date.now()
            this.dataArray[0].thisUpdateTS = Date.now()
            this.dataArray[0].count = 0
            this.sincelastUpdate = 'just created'
            this.fromNow = 'just created'
            this.count = 0
            // console.log('&&&&&&print this.data&&&&&&&&&&&&')
            // console.log(JSON.stringify(this.dataArray))
            this.test1 = JSON.stringify(Math.floor(Math.random() * 10))
          }
        }
      }
      // console.log('====1st this.dataArray====')
      // console.log(JSON.stringify(this.dataArray))
      // console.log('====2nd this.dataArray====')
      // console.log(JSON.stringify(this.dataArray))
      this.showmsg = 'no'
      Loading.hide()

      this.buffArray = this.dataArray
      console.log('CREATED done, begin MQTT signal')
    })).catch(errors => {
    })
  },
  mounted () {
  },
  mqtt: {
    'topic/event/#' (data1, topic) {
      console.log('topic(this.topicmqtt): ' + this.topicmqtt)
      this.obj = JSON.parse(data1)
      console.log('original this.obj print')
      console.log(this.obj)
      if (this.buffArray === undefined) {
        for (var m = 0; m < this.dataArray.length; m++) {
          for (var j = 0; j < this.deviceCollection.length; j++) {
            if (this.dataArray[m].MAC === this.deviceCollection[j].MAC) {
              // this.dataArray[m].MAC = this.deviceCollection[j].MAC
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
        // console.log('print this.data')
        // console.log(this.dataArray)
        // console.log(' first****** this.obj print')
        // console.log(this.obj)
        this.dataArray[this.obj.cageID - 1] = this.obj
        // console.log('print ******first array this.data')
        // console.log(this.dataArray)
        // console.log(Array.isArray(this.dataArray))
        this.buffArray = this.dataArray
        // stange to have this to work
        this.test1 = JSON.stringify(Math.floor(Math.random() * 10))
      } else {
        this.obj.eventBnColor = 'primary'
        this.obj.signalBnColor = 'primary'
        console.log(JSON.stringify(this.obj))
        // console.log('this buffArray')
        // console.log(JSON.stringify(this.buffArray))
        // var AAA = this.buffArray.filter(test => test.MAC === this.obj.MAC)]
        console.log('this.userMACList')
        console.log(this.userMACList)
        const AAA = this.userMACList.filter(test => test === this.obj.MAC)
        console.log(AAA.length)
        console.log('AAA')
        console.log(AAA)
        if (AAA.length === 1) {
          // var newCageID = this.obj.cageID
          // console.log(newCageID)
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
        } else {
          console.log('data not this rack, MAC : ' + this.obj.MAC)
        }
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
        { path: '/racks' }
      )
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
