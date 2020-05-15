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
          control-color="primary"
          class="rounded-borders"
        >
          <q-carousel-slide name="overview" class="column no-wrap flex-center">
            <q-icon name="style" color="primary" size="56px" />
            <div class="row justify-center q-pa-md">
              <div class="col-6 left">
                <q-card style="width:300px; height:300px;  text-align:center;">
                    hi
                </q-card>
              </div>
              <div class="col-6">
                <q-card style="width:300px; height:300px; margin-left:50px; text-align:center;">
                    hi
                </q-card>
              </div>
              
              
            </div>

          </q-carousel-slide>

          <q-carousel-slide name="rack" class="column no-wrap flex-center">
            <q-icon name="live_tv" color="primary" size="56px" />
            <div class="q-mt-md text-center">
              {{ lorem }}
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="cage" class="column no-wrap flex-center">
            <q-icon name="layers" color="primary" size="56px" />
            <div class="q-mt-md text-center">
              {{ lorem }}
            </div>
          </q-carousel-slide>
        </q-carousel>

      </div>

  </q-page>
</template>

<script>
import axios from 'axios'
function checkTime(){
    var nowtime = Date.parse(new Date());
    console.log(nowtime);
}

export default {
  name: 'PageIndex',
  data(){
    return{
      slide: 'overview',
      lorem: "Hi!",

    }

  },

  created (){
    checkTime()

    const requestOne = axios.get('http://strapi.frrut.net:1337/device-collections')
    const requestTwo = axios.get('http://strapi.frrut.net:1337/last-data')
    const requestThree = axios.get('http://strapi.frrut.net:1337/mk-100-users')
    const requestFour = axios.get('http://strapi.frrut.net:1337/all-data?_limit=30000&_sort=timestamp:DESC')
    axios.all([requestOne, requestTwo, requestThree, requestFour]).then(axios.spread((...responses) => {
      var deviceCollection = responses[0].data
      var lastdata = responses[1].data
      var mk100users = responses[2].data
      var alldata = responses[3].data

      console.log("deviceCollection: ", deviceCollection)
      console.log("lastdata: ", lastdata)
      console.log("mk100users: ", mk100users)
      console.log("alldata: ", alldata)

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



    })).catch(errors => {
    })


    // axios.get("http://strapi.frrut.net:1337/last-data")
    //   .then(response => {
    //     console.log(response.data)       
    //     this.device_Data = response.data.filter(e => e.MAC === '840d8ed0b3e0')
    //     console.log(this.device_Data)
    //     this.Alive_cnt = Math.round((this.device_Data[0].Alive_cnt + this.device_Data[0].Dead_cnt)/ 5 )
    //     this.Dead_cnt = this.device_Data[0].Dead_cnt
    //     this.cal_accuracy = this.Dead_cnt / this.Alive_cnt
    //     this.cal_accuracy = Math.round(this.cal_accuracy * 10000) / 100.00
    //     this.imgURL = this.device_Data[0].imgURL

    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })

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