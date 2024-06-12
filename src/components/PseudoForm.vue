<template>
  <div class="pseudo-form">
    <h1>Kahoot!</h1>
    <div class="input-container">
      <input v-model="pseudo" placeholder="Pseudo" />
      <button @click="submitPseudo">Valider</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      pseudo: ''
    };
  },
  computed: {
    ...mapState(['pseudo'])
  },
  methods: {
    ...mapActions(['connectWebSocket', 'sendMessage']),
    ...mapMutations(['setPseudo']),
    submitPseudo() {
      if (this.pseudo.trim()) {
        this.setPseudo(this.pseudo);
        const message = JSON.stringify({
          type: 'join',
          pseudo: this.pseudo,
          status: 'online'
        });
        this.sendMessage(message);
        this.$router.push('/session');
      } else {
        alert('Veuillez entrer un pseudo.');
      }
    }
  },
  mounted() {
    this.connectWebSocket();
  }
};
</script>

<style src="../assets/styles/PseudoForm.css"></style>
