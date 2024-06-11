<template>
  <div>
    <h1>Another Component</h1>
    <p>Bienvenue, {{ pseudo }}!</p>
    <router-link to="/">Go back to PseudoForm</router-link>
    <div v-if="users && users.length">
      <h2>Connected Users:</h2>
      <ul>
        <li v-for="user in users" :key="user.pseudo">
          {{ user.pseudo }} - {{ user.status }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No users connected</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['pseudo', 'users'])  // Ajoutez les utilisateurs à l'état calculé
  },
  methods: {
    ...mapActions(['connectWebSocket']),
  },
  mounted() {
    this.connectWebSocket();
    console.log('AnotherComponent mounted');
    console.log('Pseudo:', this.pseudo);
  }
};
</script>
