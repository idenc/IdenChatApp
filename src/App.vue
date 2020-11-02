<template>
  <div id="app">
    <ChatWindow msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import ChatWindow from './components/ChatWindow.vue'
import io from 'socket.io-client'

export default {
  name: 'App',
  components: {
    ChatWindow
  },
}

// eslint-disable-next-line no-unused-vars
const socket = io();
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
