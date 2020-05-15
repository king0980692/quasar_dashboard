<template>
  <div>
    <br>
    <q-btn color="purple" label="Publish to (topic/mqtt)" @click="publish1"> </q-btn>
  </div>
</template>

<script>
export default {
  methods: {
    publish1 () {
      this.$mqtt.publish('topic/mqtt', '{"key0":40,"key1":88,"key2":67,"key3":91,"key4":23,"key5":69}')
    }
  },
  mqtt: {
    'topic/mqtt' (data, topic) {
    }
  }
}
</script>
