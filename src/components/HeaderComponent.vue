<template>
  <div>
    <div class="header">
        <img src="../assets/appLogo.png" alt="" class="app-logo" />
      <div class="info">
        <div>
          <img class="star" src="../assets/uwuStar.png" alt="" />
          <p class="pageTitle">{{ maintitle }}</p>
          <img class="star" src="../assets/uwuStar.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    countdown: {
      type: Number,
      required: true
    },
    maintitle: {
      type: Text,
      required: true
    },
  }
};
</script>

<style src="../assets/styles/Header.css"></style>
