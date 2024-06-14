<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from "./HeaderComponent.vue";
import { useStore } from "vuex";

const getSearch = ref("");
const gifsList = ref([]);
const countdown = ref(10);
const selectedGifUrl = ref(null); // État réactif pour suivre l'image sélectionnée

const router = useRouter();
const store = useStore();

// Accéder à l'état 'updateRound' du store Vuex
const phrase = computed(() => store.state.updateRound);
const pseudo = computed(() => store.state.pseudo);
const sendMessage = computed(() => store.state);

const getMaxVotesPhrase = (votes) => {
  if (!votes) return ""; // Vérification de sécurité pour s'assurer que votes n'est pas undefined

  let maxVotes = -1;
  let maxVotesPhrase = "";

  for (const [phrase, vote] of Object.entries(votes)) {
    if (vote > maxVotes) {
      maxVotes = vote;
      maxVotesPhrase = phrase;
    }
  }
  return maxVotesPhrase;
};

// Propriété calculée pour obtenir la phrase avec le plus de votes
const maxVotesPhrase = computed(() => getMaxVotesPhrase(phrase.value));

const fetchGif = async () => {
  console.log(
    "okpijuhytdrfygvbhnj,kpiuytdryuiouuyjgduzgduzguzgdfuzg",
    sendMessage
  );
  console.log("Max votes phrase:", maxVotesPhrase.value); // Ajout du log ici
  try {
    const request = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${getSearch.value}&key=AIzaSyCds2gvFpebjl5Z2ExuUGRkn2b12dXHm0Q&limit=10`
    );
    const response = await request.json();
    gifsList.value = response.results;

    gifsList.value = gifsList.value.reduce((acc, current) => {
      acc.push({
        id: current.id,
        url: current.media_formats.gif.url,
        width: current.media_formats.gif.dims[0] + "px",
        height: current.media_formats.gif.dims[1] + "px",
      });
      return acc;
    }, []);
  } catch (error) {
    console.log(error);
  }
};

watch(getSearch, () => {
  fetchGif();
});

onMounted(() => {
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      const message = {
        type: "updateGameStatus",
        status: "waitingCountDown",
        timestamp: "lkjhgf",
      };
      sendMessage(JSON.stringify(message));
      console.log(pseudo);
      clearInterval(interval);
      router.push("/vote");
    }
  }, 1000);
});

const selectGif = (gif) => {
  selectedGifUrl.value = gif.url;
  console.log(store._actions);
  // store._actions.sendMessage(
  //   JSON.stringify({
  //     bonjour: "hello",
  //   })
  // );
};

// Watch for changes in the phrase and log them
watch(phrase, (newVal) => {
  console.log("Phrase from store:", newVal);
});
</script>

<template>
  <HeaderComponent :countdown="countdown" />
  <div class="gif-selector-container">
    <p>Phrase with the most votes: {{ maxVotesPhrase }}</p>
    <!-- Affichage de la phrase avec le plus de votes -->
    <input
      class="custom-input"
      type="text"
      v-model="getSearch"
      placeholder="Search for a meme..."
    />
    <div class="gifs-list">
      <div
        class="gif-item"
        :class="{ selected: selectedGifId === gif.id }"
        v-for="gif in gifsList"
        :key="gif.id"
        @click="selectGif(gif)"
      >
        <img :src="gif.url" :alt="`GIF ${gif.id}`" class="gif-image" />
      </div>
    </div>
    <button class="validate-button">Validate</button>
  </div>
</template>

<style src="../assets/styles/GifSelector.css"></style>
