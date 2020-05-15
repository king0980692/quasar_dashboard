<template>
<q-page class="q-pa-md" q-pa-md row no-wrap items-center justify-around>
<div>
 <h4 class="flex flex-center" v-if="showmsg === 'yes'">waiting for next event coming.... Please wait ! </h4>
    <div class="row items-start">
      <div class="col">
          <q-space />
{{fromNow}} / {{sincelastUpdate}} / {{count}}
          <q-space />
          <q-space />
    </div>
    </div>

    <div class="row items-start">
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
              <div class="text-h4 text-grey-8 ">{{buffArray[n-1].cageID}}  <q-icon :color="buffArray[n-1].oaAlertColor" name="warning" style="font-size: 1em" /></div>
              <div class="text-subtitle5 text-grey">隻數: {{buffArray[n-1].bbox_count}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n-1].timeRead}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n-1].deathAccuTimeRead}}</div>
              <q-icon :color="buffArray[n-1].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n-1].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n-1].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n-1].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
            <q-card-actions align="right">
              <q-btn flat round dense color="grey-8" icon="play_arrow" @click="($event) => { RealTimeSignal(buffArray[n-1].MAC) }"/>
              <q-btn flat round dense color="grey-8" icon="replay" @click="($event) => { EventHistory(buffArray[n-1].MAC) }"/>
              <q-btn flat round color="grey-8" icon="watch" @click="($event) => { MAC_handle(buffArray[n-1].MAC) }"  />
            </q-card-actions>
            </q-card-section>
          </q-card>
          </div>
      </div>

      <div class="col ">
        <div
          class="q-pa-xs q-ma-xs row items-start q-gutter-xs"
        >
            <q-card class="my-card bg-grey-2"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
            v-for="n in 8"
            :key="n"
            >
            <q-card-section align="left" bg-grey-8 text-white >
              <div class="text-h4 text-grey-8 ">{{buffArray[n+7].cageID}}  <q-icon :color="buffArray[n+7].oaAlertColor" name="warning" style="font-size: 1em" /></div>
              <div class="text-subtitle5 text-grey">隻數: {{buffArray[n+7].bbox_count}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+7].timeRead}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+7].deathAccuTimeRead}}</div>
              <q-icon :color="buffArray[n+7].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+7].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+7].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+7].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
            <q-card-actions align="right">
              <q-btn flat round dense color="grey-8" icon="play_arrow" @click="($event) => { RealTimeSignal(buffArray[n+7].MAC) }"/>
              <q-btn flat round dense color="grey-8" icon="replay" @click="($event) => { EventHistory(buffArray[n+7].MAC) }"/>
              <q-btn flat round color="grey-8" icon="watch" @click="($event) => { MAC_handle(buffArray[n+7].MAC) }"  />
            </q-card-actions>
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
              <div class="text-h4 text-grey-8 ">{{buffArray[n+15].cageID}}  <q-icon :color="buffArray[n+15].oaAlertColor" name="warning" style="font-size: 1em" /></div>
              <div class="text-subtitle5 text-grey">隻數: {{buffArray[n+15].bbox_count}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+15].timeRead}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+15].deathAccuTimeRead}}</div>
              <q-icon :color="buffArray[n+15].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+15].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+15].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+15].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
            <q-card-actions align="right">
              <q-btn flat round dense color="grey-8" icon="play_arrow" @click="($event) => { RealTimeSignal(buffArray[n+15].MAC) }"/>
              <q-btn flat round dense color="grey-8" icon="replay" @click="($event) => { EventHistory(buffArray[n+15].MAC) }"/>
              <q-btn flat round color="grey-8" icon="watch" @click="($event) => { MAC_handle(buffArray[n+15].MAC) }"  />
            </q-card-actions>
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
              <div class="text-h4 text-grey-8 ">{{buffArray[n+23].cageID}}  <q-icon :color="buffArray[n+23].oaAlertColor" name="warning" style="font-size: 1em" /></div>
              <div class="text-subtitle5 text-grey">隻數: {{buffArray[n+23].bbox_count}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+23].timeRead}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+23].deathAccuTimeRead}}</div>
              <q-icon :color="buffArray[n+23].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+23].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+23].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+23].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
            <q-card-actions align="right">
              <q-btn flat round dense color="grey-8" icon="play_arrow" @click="($event) => { RealTimeSignal(buffArray[n+23].MAC) }"/>
              <q-btn flat round dense color="grey-8" icon="replay" @click="($event) => { EventHistory(buffArray[n+23].MAC) }"/>
              <q-btn flat round color="grey-8" icon="watch" @click="($event) => { MAC_handle(buffArray[n+23].MAC) }"  />
            </q-card-actions>
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
              <div class="text-h4 text-grey-8 ">{{buffArray[n+31].cageID}}  <q-icon :color="buffArray[n+31].oaAlertColor" name="warning" style="font-size: 1em" /></div>
              <div class="text-subtitle5 text-grey">隻數: {{buffArray[n+31].bbox_count}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+31].timeRead}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+31].deathAccuTimeRead}}</div>
              <q-icon :color="buffArray[n+31].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+31].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+31].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+31].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
            <q-card-actions align="right">
              <q-btn flat round dense color="grey-8" icon="play_arrow" @click="($event) => { RealTimeSignal(buffArray[n+31].MAC) }"/>
              <q-btn flat round dense color="grey-8" icon="replay" @click="($event) => { EventHistory(buffArray[n+31].MAC) }"/>
              <q-btn flat round color="grey-8" icon="watch" @click="($event) => { MAC_handle(buffArray[n+31].MAC) }"  />
            </q-card-actions>
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
              <div class="text-h4 text-grey-8 ">{{buffArray[n+39].cageID}}  <q-icon :color="buffArray[n+39].oaAlertColor" name="warning" style="font-size: 1em" /></div>
              <div class="text-subtitle5 text-grey">隻數: {{buffArray[n+39].bbox_count}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+39].timeRead}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+39].deathAccuTimeRead}}</div>
              <q-icon :color="buffArray[n+39].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+39].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+39].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+39].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
            <q-card-actions align="right">
              <q-btn flat round dense color="grey-8" icon="play_arrow" @click="($event) => { RealTimeSignal(buffArray[n+39].MAC) }"/>
              <q-btn flat round dense color="grey-8" icon="replay" @click="($event) => { EventHistory(buffArray[n+39].MAC) }"/>
              <q-btn flat round color="grey-8" icon="watch" @click="($event) => { MAC_handle(buffArray[n+39].MAC) }"  />
            </q-card-actions>
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
              <div class="text-h4 text-grey-8 ">{{buffArray[n+47].cageID}}  <q-icon :color="buffArray[n+46].oaAlertColor" name="warning" style="font-size: 1em" /></div>
              <div class="text-subtitle5 text-grey">隻數: {{buffArray[n+47].bbox_count}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+47].timeRead}}</div>
              <div class="text-subtitle5 text-grey">{{buffArray[n+47].deathAccuTimeRead}}</div>
              <q-icon :color="buffArray[n+47].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+47].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+47].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="buffArray[n+47].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
            <q-card-actions align="right">
              <q-btn flat round dense color="grey-8" icon="play_arrow" @click="($event) => { RealTimeSignal(buffArray[n+47].MAC) }"/>
              <q-btn flat round dense color="grey-8" icon="replay" @click="($event) => { EventHistory(buffArray[n+47].MAC) }"/>
              <q-btn flat round color="grey-8" icon="watch" @click="($event) => { MAC_handle(buffArray[n+47].MAC) }"  />
            </q-card-actions>
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
        { name: 'cageID', label: 'cageID', field: 'cageID' },
        { name: 'random1', label: 'random1', field: 'random1' },
        { name: 'deathAccuTimeRead', label: 'deathAccuTimeRead', field: 'deathAccuTimeRead' }
      ]
    }
  },
  created () {
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
    axios.get('http://api.frrut.net:1337/device-collections/')
      .then(response => {
        this.deviceCollection = response.data
        console.log(JSON.stringify(this.deviceCollection))
      })
      .catch(error => {
        console.log(error)
      })
    for (var i = 0; i <= 56; i++) {
      var Objprototype = {
        'cageID': i,
        'volt_2': '',
        'bbox_count': '',
        'volt_2AlertColor': 'grey',
        'timeRead': '',
        'deathAccuTimeRead': '',
        'deathAlertColor': 'grey',
        'blobAlertColor': 'grey',
        'feederAlertColor': 'grey',
        'random1': ''
      }
      this.dataArray.push(Objprototype)
    }
    this.dataArray.shift()
    console.log('this.dataArray')
    console.log(JSON.stringify(this.dataArray))
    console.log(this.dataArray.length)
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
        this.count = this.dataArray[0].count + 1
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
    }
  },
  computed: {}
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 280px
  min-height: 180px
</style>
