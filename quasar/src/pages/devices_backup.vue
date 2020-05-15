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
          <q-td key="cageID" :props="props">{{ props.row.cageID }}</q-td>
          <q-td key="location" :props="props">{{ props.row.location }}</q-td>
          <q-td key="area" :props="props">{{ props.row.area }}</q-td>
          <q-td key="group" :props="props">{{ props.row.group }}</q-td>
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
</q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'device',
  data () {
    return {
      MAC: [],
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
      this.deviceList = this.deviceList.filter(e => e.deviceRegiStatus === true && e.registerUserName === this.loginInfo.username)
      for (var i = 0; i < this.deviceList.length; i++) {
        for (var j = 0; j < this.deviceLastData.length; j++) {
          if (this.deviceList[i].MAC === this.deviceLastData[j].MAC) {
            this.deviceList[i].lastUpdateTS = this.deviceLastData[j].timestamp
          }
        }
      }
      console.log(JSON.stringify(this.deviceList))
      for (var f = 0; f < this.deviceList.length; f++) {
        this.deviceList[f].fromnow = moment(this.deviceList[f].lastUpdateTS * 1000).locale('zh-TW').fromNow()
      }
      console.log(JSON.stringify(this.deviceList))
      this.device_list = this.deviceList
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
