<template>
  <q-page class="flex flex-center">
    <!-- <h5>This is Landing Page!! You are NOT authenticated!</h5>
    <router-link class="absolute-center" to="/login">Login</router-link> -->
    <q-img 
        src = "statics/frrut_logo_MK100_2.png"
        class = "background-image"/>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>

<style lang="scss">
  .background-image{
    height: 100%;
    width: 50%;
    z-index: -1;
    background-position: left center;
    background-repeat:  no-repeat;
    opacity: 0.6;
  }
</style>