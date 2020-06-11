<template>
  <q-page>
      <div class="q-pa-md">
        <div class="row justify-center q-pa-md">
          <q-btn-toggle
            glossy
            no-caps
            v-model="slide"
            :options="[
              { label: 'Overview', value: 'overview' },
              { label: 'Rack', value: 'rack' },
              { label: 'Cage', value: 'cage' },
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
          style="height:auto;"
        >
          <q-carousel-slide name="overview" class="column" >
            <div class="row justify-center q-pa-md">

              <div class="col-6">
                <q-card style="width:350px; height:350px; margin-left:30%; text-align:center;">
                  <q-card-section style="width:350px; height:350px;">
                    <pie-chart
                      v-if="loaded"
                      :chartdata="chartdata"
                    />
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-6 left">
                <q-card style="width:350px; height:350px;  text-align:center;">
                  <q-card-section style="width:350px; height:350px;">
                    <pie-chart
                      v-if="loaded"
                      :chartdata="chartdata"
                    />
                  </q-card-section>  
                </q-card>
              </div>

              <div class="col-6">
                <q-card style="width:350px; height:350px; margin-left:30%; margin-top:25px; text-align:center;">
                  <q-card-section style="width:350px; height:350px;">
                    <pie-chart
                      v-if="loaded"
                      :chartdata="chartdata"
                    />
                  </q-card-section>  
                </q-card>
              </div>
              <div class="col-6 left">
                <q-card style="width:350px; height:350px; margin-top:25px; text-align:center;">
                  <q-card-section style="width:350px; height:350px;">
                    <pie-chart
                      v-if="loaded"
                      :chartdata="chartdata"
                    />
                  </q-card-section>  
                </q-card>
              </div>
            </div>

          </q-carousel-slide>

          <q-carousel-slide name="rack" class="column no-wrap flex-center">
            <div class="row justify-center q-pa-md">

              <div class="col-6">
                <q-card style="width:350px; height:350px; right:25%; text-align:center;">
                  <q-card-section style="width:350px; height:350px;">
                    <line-chart
                      v-if="loaded"
                      :chartdata="chartdata"
                    />
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-6 left">
                <q-card style="width:350px; height:350px; left:25%;  text-align:center;">
                  <q-card-section style="width:350px; height:350px;">
                    <line-chart
                      v-if="loaded"
                      :chartdata="chartdata"
                    />
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
          <q-carousel-control
            position="bottom-right"
            :offset="[18, 18]"
          >
            <q-btn
              push round dense color="white" text-color="primary"
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
import axios from 'axios'
import LineChart from '../components/LineChart.js'
import PieChart from '../components/PieChart.js'

function checkTime(){
    var nowtime = Date.parse(new Date());
    console.log(nowtime);
}
export default {
  name: 'PageIndex',
  components: {
    LineChart,
    PieChart
  },
  data(){
    return{
      slide: 'overview',
      lorem: "Hi!",
      loaded: false,
      fullscreen: false,
      chartdata: null
    }

  },

  created (){
    checkTime()
  },

  methods: {
    random_color(rand){
      return '#'+ Math.floor(rand * 16777215).toString(16);
    }
  },
  mounted(){
    this.loaded = false
    
    const requestOne = axios.get('http://strapi.frrut.net:1337/device-collections')
    const requestTwo = axios.get('http://strapi.frrut.net:1337/last-data')
    const requestThree = axios.get('http://strapi.frrut.net:1337/mk-100-users')
    //const requestFour = axios.get('http://strapi.frrut.net:1337/all-data?_limit=30000&_sort=timestamp:DESC')
    
    axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      const deviceCollection = responses[0].data
      const lastdata = responses[1].data
      const mk100users = responses[2].data
      //const alldata = responses[3].data

      console.log("deviceCollection: ", deviceCollection)
      console.log("lastdata: ", lastdata)
      
      console.log("mk100users: ", mk100users)
      //console.log("alldata: ", alldata)

      this.chartdata = {
          //auto generate the lenght of data
          //labels: Array.from(Array(lastdata.length).keys()),
          labels:[],
          datasets: [
          
          ]
      }

      this.chartdata.labels.push(lastdata.map(item => item.MAC))
      
      this.chartdata.datasets.push({
        label: 'Alive_cnt',
        backgroundColor:Array.from({length: lastdata.length}, () =>this.random_color(Math.random())),
        data: lastdata.map(item=>item.Alive_cnt)
      })
      this.loaded = true


      var userInfo = [JSON.parse(localStorage.getItem('loginInfo'))]

      for (var e = 0; e < userInfo.length; e++) {
        for (var f = 0; f < mk100users.length; f++) {
          if (userInfo[e].id === mk100users[f]._id) {
            userInfo[e].role = mk100users[f].role
          }
        }
      }
      
      var role = userInfo[0].role
      var userMAC = []
      if (role === 'admin') {
        this.deviceCollection.map(function (a) {
          userMAC.push(a.MAC)
        })
        // console.log(userMAC)
        this.userMACList = userMAC
      } 
      else {
        this.deviceCollection.map(function (a) {
          if (a.registerUserID === userInfo[0].id) {
            userMAC.push(a.MAC)
          }
        })
        // console.log(userMAC)
        this.userMACList = userMAC
      }

      if (this.MAC !== undefined) {
        var ifMACIn = this.userMACList.filter(test => test === this.MAC).toString()
        console.log(ifMACIn.length)

        if (ifMACIn.length === 12) {
          console.log('this MAC is In')
          this.userMACList = [this.MAC]
          userMAC = [this.MAC]
          console.log('update this.userMACList')
          console.log(this.userMACList)
        } else {
          console.log('Not In show warning')
          this.userMACList = []
          userMAC = []
          this.persistent = true
        }
      }
    
          

    })).catch(e => {
      console.error(e)
    })
  }
  

}

</script>

<style lang="scss">
  .background-image{
    height: 100%;
    width: 50%;
    z-index: -1;
    background-position: left center;
    background-repeat:  no-repeat;
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
