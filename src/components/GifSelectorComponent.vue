<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore} from 'vuex';

const searchQuery = ref("");
const gifsList = ref([]);
const selectedGifId = ref(null);

const router = useRouter();
const store = useStore();

const fetchGifs = async () => {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?q=${searchQuery.value}&api_key=yDhEs28AeDl6Pc40isbqGH2BTsnOtTIs&limit=10`
    );
    const data = await response.json();
    gifsList.value = data.data.map(gif => ({
      id: gif.id,
      url: gif.images.fixed_height.url
    }));
  } catch (error) {
    console.error("Error fetching GIFs:", error);
  }
};

const selectGif = (gif) => {
  selectedGifId.value = gif.id;
};

watch(searchQuery, () => {
  if (searchQuery.value.trim() !== "") {
    fetchGifs();
  }
});

const countdown = computed(() => store.state.countdown);

const sendMessage = () => {
  if (!selectedGifId.value) {
    console.error("No GIF selected.");
    return;
  }
  const selectedGif = gifsList.value.find(g => g.id === selectedGifId.value);

  if (!selectedGif) {
    console.error("Selected GIF not found in the list.");
    return;
  }

  const message = {
    type: "userGifSelection",
    pseudo: store.state.pseudo,
    gifUrl: gifsList.value.find(gif => gif.id === selectedGifId.value).url
  };
  console.log("Sending message:", message);
  store.dispatch("sendMessage", JSON.stringify(message));
};
watch(countdown, (newCountdown) => {
  if (newCountdown === 1) {
    sendMessage();
    router.push('/vote');
  }
});

onMounted(() => {
  store.dispatch("setTimestamp", Date.now());
  store.dispatch("startCountdown",5);
});


const getMaxVotesPhrase = (phrases) => {
  if (!phrases) return "";

  let maxVotes = -1;
  let maxVotesPhrase = "";

  for (const [phrase, vote] of Object.entries(phrases)) {
    if (vote > maxVotes) {
      maxVotes = vote;
      maxVotesPhrase = phrase;
    }
  }
  return maxVotesPhrase;
};

// Propriété calculée pour obtenir la phrase avec le plus de votes
const maxVotesPhrase = computed(() => {
  return getMaxVotesPhrase(store.state.phrase);
});

onUnmounted(() => {
  store.dispatch('stopCountdown')
});
</script>

<template>
  <div class="gif-selector-container">
    <p>Phrase with the most votes: {{ maxVotesPhrase }}</p>
    <input
      class="custom-input"
      type="text"
      v-model="searchQuery"
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
    <div class="timer">{{ countdown }} seconds remaining</div> <!-- Utilisation de state.countdown -->
  </div>
</template>

<style src="../assets/styles/GifSelector.css"></style>
