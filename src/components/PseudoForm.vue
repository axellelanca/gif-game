<template>
  <div class="pseudo-form">
    <h1>Kahoot!</h1>
    <div class="input-container">
      <input v-model="pseudo" placeholder="Pseudo" />
      <button @click="submitPseudo">Valider</button>
      <router-link to="/another">Go to Another Component</router-link>
    </div>
  </div>
</template>

<script>
import WebSocketService from '../services/websocket';

export default {
  data() {
    return {
      pseudo: ''
    };
  },
  methods: {
    submitPseudo() {
      if (this.pseudo.trim()) {
        const message = JSON.stringify({
          type: 'join',
          pseudo: this.pseudo,
          status: 'online'
        });
        WebSocketService.send(message);
        alert(`Bienvenue, ${this.pseudo}!`);
      } else {
        alert('Veuillez entrer un pseudo.');
      }
    }
  },
  mounted() {
    WebSocketService.connect();
  },
  beforeUnmount() {
    WebSocketService.close();
  }
};
</script>

<style src="../assets/styles/PseudoForm.css"></style>
