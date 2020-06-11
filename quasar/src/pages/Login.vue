<template>

<form class="login" @submit.prevent="login">
    <q-dialog v-model="forget_pw_dialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Forget Your Password?</div>
        </q-card-section>

        <q-input              
          filled
          v-model="forget_pw_email"
          type="email"
          placeholder="Email"
          hint="Enter your registered email to receive account password."
          lazy-rules 
          :rules="[ val => forget_pw_validateEmail(val)  || 'Invalid Email format.']">
          <template v-slot:prepend>
            <q-icon name = "email"></q-icon>
          </template>
        </q-input>
        <br/>
        <q-card-actions align="center">
          <!-- <q-btn flat label="OK" color="primary" v-close-popup /> -->
          <q-btn color="cyan-10" label="Submit" :disable="forget_pw_BtnDisable" @click ="forget_pw_submit"/>
          <q-btn color="white" text-color="black"  label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="need_validate" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">The Account need validate</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          The Account doesn't validate yet, please re-check your email to complete the validate process.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="wrong_ac_pw" persistent >
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Login failed, please check your username and password again.
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
      
      <div class="q-pa-md" style="max-width: 400px">
        <q-form 
            class="q-gutter-md">
            <h6 align="center"> Sign in </h6>
            
            <q-input              
              filled
              v-model="email"
              type="email"
              placeholder="Email"
              hint="Enter your registered email address to Log in."
              lazy-rules 
              :rules="[ val => validateEmail(val)  || 'Invalid Email format.']">
              <template v-slot:prepend>
                <q-icon name = "email"></q-icon>
              </template>
            </q-input>
            
            <q-input 
              filled
              v-model="password" 
              :type="isPwd ? 'password' : 'text'" 
              placeholder="Password"
              hint="Enter your password to Log in"
              lazy-rules :rules="[ val => val && val.length >= 6 || 'It\'s must at least 6 characters.']">   
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
            
        </q-form>
      </div>

      <q-card-actions align="center">
          <q-btn color="primary" align="center" label="Login" @click="login" />

          <q-btn outline color="black" label="Register" to="/register" /> 
      </q-card-actions>
      <a style="color:grey; font-size: 13px; text-decoration: none; cursor: pointer" @click="forget_password()"> forget password? </a>
    </q-card>

</form>

</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import {
  Loading,
  QSpinnerGears
} from 'quasar'

//var baseURL = 'https://mk100.frrut.net:1880/mk-100-users' //test
var baseURL = 'https://api.frrut.net/mk-100-users/'
var validateURL = 'https://mk100.frrut.net:1880/mk100email'
var forget_pw_URL = 'https://mk100.frrut.net:1880/forgetpassword'
var exist_email = []
var exist_id = []
var account_passwd = []
var account_verified = []
var account_username = []
var account_info = {}

