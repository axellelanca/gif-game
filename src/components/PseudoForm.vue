<template>
  <div class="pseudo-form">
    <div class="welcome-msg">
      <div class="welcome-txt">
        <img class="star" src="../assets/uwuStar.png" alt="" />
        <p class="pageTitle">WELCOME TO</p>
        <img class="star" src="../assets/uwuStar.png" alt="" />
      </div>
      <div>
        <img class="logo-home-page" src="../assets/logo-what-a-meme.png" alt="" />
      </div>
    </div>
    <div class="input-container">
      <input  v-model="pseudo" placeholder="Choose your pseudo" />
      <button @click="submitPseudo">Let's go</button>
    </div>
    <div class="p1-div-meme">
      <img class="background" src="../assets/step1_picture.png" alt="" />
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
    ...mapActions([ 'sendMessage']),
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
};
</script>

<style src="../assets/styles/PseudoForm.css"></style>
