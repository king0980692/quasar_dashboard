<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>
<div>
 <h4 class="flex flex-center" v-if="showmsg === 'yes'"> Please wait ! </h4>
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
<div class="flex flex-center">

    <q-card class="my-card" v-if="chartshow === 'yes'">
      <q-card-section horizontal>
        <q-img
        :src="data[0].imgURL"
        style="width: 500px"
        :ratio="1"
        basic
        spinner-color="white"
        class="rounded-borders"
        />
        <q-card-actions vertical class="justify-around">
              <q-icon :color="data[0].deathAlertColor" name="local_hotel" style="font-size: 1.5em" />
              <q-icon :color="data[0].volt_2AlertColor" name="battery_charging_full" style="font-size: 1.5em" />
              <q-icon :color="data[0].blobAlertColor" name="gradient" style="font-size: 1.5em" />
              <q-icon :color="data[0].feederAlertColor" name="local_dining" style="font-size: 1.5em" />
        </q-card-actions>
        <q-separator vertical />
        <q-card-section horizontal>
        <div vertical class="text-h4 text-grey-8 "><q-icon :color="data[0].oaAlertColor" name="warning" style="font-size: 1em" /></div>
      <q-separator horizontal />
        <div class="text-h7 q-mt-sm q-mb-xs">{{data[0].locationStr}}  {{data[0].deathAccuTimeRead}}  {{data[0].deathStatusUpdate}} </div>
        </q-card-section>
      </q-card-section>
    </q-card>
