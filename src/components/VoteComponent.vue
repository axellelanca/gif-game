<script setup>
import { ref, onMounted ,watch, onUnmounted ,computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import HeaderComponent from "./HeaderComponent.vue";


const gifsList = ref([]);
const selectedGifId = ref({});
const isVoteSubmitted = ref(false); 
const countdown = computed(() => store.state.countdown);

const router = useRouter();
const store = useStore();

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
const fetchGifsForVote = () => {
  gifsList.value = Object.values(selectedGifId.value).map(gif => ({
    id: generateId(),
    url: gif.gifUrl,
    width: '200px',
    height: '200px'
  }));
};

const sendMessage = () => {
  const selectedGif = gifsList.value.find(g => g.id === selectedGifId.value);
  const message = {
    type: "gifVote",
    pseudo: store.state.pseudo,
    gifUrl: selectedGif.url
  };
  console.log("Sending message:", message);
  store.dispatch("sendMessage", JSON.stringify(message));
};


watch(countdown, (newCountdown) => {
  if (newCountdown === 1) {
    sendMessage();
    router.push('/results');
  }
});
onUnmounted(() => {
  store.dispatch('stopCountdown')
});



onMounted(() => {
  store.dispatch("setTimestamp", Date.now());
  store.dispatch("startCountdown",15);
  fetchGifsForVote();
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(interval);
      if (!isVoteSubmitted.value) {
        submitVote(); // Soumettre automatiquement le vote si le temps est écoulé
      }
    }
  }, 1000);
});

watch(() => store.state.selectedGifs, (newSelectedGifs) => {
  selectedGifId.value = newSelectedGifs;
  fetchGifsForVote();
});

const selectGif = (id) => {
  selectedGifId.value = id;
  
};

const submitVote = () => {
  if (selectedGifId.value !== null) {
    isVoteSubmitted.value = true;
    // Ajoutez ici l'appel à l'API pour soumettre le vote
  } else {
    console.error("No GIF selected.");
  }
};
</script>

<template>
  <headerComponent maintitle="Vote for your favorite Gif"/>
  <div class="timer">{{ countdown }} seconds remaining</div>
  <div class="gif-selector-container">
    <div class="gifs-list">
      <div
        class="gif-item"
        :class="{ selected: selectedGifId === gif.id }"
        v-for="gif in gifsList"
        :key="gif.id"
        @click="selectGif(gif.id)"
      >
        <img :src="gif.url" :alt="`GIF ${gif.id}`" class="gif-image" />
      </div>
    </div>
    <div v-if="isVoteSubmitted" class="selected-gif-container">
      <img 
        v-if="selectedGifId !== null"
        :src="gifsList.find(gif => gif.id === selectedGifId)?.url" 
        class="selected-gif" 
        alt="Selected GIF" 
      />
      <p>Thank you for voting!</p>
    </div>
  </div>
</template>

<style src="../assets/styles/GifSelector.css"></style>
