<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar class = "bg-white text-blue-grey-9">
        <q-btn
          flat
          dense
          round
          @click="drawer = !drawer"
          icon="menu"
          aria-label="Menu"/>
  
          <q-img src="../pages/frrut_logo_8_3.png" height= "12%" width= "12%">
              <q-btn flat no-caps size="100px" to='/dashboard' label="　　　　　"> </q-btn>
          </q-img>

        <q-space/>

        <q-btn outline color="blue-grey-8" :label="loginInfo.username" no-caps font-size = "24px">
              <q-menu transition-show="scale" transition-hide="scale">
                <q-list style="min-width: 150px">
                  <q-item to="/account" clickable v-ripple>
                    <q-item-section>Account</q-item-section>
                  </q-item>
                  
                  <q-item to="/"  clickable v-ripple>
                    <q-item-section @click="logout()">Log Out</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
    >
      <q-list>

        <!-- <q-item to='/cagedash' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            Cage Dashboard
          </q-item-section>
        </q-item> -->

        <q-item to='/dashboard' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            Dashboard
          </q-item-section>
        </q-item>

        <q-item to="/racks" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="grid_on" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Rack List</q-item-label>
          </q-item-section>
        </q-item>
                    
        <q-item to='/devices' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="chrome_reader_mode"/>
          </q-item-section>
          <q-item-section>
            Devices List
          </q-item-section>
        </q-item>

        <q-separator />
        
        <!-- <q-item to='/devreg' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="check_circle_outline" />
          </q-item-section>
          <q-item-section>
            Devices Register
          </q-item-section>
        </q-item> -->

        <q-item to='/mqttall' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings_input_component" />
          </q-item-section>
          <q-item-section>
            All Devices Signals
          </q-item-section>
        </q-item>

        <q-item to='/events' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="notification_important" />
          </q-item-section>
          <q-item-section>
            Events Watching
          </q-item-section>
        </q-item>

        <q-separator/>

        <q-item @click = "goto_thingsboard" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="layers" />
          </q-item-section>
          <q-item-section>
            Thingsboard
          </q-item-section>
        </q-item>

        <q-item @click = "goto_kibana" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="extension" />
          </q-item-section>
          <q-item-section>
            Kibana
          </q-item-section>
        </q-item>

        <!-- <q-item to='/account' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="account_box" />
          </q-item-section>
          <q-item-section>
            Account
          </q-item-section>
        </q-item> -->

        <!-- <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="email" />
          </q-item-section>
          <q-item-section>
            Contact us
          </q-item-section>
        </q-item> -->

        <!-- <q-item to='/storage' clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="storage" />
          </q-item-section>
          <q-item-section>
            Storage (For testing now)
          </q-item-section>
        </q-item> -->

      </q-list>

    </q-drawer>
    <!-- <div class="background-image"> -->
      <q-page-container>
        <router-view />
      </q-page-container>
    <!-- </div> -->
  </q-layout>
</template>

<script>

import { openURL } from 'quasar'
import axios from 'axios'
var baseURL = 'https://api.frrut.net/mk-100-users/'
var tblogin_username = ''
var tblogin_password = ''

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: false,
      miniState: true,
    }
  },
  created () {
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    // console.log(this.loginInfo.id)
    // console.log(this.loginInfo.loginStatus)
    // console.log(this.loginInfo.username)
    this.initial = this.loginInfo.username.charAt(0).toUpperCase()

    axios.get(baseURL)
      .then(response => {
        this.getdata = response.data
        this.tblogin_username = this.getdata.find(x => x.id === this.loginInfo.id).email
        this.tblogin_password = this.getdata.find(x => x.id === this.loginInfo.id).passwd
        // console.log(this.tblogin_username)
        // console.log(this.tblogin_password)
      })
  },
  methods:{
    goto_thingsboard(){      
      openURL("https://tb.frrut.net/login")
    },
    goto_kibana(){
      // openURL("")
    },

    logout(){
      localStorage.removeItem('loginInfo');
      this.$router.push('/login');
    },

  }
}
</script>


<style lang="scss">


</style>