<template>
<q-page q-pa-md row no-wrap items-center justify-around>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      :dense="$q.screen.lt.md"
      title="Device List"
      :data="device_list"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      dense
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search your device">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
       <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="MAC" :props="props">{{ props.row.MAC }}</q-td>
          <q-td key="rackName" :props="props">{{ props.row.rackName }}
            <q-popup-edit v-model="props.row.rackName" title="Update RackName" buttons label-set="Save" label-cancel="Close">
              <!-- <q-input v-model="props.row.RackName" dense autofocus /> -->
              <q-select v-model="props.row.rackName" :options="rack_options" label="" />
            </q-popup-edit>
          </q-td>
          <q-td key="cageID" :props="props">{{ props.row.cageID }}
            <q-popup-edit v-model="props.row.cageID" title="Update cageID" title-size="100px" buttons label-set="Save" label-cancel="Close"
                          :validate="CageRangeValidation"
                          @hide="CageRangeValidation_hide"
                          >
              <q-input type="number" v-model="props.row.cageID" dense autofocus hint="Enter cageID between 1 and 56" 
                       :error="errorCage"
                       :error-message="errorMessageCage"
                       />
            </q-popup-edit>
          </q-td>
          <q-td key="location" :props="props">{{ props.row.location }}
            <q-popup-edit v-model="props.row.location" title="Update location" buttons label-set="Save" label-cancel="Close">
              <q-input v-model="props.row.location" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="area" :props="props">{{ props.row.area }}
            <q-popup-edit v-model="props.row.area" title="Update area" buttons label-set="Save" label-cancel="Close">
              <q-input v-model="props.row.area" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="group" :props="props">{{ props.row.group }}
            <q-popup-edit v-model="props.row.group" title="Update group" buttons label-set="Save" label-cancel="Close">
              <q-input v-model="props.row.group" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="lastModified" :props="props">{{ props.row.fromnow }}</q-td>
          <q-td key="registerUserName" :props="props">{{ props.row.registerUserName }}</q-td>
          <q-td>
            <q-btn
             flat
             rounded
             color="primary"
             dense
             @click="($event) => { MAC_handle(props) }"
             label='即時圖表'
             class="q-mt-md" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <center><q-btn color="primary" type="submit" label="Submit" @click="updateDeviceInfo()"/> </center>
</q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
var exist_cageID_list = []