export default{
   data () {
    return {
      forget_pw_dialog: false,
      forget_pw_email: '',
      forget_pw_BtnDisable: true, 
      wrong_ac_pw: false,
      need_validate: false,
      email: '',
      password: '',
      isPwd: true,
    }
  },

  
  created: function(){
      },

  mounted(){
    exist_email = []
    exist_id = []
    account_passwd = []
    account_verified = []
    account_username = []
    account_info = []
    function check_login(){
          axios.get(baseURL)
            .then(response => {
              //console.log(response.data)       
              for (var i = 0; i < response.data.length; i++){
                exist_email.push(response.data[i].email);
                exist_id.push(response.data[i].id)
                account_passwd.push(response.data[i].passwd);
                account_verified.push(response.data[i].verified)
                account_username.push(response.data[i].username)
              }
              for (var j = 0; j < exist_email.length; j++) {
                  account_info[exist_email[j]] = account_passwd[j];
              }
              // console.log(account_info)
              // console.log(account_verified)
              // console.log(account_username)
            })
            .catch(error => {
              console.log(error)
            })
        }
    check_login();
  },
  methods: {

    login() {
      const { email, password } = this

      let auth = true;
      if(auth){
        
        var input_email = this.email.toLowerCase();
        var input_password = this.password;
        var email_list = Object.keys(account_info); 
        var password_list = Object.values(account_info);
        
        for(var i = 0; i <= email_list.length; i++){
          if (i == email_list.length)
          {
            // console.log('false')
            //alert ("Login failed, please check your username and password again.");
            if(this.need_validate == true)
              return false
            this.wrong_ac_pw = true
            this.email = '';
            this.password = '';
            return false
          }
          if ((input_email == email_list[i]) && (input_password == password_list[i])) {
            if(account_verified[i] == true){
              // console.log(account_verified[i])
              // console.log("success.")
              var loginInfo = { 'loginStatus': true, 'id': exist_id[i], 'username': account_username[i], 'verficationCode': 111111, 'logintimestamp': Math.floor(new Date().getTime() / 1000)}
              localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
              console.log('Save to local :' + JSON.stringify(loginInfo))
              //localStorage.setItem('token', 'ImLogin')
              this.$router.push('/dashboard');
              return true
            }
            else{
              alert("The Account doesn't validate yet, please re-check your email to complete the validate process.")
              // this.need_validate = true
              // console.log(account_verified[i])
              // function random_number(){
              //   var number_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
              //   var identify_code = ''
              //   for (var j = 0 ; j < 6; j++){
              //     var temp_num = number_array[Math.floor(Math.random() * Math.floor(10))]
              //     identify_code += temp_num
              //   }
              //   return identify_code
              // }
              // var validate_code = random_number()
              // axios.post(validateURL, {
              //   email: email_list[i],
              //   validate_code: validate_code,
              //   username: account_username[i]
              // })
              // .then(response => {
              //   console.log('Login_for_validate: ', response)
              // })
              // .catch(error => {
              //   console.log(error)
              // })
              // localStorage.removeItem('Authorization');
              // localStorage.setItem('Authorization', validate_code)
              
              // var response_id = ''
              // response_id = exist_id[i]
              // localStorage.removeItem('response_id');
              // localStorage.setItem('response_id', response_id)

              this.$router.push('/email_validation')
              return false
            }

          }
        }
      }

    },

    forget_pw_submit() {
      const {forget_pw_email} = this

      let auth = true;
      if(auth){
        var input_email = this.forget_pw_email.toLowerCase();
        var email_list = Object.keys(account_info); 
        var password_list = Object.values(account_info);
        
        console.log(input_email)
        console.log(email_list)
        console.log(password_list)
        
        for(var i = 0; i <= email_list.length; i++){
          console.log(i)
          if (i == email_list.length){
            // console.log('false')
            //alert ("Login failed, please check your username and password again.");
            alert('This email is not registered. Please check or register again.')
            this.forget_pw_email = ''
            this.forget_pw_dialog = false
            this.forget_pw_BtnDisable = true

            return false
          }

          if ((input_email == email_list[i])) {
            // console.log(account_verified[i])
            console.log("success.")
            alert('The password is send to your email, please check again!')
            axios.post(forget_pw_URL, {
              email: email_list[i],
              username: account_username[i],
              password: password_list[i]
            })
            .then(response => {
              console.log('forget_password: ', response)
              
            })
            .catch(error => {
              console.log(error)
            })
            this.forget_pw_email = ''
            this.forget_pw_dialog = false
            this.forget_pw_BtnDisable = true
            return true
          }
          

        }
      }

    },


    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase())
    },

    forget_pw_validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase())){
          this.forget_pw_BtnDisable = false
        }
        else{
          this.forget_pw_BtnDisable = true
        }
        return re.test(String(email).toLowerCase())
    },

    forget_password(){
      this.forget_pw_dialog = true
      console.log("I forget my password...")
    }

    // check_login(){
    //   axios.get(baseURL)
    //     .then(response => {
    //       //console.log(response.data)       
    //       for (var i = 0; i < response.data.length; i++){
    //         exist_email.push(response.data[i].email);
    //         account_passwd.push(response.data[i].passwd);
    //       }
    //       for (var j = 0; j < exist_email.length; j++) {
    //           account_info[exist_email[j]] = account_passwd[j];
    //       }
    //       // console.log(account_info)
    //       // console.log(Object.keys(account_info))
    //       // console.log(Object.values(account_info))
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
      
    //   var input_email = this.email;
    //   var input_password = this.password;
    //   var email_list = Object.keys(account_info); 
    //   var password_list = Object.values(account_info);

    //   for(var i = 0; i <= email_list.length; i++){
    //     if (i == email_list.length)
    //     {
    //         // console.log('false')
    //         alert ("Login was unsuccessful, please check your username and password");
    //         return false;
    //     }
    //     if ((input_email == email_list[i]) && (input_password == password_list[i])) {
    //         // console.log("success.")
    //         return true;
    //     }
    //   }
    // }

  }
}

</script>

<style>
</style>
