<template>
 
<form class="register">
    <q-card align="center" flat>
      
      <q-img
        :src="require('./frrut_logo_5_1.png')"
        style="height: 100px; max-width: 300px"
      >
      </q-img>

      <div class="q-pa-md" style="max-width: 600px">
        <q-form 
            class="q-gutter-md">
            <p align="center"><b><font size="5"> Thanks for registering frrut account.</font></b><br>
            <font size="4"> In order to complete the whole register procedure, 
              there are 6 verification codes need to be enter. Please check the email you fill in.</font>
            </p>

            <div class="column" style="max-height: 75px" >
                <q-input
                    filled
                    v-model="input_verificate_codes"
                    hint= "Enter verification codes."
                    type= "text"
                    mask="#    #    #    #    #    #"
                    unmasked-value
                    fill-mask = "-"
                    input-class='text-center'
                    style="max-height: 75px"
                    >
                </q-input>
            </div>
        </q-form>
      </div> 

      <q-card-actions align="center">
          <q-btn color="primary" align="center" label="Confirm" @click="confirm" />
      </q-card-actions>
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
import router from "../router"; 

var baseURL = 'http://strapi.frrut.net:1337/mk-100-users/'

var exist_email = []
var validate_code = ''//localStorage.getItem('Authorization')
var response_id = ''//localStorage.getItem('response_id')
var flag = false

export default{
   data () {
    return {
      input_verificate_codes: '',
    }
  },

  mounted () {
    // console.log("mounted: ", validate_code)
    // console.log("mounted: ", response_id)

    function get_response(){
      response_id = localStorage.getItem('response_id')
      validate_code = localStorage.getItem('Authorization')
      // console.log("in function: ", response_id)
      // console.log("in function: ", validate_code)
      Loading.hide()
    }
    Loading.show({
        delay: 200,
        spinner: QSpinnerGears,
        message: '<b>Loading...</b>'
      })
    setTimeout(get_response, 2500)
  },

  methods: {

    confirm() {
      let auth = true;
      var input_six_codes = this.input_verificate_codes
      if(auth){
        if(validate_code == input_six_codes){
          axios.put(baseURL + response_id, {
            'verified': true
          })
          .then(response => {
            console.log("confirm response", response)
          })
          .catch(error => {
            console.log(error)
          })
          alert('Validate Success! Please login again!')
          localStorage.removeItem('response_id');
          localStorage.removeItem('Authorization');
          this.$router.push('/login');
          Loading.show({
            delay: 200,
            spinner: QSpinnerGears,
            message: '<b>Validate process is going on... <br>Please wait for few seconds...</b>'
          })
          function wait(){ Loading.hide(); location.reload(); }
          setTimeout(wait, 2500)
        }
        else{
          alert('Validation failed. Please check again!')
          console.log("input_six_codes confirm: ", input_six_codes, typeof(input_six_codes))
          console.log("validate_code confirm: ", validate_code, typeof(validate_code))
          console.log("response_id confirm: ", response_id, typeof(response_id))
          this.input_verificate_codes = '';
          
        }
      }
    },
    

  },

}

</script>

<style>
</style>
