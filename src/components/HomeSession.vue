<template>
  <div class="home-session-container">
    <div v-if="users && users.length">
      <div class="users-list">
        <div v-for="user in users" :key="user.pseudo" class="user-item">
          <p class="label">{{ user.pseudo }}</p>
        </div>
      </div>
    </div>
    <div class="start-button-div">
      <button @click="startGame" v-if="!countdown" class="start-button">Start</button>
    </div>
    <div v-if="countdown" class="countdown">{{ countdown - 1  }} seconds remaining</div>
    <div class="bean-logo">
      <img src="../assets/mister_bean_meme.png" alt="" class="bean-logo" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["pseudo", "users", "countdown", "gameStatus", "timestamp"]),
  },
  methods: {
    ...mapActions(["sendMessage", "startCountdown", "stopCountdown"]),
    
    startGame() {
      const date = new Date();
      const message = {
        type: "updateGameStatus",
        status: "waitingCountDown",
        timestamp: date.getTime(),
      };
      this.sendMessage(JSON.stringify(message));
      this.$store.commit('setTimestamp', date.getTime());
      this.$store.commit('setGameStatus', 'waitingCountDown');
      this.$store.dispatch("startCountdown",5);
    },
    handleCountdownComplete() {
      this.$router.push("/choose");
    },
  },
  watch: {
    gameStatus(newStatus) {
      if (newStatus === "waitingCountDown") {
        this.startCountdown();
      } else if (newStatus === "waiting") {
        this.handleCountdownComplete();
      }
    },
    timestamp() {
      if (this.gameStatus === "waitingCountDown") {
        this.startCountdown();
      }
    }
  },
  mounted() {
    if (this.gameStatus === "waitingCountDown") {
      this.startCountdown();
    }
  },
  beforeUnmount() {
    this.$store.dispatch("stopCountdown");
  },
};
</script>

<style scoped>
.users-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
  list-style-type: none;
  padding: 0 30%;
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
  background: #f0f154;
}

.home-session-container {
  display: flex;
  flex-direction: column;
}

.start-button {
  max-width: 200px;
}

.start-button-div {
  display: flex;
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

button {
  width: 100px;
  height: 40px;
  border-radius: 44px;
  background: linear-gradient(90deg, #f080de 0%, #7965fa 100%);
  font-family: "IBM Plex Mono";
  color: #fff;
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
  bottom: 10px;
  left: 10px;
  width: 30%;
  height: auto;
  z-index: 1000;
}
</style>
