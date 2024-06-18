<template>
  <div class="choose-phrase">
    <h1>Pick the one you want to react to</h1>
    <div class="timer">{{ countdown }} seconds remaining</div>
    <div class="phrases">
      <div
        v-for="(phrase, index) in selectedPhrases"
        :key="index"
        :class="['phrase-card', { selected: selectedIndex === index }]"
        @click="selectPhrase(index, phrase)"
      >
        {{ phrase }}
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
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
        "When you forget what you were going to say mid-sentence",
        "When you're in a Zoom meeting and forget to unmute yourself",
        "When you're watching a movie and someone spoils the ending",
        "When you're about to fall asleep and remember something embarrassing you did years ago",
        "When you finally find a comfortable position in bed and need to go to the bathroom",
        "When you're late and every traffic light turns red",
        "When you hear a noise at night and freeze in your bed",
        "When you try to impress someone and it backfires",
        "When you're waiting for a text back and see 'read' but no response",
        "When your favorite song starts playing at the wrong moment",
        "When you accidentally like someone's old photo while stalking their profile",
        "When you're excited to eat leftovers and someone else already ate them",
        "When you're trying to sneak a snack and drop it",
        "When you wake up early and realize it's your day off",
        "When you're at a party and don't know anyone",
        "When you're almost asleep and someone calls you",
        "When you forget your headphones at home",
        "When you send a message to the wrong person",
        "When you walk into a room and forget why you came in",
        "When you're in a hurry and can't find your keys",
        "When you spill something on your favorite shirt",
        "When you're singing in the shower and someone walks in",
        "When you drop your phone and it lands screen-side down",
        "When you're out of breath from walking up a few stairs",
        "When your alarm doesn't go off and you wake up late",
        "When you're trying to explain something and it makes no sense",
        "When you get to the grocery store and forget your shopping list",
        "When you can't remember someone's name but it's too late to ask",
        "When you're craving something specific and the place is closed",
        "When you're at the checkout and realize you forgot your wallet",
        "When you're dancing and someone catches you",
        "When you're in the middle of a story and forget the point",
        "When you order food and it's not what you expected",
        "When you're about to win a game and lose at the last second",
        "When you try to take a cute selfie and it's a disaster",
        "When you're watching TV and lose the remote",
        "When you're trying to be serious but can't stop laughing",
        "When you can't open a jar and someone else does it easily",
        "When you're hungry but too lazy to cook",
        "When you miss a step and try to play it off cool",
        "When you send a message with a typo and can't unsend it",
        "When you're trying to stay awake but your eyes keep closing",
        "When you realize you've been talking to yourself",
        "When you get up too fast and feel dizzy",
        "When you finally get comfortable and the doorbell rings",
        "When you make plans and instantly regret it",
        "When you're trying to take a nap but can't fall asleep",
        "When you're talking and someone interrupts you",
        "When you see someone waving and wave back, but they're not waving at you",
        "When you find out your favorite show is getting canceled",
        "When you're trying to take a picture and your phone's out of storage"
      ],
      selectedPhrases: [],
      selectedIndex: null,
      phraseToSend: null,
      countdown: 5,
      interval: null,
    };
  },
  computed: {
    ...mapState(["gameStatus", "timestamp"]),
  },
  methods: {
    ...mapActions(["sendMessage"]),
    startCountdown() {
      this.interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.interval);
          const message = {
            type: "startRound",
            phrase: this.phraseToSend,
          };
      this.sendMessage(JSON.stringify(message));
          this.$router.push("/gifs"); // Rediriger lorsque le countdown atteint zéro
        }
      }, 1000);
    
    },
    getRandomPhrases() {
      // Simuler la récupération des phrases depuis une source de données (API, Vuex, etc.)
      const shuffled = this.phrases.sort(() => 0.5 - Math.random());
      this.selectedPhrases = shuffled.slice(0, 2);
    },
    selectPhrase(index, phrase) {
      this.selectedIndex = index;
      this.phraseToSend = phrase;
    },
  },
  mounted() {
    this.getRandomPhrases();
    this.startCountdown();
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
</script>

<style src="../assets/styles/ChoosePhrase.css"></style>
