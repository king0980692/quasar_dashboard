<template>
<q-page q-pa-md row no-wrap items-center justify-around>

  <q-dialog v-model="registerDialog" persistent>
    <q-card class="my-card">
      <q-card-section>
        <q-form @submit="updateDevReg">
          <div v-if="show === true">
          <q-btn icon="delete" color="grey" label="x Clear All" @click="clearRegis"/>
          </div>
          <p class="q-mt-sm"/>
            <q-table
              class="my-register-table"
              title="Register Devices"
              :data="register_device_list"
              :columns="register_columns"
              :filter="reg_filter"
              row-key="MAC"
              selection="multiple"
              :selected.sync="selected"
              :selected-rows-label="getSelectedString"
               @update:selected="checkselect"
              no-data-label="Good ! No unregistered devices"
              dense
            >
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="reg_filter" placeholder="Search device">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

              <template v-slot:body="props" >
                <q-tr :props="props">
                  <q-td >                                  <!-- add this line -->
                    <q-checkbox v-model="props.selected"/><!-- add this line -->
                  </q-td>
                  
                  <q-td key="MAC" :props="props">{{ props.row.MAC }}</q-td>
                  
                  <q-td key="rackName" :props="props">{{ props.row.rackName }}
                    <q-popup-edit v-model="props.row.rackName" title="Update RackName" buttons label-set="Save" label-cancel="Close"
                                  @show="updatecageInfo(props.row.rackName, props.row.cageID)" 
                                  @hide="refresh_cage_option()">
                      <q-select v-model="props.row.rackName" :options="rack_options" label="" />
                    </q-popup-edit>
                  </q-td>
                  
                  <q-td key="cageID" :props="props">{{ props.row.cageID }}
                    <q-popup-edit v-model="props.row.cageID" title="Update cageID" buttons label-set="Save" label-cancel="Close"
                                  @show="updatecageInfo(props.row.rackName, props.row.cageID)" 
                                  @hide="refresh_cage_option()">
                      <q-select name="select_cageID" v-model="props.row.cageID" :options="cage_options" option-label="itemName" label="" />
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

                  <q-td key="remarks" :props="props"> 
                      <q-select
                        label=""
                        filled
                        v-model="props.row.remarks"
                        use-input
                        use-chips
                        multiple
                        dense
                        hide-dropdown-icon
                        input-debounce="0"
                        @new-value="createValue"
                        :rules="[ val => verify_columns('reg_remarks', val) ]"
                        style="width:300px; top:50%; position:relative; "
                      />
                  </q-td>

                  </space>
                </q-tr>
              </template>
            </q-table>
          <p class="q-mt-sm"/>
          <q-btn color="primary" type="submit" style="left:38%" label="Register" :disable="RegBtnDisable"/>
          <q-btn color="white" text-color="black" style="left:40%" align="right" label="Cancel" @click="control_dialog('close_register')" />
        </q-form>
        
      </q-card-section>
    </q-card>
  </q-dialog>
  
  <div class="q-pa-md">
    <q-table
      title="Device List"
      class="my-devices-list-table"
      :dense="$q.screen.lt.md"
      :data="device_list"
      :columns="columns"
      :filter="filter"
      row-key="MAC"
      dense
      style="max-height:430px"
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
            <q-popup-edit v-model="props.row.rackName" title="Update RackName" buttons label-set="Save" label-cancel="Close"
                          @show="updatecageInfo(props.row.rackName, props.row.cageID)" 
                          @hide="refresh_cage_option()">
              <q-select name="select_rackName" v-model="props.row.rackName" :options="rack_options" label="" />
            </q-popup-edit>
          </q-td>
          
          <q-td key="cageID" :props="props">{{ props.row.cageID }}
            <q-popup-edit v-model="props.row.cageID" title="Update cageID" buttons label-set="Save" label-cancel="Close"
                          @show="updatecageInfo(props.row.rackName, props.row.cageID)" 
                          @hide="refresh_cage_option()">
              <q-select name="select_cageID" v-model="props.row.cageID" :options="cage_options" option-label="itemName" label="" />
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

          <q-td key="lastModified" :props="props">{{ props.row.fromnow }}</q-td>
          
          <q-td key="registerUserName" :props="props">{{ props.row.registerUserName }}</q-td>
          
          <q-td style="text-align:center;">
            <q-btn
             flat
             rounded
             color="primary"
             dense
             @click="($event) => { MAC_handle(props) }"
             label='即時資料'
             />
          </q-td>

          <q-td key="remarks" :props="props"> 
              <q-select
                label=""
                filled
                v-model="props.row.remarks"
                use-input
                use-chips
                multiple
                dense
                hide-dropdown-icon
                input-debounce="0"
                @new-value="createValue"
                :rules="[ val => verify_columns('remarks', val) ]"
                style="width:300px; top:50%; position:relative; "
              />
          </q-td>

        </q-tr>
      </template>
    </q-table>
  </div>
  <center><q-btn color="primary" type="submit" label="Update" :disable="remarks_flag" @click="updateDeviceInfo()"/> </center>

  <q-page-sticky position="bottom-right" :offset="[25, 25]">
    <q-fab
      icon="add"
      direction="up"
      color="primary"
    >

      <q-fab-action @click="control_dialog('open_register')" color="green" icon="phonelink_setup">
        <q-tooltip anchor="center left" self="center right">Register Devices</q-tooltip>
      </q-fab-action>
      <!-- <q-fab-action @click="onClick" color="primary" icon="mail" /> -->
    </q-fab>
  </q-page-sticky>