export default {
  name: 'device',
  data () {
    return {
      rack_options: [],
      MAC: [],
      errorCage: false,
      errorMessageCage: '',
      filter: '',
      columns: [
        {
          name: 'MAC',
          label: '設備 ID',
          align: 'left',
          sortable: true,
          field: row => row.name,
          format: val => `${val}`
        },
        { name: 'rackName', label: '籠架', field: 'rackName', sortable: true, align: 'left' },
        { name: 'cageID', label: '籠號', field: 'cageID', sortable: true, align: 'left' },
        { name: 'location', label: 'location', field: 'location', sortable: true, align: 'left' },
        { name: 'area', label: 'area', field: 'area', sortable: true, align: 'left' },
        { name: 'group', label: 'group', field: 'group', sortable: true, align: 'left' },
        { name: 'lastModified', label: '最後更新', sortable: true, field: 'lastModified', align: 'left' },
        { name: 'registerUserName', label: '登記使用者', field: 'registerUserName', sortable: true, align: 'left' },
        { name: 'detail', label: '即時表格', field: 'detail', sortable: true, align: 'left' }// { name: 'info', label: 'Info', field: 'info', align: 'center' }
      ],
      device_list: []
    }
  },
  created () {
    console.log(this.$route.query)
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    console.log(this.loginInfo)
    console.log(this.loginInfo.id)
    const requestOne = axios.get('http://strapi.frrut.net:1337/device-collections/')
    const requestTwo = axios.get('http://strapi.frrut.net:1337/last-dev-data/')
    const requestThree = axios.get('http://strapi.frrut.net:1337/mk-100-users/')
    axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      this.deviceList = responses[0].data
      this.deviceLastData = responses[1].data
      this.userInfo = responses[2].data
      console.log(this.deviceList)
      console.log(this.deviceLastData)
      // console.log(JSON.stringify(this.userInfo))
      // var userinformation = this.userInfo
      this.deviceList = this.deviceList.filter(e => e.deviceRegiStatus === true && e.registerUserID === this.loginInfo.id)
      for (var i = 0; i < this.deviceList.length; i++) {
        for (var j = 0; j < this.deviceLastData.length; j++) {
          if (this.deviceList[i].MAC === this.deviceLastData[j].MAC) {
            this.deviceList[i].lastUpdateTS = this.deviceLastData[j].timestamp
          }
        }
      }
      this.userInfo = this.userInfo.filter(e => e.id === this.loginInfo.id)
      console.log("userInfo: ", this.userInfo)
      for (var i = 0; i < this.userInfo.length; i++) {
        for (var j = 0; j < this.userInfo[i].respRack.length; j++) {
            this.rack_options.push(this.userInfo[i].respRack[j])
        }
      }
      console.log("rack_options: ", JSON.stringify(this.rack_options))
      for (var f = 0; f < this.deviceList.length; f++) {
        this.deviceList[f].fromnow = moment(this.deviceList[f].lastUpdateTS * 1000).locale('zh-TW').fromNow()
        exist_cageID_list[f] = (this.deviceList[f].cageID.toString())
      }
      console.log(JSON.stringify(this.deviceList))
      this.device_list = this.deviceList
      
      // for(var i = 0; i < exist_cageID_list.length; i++){
      //   exist_cageID_list[i] = exist_cageID_list[i].toString()
      // }
      console.log(exist_cageID_list)

    })).catch(errors => {
    })
  },
  mounted () {
  },
  methods: {
    MAC_handle (props) {
      this.$router.push(
        { path: '/mqttall?MAC=' + props.row.MAC }
      )
    },
    // CageRangeValidation(valid){
    //   // var cageidlist = []
    //   for(var i = 0; i < this.device_list.length; i++){
    //     cageidlist.push(this.device_list[i].cageID.toString())
    //   }
    //   console.log(cageidlist)
    // },
    CageRangeValidation(valid){
      if(valid == 0){
        for (var f = 0; f < this.device_list.length; f++) {
          exist_cageID_list[f] = (this.deviceList[f].cageID.toString())
        }
        console.log(exist_cageID_list)
        this.errorCage = false
        this.errorMessageCage = ''
        return true
      }
      else if (exist_cageID_list.includes(valid)){
        this.errorCage = true
        this.errorMessageCage = "The cageID already Exists."
        return false
      }
      else if (valid < 1 || valid > 56){
        this.errorCage = true
        this.errorMessageCage = "The value must be between 1 and 56."
        return false
      }
      for (var f = 0; f < this.device_list.length; f++) {
        exist_cageID_list[f] = (this.deviceList[f].cageID.toString())
      }
      console.log(exist_cageID_list)
      this.errorCage = false
      this.errorMessageCage = ''
      return true
    },
    CageRangeValidation_hide(x){
      this.errorCage = false
      this.errorMessageCage = ''
      return true
    },
    updateDeviceInfo(){
      console.log(this.device_list)
      var putData = []
      for(var i = 0; i < this.device_list.length; i++){
        putData[i]= {
          "id": this.device_list[i].id,
          "rackName": this.device_list[i].rackName,
          "cageID": this.device_list[i].cageID,
          "location": this.device_list[i].location,
          "area": this.device_list[i].area,
          "group": this.device_list[i].group
        }
      }
      console.log("putData: ", putData)
      putData.forEach(DeviceInfo =>
        axios.put("http://strapi.frrut.net:1337/device-collections/" + DeviceInfo.id, DeviceInfo)
          .then(response => {
            console.log('Update success')
            console.log(response.data)
            window.location.reload()
          })
          .catch(error => {
            console.log(error)
            console.log(DeviceInfo)
          })
      )
      
    }
  },
  computed: {
    fromNow: function () {
      return moment('Mon Dec 30 2019 08:52:37 GMT+0000 (Coordinated Universal Time)').fromNow()
    }
  }
}
</script>
<style lang="sass">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    min-height: 350px
    max-height: 500px

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
