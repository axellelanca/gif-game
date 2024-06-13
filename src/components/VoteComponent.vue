<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from "./HeaderComponent.vue";

const gifsList = ref([]);
const countdown = ref(60);
const selectedGifId = ref(null); // État réactif pour suivre l'image sélectionnée
const isVoteSubmitted = ref(false); // État réactif pour savoir si le vote est soumis

const router = useRouter();

// Simuler les GIFs disponibles pour le vote (à remplacer par un appel réel à l'API si nécessaire)
const fetchGifsForVote = async () => {
  try {
    const gifs = [
      { id: '1', url: 'https://media.giphy.com/media/1xVdmUab7zCJ2/giphy.gif' },
      { id: '2', url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif' },
      { id: '3', url: 'https://media.giphy.com/media/26u4nJPf0JtQPdStq/giphy.gif' },
    ];
    gifsList.value = gifs.map(gif => ({
      id: gif.id,
      url: gif.url,
      width: '200px',
      height: '200px',
    }));
    console.log(gifsList.value);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchGifsForVote(); // Fetch GIFs when the component is mounted
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

const selectGif = (id) => {
  selectedGifId.value = id;
};

const submitVote = () => {
  if (selectedGifId.value !== null) {
    isVoteSubmitted.value = true;
    console.log(`Voted for GIF ID: ${selectedGifId.value}`);
    // Ajoutez ici l'appel à l'API pour soumettre le vote
    router.push("/results"); // Rediriger vers la page de résultats après le vote
  }
};
</script>

<template>
  <HeaderComponent :countdown="countdown" />
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
    <button class="validate-button" @click="submitVote">Submit Vote</button>
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
