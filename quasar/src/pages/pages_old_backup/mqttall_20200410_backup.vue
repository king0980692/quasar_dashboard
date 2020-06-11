<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>

<div>
 <h4 class="flex flex-center" v-if="showmsg === 'yes'">Please wait for messages coming....</h4>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      title="Device real time messages"
      :data="data"
      :columns="columns"
      table-style="max-height: 400px"
      row-key="index"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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
      filter: '',
      buff: 'Sub1:<br>',
      data: [ {} ],
      deviceList: [],
      columns: [
        { name: 'fromNow', label: '最後更新', field: 'fromNow' },
        { name: 'timeRead', label: '更新時間', field: 'timeRead' },
        { name: 'MAC', label: 'MAC', field: 'MAC' },
        { name: 'cageID', label: 'cageID', field: 'cageID' },
        { name: 'volt_2', label: '電力 %', field: 'volt_2' },
        { name: 'blobInt', label: '清潔狀態', field: 'blobInt' },
        { name: 'feederInt', label: '飼料狀態', field: 'feederInt' },
        { name: 'bbox_count', label: '偵測總數量', field: 'bbox_count' },
        { name: 'stillQty', label: '鼠隻靜止數量', field: 'stillQty' },
        { name: 'vitalInt', label: '靜止訊息', field: 'vitalInt' },
        { name: 'deathAlertInfo', label: '訊號通知狀態', field: 'deathAlertInfo' },
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
    console.log(this.$route.query)
    this.MAC = this.$route.query.MAC
    console.log(this.MAC)
    if (this.MAC === undefined) {
      this.topicmqtt = 'topic/mac/#'
    } else {
      this.topicmqtt = 'topic/mac/' + this.MAC
    }
    this.$mqtt.subscribe(this.topicmqtt)
    console.log(this.topicmqtt)

    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })
    // console.log(this.MAC)
    var topicmqtt = 'topic/mac/#'
    this.$mqtt.subscribe(topicmqtt)
    console.log(topicmqtt)
  },
  mounted () {
  },
  mqtt: {
    'topic/mac/#' (data, topic) {
      this.buff = data
      console.log('data: ' + data)
      console.log('topic: ' + topic)
      if (this.MAC === undefined) {
        this.showmsg = 'no'
        Loading.hide()
        this.array = [JSON.parse(data)]
        console.log('this.array print')
        console.log(this.array)
        if (this.buffArray === undefined) {
          this.buffArray = this.array
          console.log('first array')
          this.data = this.buffArray
          for (var c = 0; c < this.data.length; c++) {
            this.data[c].fromNow = moment(this.data[c].timestamp * 1000).locale('zh-TW').fromNow()
          }
          this.data = this.data.reverse()
          console.log(JSON.stringify(this.data))
        } else {
          console.log('print thisbuffarray')
          console.log(this.buffArray)
          this.tempbuffarray = this.buffArray
          this.buffArray = this.tempbuffarray.concat(this.array)
          console.log(JSON.stringify(this.buffArray))
          // this.buff = JSON.stringify(this.buffArray)
          this.buffArray1 = this.buffArray.sort((a, b) => b.timestamp - a.timestamp)
          this.data = this.buffArray1
          for (var h = 0; h < this.data.length; h++) {
            this.data[h].fromNow = moment(this.data[h].timestamp * 1000).locale('zh-TW').fromNow()
            this.data[h].timeRead = moment(this.data[h].timestamp * 1000).locale('zh-TW').format('Do, h:mm:ss a')
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
      } else {
        this.newtopicmqtt = topic
      }
      if (topic === this.topicmqtt) {
        this.showmsg = 'no'
        Loading.hide()
        this.array = [JSON.parse(data)]
        console.log('this.array print')
        console.log(this.array)
        if (this.buffArray === undefined) {
          this.buffArray = this.array
          console.log('first array')
          this.data = this.buffArray
          for (var k = 0; k < this.data.length; k++) {
            this.data[k].fromNow = moment(this.data[k].timestamp * 1000).locale('zh-TW').fromNow()
          }
          this.data = this.data.reverse()
          console.log(JSON.stringify(this.data))
        } else {
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
            this.data[j].timeRead = moment(this.data[j].timestamp * 1000).locale('zh-TW').format('Do, h:mm:ss a')
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
</style>
