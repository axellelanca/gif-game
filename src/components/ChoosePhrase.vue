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
      countdown: 30
    };
  },
  methods: {
    getRandomPhrases() {
      const shuffled = this.phrases.sort(() => 0.5 - Math.random());
      this.selectedPhrases = shuffled.slice(0, 2);
    },
    selectPhrase(index) {
      this.selectedIndex = index;
    },
    startCountdown() {
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.$router.push('/session');
        }
      }, 1000);
    }
  },
  mounted() {
    this.getRandomPhrases();
    this.startCountdown();
  }
};
</script>

<style scoped>
.choose-phrase {
  text-align: center;
  padding: 20px;
  color: white;
}

.timer {
  font-size: 24px;
  margin-bottom: 20px;
}

.phrases {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.phrase-card {
  background: #333;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.phrase-card.selected {
  background: #f39c12;
}
</style>
