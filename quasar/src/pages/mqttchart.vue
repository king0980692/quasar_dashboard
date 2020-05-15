<template>
  <q-page class='q-pt-sm'>
    <div id='result'></div>
    <canvas id='streamChart' class='full-width' style='height: 350px;'></canvas>
    <publish></publish>
  <div class="sub" v-html="buff">
  </div>
  </q-page>
</template>

<style>
</style>

<script>
import Chart from 'chart.js'
import publish from './Publish'
export default {
  name: 'app',
  components: {
    publish
  },
  data () {
    return {
      buff: 'Sub1:<br>'
    }
  },
  created () {
    console.log(this.$route.query)
    this.MAC = this.$route.query.MAC
    console.log(this.MAC)
    var topicmqtt = 'topic/' + this.MAC
    this.$mqtt.subscribe(topicmqtt)
    console.log(topicmqtt)
  },
  mounted () {
    this.drawTheChart()
    // this.streamData()
  },
  mqtt: {
    'topic/#' (data, topic) {
      this.buff = data
      console.log('data: ' + data)
      console.log('topic: ' + topic)
      if (topic === 'topic/' + this.MAC) {
        var time = new Date().toLocaleTimeString()
        var datajson = JSON.parse(data)
        this.mChart.data.labels.push(time)
        this.mChart.data.datasets[0].data.push(datajson.key0)
        this.mChart.data.datasets[1].data.push(datajson.key1)
        this.mChart.data.datasets[2].data.push(datajson.key2)
        this.mChart.data.datasets[3].data.push(datajson.key3)
        this.mChart.data.datasets[4].data.push(datajson.key4)
        this.mChart.data.datasets[5].data.push(datajson.key5)
        this.mChart.update()
      }
    }
  },
  methods: {
    drawTheChart () {
      let ctx = document.getElementById('streamChart').getContext('2d')
      this.mChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              borderWidth: 1,
              borderColor: '#f55d42',
              label: 'cage1',
              fill: false
            },
            {
              data: [],
              borderWidth: 1,
              borderColor: '#9e42f5',
              label: 'cage2',
              fill: false
            },
            {
              data: [],
              borderWidth: 1,
              borderColor: 'yellow',
              label: 'cage3',
              fill: false
            },
            {
              data: [],
              borderWidth: 1,
              borderColor: 'gray',
              label: 'cage4',
              fill: false
            },
            {
              data: [],
              borderWidth: 1,
              borderColor: 'black',
              label: 'cage5',
              fill: false
            },
            {
              data: [],
              borderWidth: 1,
              borderColor: '#EF33FF',
              label: 'cage6',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Chart.js for MAC  : ' + this.MAC
          },
          legend: {
            display: true
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      })
    }
  },
  computed: {}
}
</script>
