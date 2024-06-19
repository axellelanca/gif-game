<script setup>
import { ref, onMounted } from "vue";
import HeaderComponent from "./HeaderComponent.vue";
const scores = ref([]); // Pour stocker les scores des joueurs

// Simuler l'obtention des scores (à remplacer par un appel réel à l'API si nécessaire)
const fetchScores = async () => {
  try {
    // Simuler les scores des joueurs
    const simulatedScores = [
      { rank: 1, name: 'Player 1', score: 300 },
      { rank: 2, name: 'Player 2', score: 250 },
      { rank: 3, name: 'Player 3', score: 200 },
      { rank: 4, name: 'Player 4', score: 150 },
      { rank: 5, name: 'Player 5', score: 100 },
    ];
    scores.value = simulatedScores;
    console.log(scores.value);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchScores(); // Fetch scores when the component is mounted
});
</script>

<template>
  <header-component maintitle="Choose your best gif !"/>
  <div class="scores-container">
    <h1>Final ranking</h1>
    <div class="scores-list">
      <div class="score-item" v-for="score in scores" :key="score.rank">
        <p>{{ score.rank }}. {{ score.name }} - {{ score.score }} pts</p>
      </div>
    </div>
    <button class="new-game-button" @click="startNewGame">New game</button>
  </div>
</template>

<script>
const startNewGame = () => {
  // Logique pour démarrer un nouveau jeu, par exemple rediriger vers la page d'accueil
  window.location.href = "/";
};
</script>

<style>
.scores-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.scores-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-bottom: 10px;
}

.new-game-button {
  background: linear-gradient(45deg, #ff0080, #ff8c00);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.new-game-button:hover {
  background: linear-gradient(45deg, #ff8c00, #ff0080);
}
</style>