</q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import {
  Loading,
  QSpinnerGears
} from 'quasar'
var baseURL = 'https://api.frrut.net/mk-100-users/'
var registernewdevicesURL = 'https://mk100.frrut.net:1880/registernewdevices'
var exist_cageID_list = []
var no_dul_rack_cage = []
var rack_cage = []

export default {
  name: 'device',
  data () {
    return {
      remarks_flag: false, 
      RegBtnDisable: true,
      newrackDialog: false,
      registerDialog: false,
      rack_options: [],
      cage_options: [],
      MAC: [],
      show: false,
      selected: [],
      deviceList: [],
      deviceLastData: [],
      errorCage: false,
      errorMessageCage: '',
      filter: '',
      reg_filter: '',
      columns: [
        {
          name: 'MAC',
          label: '設備 ID',
          align: 'center',
          sortable: true,
          // field: row => row.name,
          field: 'MAC',
          format: val => `${val}`
        },
        { name: 'rackName', label: '籠架', field: 'rackName', sortable: true, align: 'center' },
        { name: 'cageID', label: '籠號', field: 'cageID', sortable: true, align: 'center' },
        { name: 'location', label: 'Location', field: 'location', sortable: true, align: 'center' },
        { name: 'area', label: 'Area', field: 'area', sortable: true, align: 'center' },
        // { name: 'group', label: 'group', field: 'group', sortable: true, align: 'left' },
        { name: 'lastModified', label: '最後更新', sortable: true, field: 'lastModified', align: 'center' },
        { name: 'registerUserName', label: '登記使用者', field: 'registerUserName', sortable: true, align: 'center' },
        { name: 'detail', label: '即時資料', field: 'detail', sortable: true, align: 'center' },// { name: 'info', label: 'Info', field: 'info', align: 'center' }
        { name: 'remarks', label: '備註標籤', field: 'remarks', align: 'left', sortable: true}
      ],
      register_columns: [
        { name: 'MAC', label: '設備 ID', field: 'MAC', sortable: true, align: 'center' },
        { name: 'rackName', label: '籠架', field: 'rackName', sortable: true, align: 'center' },
        { name: 'cageID', label: '籠號', field: 'cageID', sortable: true, align: 'center' },
        { name: 'area', label: 'area', field: 'area', sortable: true, align: 'center' },
        { name: 'location', label: 'location', field: 'location', sortable: true, align: 'center' },
        { name: 'remarks', label: '備註標籤', field: 'remarks', align: 'left'}
        // { name: 'timeStr', label: '最後更新', field: 'timeStr', sortable: true }
      ],
      data: [],
      device_list: [],
      register_device_list:[],
      check_device_list_if_change: [],
    }
  },
  created () {
    exist_cageID_list = []
    // console.log(this.$route.query)
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    // console.log(this.loginInfo)
    // console.log(this.loginInfo.id)
    const requestOne = axios.get('https://api.frrut.net/device-collections/')
    const requestTwo = axios.get('https://api.frrut.net/last-data')
    const requestThree = axios.get('https://api.frrut.net/mk-100-users/')
    axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      this.deviceList = responses[0].data
      this.register_device_list = responses[0].data
      this.deviceLastData = responses[1].data
      this.userInfo = responses[2].data
      // console.log(this.deviceList)

      this.deviceList = this.deviceList.filter(e => e.deviceRegiStatus === true && e.registerUserID === this.loginInfo.id)
      this.register_device_list = this.register_device_list.filter(e => e.deviceRegiStatus === false)
      // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: ", this.deviceList)
      // console.log("reeeeeeeeeeeeeeegisterrrrrrr_listttttttt: ", this.register_device_list)

      for (var i = 0; i < this.deviceList.length; i++) {
        for (var j = 0; j < this.deviceLastData.length; j++) {
          if (this.deviceList[i].MAC === this.deviceLastData[j].MAC) {
            this.deviceList[i].lastUpdateTS = this.deviceLastData[j].timestamp
          }
        }
        rack_cage.push({"rackName":this.deviceList[i].rackName, "cageID":this.deviceList[i].cageID})
      }
      // console.log("rack_cage: ", rack_cage)

      no_dul_rack_cage = rack_cage.map((item) => item.rackName).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
        let output = rack_cage.filter(itm => itm.rackName === item).map(itm => itm.cageID)
        let rn = rack_cage.filter(itm => itm.rackName === item).map(itm => itm.rackName)
        return { rackName:rn[0], cageID: output}
      })
      // console.log("no_dul_rack_cage1:", no_dul_rack_cage)

      this.userInfo = this.userInfo.filter(e => e.id === this.loginInfo.id)
      // console.log("userInfo: ", this.userInfo)
      this.cage_options = Array.from(Array(57).keys())
      // console.log("cage_options: ", this.cage_options)
      

      for (var i = 0; i < this.userInfo.length; i++) {
        for (var j = 0; j < this.userInfo[i].respRack.length; j++) {
            this.rack_options.push(this.userInfo[i].respRack[j])
        }
      }
      // console.log("rack_options: ", JSON.stringify(this.rack_options))
      for (var f = 0; f < this.deviceList.length; f++) {
        this.deviceList[f].remarks = this.deviceList[f].remarks.split(",")
        if(this.deviceList[f].remarks[0] == ''){
          this.deviceList[f].remarks.pop()
        }
        this.deviceList[f].fromnow = moment(this.deviceList[f].lastUpdateTS * 1000).locale('zh-TW').fromNow()
        exist_cageID_list.push(this.deviceList[f].cageID.toString())
      }
      this.device_list = this.deviceList

      for (var f = 0; f < this.register_device_list.length; f++) {
        this.register_device_list[f].remarks = this.register_device_list[f].remarks.split(",")
        if(this.register_device_list[f].remarks[0] == ''){
          this.register_device_list[f].remarks.pop()
        }
        this.register_device_list[f].fromnow = moment(this.register_device_list[f].lastUpdateTS * 1000).locale('zh-TW').fromNow()
      }
      this.register_device_list = this.register_device_list

      // console.log("exist_cageID_list: " + exist_cageID_list)
    })).catch(errors => {
    })
  },
  mounted () {
  },
  methods: {
    verify_columns(which, val){
      switch(which)
      {
        case 'remarks':
          return new Promise((resolve, reject) => {
            if(typeof(val) === "string"){
              resolve(val=> val || '')
            }
            else if (val.length > 3){
              resolve(val.length < 3 || 'Maximum 3 Remarks.')
              this.remarks_flag = true
            }            
            else{
              resolve(val=> val || '')
              this.remarks_flag = false
            }
          })
          break;

        case 'reg_remarks':
          return new Promise((resolve, reject) => {
            if(typeof(val) === "string"){
              resolve(val=> val || '')
            }
            else if (val.length > 3){
              resolve(val.length < 3 || 'Maximum 3 Remarks.')
              this.RegBtnDisable = true
              let reg_remarks_over = true
            }            
            else{
              resolve(val=> val || '')
              if(this.selected.length > 0){
                this.RegBtnDisable = false 
              }
            }
          })
          break;

        default:
          alert("Something wrong.");
      }
    },
    createValue (val, done) {
      if(val.length > 15){

      }
      else{
        done(val, 'add-unique')
      }
    },
    checkselect(){
      console.log("this.selected: ", this.selected)
      if(this.selected.length > 0){
        // console.log("this.selected: ", this.selected)
        // console.log("this.selected[0].remarks:", this.selected[0].remarks)
        var reg_remarks_checker = this.register_device_list.every(x => x.remarks.length <= 3);
        // console.log("result: ", reg_remarks_checker)
        this.RegBtnDisable = false
        if(reg_remarks_checker == true){
          this.RegBtnDisable = false
        }
        else{
          this.RegBtnDisable = true
        }
      }
      else{
        if(reg_remarks_checker == true){
          this.RegBtnDisable = false
          if(this.selected.length == 0){
            this.RegBtnDisable = true
          }
        }          
        else{
          this.RegBtnDisable = true
        }
      }
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} device${this.selected.length > 1 ? 's' : ''} selected of ${this.register_device_list.length}`
    },
    updateDevReg: function () {
      if (this.selected.length !== 0) {
        Loading.show({
          delay: 400,
          spinner: QSpinnerGears
        })
        this.selected.map(function (a) {
          a.deviceRegiStatus = true
        })
        var username = this.userInfo.find(x => x.id === this.loginInfo.id).username
        // console.log(username)
        for (var k = 0; k < this.selected.length; k++) {
          this.selected[k].registerUserID = this.loginInfo.id
          this.selected[k].registerUserName = username
          // console.log("k, ",k)
          // console.log("this.selected[k].remarks[0]: ", this.selected[k].remarks)
          if(this.selected[k].remarks.length > 0){
            // console.log("i'm in!!!!!!!!!!")
            this.selected[k].remarks = String(this.selected[k].remarks)
          }
          else{
            // this.selected[k].remarks.pop()
            this.selected[k].remarks = ""
          }
        }
        // console.log(this.selected)
        // console.log("this.selected[0].remarks: ", this.selected[0].remarks)
        // console.log("type of this.selected[0].remarks: ", typeof(this.selected[0].remarks))

        this.selected.forEach(element =>
          axios.put('https://api.frrut.net/device-collections/' + element.id, element)
            .then(response => {
              console.log('update success')
              console.log(response.data)
            })
            .catch(error => {
              console.log(error)
            })
        )
        var registernewdevicesDATA = []
        var getdata = {}
        var thingsboardcustomerID = ''
        var tblogin_username = ''
        var tblogin_password = ''

        axios.get(baseURL)
        .then(response => {
          this.getdata = response.data
          this.thingsboardtenantID = this.getdata.find(x => x.id === this.loginInfo.id).thingsboardtenantID
          this.tblogin_username = this.getdata.find(x => x.id === this.loginInfo.id).email
          this.tblogin_password = this.getdata.find(x => x.id === this.loginInfo.id).passwd
          for (var k = 0; k < this.selected.length; k++) {
            registernewdevicesDATA[k] = { 
              "Device_macId": this.selected[k].MAC,
              "thingsboardtenantID": this.thingsboardtenantID,
              "userID": this.loginInfo.id,
              "tblogin_username": this.tblogin_username,
              "tblogin_password":this.tblogin_password
              }
          }
          registernewdevicesDATA.forEach(assign =>
            axios.post(registernewdevicesURL, assign)
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
      }
    },
    clearRegis: function () {
      Loading.show({
        delay: 400,
        spinner: QSpinnerGears
      })
      this.loading = true
      axios.get('https://api.frrut.net/device-collections/')
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
            axios.put('https://api.frrut.net/device-collections/' + element.id, element)
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
    control_dialog(input){
      switch(input){
        case 'open_newrack':
          this.newrackDialog = true
          this.rack_data = ''
          break;
        case 'close_newrack':
          this.newrackDialog = false
          this.rack_data = ''
          break;
        case 'open_register':
          this.registerDialog = true
          this.cage_options = Array.from(Array(57).keys())
          // console.log("cage_options: ", this.cage_options)

          rack_cage = []

          for (var i = 0; i < this.deviceList.length; i++) {
            for (var j = 0; j < this.deviceLastData.length; j++) {
              if (this.deviceList[i].MAC === this.deviceLastData[j].MAC) {
                this.deviceList[i].lastUpdateTS = this.deviceLastData[j].timestamp
              }
            }
            rack_cage.push({"rackName":this.deviceList[i].rackName, "cageID":this.deviceList[i].cageID})
            }
          if(this.registerDialog === true){
            for(var i = 0; i < this.register_device_list.length; i++){
              rack_cage.push({"rackName": this.register_device_list[i].rackName, "cageID": this.register_device_list[i].cageID})
            }
          }
          // console.log("plus_register_rack_cage: ", rack_cage)
          
          no_dul_rack_cage = rack_cage.map((item) => item.rackName).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
            let output = rack_cage.filter(itm => itm.rackName === item).map(itm => itm.cageID)
            let rn = rack_cage.filter(itm => itm.rackName === item).map(itm => itm.rackName)
            return { rackName:rn[0], cageID: output}
          })
          // console.log("plus_register_no_dul_rack_cage:", no_dul_rack_cage)
          break;
        case 'close_register':
          this.registerDialog = false
          this.refresh_cage_option()
          break;
        default:
          this.newrackDialog = false
          this.rack_data = ''
          this.registerDialog = false
          break;
      }
    },
    MAC_handle (props) {
      this.$router.push(
        { path: '/mqttall?MAC=' + props.row.MAC }
      )
    },
    updatecageInfo(r_name, c_id){
      // console.log("c_id: ", c_id)
      // console.log("rack_name: ", r_name)

      var ra_ca = no_dul_rack_cage.filter(e => e.rackName === r_name)
      // console.log("ra_ca: ", ra_ca)

      var c_op = this.cage_options

      var set1 = new Set(c_op)
      var set2 = new Set(ra_ca[0].cageID)
      // console.log(set2)

      this.cage_options = c_op.filter((f)=>{
        return !set2.has(f)
      })
      // console.log(this.cage_options)
      // console.log(this.registerDialog)
      this.cage_options.push(c_id)
      if(!this.cage_options.includes(0)){
        // console.log("push 0 !!!")
        this.cage_options.push(0)
      }

      this.cage_options.sort(function (a, b) {
        return a - b
      });

      // console.log(this.cage_options)
      return true
    },
    refresh_cage_option(){
      this.cage_options = Array.from(Array(57).keys())
      // console.log("cage_options: ", this.cage_options)

      rack_cage = []

      for (var i = 0; i < this.deviceList.length; i++) {
        for (var j = 0; j < this.deviceLastData.length; j++) {
          if (this.deviceList[i].MAC === this.deviceLastData[j].MAC) {
            this.deviceList[i].lastUpdateTS = this.deviceLastData[j].timestamp
          }
        }
        rack_cage.push({"rackName":this.deviceList[i].rackName, "cageID":this.deviceList[i].cageID})
        }
      if(this.registerDialog === true){
        for(var i = 0; i < this.register_device_list.length; i++){
          rack_cage.push({"rackName": this.register_device_list[i].rackName, "cageID": this.register_device_list[i].cageID})
        }
      }

      // console.log("hide_rack_cage: ", rack_cage)
      
      no_dul_rack_cage = rack_cage.map((item) => item.rackName).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
        let output = rack_cage.filter(itm => itm.rackName === item).map(itm => itm.cageID)
        let rn = rack_cage.filter(itm => itm.rackName === item).map(itm => itm.rackName)
        return { rackName:rn[0], cageID: output}
      })
      // console.log("hide_no_dul_rack_cage:", no_dul_rack_cage)
    },


    CageRangeValidation(valid){
      if(valid == 0){
        for (var f = 0; f < exist_cageID_list.length; f++) {
          exist_cageID_list[f] = (this.deviceList[f].cageID.toString())
        }
        // console.log(exist_cageID_list)
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
      // console.log(exist_cageID_list)
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
      // console.log(this.device_list)
      var putData = []
      for(var i = 0; i < this.device_list.length; i++){
        putData[i]= {
          "id": this.device_list[i].id,
          "rackName": this.device_list[i].rackName,
          "cageID": this.device_list[i].cageID,
          "location": this.device_list[i].location,
          "area": this.device_list[i].area,
          "remarks": String(this.device_list[i].remarks)
        }
      }
      console.log("putData: ", putData)
      putData.forEach(DeviceInfo =>
        axios.put("https://api.frrut.net/device-collections/" + DeviceInfo.id, DeviceInfo)
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
.my-devices-list-table
  /* max height is important */
  .q-table__middle
    min-height: 250px
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

.my-register-table
  /* max height is important */
  .q-table__middle
    min-height: 250px
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


.my-card
  width: 100%
  min-width: 900px
  min-height: 300px
</style>
