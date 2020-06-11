<template>
 <q-page class="flex flex-center" q-pa-md row no-wrap items-center justify-around>
 <div class="q-pa-md" style="max-width: 400px">
<q-form @submit="updateProfile()">
      <q-input v-model="loginInfo.id" filled type="text" label="User ID" disable readonly>
        <template v-slot:prepend>
          <q-icon name="vpn_key" />
        </template>
      </q-input>
    <p class="q-mt-sm"/>
      <q-input v-model="info.data.username" filled type="text" label="User Name">
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="info.data.username = ''" class="cursor-pointer" />
        </template>
      </q-input>
    <p class="q-mt-sm"/>
      <q-input v-model="info.data.email" filled type="email" label="email" >
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="info.data.email = ''" class="cursor-pointer" />
        </template>
      </q-input>
    <p class="q-mt-sm"/>
      <q-input v-model="info.data.passwd" filled :type="isPwd ? 'password' : 'text'"  label="password">

        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:append>
          <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd">
          </q-icon>
        </template>
        <!-- <template v-slot:append>
          <q-icon name="close" @click="info.data.passwd = ''" class="cursor-pointer" />
        </template> -->
      </q-input>
    <p class="q-mt-sm"/>
      <q-input
        filled
        v-model="info.data.usermobile"
        label="Phone"
        mask="#### - ### - ###"
        unmasked-value
      >
        <template v-slot:prepend>
          <q-icon name="phone" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="info.data.usermobile = ''" class="cursor-pointer" />
        </template>
      </q-input>

    <p class="q-mt-sm"/>
    <q-item v-if="info.data.webhook_channel_url === ''" clickable tag="a" target="_blank" @click="slackURL()">
          <q-item-section avatar>
            <q-icon name="img:https://image.flaticon.com/icons/svg/2111/2111614.svg" />
          </q-item-section>
          <q-item-section>
            <q-item-label>未設定slack帳戶/請設定{{info.data.email}}帳戶
            </q-item-label>
          </q-item-section>
    </q-item>
    <q-item-section side top v-if="info.data.webhook_channel_url === ''" >
        <q-btn color="grey" size="10px" icon="repeat" @click="reloadPage()"/>
    </q-item-section>

    <p class="q-mt-sm"/>

    <q-item v-if="info.data.webhook_channel_url !== ''"  >
     <q-list >
      <q-item  >
        <q-item-section avatar>
          <q-avatar size="20px">
            <img src="https://image.flaticon.com/icons/svg/2111/2111614.svg">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Slack 已完成設定</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="close" @click="resetSlack()" class="cursor-pointer" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label caption>workspace</q-item-label>
          <q-item-label>{{info.data.team_name}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption>channel</q-item-label>
          <q-item-label>{{info.data.webhook_channel}}</q-item-label>
        </q-item-section>
     </q-item>
     </q-list>
    </q-item>

      <p class="q-mt-sm"/>
    <q-btn color="primary" type="submit" label="更新" />

</q-form>
</div>

<div>
</div>
</q-page>

</template>

<script>
import axios from 'axios'
import { openURL } from 'quasar'

var baseURL = 'https://api.frrut.net/mk-100-users/'
// var loginInfo_slack = JSON.parse(localStorage.getItem('loginInfo') || '{}')
// var slackURL = 'https://slack.com/oauth/authorize?scope=incoming-webhook&client_id=914264040262.899946458546&state=' + loginInfo_slack.id

export default {
  name: 'device',
  data () {
    return {
      info: null,
      isPwd: true,
      loginInfo: {},
    }
  },
  created () {
  },
  mounted () {
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    
    console.log("In mounted: " + this.loginInfo.id)
    console.log("In mounted: " + this.loginInfo.loginStatus)
    //console.log("slackURL" + slackURL)
    this.loading = true
    axios.get(baseURL + this.loginInfo.id)
      .then(response => {
        this.info = response
        this.loading = false
        console.log(this.info)
      })
      .catch(error => {
        console.log(error)
        this.$router.push('login')
        if (error.response.status === 500) {
          console.log('no Auth info, send me to login')
        }
      })
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
      axios.put(baseURL + this.loginInfo.id, this.info.data)
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
      axios.put(baseURL + this.loginInfo.id,
        { 'slack_user_id': '', 'slack_access_token': '', 'slack_team_id': '', 'webhook_channel_id': '', 'webhook_configuration_url': '', 'webhook_channel_url': '', 'webhook_channel': '' })
        .then(response => {
          this.info = response
          console.log(this.info.data)
        })
        .catch(error => {
          this.$router.push('/')
          console.log(error)
        })
    },
    slackURL(){
      var loginInfo_slack = JSON.parse(localStorage.getItem('loginInfo') || '{}')
      var slackURL = 'https://slack.com/oauth/authorize?scope=incoming-webhook&client_id=914264040262.899946458546&state=' + loginInfo_slack.id
      console.log(slackURL)
      openURL(slackURL)
    }
  }
}
</script>
