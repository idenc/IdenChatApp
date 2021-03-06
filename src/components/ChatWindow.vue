<template>
  <div>
    <div id="main-chat">
      <div id="chat-log" ref="message_box">
        <ul id="message_box">
          <template v-for="message in chat_messages">
            <li :key="message.id" v-if="message.user">
              {{ new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }} <span
                :style="{'color': message.color, 'font-weight': 'bold'}">{{ message.user }}:</span> {{
                message.message
              }}
            </li>
            <li :key="message.id" :style="{'color': message.color}" v-else>
              {{ message.message }}
            </li>
          </template>

        </ul>
      </div>

      <div id="user-div">
        <ul id="user-list">
          <template v-for="user in users">
            <li :style="{'color': user.color}" :key="user.username" v-if="user.username === username">
              <b>{{ user.username }} (you)</b></li>
            <li :style="{'color': user.color}" :key="user.username" v-else>{{ user.username }}</li>
          </template>
        </ul>
      </div>

      <form @submit.prevent="sendMessage">
        <InputBox id="input-box" v-bind:placeholder="'Message'" v-model="message"></InputBox>
      </form>
    </div>
  </div>
</template>

<script>
"use strict";
import io from 'socket.io-client'
import InputBox from "@/components/InputBox";

const socket = io();

export default {
  name: 'ChatWindow',
  components: {InputBox},
  data() {
    return {
      message: '',
      username: '',
      users: [],
      color: '',
      chat_messages: [],
    }
  },
  methods: {
    sendMessage() {
      if (this.message === '') {
        return;
      }
      socket.emit('chat message', this.message);
      this.message = '';
    }
  },
  mounted: function () {
    socket.on('connect', () => {
      if (localStorage.username && localStorage.color) {
        this.username = localStorage.username;
        this.color = localStorage.color;
        const user = {username: this.username, color: this.color}
        socket.emit('user info', user);
      } else {
        socket.emit('user info', null);
      }
    });

    socket.on('chat message', (msg) => {
      const messageBox = this.$refs.message_box;
      this.chat_messages.push(msg);

      this.$nextTick(() => {
        messageBox.scrollTop = messageBox.scrollHeight;
      });
    });

    socket.on('user info', (user) => {
      localStorage.username = user.username;
      localStorage.color = user.color;
      this.username = user.username;
      this.color = user.color;
      this.chat_messages.push({message: `You are ${user.username}`, id: 'username message'})
    })

    socket.on('user joined', (user) => {
      console.log(`user joined: ${user}`)
      this.users.push(user);
    });

    socket.on('user left', (user) => {
      console.log(`user left: ${user}`)
      this.users = this.users.filter(u => u.username !== user);
    });

    // Server sends the chat history and user list
    socket.on('chat info', (info) => {
      console.log(`chat info: ${info}`)
      this.users.push(...info.current_users);
      this.chat_messages.push(...info.messages);
    });

    socket.on('command error', (err) => {
      err.color = 'red';
      this.chat_messages.push(err);
    });

    socket.on('color change', (color_info) => {
      // Update users color and all messages sent by that user
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].username === color_info.username) {
          this.users[i].color = color_info.new_color;
          break;
        }
      }

      for (let i = 0; i < this.chat_messages.length; i++) {
        if (this.chat_messages[i].user === color_info.username) {
          this.chat_messages[i].color = color_info.new_color;
        }
      }
    });

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 10px;
  text-align: left;
}

#chat-log ul {
  position: absolute;
  padding: 0 10px;
  bottom: 0;
  max-height: calc(100% - 20px);
  color: #d7d5d5;
}

#chat-log ul > :last-child {
  margin-bottom: 10px;
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

#user-div {
  background: #1c3450;
  grid-area: r;
}

#chat-log {
  background: #12223b;
  position: relative;
  grid-area: m;
  overflow-y: auto;
}

form {
  grid-area: s;
  display: flex;
}

#input-box {
  overflow: hidden;
  display: flex;
  flex: 1;
}
</style>
