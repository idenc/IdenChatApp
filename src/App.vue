<template>
  <div id="app">
    <ChatWindow id="chat" class="center shadow"/>
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
  /* from https://cssgradient.io/gradient-backgrounds/ */
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
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

.shadow {
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12)
}
</style>
