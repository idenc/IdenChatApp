<template>
  <div>
    <div id="main-chat">
      <div id="chat-log">
        <ul ref="message_box" id="message_box">
        </ul>
      </div>

      <div id="user-list">

      </div>

      <form @submit.prevent="sendMessage">
        <input type="text" placeholder="Message..." v-model="message">
        <input type="submit" value="Submit">
      </form>
    </div>
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
      username: '',
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
      li.innerHTML = `<b>${msg.user}:</b> ${msg.message}`;
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
#chat-log ul {
  list-style-type: none;
  padding: 10px;
  margin: 0;
  text-align: left;
  position: absolute;
  bottom: 0;
}

#main-chat {
  display: grid;
  grid-template-columns:  1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows:     1fr 1fr 1fr 1fr 1fr 60px;
  grid-template-areas:
    "m m m m m r"
    "m m m m m r"
    "m m m m m r"
    "m m m m m r"
    "m m m m m r"
    "s s s s s r";
  height: 100%;
  width: 100%;
}

#user-list {
  background: grey;
  grid-area: r;
}

#chat-log {
  background: lightblue;
  position: relative;
  grid-area: m;
}

form {
  grid-area: s;
  display: flex;
}

input[type="text"] {
  flex: 3
}

input[type="submit"] {
  flex: 1;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background: #666;
}
</style>
