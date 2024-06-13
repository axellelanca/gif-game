<script setup>
import { ref, watch } from "vue";
import HeaderComponent from "./HeaderComponent.vue";

const getSearch = ref("");
const gifsList = ref([]);

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
</script>

<template>
  <HeaderComponent />
  <div style="height: 500px; width: 800px; border: 1px solid black">
    <input
      class="customInput"
      type="text"
      v-model="getSearch"
      placeholder="select le meme lo"
    />
    <div>
      <div
        style="height: 100%; overflow: hidden"
        v-for="gif in gifsList"
        :key="gif.id"
      >
        <img :src="gif.url" :height="gif.height" :width="gif.width" alt="" />
      </div>
    </div>
  </div>
</template>

<style src="../assets/styles/GifSelector.css"></style>
