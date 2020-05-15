<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>
<div>
 <h4 class="flex flex-center" v-if="showmsg === 'yes'"> System Check Loading.. Please wait ! </h4>
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
        :src="checkObj[0].imgURL"
        style="width: 500px"
        :ratio="1"
        basic
        spinner-color="white"
        class="rounded-borders"
        />
        <q-separator vertical />
        <q-card-section horizontal>
        <div vertical class="text-h4 text-grey-8 "><q-icon :color="checkObj[0].overallColor" :name="checkObj[0].overallIcon" style="font-size: 1em" /></div>
      </q-card-section>

      <q-separator inset />
        <div class="text-h7 text-primary q-mt-sm q-mb-xs" >  {{checkObj[0].timeStr}}  updated</div>
      <q-card-section>

        </q-card-section>
      </q-card-section>
    </q-card>
</div>

 <div class="q-pa-md">
    <q-table
      title="System Check"
      :data="checkArray"
      :columns="columns"
      row-key="appid"
      v-if="chartshow === 'yes'"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <div class="col-4">
            <q-icon :color="props.row.alertColor" :name="props.row.alertIcon" style="font-size: 2em" />
            </div>
          </q-td>
          <q-td  key="appname" :props="props">
           {{ props.row.appname }}
          </q-td>
          <q-td key="fromNow" :props="props">
              {{ props.row.fromNow }}
          </q-td>
          <q-td key="updateTime" :props="props">
              {{ props.row.updateTime }}
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
// import moment from 'moment'
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
      showmsg: 'no',
      checkObj: [],
      checkArray: [],
      columns: [
        { name: 'status', label: 'status', field: 'status' },
        { name: 'appname', label: 'appname', field: 'appname' },
        { name: 'fromNow', label: 'fromNow', field: 'fromNow' },
        { name: 'updateTime', label: 'updateTime', field: 'updateTime' }
      ]
    }
  },
  created () {
    this.topicmqtt = 'topic/mk100/systemcheck'
    this.$mqtt.subscribe(this.topicmqtt)
    console.log(this.topicmqtt)
    this.showLoading()
  },
  mounted () {
  },
  mqtt: {
    'topic/mk100/systemcheck' (data, topic) {
      // this.buff = data
      // console.log('data: ' + data)
      // console.log('topic(this.topicmqtt): ' + this.topicmqtt)
      // console.log('topic*****' + topic)
      this.showmsg = 'no'
      this.chartshow = 'yes'
      this.checkObj = [JSON.parse(data)]
      console.log('this.checkObj')
      console.log(this.checkObj)
      this.checkArray = this.checkObj[0].checkArray
      console.log(this.checkArray)
      // console.log('MAC*****' + this.MAC)
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
