<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from "vue";
import { useStore } from "vuex";
import HeaderComponent from "@/components/HeaderComponent.vue";

const results = ref([]);
const selectedGifId = ref({});
const countdown = computed(() => store.state.countdown);

const store = useStore();

const fetchResults = () => {
  results.value = store.state.votes.map(vote => ({
    gifUrl: vote.gifUrl,
    votes: vote.votes
  }));
};

watch(countdown, (newCountdown) => {
  if (newCountdown === 1) {
    fetchResults();
  }
});

onUnmounted(() => {
  store.dispatch('stopCountdown');
});

const sortedResults = computed(() => {
  return [...results.value].sort((a, b) => b.votes - a.votes);
});

const topResult = computed(() => {
  return sortedResults.value.length > 0 ? sortedResults.value[0] : null;
});

const otherResults = computed(() => {
  return sortedResults.value.slice(1);
});

onMounted(() => {
  fetchResults();
  store.dispatch("setTimestamp", Date.now());
  store.dispatch("startCountdown", 10);
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      store.commit('decrementCountdown');
    } else {
      clearInterval(interval);
    }
  }, 1000);
});

watch(() => store.state.selectedGifs, (newSelectedGifs) => {
  selectedGifId.value = newSelectedGifs;
  fetchResults();
});

</script>

<template>
  <header-component maintitle="Score"/>
  <div class="results-container">
    <div v-if="topResult" class="top-result">
      <img :src="topResult.gifUrl" :alt="`GIF ${topResult.gifUrl}`" class="top-result-gif" />
      <p class="top-result-text">1er - Votes: {{ topResult.votes }}</p>
    </div>
    <div class="results-list">
      <div class="result-item" v-for="(result, index) in otherResults" :key="result.gifUrl">
        <img :src="result.gifUrl" :alt="`GIF ${result.gifUrl}`" class="result-gif" />
        <p>{{ index + 2 }}ème - Votes: {{ result.votes }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.top-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.top-result-gif {
  max-width: 400px; /* Agrandir le GIF du premier résultat */
  max-height: 400px;
  object-fit: cover;
}

.top-result-text {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 10px;
}

.results-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 800px;
  margin-top: 20px;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-gif {
  max-width: 150px;
  max-height: 150px;
  object-fit: cover;
}
</style>
