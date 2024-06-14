<template>
  <div class="home-session-container">
    <HeaderComponent :countdown="countdown" maintitle="Players" />
    <!-- <p class="welcome-message">Bienvenue, {{ pseudo }}!</p> -->
    <div v-if="users && users.length">
    <div class="users-list">     
      <div v-for="user in users" :key="user.pseudo" class="user-item">
      <p class="label">{{ user.pseudo }}</p>
        
      </div>
    </div>
    </div>
    <div class="start-btton-div">
      <button @click="startGame" v-if="!countdown" class="start-button">Start</button>
    </div>
    <div v-if="countdown" class="countdown">{{ countdown }} seconds remaining</div>
    <div class="bean-logo">
      <img src="../assets/mister_bean_meme.png" alt="" class="bean-logo" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import HeaderComponent from "./HeaderComponent.vue";

export default {
  components: {
    HeaderComponent,
  },
  data() {
    return {
      unsubscribe: null,
      countdown: null,
      interval: null,
    };
  },
  computed: {
    ...mapState(["pseudo", "users"]),
  },
  methods: {
    ...mapActions(["connectWebSocket", "sendMessage"]),
    
    startGame() {
      const date = new Date();
      const message = {
        type: "updateGameStatus",
        status: "waitingCountDown",
        timestamp: date.getTime(),
      };
      this.sendMessage(JSON.stringify(message));
    },
    startCountdown(timestamp) {
      this.countdown = timestamp;
      this.interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.interval);
          //this.$router.push("/choose");
        }
      }, 1000);
    },
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if (
        mutation.type === "setGameStatus" &&
        mutation.payload === "waitingCountDown" &&
        this.$store.state.timestamp
      ) {
        const savedTimestamp = this.$store.state.timestamp;
        const currentTimestamp = Date.now();
        const countdown = Math.max(
          0,
          Math.floor((savedTimestamp - currentTimestamp + 5000) / 1000)
        );
        this.startCountdown(countdown);
      }
    });
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
</script>

<style scoped>
.users-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px; /* Espace entre les éléments */
  margin-bottom: 20px;
  list-style-type: none; /* Enlever les puces */
  padding: 0% 30% 0% 30%;  
  max-width: 100%;
  margin-top: 100px;

}

.user-item {
  width: 180px;
  height: 45px;
  position: relative;
  border-radius: 3px;
  z-index: 1;
}

.user-item::before {
  content: "";
  position: absolute;
  top: 33px;
  left: 8px;
  width: 180px;
  height: 45px;
  border-radius: 3px;
  z-index: 0;
  background: #F0F154;
}

.home-session-container{
    display: flex;
    flex-direction: column;
}

.start-button{
  max-width: 200px;
}

.start-btton-div{
  display: flex ;
  justify-content: center;
  margin-top: 100px;
}


.label {
    background-color: #ffffff;
    display: inline-block;
    width: 180px;
    height: 45px;
    color: #000000;
    border-radius: 3px;
    font-size: 24px;
    position: relative;
    z-index: 2;
    display: flex;              /* Use flexbox for centering */
    justify-content: center;    /* Center horizontally */
    align-items: center;        /* Center vertically */
    text-align: center; 
}

button {
    width: 100px;
    height: 40px;
    border-radius: 44px;
    background: linear-gradient(90deg, #F080DE 0%, #7965FA 100%);
    font-family: "IBM Plex Mono";
    color: #FFF;
    font-size: 20px;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
    position: relative;
    z-index: 1;
    overflow: hidden;
    border: none;
}

.bean-logo {
    position: fixed;
    bottom: 10px !important;
    left: 10px;
    width: 30%;
    height: auto;
    z-index: 1000;
}

</style>
