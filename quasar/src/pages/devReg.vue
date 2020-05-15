<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">提醒</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
            沒有選擇任何選項
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
<q-form @submit="updateDevReg" class="q-pa-md">
  <div v-if="show === true">
   <q-btn icon="delete" color="grey" label="x Clear All" @click="clearRegis"/>
  </div>
<p class="q-mt-sm"/>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      title="Register Devices"
      :data="deviceList"
      :columns="columns"
      row-key="MAC"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="Good ! No unregistered devices"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>                                  <!-- add this line -->
            <q-checkbox v-model="props.selected"/><!-- add this line -->
          </q-td>
          
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
          <q-td key="area" :props="props">{{ props.row.area }}
            <q-popup-edit v-model="props.row.area" title="Update area" buttons label-set="Save" label-cancel="Close">
              <q-input v-model="props.row.area" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="location" :props="props">{{ props.row.location }}
            <q-popup-edit v-model="props.row.location" title="Update location" buttons label-set="Save" label-cancel="Close">
              <q-input v-model="props.row.location" dense autofocus />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>

    </q-table>

      
  </div>
    <p class="q-mt-sm"/>
    <q-btn color="primary" type="submit" style="margin-left:200px" label="Submit" />
</q-form>
</q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import {
  Loading,
  QSpinnerGears
} from 'quasar'
var baseURL = 'http://strapi.frrut.net:1337/mk-100-users/'
var assigntocustomerURL = 'https://mk100.frrut.net:1880/assigntocustomer'
var exist_cageID_list = []
export default {
  name: 'device',
  data () {
    return {
      rack_options: [],
      errorCage: false,
      errorMessageCage: '',
      alert: false,
      fullWidth: false,
      show: false,
      selected: [],
      deviceList: [],
      deviceLastData: [],
      userInfo: [],
      columns: [
        { name: 'MAC', label: '設備 ID', field: 'MAC', sortable: true },
        { name: 'rackName', label: '籠架', field: 'rackName', sortable: true },
        { name: 'cageID', label: '籠號', field: 'cageID', sortable: true },
        { name: 'area', label: 'area', field: 'area', sortable: true },
        { name: 'location', label: 'location', field: 'location', sortable: true },
        // { name: 'timeStr', label: '最後更新', field: 'timeStr', sortable: true }
      ],
      data: [
      ],
      register_device_list: []
    }
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('').length
    },
    now: function () {
      return Date.now()
    },
    timestamp: function () {
      return moment(Date.now()).format('YYYY-MM-DD [at] hh:mm')
    },
    fromNow: function () {
      return moment('Wed Jan 30 2020 09:03:53 GMT+0000 (Coordinated Universal Time)').fromNow()
    }
  },
  methods: {
    CageRangeValidation(valid){
      if(valid == 0){
        for (var f = 0; f < this.register_device_list.length; f++) {
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
      for (var f = 0; f < this.register_device_list.length; f++) {
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
    getSelectedString () {
      console.log(this.selected)
      console.log(this.selected.length)
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.deviceList.length}`
    },
    updateDevReg: function () {
      console.log("1",this.selected)
      console.log("2",this.selected.length)
      if (this.selected.length !== 0) {
        Loading.show({
          delay: 400,
          spinner: QSpinnerGears
        })
        this.selected.map(function (a) {
          a.deviceRegiStatus = true
        })
        var username = this.userInfo.find(x => x.id === this.loginInfo.id).username
        console.log(username)
        for (var k = 0; k < this.selected.length; k++) {
          this.selected[k].registerUserID = this.loginInfo.id
          this.selected[k].registerUserName = username
        }
        console.log(this.selected)
        this.selected.forEach(element =>
          axios.put('http://api.frrut.net:1337/device-collections/' + element.id, element)
            .then(response => {
              console.log('update success')
              console.log(response.data)
            })
            .catch(error => {
              console.log(error)
            })
        )
        var assigntocustomerDATA = []
        var getdata = {}
        var thingsboardcustomerID = ''
        var tblogin_username = ''
        var tblogin_password = ''

        axios.get(baseURL)
        .then(response => {
          this.getdata = response.data
          // console.log(this.getdata)
          this.thingsboardtenantID = this.getdata.find(x => x.id === this.loginInfo.id).thingsboardtenantID
          this.tblogin_username = this.getdata.find(x => x.id === this.loginInfo.id).email
          this.tblogin_password = this.getdata.find(x => x.id === this.loginInfo.id).passwd
          for (var k = 0; k < this.selected.length; k++) {
            assigntocustomerDATA[k] = { 
              "Device_macId": this.selected[k].MAC,
              "thingsboardtenantID": this.thingsboardtenantID,
              "userID": this.loginInfo.id,
              "tblogin_username": this.tblogin_username,
              "tblogin_password":this.tblogin_password
              }
          }
          assigntocustomerDATA.forEach(assign =>
            axios.post(assigntocustomerURL, assign)
              .then(response => {
                console.log('post success')
                console.log(response.data)
                window.location.reload()
              })
              .catch(error => {
                console.log(error)
              })
          )
        })
        .catch(error => {
          console.log(error)
        })
      } 
      else {
        console.log('nothing selected')
        this.alert = true
      }
    },
    clearRegis: function () {
      Loading.show({
        delay: 400,
        spinner: QSpinnerGears
      })
      this.loading = true
      axios.get('http://api.frrut.net:1337/device-collections/')
        .then(response => {
          this.deviceList1 = response.data
          console.log('update success')
          console.log(this.deviceList1)
          this.deviceList1.map(function (a) {
            a.deviceRegiStatus = false
            a.registerUserID = ''
            a.registerUserName = ''
          })
          this.deviceList1.forEach(element =>
            axios.put('http://api.frrut.net:1337/device-collections/' + element.id, element)
              .then(response => {
                console.log('update success')
                console.log(response.data)
                this.loading = false
                window.location.reload()
              })
              .catch(error => {
                console.log(error)
              })
          )
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
  created () {
    console.log(this.$route.query)
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    console.log(this.loginInfo)
    console.log(this.loginInfo.id)
    const requestOne = axios.get('http://api.frrut.net:1337/device-collections/')
    const requestTwo = axios.get('http://strapi.frrut.net:1337/lastdata')
    const requestThree = axios.get('http://api.frrut.net:1337/mk-100-users/')
    axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      this.deviceList = responses[0].data
      this.deviceLastData = responses[1].data
      this.userInfo = responses[2].data
      console.log(this.deviceList)
      console.log('this.deviceLastData: ' + JSON.stringify(this.deviceLastData))
      // console.log(JSON.stringify(this.userInfo))
      // var userinformation = this.userInfo
      this.deviceList = this.deviceList.filter(e => e.deviceRegiStatus === false)

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
      this.register_device_list = this.deviceList


      console.log('*********** filter false this.deviceList ***************')
      console.log(this.deviceList)

      for (var i = 0; i < this.deviceList.length; i++) {
        for (var j = 0; j < this.deviceLastData.length; j++) {
          if (this.deviceList[i].MAC === this.deviceLastData[j].MAC) {
            this.deviceList[i].lastUpdateTS = this.deviceLastData[j].timestamp
          }
        }
      }
      console.log('test test test ' + JSON.stringify(this.deviceList))
      for (var f = 0; f < this.deviceList.length; f++) {
        this.deviceList[f].fromnow = moment(this.deviceList[f].lastUpdateTS * 1000).locale('zh-TW').fromNow()
      }
      // var username = this.userInfo.find(x => x.id === this.loginInfo.id).username
      // console.log(username)
      // for (var k = 0; k < this.deviceList.length; k++) {
      //   this.deviceList[k].registerUserID = this.loginInfo.id
      //   this.deviceList[k].registerUserName = username
      // }
      console.log(JSON.stringify(this.deviceList))
    })).catch(errors => {
    })
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
</style>
