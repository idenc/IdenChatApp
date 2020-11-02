<template>
  <div>
    <ul ref="message_box" id="message_box">
    </ul>
    <form @submit.prevent="sendMessage">
      <input type="text" placeholder="Message..." v-model="message">
      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>
import io from 'socket.io-client'

const socket = io();

export default {
  name: 'ChatWindow',
  data() {
    return {
      message: '',
    }
  },
  methods: {
    sendMessage() {
      socket.emit('chat message', this.message);
      this.message = '';
    }
  },
  mounted: function () {
    socket.on('chat message', (msg) => {
      const messageBox = this.$refs.message_box;
      const li = document.createElement('li');
      li.innerHTML = msg;
      messageBox.append(li);

      this.$nextTick(() => {
        messageBox.scrollTop = messageBox.scrollHeight;
      });
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#message_box {
  height: 200px;
  overflow-y: scroll;
}
</style>
