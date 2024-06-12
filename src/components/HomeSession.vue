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
      console.log('Connected Users:', filteredUsers);  // Ajouter ce log pour déboguer
      return filteredUsers;
    }
  },
  methods: {
    ...mapActions(['connectWebSocket']),
    startGame() {
      this.countdown = 30;
      this.interval = setInterval(() => {
        if (this.countdown > 0) {
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
  }
};
</script>
