<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from "./HeaderComponent.vue";

const getSearch = ref("");
const gifsList = ref([]);
const countdown = ref(60);
const selectedGifId = ref(null); // État réactif pour suivre l'image sélectionnée

const router = useRouter();

const fetchGif = async () => {
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

    console.log(gifsList.value);
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
      clearInterval(interval);
      router.push("/vote");
    }
  }, 1000);
});

const selectGif = (id) => {
  selectedGifId.value = id;
};
</script>

<template>
  <HeaderComponent :countdown="countdown" />
  <div class="gif-selector-container">
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
        @click="selectGif(gif.id,gi)"
      >
        <img :src="gif.url" :alt="`GIF ${gif.id}`" class="gif-image" />
      </div>
    </div>
    <button class="validate-button">Validate</button>
  </div>
</template>

<style src="../assets/styles/GifSelector.css"></style>
