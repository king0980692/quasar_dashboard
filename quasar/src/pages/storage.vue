<template>
 <q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>
 <div id="example" class="q-pa-md">
  <q-btn icon="map" color="primary" label="post array" @click="post1"/>
  <p class="q-mt-sm"/>
  <q-btn icon="map" color="primary" label="update array" @click="update1"/>
  <p class="q-mt-sm"/>
  <q-btn icon="map" color="primary" label="get 3 " @click="getTwo"/>
</div>
 <div class="q-pa-md" style="max-width: 400px">
    <p class="q-mt-sm"/>
        <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Test LocalStorage</div>
      </q-card-section>
      <q-separator />
      <q-card-actions vertical>
        <q-btn flat  @click="setLocalStorage()">Set LocalStorage</q-btn>
        <q-btn flat  @click="getLocalStorage()">Get LocalStroage</q-btn>
        <q-btn flat  @click="clearLogin()">Clear Login</q-btn>
        <q-btn flat  @click="checkLogin()">Check Login</q-btn>
        <q-btn flat  @click="getId()">get id</q-btn>
      </q-card-actions>
    </q-card>
</div>
<div>
</div>
</q-page>

</template>

<script>
import axios from 'axios'
export default {
  name: 'device',
  data () {
    return {
      info: null,
      loginInfo: {}
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    MAC_handle (props) {
      this.$router.push(
        { path: '/cage/' + props.row.MAC }
      )
    },
    reloadPage () {
      window.location.reload()
    },
    updateProfile () {
      console.log(this.info.data)
      axios.put('http://nodered.frrut.net:1337/mk-100-users/5e23ac367dc97701ad91b479')
        .then(response => {
          this.info = response
          console.log(this.info.data)
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    },
    resetSlack () {
      console.log(this.info.data)
      axios.put('http://nodered.frrut.net:1337/mk-100-users/' + this.loginInfo.id,
        { 'slack_user_id': '', 'slack_access_token': '', 'slack_team_id': '', 'webhook_channel_id': '', 'webhook_configuration_url': '', 'webhook_channel_url': '', 'webhook_channel': '' })
        .then(response => {
          this.info = response
          console.log(this.info.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    setLocalStorage () {
      var loginInfo = { 'loginStatus': true, 'id': '5e23ac367dc97701ad91b479', 'username': 'Howard Weng', 'verficationCode': 111111 }
      localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
      console.log('Save to local :' + JSON.stringify(loginInfo))
    },
    getLocalStorage () {
      var getinfo = localStorage.getItem('loginInfo')
      console.log(JSON.parse(getinfo))
    },
    checkLogin () {
      var getinfo = localStorage.getItem('loginInfo')
      if (getinfo) {
        var jsoninfo = JSON.parse(getinfo)
        var loginStatus = jsoninfo.loginStatus
        console.log('loginStatus :' + loginStatus)
      } else {
        console.log('NOT login')
      }
    },
    clearLogin () {
      localStorage.removeItem('loginInfo')
      console.log('info cleared')
    },
    getId () {
      var getinfo = localStorage.getItem('loginInfo')
      if (getinfo) {
        var jsoninfo = JSON.parse(getinfo)
        var userId = jsoninfo.id
        this.userId = userId
        console.log(userId)
      } else {
        console.log('NO ID, not login')
      }
    }
  }
}
</script>
