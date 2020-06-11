<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>
<div class="flex flex-center">
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section align="center" class="bg-grey-3">
        <div vertical class="text-h4 text-grey-8 center"><q-icon :color='origArray[0].warningColor' :name='origArray[0].warningIcon' style="font-size: 5em" /></div>
      </q-card-section>
      <q-card-section align="center" class="bg-grey-3">
        <div class='text-h6 text-grey-8'>{{origArray[0].warningMsg}}</div>
      </q-card-section>
      <q-card-section :class='origArray[0].bgclass' align="center">
        <div :class='origArray[0].textClass'>{{origArray[0].dispMsg}}  </div>
      </q-card-section>

    </q-card>
        <q-btn flat class="text-h7 text-grey-8">最高溫   {{origArray[0].maxtemp}}</q-btn>
        <q-btn flat class="text-h7 text-grey-8">總溫度   {{origArray[0].sumtemp}}</q-btn>
        <q-btn flat class="text-h7 text-grey-8">警戒溫度   {{origArray[0].warningTemp}} °c</q-btn>
        <q-btn flat class="text-h7 text-grey-8">電池   {{origArray[0].batt}} %</q-btn>
  </div>
</div>
<div class="my-chart">
<vue-plotly :data="dataArray" :layout="layout" :options="options" :config="config" />
</div>

</q-page>
</template>

<style>
</style>

