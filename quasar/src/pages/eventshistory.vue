<template>
<q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>

    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
        <q-avatar icon="report_off" color="primary" text-color="white" />
          No data available from this device
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
<div class="q-pa-md">
 <h4 class="flex flex-center" v-if="showmsg === 'yes'">fetching data...., please wait</h4>
</div>
 <div class="q-pa-md">
    <q-table
      title="Device History last 200 events"
      :data="data"
      :columns="columns"
      row-key="MAC"
    >
      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="fromNow" :props="props">
              {{ props.row.fromNow }}
          </q-td>
          <q-td>
            <q-btn
             flat
             rounded
             :color="props.row.oaAlertColor"
             dense
             :label='props.row.timeStr'
             class="q-mt-md" />
          </q-td>
          <q-td key="MAC" :props="props">
              {{ props.row.MAC }}
          </q-td>
          <q-td key="cageID" :props="props">
              {{ props.row.cageID }}
          </q-td>
          <q-td key="deathAccuTimeRead" :props="props">
              {{ props.row.deathAccuTimeRead }}
          </q-td>
          <q-td key="volt_2" :props="props">
              {{ props.row.volt_2 }}
          </q-td>
          <q-td key="blobInt" :props="props">
              {{ props.row.blobInt }}
          </q-td>
          <q-td key="feederInt" :props="props">
              {{ props.row.feederInt }}
          </q-td>
          <q-td key="deathAlertInfo" :props="props">
              {{ props.row.deathAlertInfo }}
          </q-td>
          <q-td>
            <div class="col-4">
              <q-img
                :src="props.row.imgURL"
                :ratio="16/9"
              />
            </div>
          </q-td>

          <q-td>
            <q-btn
             text-color="secondary"
             flat
             @click=" ($event) => { URL_handle(props) } "
             icon="camera"
             class="q-mt-md" />
                  <q-dialog
                  v-model="card">
                    <q-card class="my-card">
                      <q-img
                      :src="data[0].specialURL" />
                      <q-card-section>
                        <div class="row no-wrap items-center">
                          <div class="col text-h8 ellipsis">
                           {{data[0].specialURL}}
                          </div>
                          <q-card-actions align="right">
                            <q-btn label="OK" color="grey-5" v-close-popup />
                          </q-card-actions>
                        </div>

                      </q-card-section>

                    </q-card>
                  </q-dialog>
          </q-td>

        </q-tr>
      </template>
    </q-table>
  </div>
</q-page>
</template>

<style>
</style>

<script>
import axios from 'axios'
import moment from 'moment'
import {
  Loading,
  QSpinnerGears
} from 'quasar'
export default {
  name: 'app',
  data () {
    return {
      card: false,
      sliders: false,
      slide: 1,
      alert: false,
      slideVol: 39,
      slideAlarm: 56,
      slideVibration: 63,
      specialURL: '',
      filter: '',
      pagination: {
        rowsPerPage: 1000
      },
      buff: 'Sub1:<br>',
      data: [ {} ],
      deviceList: [],
      columns: [
        { name: 'fromNow', label: 'fromNow', field: 'fromNow' },
        { name: 'timeStr', label: 'Update Time', field: 'timeStr' },
        { name: 'MAC', label: 'MAC', field: 'MAC' },
        { name: 'cageID', label: 'Cage ID', field: 'cageID' },
        { name: 'deathAccuTimeRead', label: 'Alert Accumulated', field: 'deathAccuTimeRead' },
        { name: 'volt_2', label: 'Voltage %', field: 'volt_2' },
        { name: 'blobInt', label: 'Dirt Alert', field: 'blobInt' },
        { name: 'feederInt', label: 'Feeder Alart', field: 'feederInt' },
        { name: 'deathAlertInfo', label: 'Mice Still Alert', field: 'deathAlertInfo' },
        { name: 'image', label: 'image', field: 'image', align: 'left' },
        { name: 'detail', label: 'Large img', field: 'imgURL', align: 'left' }
      ]
    }
  },
  created () {
    console.log(this.$route.query)
    this.MAC = this.$route.query.MAC
    console.log(this.MAC)
    if (this.MAC === undefined) {
      this.eventURL = 'http://strapi.frrut.net:1337/event-alls?_limit=200&_sort=timestamp:DESC'
    } else {
      this.eventURL = 'http://strapi.frrut.net:1337/event-alls?MAC=' + this.MAC + '&_limit=200&_sort=timestamp:DESC'
    }
    console.log(this.eventURL)
    this.showmsg = 'yes'
    Loading.show({
      delay: 400,
      spinner: QSpinnerGears
    })
    axios.get(this.eventURL)
      .then(response => {
        this.data = response.data
        console.log(JSON.stringify(this.data))
        this.showmsg = 'no'
        Loading.hide()
        if (this.data.length === 0) {
          console.log('nothing here')
          this.alert = true
        } else {
          for (var j = 0; j < this.data.length; j++) {
            this.data[j].fromNow = moment(this.data[j].timestamp * 1000).locale('zh-TW').fromNow()
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  mounted () {
  },
  methods: {
    URL_handle (props) {
      this.$router.push(
        console.log(props.row.imgURL),
        // { path: '/mqtttable?MAC=' + props.row.MAC }
        this.card = true,
        this.data[0].specialURL = props.row.imgURL
      )
    }
  },
  computed: {}
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
