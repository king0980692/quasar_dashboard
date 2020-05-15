import VueMqtt from 'vue-mqtt'

export default ({ Vue }) => {
  Vue.use(VueMqtt, 'ws://mqtt.frrut.net:3000/mqtt', { clientId: ('WebClient-' + parseInt(Math.random() * 100000)), username: 'frrut', password: 'abc123' })
}