</div>

 <div class="q-pa-md">
    <q-table
      title="Real Time Events"
      :data="data"
      :columns="columns"
      row-key="MAC"
      v-if="chartshow === 'yes'"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="fromNow" :props="props">
              {{ props.row.fromNow }}
          </q-td>
          <q-td>
            <q-btn
             flat
             rounded
             :color="props.row.oaAlertColor"
             dense
             :label='props.row.timeStr'
             class="q-mt-md" />
          </q-td>
          <q-td key="MAC" :props="props">
              {{ props.row.MAC }}
          </q-td>
          <q-td key="cageID" :props="props">
              {{ props.row.cageID }}
          </q-td>
          <q-td key="deathAccuTimeRead" :props="props">
              {{ props.row.deathAccuTimeRead }}
          </q-td>
          <q-td key="volt_2" :props="props">
              {{ props.row.volt_2 }}
          </q-td>
          <q-td key="blobInt" :props="props">
              {{ props.row.blobInt }}
          </q-td>
          <q-td key="feederInt" :props="props">
              {{ props.row.feederInt }}
          </q-td>
          <q-td key="deathAlertInfo" :props="props">
              {{ props.row.deathAlertInfo }}
          </q-td>
          <q-td>
            <div class="col-4">
              <q-img
                :src="props.row.imgURL"
                :ratio="16/9"
              />
            </div>
          </q-td>

          <q-td>
            <q-btn
             text-color="secondary"
             flat
             @click=" ($event) => { URL_handle(props) } "
             icon="camera"
             class="q-mt-md" />
                  <q-dialog
                  v-model="card">
                    <q-card class="my-card">
                      <q-img
                      :src="data[0].specialURL" />
                      <q-card-section>
                        <div class="row no-wrap items-center">
                          <div class="col text-h8 ellipsis">
                           {{data[0].specialURL}}
                          </div>
                          <q-card-actions align="right">
                            <q-btn label="OK" color="grey-5" v-close-popup />
                          </q-card-actions>
                        </div>

                      </q-card-section>

                    </q-card>
                  </q-dialog>
          </q-td>

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
import {
  QSpinnerGears
} from 'quasar'
export default {
  name: 'app',
  data () {
    return {
      card: false,
      chartshow: 'no',
      filter: '',
      url: 'https://mk100.frrut.net/img/840d8ed08ec4_1580888946.jpg',
      pagination: {
        rowsPerPage: 1000
      },
      alert: false,
      specialURL: '',
      newtopicmqtt: '',
      buff: 'Sub1:<br>',
      data: [ {} ],
      deviceList: [],
      showmsg: 'no',
      columns: [
        { name: 'fromNow', label: 'fromNow', field: 'fromNow' },
        { name: 'timeStr', label: 'Update Time', field: 'timeStr' },
        { name: 'MAC', label: 'MAC', field: 'MAC' },
        { name: 'cageID', label: 'Cage ID', field: 'cageID' },
        { name: 'deathAccuTimeRead', label: 'Alert Accumulated', field: 'deathAccuTimeRead' },
        { name: 'volt_2', label: 'Voltage %', field: 'volt_2' },
        { name: 'blobInt', label: 'Dirt Alert', field: 'blobInt' },
        { name: 'feederInt', label: 'Feeder Alart', field: 'feederInt' },
        { name: 'deathAlertInfo', label: 'Mice Still Alert', field: 'deathAlertInfo' },
        { name: 'image', label: 'image', field: 'image', align: 'left' },
        { name: 'detail', label: 'Large img', field: 'imgURL', align: 'left' }
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
    // this.showmsg = 'yes'
    this.showLoading()
    // Loading.show({
    //   delay: 400,
    //   spinner: QSpinnerGears
    // })
  },
  mounted () {
  },
  mqtt: {
    'topic/event/#' (data, topic) {
      // this.buff = data
      console.log('data: ' + data)
      console.log('topic(this.topicmqtt): ' + this.topicmqtt)
      console.log('topic*****' + topic)
      console.log('MAC*****' + this.MAC)
      console.log(this.MAC)

      if (this.MAC === undefined) {
        this.showmsg = 'no'
        this.$q.loading.hide()
        this.array = [JSON.parse(data)]
        console.log('this.array print')
        console.log(this.array)
        if (this.buffArray === undefined) {
          this.chartshow = 'yes'
          this.buffArray = this.array
          console.log('first array')
          this.data = this.buffArray
          for (var e = 0; e < this.data.length; e++) {
            this.data[e].fromNow = moment(this.data[e].timestamp * 1000).locale('zh-TW').fromNow()
          }
          this.data = this.data.reverse()
          console.log(JSON.stringify(this.data))
        } else {
          this.showmsg = 'no'
          this.chartshow = 'yes'
          this.$q.loading.hide()
          console.log('print thisbuffarray')
          console.log(this.buffArray)
          this.tempbuffarray = this.buffArray
          this.buffArray = this.tempbuffarray.concat(this.array)
          console.log(JSON.stringify(this.buffArray))
          // this.buff = JSON.stringify(this.buffArray)
          this.buffArray1 = this.buffArray.sort((a, b) => b.timestamp - a.timestamp)
          this.data = this.buffArray1
          for (var c = 0; c < this.data.length; c++) {
            this.data[c].fromNow = moment(this.data[c].timestamp * 1000).locale('zh-TW').fromNow()
          }
          // this.data = this.data
          console.log(JSON.stringify(this.data))
          let temparray = []
          for (let d = 0; d < this.data.length; d++) {
            if (this.data[d].timestamp > this.data[0].timestamp - 500) {
              temparray.push(this.data[d])
            }
          }
          console.log(temparray.length)
          this.buffArray = temparray
        }
      } else {
        this.newtopicmqtt = topic
      }
      if (topic === this.newtopicmqtt) {
        this.showmsg = 'no'
        this.$q.loading.hide()
        this.array = [JSON.parse(data)]
        console.log('this.array print')
        console.log(this.array)
        if (this.buffArray === undefined) {
          this.chartshow = 'yes'
          this.buffArray = this.array
          console.log('first array')
          this.data = this.buffArray
          for (var k = 0; k < this.data.length; k++) {
            this.data[k].fromNow = moment(this.data[k].timestamp * 1000).locale('zh-TW').fromNow()
          }
          this.data = this.data.reverse()
          console.log(JSON.stringify(this.data))
        } else {
          this.showmsg = 'no'
          this.chartshow = 'yes'
          this.$q.loading.hide()
          console.log('print thisbuffarray')
          console.log(this.buffArray)
          this.tempbuffarray = this.buffArray
          this.buffArray = this.tempbuffarray.concat(this.array)
          console.log(JSON.stringify(this.buffArray))
          // this.buff = JSON.stringify(this.buffArray)
          this.buffArray1 = this.buffArray.sort((a, b) => b.timestamp - a.timestamp)
          this.data = this.buffArray1
          for (var j = 0; j < this.data.length; j++) {
            this.data[j].fromNow = moment(this.data[j].timestamp * 1000).locale('zh-TW').fromNow()
          }
          // this.data = this.data
          console.log(JSON.stringify(this.data))
          let temparray = []
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].timestamp > this.data[0].timestamp - 500) {
              temparray.push(this.data[i])
            }
          }
          console.log(temparray.length)
          this.buffArray = temparray
        }
      }
    }
  },
  methods: {
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
      this.$router.push(
        console.log(props.row.imgURL),
        // { path: '/mqtttable?MAC=' + props.row.MAC }
        this.card = true,
        this.data[0].specialURL = props.row.imgURL

      )
    }
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
    max-height: 200px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ebebeb

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
.my-card
  width: 50%

  align: center
</style>
