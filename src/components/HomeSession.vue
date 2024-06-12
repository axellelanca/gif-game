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
      const filteredUsers = this.users.filter(user => user.status === 'online');
      console.log('Connected Users:', filteredUsers);
      return filteredUsers;
    }
  },
  methods: {
    ...mapActions(['connectWebSocket', 'sendMessage']),
    startGame() {
      const message = {
        type: "updateGameStatus",
        status: "waitingCountDown",
        countdown: 30
      };
      this.sendMessage(JSON.stringify(message));
      this.startCountdown(30);
    },
    startCountdown(initialCountdown) {
      this.countdown = initialCountdown;
      this.interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
          const message = {
            type: "updateGameStatus",
            status: "waitingCountDown",
            countdown: this.countdown
          };
          this.sendMessage(JSON.stringify(message));
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
  }
};
</script>
