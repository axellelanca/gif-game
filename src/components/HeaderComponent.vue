<template>
  <div>
    <div class="header">
      <div>
        <img src="../assets/appLogo.png" alt="" />
      </div>
      <div class="info">
        <p class="timer">ends in {{ countdown }} seconds</p>
        <div>
          <img class="star" src="../assets/uwuStar.png" alt="" />
          <p class="pageTitle">choose your best gif</p>
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
    }
  }
};
</script>

<style src="../assets/styles/Header.css"></style>
