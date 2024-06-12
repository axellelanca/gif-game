<template>
  <div>
    <h1>Gif Game</h1>
    <p>Bienvenue, {{ pseudo }}!</p>
    <router-link to="/">Changer de pseudo</router-link>
    <div v-if="users && users.length">
      <ul>
        <li v-for="user in connectedUsers" :key="user.pseudo">
          {{ user.pseudo }} - {{ user.status }}
        </li>
      </ul>
    </div>
    <button @click="startGame" v-if="!countdown">Start</button>
    <div v-if="countdown">{{ countdown }} seconds remaining</div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      countdown: null,
      interval: null
    };
  },
  computed: {
    ...mapState(['pseudo', 'users']),
    connectedUsers() {
      return this.users.filter(user => user.status === 'online');
    }
  },
  methods: {
    ...mapActions(['connectWebSocket', 'sendMessage']),
    startGame() {
      const date = new Date();
      const message = {
        type: "updateGameStatus",
        status: "waitingCountDown",
        timestamp: date.getTime()
      };
      this.sendMessage(JSON.stringify(message));
    },
    startCountdown(timestamp) {
      this.countdown = timestamp;
      this.interval = setInterval(() => {
        if (this.countdown > 0) {
          console.log(this.countdown)
          this.countdown--;
        } else {
          clearInterval(this.interval);
          this.$router.push('/choose');
        }
      }, 1000);
    }
  },
  mounted() {
    this.connectWebSocket();
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  created() {
    
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setGameStatus' && mutation.payload === 'waitingCountDown') {
        const savedTimestamp = this.$store.state.timestamp;
        const currentTimestamp = Date.now();
        const countdown = Math.max(0, Math.floor((savedTimestamp - currentTimestamp + 30000) / 1000));
        console.log(countdown);
        this.startCountdown(countdown);
        
      }
    });
  }
};
</script>
