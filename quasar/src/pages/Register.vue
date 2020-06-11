<template>
  
<form class="register">

    <q-dialog v-model="register_fail" persistent >
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Signup failed. Please check again!
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="register_suc" persistent >
      <q-card>
        <q-card-section>
          <div class="text-h6">Congratulation!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Signup Success! Please continue to validate your account!
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-card align="center" flat>
      <q-img
        :src="require('./frrut_logo_5_1.png')"
        style="height: 100px; max-width: 300px"
      >
      </q-img>

      <div class="q-pa-md" style="max-width: 600px">
        <q-form 
            class="q-gutter-md">
            <h6 align="center"> Register Account</h6>

            <div class="column" style="height: 300px">
              
                  <div class="col-6 col-sm-4">
                    <q-input              
                      filled
                      v-model="register_data.email"
                      type="email"
                      placeholder="Login Email"
                      hint="Enter your email address to register the account."
                      :rules="[ val => verify_columns('email', val)]">
                      <template v-slot:prepend>
                        <q-icon name = "email"></q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-6 col-sm-4">
                    <q-input 
                      filled
                      v-model="register_data.passwd" 
                      :type="isPwd ? 'password' : 'text'" 
                      placeholder="Password"
                      hint="Enter your password to Log in"
                      lazy-rules :rules="[ val => verify_columns('password', val)]">   
                      <template v-slot:append>
                        <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd">
                        </q-icon>
                      </template>

                      <template v-slot:prepend>
                        <q-icon name = "lock"></q-icon>
                      </template>
                    </q-input>

                  </div>

                  <div class="col-6 col-sm-4">
                    <q-input
                        filled
                        v-model="confirm_password"
                        hint="Confirm your password again."
                        placeholder="Confirm Password"
                        :type="isPwd ? 'password' : 'text'" 
                        lazy-rules :rules="[ val => verify_columns('comfirm_password', val)]">
                        <template v-slot:append>
                          <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd">
                          </q-icon>
                        </template>

                        <template v-slot:prepend>
                          <q-icon name = "lock"></q-icon>
                        </template>
                    </q-input>
                  </div>

                  <div class="col-6 col-sm-4">
                    <q-input              
                      filled
                      v-model="register_data.username"
                      type="text"
                      placeholder="User name"
                      hint="Enter your user information."
                      lazy-rules :rules="[ val => verify_columns('username', val)]">
                      <template v-slot:prepend>
                        <q-icon name = "perm_contact_calendar"></q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-6 col-sm-4">
                    <q-input              
                      filled
                      v-model="register_data.usermobile"
                      type="text"
                      placeholder="Phone number"
                      hint="Enter your Phone number."
                      mask="####-###-###"
                      lazy-rules :rules="[ val => verify_columns('mobile', val) ]">
                      <template v-slot:prepend>
                        <q-icon name = "phone"></q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-6 col-sm-4">
                    <q-input              
                      filled
                      v-model="register_data.company"
                      type="text"
                      placeholder="Company name "
                      hint="Enter your Company name."
                      lazy-rules :rules="[ val => verify_columns('company', val)]">
                      <template v-slot:prepend>
                        <q-icon name = "company"></q-icon>
                      </template>
                    </q-input>
                  </div>

            </div>

        </q-form>
      </div>

      <q-card-actions align="center">
          <q-btn color="primary" align="center" label="Sign up" @click="signup" />

          <q-btn outline color = "grey" label="Back to Login" to="/login" /> 
      </q-card-actions>
    </q-card>

</form>

</template>

<script>
import Vue from 'vue'
import axios from 'axios'

var baseURL = 'https://api.frrut.net/mk-100-users/'
var addnewuserURL = 'https://mk100.frrut.net:1880/addnewuser'
var addnewRackURL = 'https://mk100.frrut.net:1880/addnewRack'

var exist_email = []
var tblogin_useremail = ''
var check_flag = [false, false, false, false, false, false]

