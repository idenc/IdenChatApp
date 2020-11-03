<template>
  <div id="app">
    <ChatWindow id="chat" class="center"/>
  </div>
</template>

<script>
import ChatWindow from './components/ChatWindow.vue'

export default {
  name: 'App',
  components: {
    ChatWindow
  },
}
</script>

<style>
body {
  margin: 0;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow: hidden;
}

#chat {
  display: flex;
  flex-direction: column;
  max-width: 960px;
  margin: 10px auto auto;
  height: calc(100% - 20px);
}
</style>
