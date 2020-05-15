<template>
  <q-page>
    <!-- <div class="q-pa-md">
      <q-card class="q-pa-md" style="height:30em">
          <div class="q-pa-md q-col-gutter-md items-start" >
              <q-img src="./test_image.png" style="float:left;" height= "27.5em" width= "27.5em"></q-img>
              <h4 style="margin:auto; margin-left:12em; margin-top:1.2em;">Accuracy: {{this.cal_accuracy}}% </h4>
              <h4 style="margin:auto; margin-left:12em; margin-top:1.2em;">Total Alive: {{this.Alive_cnt}} </h4>
              <h4 style="margin:auto; margin-left:12em; margin-top:1.2em;">Total Dead: {{this.Dead_cnt}} </h4>
          </div>
      </q-card>
    </div> -->

    <div class="q-pa-md">
      <q-card class="q-pa-md" style="height:32em;">
          <div class="q-pa-md q-col-gutter-md row">
            <div class="col-6">
              <q-img 
                :src="this.imgURL"
                style="position: absolute; left:15em; vertical-align:middle;" 
                height= "27.5em" 
                width= "27.5em">
              </q-img>
            </div>
            <div class="col-6">
              <h4 style="margin:auto; margin-top:3em; margin-left:2em;">Accuracy: {{this.cal_accuracy}}% </h4>
              <h4 style="margin:auto; margin-top:1.2em; margin-left:2em;">Total Dead: {{this.Dead_cnt}} </h4>
              <h4 style="margin:auto; margin-top:1.2em; margin-left:2em;">Total Recevied: {{this.Alive_cnt}} </h4>
            </div>
          </div>
      </q-card>
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
      device_Data: [],
      filter: '',
      imgURL: '',
      cal_accuracy: 0,
      Alive_cnt: 0,
      Dead_cnt: 0,
    }

  },


  created (){

    // const requestDATA = axios.get('http://strapi.frrut.net:1337/last-data')
    // console.log("hey!", requestDATA)

    axios.get("http://strapi.frrut.net:1337/last-data")
      .then(response => {
        console.log(response.data)       
        this.device_Data = response.data.filter(e => e.MAC === '840d8ed0b3e0')
        console.log(this.device_Data)
        this.Alive_cnt = Math.round((this.device_Data[0].Alive_cnt + this.device_Data[0].Dead_cnt)/ 5 )
        this.Dead_cnt = this.device_Data[0].Dead_cnt
        this.cal_accuracy = this.Dead_cnt / this.Alive_cnt
        this.cal_accuracy = Math.round(this.cal_accuracy * 10000) / 100.00
        this.imgURL = this.device_Data[0].imgURL

      })
      .catch(error => {
        console.log(error)
      })
    

    // setInterval(checkTime(),"5000");
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