<script>
import VuePlotly from '@statnett/vue-plotly'
export default {
  name: 'app',
  components: {
    VuePlotly
  },
  data () {
    return {
      // data: [{ x: [1, 3], y: [2, 4] }],
      dataArray: [],
      arrayMQTT: [],
      origArray: [],
      layout: { showlegend: false },
      options: { scrollZoom: false, displayModeBar: false },
      config: {}
    }
  },
  created () {
    this.topicmqtt = 'topic/ws/heatmap'
    this.$mqtt.subscribe(this.topicmqtt)
    console.log(this.topicmqtt)
    this.arrayMQTT = [
      [34, 31, 34, 34, 33, 33, 33, 31, 30, 32, 38, 31, 31, 30, 33, 39, 39, 36, 38, 39, 32, 38, 39, 32, 38, 31, 39, 39, 35, 31, 34, 37],
      [30, 37, 37, 34, 39, 33, 36, 39, 34, 39, 32, 37, 34, 35, 32, 37, 36, 39, 38, 33, 36, 32, 33, 32, 38, 36, 39, 36, 35, 39, 35, 38],
      [37, 32, 39, 36, 36, 31, 35, 33, 38, 39, 39, 30, 31, 32, 36, 35, 34, 35, 32, 35, 38, 33, 36, 37, 34, 38, 38, 38, 39, 35, 33, 38],
      [39, 33, 35, 37, 34, 38, 33, 36, 36, 30, 39, 30, 31, 38, 34, 38, 32, 30, 35, 35, 32, 30, 31, 35, 32, 36, 36, 37, 38, 34, 34, 38],
      [33, 31, 30, 39, 35, 38, 37, 35, 37, 38, 32, 39, 31, 36, 39, 37, 38, 36, 38, 38, 38, 37, 33, 32, 34, 37, 30, 34, 39, 33, 31, 30],
      [33, 35, 34, 30, 36, 36, 30, 34, 32, 37, 33, 33, 38, 33, 36, 32, 39, 31, 35, 38, 35, 36, 30, 36, 32, 37, 36, 38, 31, 32, 34, 31],
      [39, 36, 37, 36, 31, 33, 38, 36, 37, 39, 31, 32, 36, 38, 37, 31, 39, 38, 38, 33, 34, 38, 32, 33, 34, 31, 39, 35, 38, 31, 36, 39],
      [39, 34, 32, 34, 34, 37, 33, 38, 38, 34, 33, 33, 33, 39, 36, 31, 31, 31, 32, 38, 39, 36, 35, 31, 36, 36, 31, 33, 34, 39, 38, 37],
      [32, 31, 30, 37, 34, 35, 37, 36, 35, 38, 39, 39, 35, 34, 38, 35, 36, 38, 31, 34, 38, 31, 37, 34, 31, 30, 33, 34, 38, 36, 30, 32],
      [37, 30, 33, 33, 33, 34, 30, 30, 31, 32, 35, 36, 31, 35, 39, 34, 39, 36, 31, 39, 34, 30, 35, 39, 35, 33, 38, 33, 36, 36, 38, 33],
      [39, 34, 37, 39, 36, 30, 33, 39, 31, 36, 38, 35, 32, 32, 37, 34, 39, 35, 31, 33, 36, 39, 39, 38, 39, 37, 38, 35, 34, 32, 34, 30],
      [36, 37, 31, 34, 30, 31, 31, 31, 39, 36, 30, 36, 34, 36, 32, 33, 32, 35, 34, 34, 34, 38, 38, 39, 33, 37, 31, 39, 32, 39, 32, 31],
      [34, 36, 34, 32, 36, 33, 34, 39, 31, 33, 34, 35, 31, 31, 31, 34, 34, 31, 35, 32, 34, 38, 30, 34, 32, 34, 31, 39, 31, 39, 34, 34],
      [31, 32, 30, 39, 34, 31, 36, 33, 34, 32, 30, 34, 36, 30, 31, 35, 39, 35, 33, 34, 36, 35, 39, 32, 33, 38, 39, 30, 33, 38, 32, 37],
      [36, 31, 31, 38, 33, 30, 39, 31, 30, 35, 31, 34, 36, 39, 32, 31, 38, 34, 38, 33, 38, 33, 36, 37, 33, 31, 35, 33, 35, 30, 32, 36],
      [31, 38, 37, 35, 33, 34, 36, 34, 32, 31, 35, 31, 33, 39, 39, 38, 31, 35, 36, 39, 38, 32, 31, 37, 31, 38, 31, 31, 33, 34, 30, 30],
      [35, 30, 31, 30, 32, 32, 30, 39, 31, 39, 34, 39, 33, 35, 32, 35, 35, 30, 37, 32, 35, 32, 32, 31, 38, 34, 32, 30, 38, 32, 37, 34],
      [38, 35, 38, 33, 38, 36, 33, 33, 38, 30, 30, 38, 33, 30, 36, 30, 37, 31, 37, 36, 39, 35, 32, 37, 38, 38, 36, 31, 38, 30, 31, 35],
      [37, 34, 35, 39, 36, 31, 39, 37, 37, 39, 36, 37, 33, 38, 36, 33, 34, 33, 35, 33, 31, 39, 37, 31, 34, 31, 38, 39, 39, 34, 38, 38],
      [35, 36, 31, 35, 32, 38, 31, 34, 39, 31, 37, 32, 37, 39, 36, 30, 36, 31, 33, 31, 30, 37, 31, 37, 32, 30, 38, 32, 34, 31, 31, 33],
      [30, 34, 34, 30, 34, 32, 34, 31, 35, 31, 30, 31, 32, 33, 37, 31, 38, 32, 38, 38, 30, 34, 39, 34, 33, 38, 34, 36, 38, 39, 36, 33],
      [38, 31, 37, 39, 31, 36, 35, 38, 30, 36, 32, 38, 38, 33, 34, 38, 37, 32, 35, 36, 33, 30, 36, 31, 38, 34, 36, 37, 31, 34, 36, 38],
      [37, 36, 32, 32, 39, 35, 30, 39, 36, 36, 32, 36, 31, 38, 30, 35, 37, 36, 33, 36, 34, 32, 37, 30, 34, 31, 38, 39, 38, 34, 34, 35],
      [36, 35, 39, 39, 36, 35, 35, 32, 32, 34, 32, 37, 34, 34, 39, 34, 39, 30, 30, 36, 34, 32, 31, 39, 30, 33, 30, 31, 39, 32, 31, 32]
    ]
    this.dataArray = [
      {
        z: this.arrayMQTT,
        type: 'heatmap',
        hoverongaps: false
      }
    ]
  },
  mounted () {
  },
  mqtt: {
    'topic/ws/heatmap' (data, topic) {
      // console.log('topic(this.topicmqtt): ' + this.topicmqtt)
      // console.log('topic*****' + topic)
      // this.showmsg = 'no'
      this.chartshow = 'yes'
      // console.log('data: ' + data)
      this.origObj = JSON.parse(data)
      this.origArray = [JSON.parse(data)]
      console.log('this.origArray')
      console.log(this.origArray)
      this.arrayMQTT = this.origObj.IR
      // console.log('this.arrayMQTT')
      // console.log(JSON.stringify(this.arrayMQTT))
      this.dataArray = [
        {
          z: this.arrayMQTT,
          type: 'heatmap',
          hoverongaps: false,
          displayModeBar: false
        }
      ]
      // this.checkArray = this.checkObj[0].checkArray
      // console.log(this.checkArray)
      // console.log('MAC*****' + this.MAC)
    }
  }
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
  width: 100%
  align: center
.my-chart
  width: 80%
  align: center
  max-width: 550px
</style>
