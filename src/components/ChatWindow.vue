<template>
  <form @submit.prevent="sendMessage">
    <input type="text" placeholder="Message..." v-model="message">
    <input type="submit" value="Send">
  </form>
</template>

<script>
export default {
  name: 'ChatWindow',
  props: {
    message: String
  },
  methods: {
    sendMessage() {
      this.$emit('send-message', this.message);
      this.message = '';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
