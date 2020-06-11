<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row justify-center q-pa-sm">
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
      </div>

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
        <q-carousel-slide name="overview" class="column no-wrap">
          <div class="row justify-center q-pa-sm">
            <div class="col-12">
              <q-card
                style="width:auto-filled; height:auto; float:center;  text-align:center;"
              >
                <q-card-section style="width:auto-fill; height:auto;">
                  <!-- RackNAME + CageID + Notify -->
                  <div></div>
                  <!-- <div>
                    <q-btn
                      no-caps
                      unelevated
                      color="warning"
                      text-color="dark"
                      v-for="(e,idx) in event_list"
                      :key ="idx"
                      :label="e.event_type"
                      
                    />
                  </div> -->
                  <div ref="container" class="q-pa-md q-gutter-sm">
                    <q-btn
                      no-caps
                      unelevated
                      color="warning"
                      text-color="dark"
                      @click="
                        add_btn('1', 'Cage-1 low volt', 'list', 'primary')
                      "
                      label="Insert Warning"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-3">
              <q-card style=" float:center;  text-align:center;">
                <q-card-section style="width:auto-fill; height:auto;">
                  <pie-chart
                    v-if="loaded"
                    :chartdata="doughnut_alive_device_data"
                    :options="alive_device_options"
                  />
                </q-card-section>
              </q-card>
            </div>

            <div class="col-3">
              <q-card style=" float:center;  text-align:center;">
                <q-card-section style="width:auto-fill; height:auto;">
                  <pie-chart
                    v-if="loaded"
                    :chartdata="doughnut_battery_alert_data"
                    :options="battery_alert_options"
                  />
                </q-card-section>
              </q-card>
            </div>

            <div class="col-3">
              <q-card style=" float:center;  text-align:center;">
                <q-card-section style="width:auto-fill; height:auto;">
                  <pie-chart
                    v-if="loaded"
                    :chartdata="doughnut_dirt_alert_data"
                    :options="dirt_alert_options"
                  />
                </q-card-section>
              </q-card>
            </div>

            <div class="col-3">
              <q-card style=" float:center;  text-align:center;">
                <q-card-section style="width:auto-fill; height:auto;">
                  <pie-chart
                    v-if="loaded"
                    :chartdata="doughnut_feeder_alert_data"
                    :options="feeder_alert_options"
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- <div class="col-6">
              <q-card style="width:350px; height:350px; float:right; right:2em; margin-top:25px; text-align:center;">
                <q-card-section style="width:350px; height:350px;">
                  <pie-chart v-if="loaded" :chartdata="chartdata" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 left">
              <q-card style="width:350px; height:350px; margin-top:25px; float:left; left:2em; text-align:center;">
                <q-card-section style="width:350px; height:350px;">
                  <pie-chart v-if="loaded" :chartdata="chartdata" />
                </q-card-section>
              </q-card>
            </div> -->
          </div>
        </q-carousel-slide>

        <!-- Slide 2: Rack -->
        <q-carousel-slide name="rack" class="column no-wrap flex-center">
          <div class="row justify-center q-pa-md">
            <div class="col-6">
              <q-card
                style="width:350px; height:350px; margin-left:30%; text-align:center;"
              >
                <q-card-section style="width:350px; height:350px;">
                  <line-chart v-if="loaded" :chartdata="chartdata" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 left">
              <q-card style="width:350px; height:350px;  text-align:center;">
                <q-card-section style="width:350px; height:350px;">
                  <line-chart v-if="loaded" :chartdata="chartdata" />
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6">
              <q-card
                style="width:350px; height:350px; margin-left:30%; margin-top:25px; text-align:center;"
              >
                <q-card-section style="width:350px; height:350px;">
                  <line-chart v-if="loaded" :chartdata="chartdata" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 left">
              <q-card
                style="width:350px; height:350px; margin-top:25px; text-align:center;"
              >
                <q-card-section style="width:350px; height:350px;">
                  <line-chart v-if="loaded" :chartdata="chartdata" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-carousel-slide>

        <q-carousel-slide name="cage" class="column no-wrap flex-center">
          <q-icon name="layers" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[18, 18]">
            <q-btn
              push
              round
              dense
              color="white"
              text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
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
// import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";
import ChartJspluginDoughnutlabel from "chartjs-plugin-doughnutlabel";
import Button from "../components/button";
import Vue from "vue";
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
      MAC: [],
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
    dirty_result() {
      return;
    }
  },
  created() {
    // console.log("testing")
    this.okaudio = new Audio("https://mk100.frrut.net/when.mp3");
    this.loaded = false;
    this.topicmqtt = "topic/event/#";
    this.$mqtt.subscribe(this.topicmqtt);

    this.get_api();
    // this.intervalFetchData();
  },
  mqtt: {
    "topic/event/#"(data1, topic) {
      console.log("topic(this.topicmqtt): " + this.topicmqtt);
      this.obj = JSON.parse(data1);
      console.log("original this.obj print");
      console.log(this.obj);
      this.timestr = this.obj.timeStr;
      console.log("this.all_device_MAC: ", this.all_device_MAC);
      var checkMAC = this.userMACList
        .filter(test => test === this.obj.MAC)
        .toString();
      console.log(checkMAC.length);

      if (checkMAC.length === 12) {
        // console.log('last buffArray print')
        // console.log(this.buffArray)
        this.buffArray = this.data;
        this.buffArray.unshift(this.obj);
        //console.log(this.buffArray.length)

        if (this.model === "onlyalert") {
          // this.buffArray = this.buffArray.filter(test => test.oaAlertStatus === true)  #################################
          // this.data = this.data.filter(test => test.MAC !== '111111111111')
          console.log(this.model);
        } else if (this.model === "allevents") {
          // this.data = this.data.filter(test => test.MAC !== '111111111111')
          console.log(this.model);
        }
        for (var j = 0; j < this.buffArray.length; j++) {
          // this.buffArray[j].fromNow = moment(this.buffArray[j].timestamp * 1000).locale('zh-TW').fromNow()
          this.buffArray[j].timeStr = moment(this.buffArray[j].timestamp * 1000).locale("zh-TW").format("YYYY/MM/DD HH:mm:ss");
          this.buffArray[j].volt = parseFloat(
            this.buffArray[j].volt.toFixed(2)
          );
        }
        // this.data = this.buffArray
        var qtyMax = 200;
        if (this.buffArray.length > qtyMax) {
          var temparray = [];
          for (let i = 0; i < qtyMax; i++) {
            temparray.push(this.buffArray[i]);
          }
          //console.log(temparray.length)
          this.data = temparray;
          this.playOKSound();
          // this.buffArray = temparray
          //console.log(JSON.stringify(this.data))
          //console.log(JSON.stringify(this.data.length))
        } else {
          console.log(this.buffArray.length);
          this.data = this.buffArray;
          this.playOKSound();
          // this.buffArray = this.buffArray1
        }
      } else {
        console.log("not for this user, NO show");
        this.playLostcontactSound();
      }
    }
  },
  methods: {
    add_btn(
      cage_id = "",
      text = "Click me!",
      icon_name = "",
      type = "",
      tooltip_text = "test1234"
    ) {
      var ComponentClass = Vue.extend(Button);
      var instance = new ComponentClass({
        propsData: {
          _id: cage_id,
          type: type,
          icon_type: icon_name,
          tooltip_text: tooltip_text
        }
      });
      instance.$slots.default = [text];
      instance.$mount(); // pass nothing
      // console.log("this.$refs: ", this.$refs);
      this.$refs.container.appendChild(instance.$el);
    },
    triggerWarning(position) {
      this.$q.notify({
        type: "warning",
        message: 'Rack: Mouse, Cage: 56, "Feeder is Insufficient."',
        position,
        actions: [{ label: "OK", color: "red", handler: () => {} }]
      });
    },
    random_color(rand) {
      return "#" + Math.floor(rand * 16777215).toString(16);
    },
    checkTime() {
      return Date.parse(new Date());
    },
    intervalFetchData() {
      setInterval(() => {
        this.get_api();
      }, 6000);
    },
    get_api() {
      const requestOne = axios.get("https://api.frrut.net/device-collections");
      const requestTwo = axios.get("https://api.frrut.net/last-data");
      const requestThree = axios.get("https://api.frrut.net/mk-100-users");
      // const requestFour = axios.get("https://api.frrut.net/all-data?_limit=10000&_sort=timestamp:DESC");

      var nowtime = this.checkTime() / 1000;
      console.log("nowtime: ", nowtime, typeof nowtime);
      axios
        .all([requestOne, requestTwo, requestThree])
        .then(
          axios.spread((...responses) => {
            const deviceCollection = responses[0].data;
            const lastdata = responses[1].data.filter(function(item) {
              return item.MAC;
            });
            const mk100users = responses[2].data;
            // const alldata = responses[3].data;

            // console.log("deviceCollection: ", deviceCollection)
            // console.log("lastdata: ", lastdata)
            // console.log("mk100users: ", mk100users)
            // console.log("alldata: ", alldata)

            var userInfo = [JSON.parse(localStorage.getItem("loginInfo"))];

            for (var e = 0; e < userInfo.length; e++) {
              for (var f = 0; f < mk100users.length; f++) {
                if (userInfo[e].id === mk100users[f]._id) {
                  userInfo[e].role = mk100users[f].role;
                }
              }
            }

            var role = userInfo[0].role;
            var all_device_MAC = [];
            var user_lastdata = [];
            // console.log(role)

            if (role === "admin") {
              deviceCollection.map(function(a) {
                all_device_MAC.push(a.MAC);
              });

              lastdata.map(function(a) {
                if (all_device_MAC.includes(a.MAC)) {
                  user_lastdata.push(a);
                }
              });
            } else {
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

            var Timeout_devices = all_device_MAC.length - user_lastdata.length;

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
            console.log("user_lastdata: ", user_lastdata, user_lastdata.length);
            console.log("all_device_MAC: ", all_device_MAC);

            var Working_devices = user_lastdata.length;

            var Sufficient_battery = user_lastdata.filter(
              x => x.voltAlertColor === "green"
            ).length;
            var Insufficient_battery = user_lastdata.filter(
              x => x.voltAlertColor === "red"
            ).length;

            var Clean = user_lastdata.filter(x => x.blobAlertColor === "green")
              .length;
            var Dirty = user_lastdata.filter(x => x.blobAlertColor === "red")
              .length;

            var Sufficient_feed = user_lastdata.filter(
              x => x.feederAlertColor === "green"
            ).length;
            var Insufficient_feed = user_lastdata.filter(
              x => x.feederAlertColor === "red"
            ).length;

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
                    {
                      text: "Timeout",
                      font: { size: "20", style: "bold" }
                    }
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
                    {
                      text: "Insufficient",
                      font: { size: "20", style: "bold" }
                    }
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
                    {
                      text: "Dirty",
                      font: { size: "20", style: "bold" }
                    }
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
                    {
                      text: "Insufficient",
                      font: { size: "20", style: "bold" }
                    }
                  ]
                }
              }
            };

            this.doughnut_alive_device_data = {
              labels: ["Working Devices", "Timeout Devices"],
              datasets: [
                {
                  backgroundColor: ["#40bf40", "#e6e6e6"],
                  data: [Working_devices, Timeout_devices]
                }
              ]
            };

            this.doughnut_battery_alert_data = {
              labels: ["Sufficient Battery", "Insufficient Battery"],
              datasets: [
                {
                  backgroundColor: ["#40bf40", "#ff5c33"],
                  data: [Sufficient_battery, Insufficient_battery]
                }
              ]
            };

            this.doughnut_dirt_alert_data = {
              labels: ["Clean Environment", "Dirty Environment"],
              datasets: [
                {
                  backgroundColor: ["#40bf40", "#ff5c33"],
                  data: [Clean, Dirty]
                }
              ]
            };

            this.doughnut_feeder_alert_data = {
              labels: ["Sufficient Feed", "Insufficient Feed"],
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
    }
  },
  mounted() {}
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
