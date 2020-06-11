<template>
  <q-page>
    <div class="q-pa">
      <!-- <div class="row justify-center q-pa-sm">
        <q-btn-toggle
          glossy
          no-caps
          v-model="slide"
          :options="[
            { label: 'Overview', value: 'overview' },
            { label: 'Rack', value: 'rack' },
            { label: 'Cage', value: 'cage' }
          ]"
        />
      </div> -->
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        animated
        :fullscreen.sync="fullscreen"
        class="rounded-borders"
        style="height:auto; "
      >
        <!-- Slide 1: Rack -->
        <q-carousel-slide name="overview" class="column no-wrap" >
          <div class="row justify-center q-pa">
            <div class="col-12 q-pa-xs">
              <q-card style="width:auto-fill; height:auto-fill; float:center;  text-align:center;">
                <b style="font-size:28px; font-family: Microsoft JhengHei; line-height: 54px;">
                  Temperature monitoring system
                </b>
              </q-card>
            </div>

            <!-- <div class="col-12">
              <q-card style="float:center; text-align:center;">
                <q-card-section style="width:auto-fill; height:auto-fill;">
                  <line-chart v-if="loaded" :chartdata="chartdata" />
                </q-card-section>
              </q-card>
            </div> -->



            <!-- <div class="col-4">
              <q-card style="float:center; height:100%; text-align:center;">
                <q-card-section style="width:auto-fill; height:auto;">
                  <q-icon name="wifi" size="50px" >
                    <q-tooltip anchor="center right" self="center left" content-class="bg-indigo" :offset="[10, 10]" content-style="font-size:14px;">
                      Connection
                    </q-tooltip>
                  </q-icon>
                  <pie-chart
                    v-if="loaded"
                    :chartdata="doughnut_alive_device_data"
                    :options="alive_device_options"
                  />
                </q-card-section>
              </q-card>
            </div> -->

            <!-- <q-card style="width:auto-fill; height:auto-fill">
              <div class="col-3" id="main" style="width:100px; height:100px;"></div>
            </q-card> -->

            <div class="col-6">
              <q-card  id="linechart" style="width:100%; height:100%;  min-height: 400px">
                <!-- <div class="col-4" id="linechart" style="width:300px; height:500px;"></div> -->
              </q-card>
            </div>  

            <div class="col-6">
              <q-card id="main" style="width:100%; height:100%;  min-height: 400px" >
                <!-- <div id="main" style="width:300px; height:500px;"></div> -->
              </q-card>
            </div>  
            


          </div>
        </q-carousel-slide>
        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[8, 8]">
            <q-btn
              push
              round
              dense
              size="18px"
              color="white"
              text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            >
              <q-tooltip anchor="center left" self="center right" content-class="bg-indigo" :offset="[10, 10]" content-style="font-size:10px;">
                Fullscreen
              </q-tooltip>
            </q-btn>
          </q-carousel-control>
        </template>

        
      </q-carousel>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import LineChart from "../components/LineChart.js";
import PieChart from "../components/PieChart.js";
import moment from 'moment'
// import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";
import ChartJspluginDoughnutlabel from "chartjs-plugin-doughnutlabel";
import Button from "../components/button";
import Vue from "vue";
import echarts from 'echarts';

var all_device_MAC = [];
var last_data_for_mqtt = [];
var echart_thermometer = {};
var line_chart_temperature = {};

