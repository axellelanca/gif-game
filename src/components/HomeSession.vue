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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
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
  },
  mounted() {
    this.connectWebSocket();
  }
};
</script>
