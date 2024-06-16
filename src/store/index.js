// src/store/index.js

import { createStore } from "vuex";

const store = createStore({
  state: {
    socket: null,
    pseudo: "",
    users: [],
    updatePhrase: null,
    gameStatus: "waiting",
    timestamp: null,
    countdown: 0,
    intervalId: null,
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
    setPseudo(state, pseudo) {
      state.pseudo = pseudo;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setGameStatus(state, gameStatus) {
      state.gameStatus = gameStatus;
    },
    setTimestamp(state, timestamp) {
      state.timestamp = timestamp;
    },
    setCountdown(state, countdown) {
      state.countdown = countdown;
    },
    setIntervalId(state, intervalId) {
      state.intervalId = intervalId;
    },
    clearIntervalId(state) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    },
    setUpdateRound(state, updateRound) {
      state.updateRound = updateRound;
    },
  },
  actions: {
    connectWebSocket({ commit, state, dispatch }) {
      if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
        const socket = new WebSocket("ws://localhost:4000");
        socket.onopen = () => {
          console.log("WebSocket connected");
          if (state.pseudo) {
            const message = JSON.stringify({
              type: "join",
              pseudo: state.pseudo,
              status: "online",
            });
            socket.send(message);
          }
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === "userList") {
              commit("setUsers", message.users);
            } else if (message.type === "gameStatus") {
              commit("setGameStatus", message.gameStatus);
              commit("setTimestamp", message.timestamp);
              if (message.gameStatus === "waitingCountDown") {
                dispatch("startCountdown");
              }
            } else if (message.type === "roundUpdate") {
              commit("setUpdateRound", message.phrase);
            }

            console.log("WebSocket message received:", message);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };

        socket.onclose = () => {
          console.log("WebSocket closed");
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        commit("setSocket", socket);
      }
    },
    async sendMessage({ state }, message) {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.send(message);
      } else {
        console.error("WebSocket is not open");
      }
    },
    startCountdown({ commit, state, dispatch }) {
      if (state.intervalId) {
        clearInterval(state.intervalId);
      }

      let countdown = Math.floor((state.timestamp + 5000 - Date.now()) / 1000);
      commit("setCountdown", countdown);

      const intervalId = setInterval(() => {
        if (countdown > 0) {
          countdown--;
          commit("setCountdown", countdown);
        } else {
          clearInterval(intervalId);
          commit("setIntervalId", null);
          dispatch("handleCountdownComplete");
        }
      }, 1000);

      commit("setIntervalId", intervalId);
    },
    handleCountdownComplete({ commit, dispatch }) {
      commit("setGameStatus", "waitingCountDownChoose");
      dispatch("sendMessage", JSON.stringify({
        type: "updateGameStatus",
        status: "waitingCountDownChoose",
      }));
    },
    stopCountdown({ commit }) {
      commit("clearIntervalId");
    },
    closeWebSocket({ state }) {
      if (state.socket) {
        state.socket.close();
      }
    },
    initializeStore() {},
  },
});

export default store;
