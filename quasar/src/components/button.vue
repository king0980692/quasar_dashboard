<template>
  <q-btn :id="_id" :class="type" :icon-right="icon_type" >
    <q-tooltip content-class="bg-indigo" :offset="[10, 10]" content-style="font-size:14px;">
      {{tooltip_text}}
    </q-tooltip>
    <slot />
  </q-btn>
</template>

<script>
export default {
  name: "Button",
  props: ["_id","type","icon_type", "tooltip_text"],
  data(){
    return {
      clicked :false    
    }
  },
  methods :{
  }
};
</script>

<style scoped>
  button.primary {
    background: blue;
    color: white;
  }
  button.secondary {
    background: green;
    color: white;
  }
  button.warning{
    background: #FFCD14;
    color: red;
    font-size: 14px;
    /* font-weight: bold; */
  }
</style>