export default {
  name: "PageIndex",
  components: {
    LineChart,
    PieChart,
    Button
  },
  data() {
    return {
      okaudio: "",
      // all_device_MAC: [],
      slide: "overview",
      lorem: "Hi!",
      event_list: [
        {
          id: 1,
          rack_name: "mouse",
          cage_id: "3",
          event_type: "low volt"
        },
        {
          id: 2,
          rack_name: "mouse",
          cage_id: "4",
          event_type: "dead warning"
        }
      ],
      loaded: false,
      fullscreen: false,
      doughnut_alive_device_data: null,
      doughnut_battery_alert_data: null,
      doughnut_dirt_alert_data: null,
      doughnut_feeder_alert_data: null,
      chartdata: null,
      alive_device_options: {},
      battery_alert_options: {},
      dirt_alert_options: {},
      feeder_alert_options: {
        responsive: true,
        plugins: {
          doughnutlabel: {
            labels: []
          }
        }
      }
      //user_lastdata:[]
    };
  },
  computed: {

  },
  created() {
    this.okaudio = new Audio("https://mk100.frrut.net/when.mp3");
    this.loaded = false;
    this.get_api();
    
    this.topicmqtt = "te200/data/#";
    this.$mqtt.subscribe(this.topicmqtt);

  },
  methods: {
    playOKSound() {
      console.log("Play OK sound");
      const okaudioPromise = this.okaudio.play();
      if (okaudioPromise !== undefined) {
        okaudioPromise
          .then(() => {
            console.log("Finished Play OK sound");
            // Automatic playback started!
            // Show playing UI.
          })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
          });
      }
    },
    checkTime() {
      return Date.parse(new Date());
    },
    get_api() {
      const requestOne = axios.get("https://api.frrut.net/device-collections");
      // const requestTwo = axios.get("https://api.frrut.net/last-data");
      const requestTwo = axios.get("https://api.frrut.net/te-200-last-data");
      const requestThree = axios.get("https://api.frrut.net/mk-100-users");
      const requestFour = axios.get("https://api.frrut.net/tm-200-all-data?_limit=500&_sort=timestamp:DESC")
      // const requestFour = axios.get("https://api.frrut.net/all-data?_limit=10000&_sort=timestamp:DESC");

      var nowtime = this.checkTime() / 1000;
      console.log("nowtime: ", nowtime, typeof nowtime);
      axios
        .all([requestOne, requestTwo, requestThree])
        .then(
          axios.spread((...responses) => {
            const deviceCollection = responses[0].data;
            const lastdata = responses[1].data.filter(function(item) {
              return item.mac;
            });
            last_data_for_mqtt = lastdata
            console.log("last_data_for_mqtt: ", last_data_for_mqtt)
            const mk100users = responses[2].data;

            var userInfo = [JSON.parse(localStorage.getItem("loginInfo"))];

            for (var e = 0; e < userInfo.length; e++) {
              for (var f = 0; f < mk100users.length; f++) {
                if (userInfo[e].id === mk100users[f]._id) {
                  userInfo[e].role = mk100users[f].role;
                }
              }
            }
            // console.log("deviceCollection: ", deviceCollection)
            var role = userInfo[0].role;
            all_device_MAC = [];
            var user_lastdata = [];
            console.log("userInfo: ", userInfo)

            if (role === "admin") {
              deviceCollection.map(function(a) {
                all_device_MAC.push(a.MAC);
              });

              lastdata.map(function(a) {
                if (all_device_MAC.includes(a.MAC)) {
                  user_lastdata.push(a);
                }
              });
            }
            else {
              deviceCollection.map(function(a) {
                if (a.registerUserID === userInfo[0].id) {
                  all_device_MAC.push(a.MAC);
                }
              });

              lastdata.map(function(a) {
                if (all_device_MAC.includes(a.MAC)) {
                  user_lastdata.push(a);
                }
              });
            }
            // console.log("user_lastdata: ", user_lastdata)

            for (var j = 0; j < user_lastdata.length; j++) {
              user_lastdata[j].timeStr = moment(user_lastdata[j].timestamp * 1000).locale('zh-TW').format('YYYY/MM/DD HH:mm:ss')
            }

            user_lastdata = user_lastdata.sort((a, b) => b.timestamp - a.timestamp)
            this.buffArray = user_lastdata

            var qtyMax = 200
            if (this.buffArray.length > qtyMax) {
              var temparray = []
              for (let i = 0; i < qtyMax; i++) {
                temparray.push(this.buffArray[i])
              }
              user_lastdata = temparray
            } 
            else {
              // console.log("user_lastdata.length: ", user_lastdata.length)
            } 

            var Timeout_devices =
              all_device_MAC.length - user_lastdata.length;

            var check_time_list = user_lastdata.map(
              item => nowtime - item.timestamp >= 14400
            );
            // console.log("check_time_list: ", check_time_list);

            for (var i = 0; i < check_time_list.length; i++) {
              if (check_time_list[i]) {
                // console.log("One device Timeout!");
                user_lastdata.pop();
                Timeout_devices += 1;
              }
            }
            console.log("all_device_MAC: ", all_device_MAC)
            console.log("user_lastdata: ", user_lastdata, user_lastdata.length);

            var Working_devices = user_lastdata.length;

            var Sufficient_battery = user_lastdata.filter(x => x.voltAlertColor === "green").length;
            var Insufficient_battery = user_lastdata.filter(x => x.voltAlertColor === "red").length;

            var Clean = user_lastdata.filter(x => x.blobAlertColor === "green").length;
            var Dirty = user_lastdata.filter(x => x.blobAlertColor === "red").length;

            var Sufficient_feed = user_lastdata.filter(x => x.feederAlertColor === "green").length;
            var Insufficient_feed = user_lastdata.filter(x => x.feederAlertColor === "red").length;

            this.alive_device_options = {
              responsive: true,
              plugins: {
                doughnutlabel: {
                  labels: [
                    {
                      text:
                        Timeout_devices +
                        " of " +
                        (Working_devices + Timeout_devices),
                      font: { size: "20", style: "bold" }
                    },
                  ]
                }
              }
            };

            this.battery_alert_options = {
              responsive: true,
              plugins: {
                doughnutlabel: {
                  labels: [
                    {
                      text:
                        Insufficient_battery +
                        " of " +
                        (Sufficient_battery + Insufficient_battery),
                      font: { size: "20", style: "bold" }
                    },
                  ]
                }
              }
            };

            this.dirt_alert_options = {
              responsive: true,
              plugins: {
                doughnutlabel: {
                  labels: [
                    {
                      text: Dirty + " of " + (Clean + Dirty),
                      font: { size: "20", style: "bold" }
                    },
                  ]
                }
              }
            };

            this.feeder_alert_options = {
              responsive: true,
              plugins: {
                doughnutlabel: {
                  labels: [
                    {
                      text:
                        Insufficient_feed +
                        " of " +
                        (Sufficient_feed + Insufficient_feed),
                      font: { size: "20", style: "bold" }
                    },
                  ]
                }
              }
            };

            this.doughnut_alive_device_data = {
              labels: ["Connected", "Lost"],
              datasets: [
                {
                  backgroundColor: ["#40bf40", "#e6e6e6"],
                  data: [Working_devices, Timeout_devices]
                }
              ]
            };

            this.doughnut_battery_alert_data = {
              labels: ["Full", "Empty"],
              datasets: [
                {
                  backgroundColor: ["#40bf40", "#ff5c33"],
                  data: [Sufficient_battery, Insufficient_battery]
                }
              ]
            };

            this.doughnut_dirt_alert_data = {
              labels: ["Clean", "Dirty"],
              datasets: [
                {
                  backgroundColor: ["#40bf40", "#ff5c33"],
                  data: [Clean, Dirty]
                }
              ]
            };

            this.doughnut_feeder_alert_data = {
              labels: ["Full", "Empty"],
              datasets: [
                {
                  backgroundColor: ["#40bf40", "#ff5c33"],
                  data: [Sufficient_feed, Insufficient_feed]
                }
              ]
            };
            this.loaded = true;
          })
        )
        .catch(e => {
          console.error(e);
        });
    },
    get_thermometer_data(){

      var TP_value = -30;
      var kd = []; //刻度
      var Gradient = [];
      var leftColor = '';
      var showValue = '';
      var boxPosition = [50, 50];
      var TP_txt = ''
      // 刻度使用柱狀圖模擬，短設置1，長的設置3；構造一個數據
      for (var i = 0, len = 135; i <= len; i++) {
          if (i < 10 || i > 130) {
              kd.push('')
          } else {
              if ((i - 10) % 20 === 0) {
                  kd.push('-3');
              } else if ((i - 10) % 4 === 0) {
                  kd.push('-1');
              } else {
                  kd.push('');
              }
          }
      }
      //中間線的漸變色和文本内容
      if (TP_value > 20) {
          TP_txt = '溫度偏高';
          Gradient.push({
              offset: 0,
              color: '#93FE94'
          }, {
              offset: 0.5,
              color: '#E4D225'
          }, {
              offset: 1,
              color: '#E01F28'
          })
      } else if (TP_value > -20) {
          TP_txt = '溫度正常';
          Gradient.push({
              offset: 0,
              color: '#93FE94'
          }, {
              offset: 1,
              color: '#E4D225'
          })
      } else {
          TP_txt = '溫度偏低';
          Gradient.push({
              offset: 0,
              color: '#93FE94'
          })
      }
      if (TP_value > 62) {
          showValue = 62
      } else {
          if (TP_value < -60) {
              showValue = -60
          } else {
              showValue = TP_value
          }
      }
      if (TP_value < -10) {
          //boxPosition = [65, -50];
      }
      leftColor = Gradient[Gradient.length - 1].color;

      // 因為柱狀初始化為0，溫度存在負值，所以加上負值60和空出距離10
      var option = {
          backgroundColor: 'white',
          title: {
              text: '冰箱溫度',
              x: 'center',
              textStyle:{
                color: 'black',
                fontSize: 20,
              },
              show: true
          },
          yAxis: [{
              show: false,
              data: [],
              min: -40,
              max: 135,
              axisLine: {
                  show: false
              }
          }, {
              show: false,
              min: 0,
              max: 50,
          }, {
              type: 'category',
              data: ['', '', '', '', '', '', '', '', '', '', '', '', '', '°C'],
              position: 'left',
              offset: -320,
              axisLabel: {
                  fontSize: 10,
                  color: 'black'
              },
              axisLine: {
                  show: false
              },
              axisTick: {
                  show: false
              },
          }],
          xAxis: [{
              show: false,
              min: -100,
              max: 80,
              data: []
          }, {
              show: false,
              min: -100,
              max: 80,
              data: []
          }, {
              show: false,
              min: -100,
              max: 80,
              data: []
          }, {
              show: false,
              min: -73,
              max: 80,

          }],
          series: [{
              name: '溫度條',
              type: 'bar',
              // 對應上面XAxis的第一個對象配置
              xAxisIndex: 0,
              data: [{
                  value: (showValue + 70),
                  label: {
                      normal: {
                          show: true,
                          position: [-40, 120],

                          width: 100,
                          height: 100,
                          formatter: '{back| ' + TP_value + ' }{unit|°C}\n',
                          rich: {
                              back: {
                                  align: 'center',
                                  lineHeight: 50,
                                  fontSize: 40,
                                  fontFamily: 'digifacewide',
                                  color: leftColor
                              },
                              unit: {
                                  fontFamily: '微軟雅黑',
                                  fontSize: 15,
                                  lineHeight: 50,
                                  color: leftColor
                              },
                          }
                      }
                  }
              }],

              barWidth: 18,
              itemStyle: {
                  normal: {
                      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
                  }
              },
              z: 2
          }, {
              name: '內框',
              type: 'bar',
              xAxisIndex: 1,
              barGap: '-100%',
              data: [134],
              barWidth: 28,
              itemStyle: {
                  normal: {
                      color: '#0C2E6D',
                      barBorderRadius: 50,
                  }
              },
              z: 1
          }, {
              name: '外框',
              type: 'bar',
              xAxisIndex: 2,
              barGap: '-100%',
              data: [135],
              barWidth: 38,
              itemStyle: {
                  normal: {
                      color: '#4577BA',
                      barBorderRadius: 50,
                  }
              },
              z: 0
          }, {
              name: '溫度圓',
              type: 'scatter',
              hoverAnimation: false,
              data: [0],
              xAxisIndex: 0,
              symbolSize: 48,
              itemStyle: {
                  normal: {
                      color: '#93FE94',
                      opacity: 1,
                  }
              },
              z: 2
          }, {
              name: '內圓',
              type: 'scatter',
              hoverAnimation: false,
              data: [0],
              xAxisIndex: 1,
              symbolSize: 60,
              itemStyle: {
                  normal: {
                      color: '#0C2E6D',
                      opacity: 1,
                  }
              },
              z: 1
          }, {
              name: '外圓',
              type: 'scatter',
              hoverAnimation: false,
              data: [0],
              xAxisIndex: 2,
              symbolSize: 70,
              itemStyle: {
                  normal: {
                      color: '#4577BA',
                      opacity: 1,
                  }
              },
              z: 0
          }, {
              name: '刻度',
              type: 'bar',
              yAxisIndex: 0,
              xAxisIndex: 3,
              label: {
                  normal: {
                      show: true,
                      position: 'left',
                      distance: 10,
                      color: 'black',
                      fontSize: 14,
                      formatter: function(params) {
                          if (params.dataIndex > 130 || params.dataIndex < 10) {
                              return '';
                          } else {
                              if ((params.dataIndex - 10) % 20 === 0) {
                                  return params.dataIndex - 70;
                              } else {
                                  return '';
                              }
                          }
                      }
                  }
              },
              barGap: '-100%',
              data: kd,
              barWidth: 2,
              itemStyle: {
                  normal: {
                      color: 'black',
                      barBorderRadius: 120,
                  }
              },
              z: 0
          }]
        };
      echart_thermometer.setOption(option)
    },
    get_temperature_data(){
      
      function randomData() {
          now = new Date(+now + oneDay);
          value = Math.random() * 10;
          return {
              name: now.toString(),
              value: [
                  [now.getFullYear(), now.getMonth(), now.getDate()].join('/'),
                  Math.round(value)
              ]
          };
      }

      var data = [];
      var data2 = [];
      var now = new Date(2020, 1, 1);
      var oneDay = 24 * 3600 * 1000;
      var value = Math.random();
      for (var i = 0; i < 7; i++) {
          data.push(randomData());
          data2.push(randomData());
      }


      var option = {
      color: ['#ed7a2c', '#5b9bd5', '#a5a5a5'],
      grid: {
          bottom: 60,
      },
      title: {
          text: '疫苗冰箱溫度監控',
          x: 'center',
          textStyle: {
              fontWeight: 'bold',
              fontSize: '18'
          }
      },
      tooltip: {
          trigger: 'axis',
          confine: true,
          textStyle: {
              fontSize: 12
          }
      },
      xAxis: {
          type: "time",
          boundaryGap: false,
          // axisLabel//: {
          //     formatter: (function(value){
          //         return moment(value).format('HH:mm');
          //     })
          // },

      },
      yAxis: {
          type: "value",
          max: 10,
          min: -5,
          interval: 3,
      },
      series: [
        {
          name: "冰箱溫度:A1",
          type: "line",
          lineStyle: {
            width: 3
          },
          data: data,
          showSymbol: false,
          hoverAnimation: false,
        }, 
        {
          name: "冰箱溫度:A2",
          type: "line",
          lineStyle: {
            width: 3
          },
          data: data2,
          showSymbol: false,
          hoverAnimation: false,
        },
        {
          name: "警戒線",
          type: "line",
          markLine: {
              lineStyle: {
                  width: 2,
                  type:"solid"
              },
              label: {
                  position: "insideEndTop",
                  formatter: "{b}",
                  color: "#333"
              },
              tooltip: {
                  trigger: 'item',
                  confine: true,
                  textStyle: {
                      fontSize: 12
                  }
              },
              symbolSize: 0,
              data: [{
                  name: "高溫警戒",
                  yAxis: 8.5,
                  lineStyle: {
                      color: "#f60902"
                  }
              }, {
                  name: "中警戒",
                  yAxis: 7.5,
                  lineStyle: {
                      color: "#A3A3A3"
                  }
              }]
          },
        }

      ]
      };

      line_chart_temperature.setOption(option)
      setInterval(function () {

          for (var i = 0; i < 1; i++) {
              data.shift();
              data2.shift();
              data.push(randomData());
              data2.push(randomData());
          }

          line_chart_temperature.setOption({
              series: [{
                  name: '冰箱溫度:A1',
                  data: data,
                  type: 'line'
              },
              {
                  name: '冰箱溫度:A2',
                  data: data2,
                  type: 'line'
              }
              ]
          });
      }, 5000);

      //line_chart_temperature.setOption(option)
    },
  },
  mounted() {
    echart_thermometer = echarts.init(document.getElementById('main'));
    // console.log("type of echart_thermometer: ", typeof(echart_thermometer))
    window.addEventListener("resize", echart_thermometer.resize);
    this.get_thermometer_data()

    line_chart_temperature = echarts.init(document.getElementById('linechart'))
    window.addEventListener("resize", line_chart_temperature.resize);
    this.get_temperature_data()
  },

  mqtt: {
    "te200/data/#"(mqtt_data_payload, topic) {

      this.obj = JSON.parse(mqtt_data_payload);
      // console.log("this.obj: ", this.obj);
  
  //     this.timestr = this.obj.timeStr;
  //     console.log("all_device_MAC: ", all_device_MAC);

  //     var checkMAC = all_device_MAC.filter(test => test === this.obj.MAC).toString()
  //     console.log("checkMAC: ", checkMAC, "   checkMAC.length: ", checkMAC.length)

      var checkMAC = this.obj.mac  
  //     if (checkMAC.length === 12) {
      if (checkMAC === '2CF432778CE7' || checkMAC === '2CF432778CC4') {
        this.buffArray = last_data_for_mqtt.filter(exclude => exclude.mac !== checkMAC)
        console.log("this.buffArray before adding: ", this.buffArray)
        this.testarray = this.buffArray
        this.testarray = this.testarray.unshift(this.obj)
        console.log("this.buffArray after adding: ", this.testarray)

  //       for (var j = 0; j < this.buffArray.length; j++) {
  //         this.buffArray[j].timeStr = moment(this.buffArray[j].timestamp * 1000).locale('zh-TW').format('YYYY/MM/DD HH:mm:ss')
  //         this.buffArray[j].volt = parseFloat(this.buffArray[j].volt.toFixed(2))
  //       }

  //       var qtyMax = 200
  //       if (this.buffArray.length > qtyMax) {
  //         var temparray = []
  //         for (let i = 0; i < qtyMax; i++) {
  //           temparray.push(this.buffArray[i])
  //         }
  //         last_data_for_mqtt = temparray
  //       } 
  //       else {
  //         console.log(this.buffArray.length)
  //         last_data_for_mqtt = this.buffArray
  //       }
  //     } 
  //     else {
  //       console.log('not for this user, NO show')
      // }
      } 
    } 
  }
};
</script>

<style lang="scss">
.background-image {
  height: 100%;
  width: 50%;
  z-index: -1;
  background-position: left center;
  background-repeat: no-repeat;
  opacity: 0.6;
}
</style>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
