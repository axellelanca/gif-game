<script setup>
import { ref, onMounted, computed } from "vue";

const results = ref([]); // Pour stocker les résultats des votes

// Simuler l'obtention des résultats des votes (à remplacer par un appel réel à l'API si nécessaire)
const fetchResults = async () => {
  try {
    // Simuler les résultats des votes
    const simulatedResults = [
      { id: '1', url: 'https://media.giphy.com/media/1xVdmUab7zCJ2/giphy.gif', votes: 5 },
      { id: '2', url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', votes: 3 },
      { id: '3', url: 'https://media.giphy.com/media/26u4nJPf0JtQPdStq/giphy.gif', votes: 7 },
    ];
    results.value = simulatedResults;
    console.log(results.value);
  } catch (error) {
    console.log(error);
  }
};

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
  fetchResults(); // Fetch results when the component is mounted
});
</script>

<template>
  <div class="results-container">
    <h1>Results</h1>
    <div v-if="topResult" class="top-result">
      <img :src="topResult.url" :alt="`GIF ${topResult.id}`" class="top-result-gif" />
      <p class="top-result-text">1er - Votes: {{ topResult.votes }}</p>
    </div>
    <div class="results-list">
      <div class="result-item" v-for="(result, index) in otherResults" :key="result.id">
        <img :src="result.url" :alt="`GIF ${result.id}`" class="result-gif" />
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
