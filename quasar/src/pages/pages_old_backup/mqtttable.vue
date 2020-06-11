<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>

<div>
 <h4 class="flex flex-center" v-if="showmsg === 'yes'">未有訊息顯示，等待訊息傳入....</h4>
 <div class="flex flex-center" v-if="showmsg === 'no'">
設備 ID : {{MAC}}  /  登記使用者: {{data[0].registerUserName}}  /  籠號: {{data[0].cageID}}
  </div>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      title="重要指標"
      :data="data"
      :columns="columns"
      table-style="max-height: 400px"
      row-key="index"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    />
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
      buff: 'Sub1:<br>',
      data: [ {} ],
      deviceList: [],
      columns: [
        { name: 'fromNow', label: '最後更新', field: 'fromNow' },
        // { name: 'timestamp', label: 'timestamp', field: 'timestamp' },
        { name: 'volt_2', label: '電力 %', field: 'volt_2' },
        { name: 'blobInt', label: '清潔狀態', field: 'blobInt' },
        { name: 'feederInt', label: '飼料狀態', field: 'feederInt' },
        { name: 'bbox_count', label: '偵測總數量', field: 'bbox_count' },
        { name: 'stillQty', label: '鼠隻靜止數量', field: 'stillQty' },
        { name: 'vitalInt', label: '靜止訊息', field: 'vitalInt' },
        { name: 'deathAlertInfo', label: '訊號通知狀態', field: 'deathAlertInfo' },
        { name: 'gas1', label: '氣體 1', field: 'gas1' },
        { name: 'gas2', label: '氣體 2', field: 'gas2' },
        { name: 'gas3', label: '氣體 3', field: 'gas3' }
      ]
    }
  },
  created () {
    console.log(this.$route.query)
    this.MAC = this.$route.query.MAC
    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })
    console.log(this.MAC)
    var topicmqtt = 'topic/mac/' + this.MAC
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
      if (topic === 'topic/mac/' + this.MAC) {
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
          }
          // this.data = this.data
          console.log(JSON.stringify(this.data))
          let temparray = []
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].timestamp > this.data[0].timestamp - 300) {
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