export default{
   data () {
    return {
      register_fail: false,
      register_suc: false,
      confirm_password: '',
      register_data: {},
      isPwd: true,
    }
  },
  mounted () {
      axios.get(baseURL)
        .then(response => {
          //console.log(response.data)       
          for (var i = 0; i < response.data.length; i++){
            exist_email.push(response.data[i].email);
          }
          //this.getdata = response.data
          // console.log(exist_email)
        })
        .catch(error => {
          console.log(error)
          // if (error.response.status === 500) {
          //   console.log('no Auth info, send me to login')
          // }
        })
      // console.log(check_flag)
  },

  methods: {

    signup() {
      //const { email, passwd, confirm_password, username, usermobile, company } = this
      let auth = true;
      let checker = arr => arr.every(v => v === true);
      if(auth){
        if(checker(check_flag)){
          this.register_data.email = this.register_data.email.toLowerCase()
          var object1 = this.register_data
                        // "email": "howard@frrut.com",
                        // "username": "Brian Test",
                        // "usermobile": "0912345678",
                        // "passwd": "111111",
                        // "company": "frrut",
          var object2 = {
              'verified' : false,
              'role' : 'normal',
              'thingsboarduserID' : '',
              'thingsboardcustomerID' : '',
              'thingsboardtenantID' : '',
              'slack_access_token' : '',
              'slack_user_id' : '',
              'slack_team_id' : '',
              'slack_name' : '',
              'team_name' : '',
              'webhook_channel_url' : '',
              'webhook_channel_id' : '',
              'webhook_configuration_url' : '',
              'webhook_channel' : ''
            }

          function random_number(){
            var number_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            var identify_code = ''
            for (var i = 0 ; i < 6; i++){
              var temp_num = number_array[Math.floor(Math.random() * Math.floor(10))]
              identify_code += temp_num
            }
            return identify_code
          }
          var validate_code = random_number()

          var response_id = ''
          var addnewuserDATA = this.register_data
          var postdata = Object.assign(object1, object2) 
          axios.post(baseURL, postdata)
            .then(response => {
              // console.log('Signup response: ', response)
              response_id = response.data.id
              localStorage.removeItem('response_id');
              localStorage.setItem('response_id', response_id)
              // console.log('Signup response_id: ', response_id)
              addnewuserDATA.userID = response_id
              addnewuserDATA.validate_code = validate_code
              axios.post(addnewuserURL, addnewuserDATA) 
                .then(response => {
                  axios.get('https://api.frrut.net/mk-100-users/')
                  .then(response => {

                    var objectRack = {"respRack": ['0']}
                    var objectEmail = {"email": this.register_data.email}

                    var default_rack = Object.assign(objectRack, objectEmail) 
                    console.log(default_rack)
                    // console.log('exist_rack: ', exist_rack)
                    axios.post(addnewRackURL, default_rack)
                      .then(response => {
                        console.log(response)
                      })
                      .catch(error => {
                        console.log(error)
                      })

                  })
                })
                .catch(error => {
                  console.log(error)
                })
            })
            .catch(error => {
              console.log(error)
            })

          localStorage.removeItem('Authorization');
          localStorage.setItem('Authorization', validate_code)
          // console.log('Signup validate_code: ', validate_code)
          alert('Signup Success! Please continue to validate your account!')
          // this.register_suc = true
          this.$router.push('/email_validation')

        }
        else{
          this.register_fail = true
          return false
          }
      }
    },

    verify_columns(which, val){
      switch(which)
      {
        case 'email':
          function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase())
          }
          function existEmail(email){
            if(exist_email.includes(email))
              return false
            else
              return true
          }
          
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if(!val){
                resolve(!!val || 'Can\'t be empty.')
                check_flag[0] = false}
              else if(!validateEmail(val.toLowerCase())){
                resolve(validateEmail(val.toLowerCase()) || 'Invalid Format')
                check_flag[0] = false}
              else if(!existEmail(val.toLowerCase())){
                resolve(existEmail(val.toLowerCase()) || 'The Email has already exist.')
                check_flag[0] = false}
              else{
                resolve(val=> val || '')
                check_flag[0] = true}
            }, 1000)
          })
          break;

        case 'password':
          return new Promise((resolve, reject) => {
            if(!val){
              resolve(!!val || 'Can\'t be empty.')
              check_flag[1] = false}
            else if (val.length < 6){
              resolve(val.length >= 6 || 'It\'s must at least 6 characters.')
              check_flag[1] = false
            }            
            else{
              resolve(val=> val || '')
              check_flag[1] = true}
          })
          break;

        case 'comfirm_password':
          return new Promise((resolve, reject) => {
            var pwd = this.register_data.passwd;
            if(!val){
              resolve(!!val || 'Can\'t be empty.')
              check_flag[2] = false}
            else if(val.length < 6){
              resolve(val.length >= 6 || 'It\'s must at least 6 characters.')
              check_flag[2] = false}
            else if(!(pwd === val)){
              resolve((pwd === val) || 'Password not match')
              check_flag[2] = false}
            else{
              resolve(val=> val || '')
              check_flag[2] = true}
          })
          break;

        case 'username':
          return new Promise((resolve, reject) => {
            if(!val){
              resolve(!!val || 'Can\'t be empty.')
              check_flag[3] = false}
            else{
              resolve(val=> val || '')
              check_flag[3] = true}
            })
          break;

        case 'mobile':
          return new Promise((resolve, reject) => {
            if(!val){
              resolve(!!val || 'Can\'t be empty.')
              check_flag[4] = false}
            else if(val.length != 12){
              resolve(val.length == 12 || 'Wrong format.')
              check_flag[4] = false}
            else{
              resolve(val=> val || '')
              check_flag[4] = true}
          })
          break;

        case 'company':
          return new Promise((resolve, reject) => {
            if(!val){
              resolve(!!val || 'Can\'t be empty.')
              check_flag[5] = false
              // console.log(check_flag)
              }
            else{
              resolve(val=> val || '')
              check_flag[5] = true
              // console.log(check_flag)
              }})
          break;
        
        default:
          alert("Something wrong.");
      }
    },
  },
}

</script>

<style>
</style>
