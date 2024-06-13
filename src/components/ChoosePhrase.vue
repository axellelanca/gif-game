<template>
  <div class="choose-phrase">
    <h1>Pick the one you want to react to</h1>
    <div class="timer">{{ countdown }} seconds remaining</div>
    <div class="phrases">
      <div
        v-for="(phrase, index) in selectedPhrases"
        :key="index"
        :class="['phrase-card', { selected: selectedIndex === index }]"
        @click="selectPhrase(index)"
      >
        {{ phrase }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      phrases: [
        "When you're vibing to music and an ad comes on",
        "When you're waiting for something and the internet is slow",
        "When you finally sit down to eat and realize you forgot your drink",
        "When you finish a series and don't know what to do with your life",
        "When you're trying to be quiet but drop something loud",
        "When your phone dies right before you get to your destination",
        "When you send a risky text and see 'typing...'",
        "When you forget what you were going to say mid-sentence"
      ],
      selectedPhrases: [],
      selectedIndex: null,
      countdown: 30,
      interval: null,
      gameStarted: false // Ajout du drapeau
    };
  },
  methods: {
    ...mapActions(['connectWebSocket', 'sendMessage']),
    startGame() {
      if (!this.gameStarted) {
        this.gameStarted = true;
        const date = new Date();
        const message = {
          type: "updateGameStatus",
          status: "waitingCountDown",
          timestamp: date.getTime()
        };
        this.sendMessage(JSON.stringify(message));
      }
    },
    getRandomPhrases() {
      const shuffled = this.phrases.sort(() => 0.5 - Math.random());
      this.selectedPhrases = shuffled.slice(0, 2);
    },
    selectPhrase(index) {
      this.selectedIndex = index;
    },
    startCountdown(timestamp) {
      if (this.interval) {
        clearInterval(this.interval); // Nettoie l'intervalle précédent
      }
      this.countdown = timestamp;
      this.interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.interval);
          this.$router.push('/game');
        }
      }, 1000);
    }
  },
  mounted() {
    this.getRandomPhrases();
    this.connectWebSocket();
    this.startGame(); 
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  created() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setGameStatus' && mutation.payload === 'waitingCountDown' && this.$store.state.timestamp) {
        const savedTimestamp = this.$store.state.timestamp;
        const currentTimestamp = Date.now();
        const countdown = Math.max(0, Math.floor((savedTimestamp - currentTimestamp + 30000) / 1000));
        this.startCountdown(countdown);
      }
    });
  }
};
</script>

<style src="../assets/styles/ChoosePhrase.css"></style>
