// src/store/index.js

import { createStore } from "vuex";

const store = createStore({
  state: {
    socket: null,
    pseudo: "",
    users: [],
    gameStatus: "waiting",
    timestamp: null,
    countdown: 0,
    intervalId: null,
    phrase: {},
    selectedGifs: {},
    votes:[],
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
    decrementCountdown(state) {
      if (state.countdown > 0) {
        state.countdown--;
      }
    },
    setIntervalId(state, intervalId) {
      state.intervalId = intervalId;
    },
    clearIntervalId(state) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    },
    setPhrase(state, phrase) {
      state.phrase = phrase;
    },
    updatePhraseVotes(state, { phrase, votes }) {
      if (state.phrase[phrase]) {
        state.phrase[phrase] += votes;
      } else {
        state.phrase[phrase] = votes;
      }
    },
    setSelectedGifs(state, selectedGifs) {
      state.selectedGifs = selectedGifs;
    },
    setGifVote(state, { pseudo, gifUrl }) {
      if (!state.selectedGifs[pseudo]) {
        state.selectedGifs[pseudo] = {};
      }
      state.selectedGifs[pseudo].gifUrl = gifUrl;
    },
    setVotes(state, votes) {
      state.votes = votes;
    },
  },
  actions: {
    connectWebSocket({ commit, state }) {
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
            } else if (message.type === "roundUpdate") {
              commit("setPhrase", message.phrase); // Met à jour state.phrase avec les nouvelles phrases
            }else if (message.type === "selectedGifs") {
              commit("setSelectedGifs", message);
              store.dispatch('updateSelectedGifs', message.selectedGifs);
            }
            else if (message.type === "gifVote") {
              commit("setGifVote", {
                pseudo: message.pseudo,
                gifUrl: message.gifUrl
              });
            } else if (message.type === "updatePhraseVotes") {
              commit("updatePhraseVotes", {
                phrase: message.phrase,
                votes: message.votes,
              }); // Met à jour les votes d'une phrase spécifique
            } else if (message.type === "votes") {
              commit("setVotes", message.votes);
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
    startCountdown({ commit, state, dispatch }, initialValue = 10) {
      if (state.intervalId) {
        clearInterval(state.intervalId);
      }
      if (!state.timestamp) {
        console.error('Timestamp not initialized');
        return;
      }
      let countdown = Math.floor((state.timestamp + initialValue * 1000 - Date.now()) / 1000);
      countdown = Math.max(countdown, 0);

      commit("setCountdown", countdown);

      const intervalId = setInterval(() => {
        if (state.countdown > 1) {
          commit("decrementCountdown");
        } else {
          clearInterval(intervalId);
          commit('clearIntervalId');
          dispatch("handleCountdownComplete");
        }
      }, 1000);
      commit("setIntervalId", intervalId);
    },
    handleCountdownComplete({ commit, dispatch }) {
      commit("setGameStatus", "waiting");
      dispatch("sendMessage", JSON.stringify({
        type: "updateGameStatus",
        status: "waiting",
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
    setTimestamp({ commit }, timestamp) {
      commit("setTimestamp", timestamp);
    },
    updateSelectedGifs({ commit }, gifs) {
      commit('setSelectedGifs', gifs);
    },
    setVotes({ commit }, votes) {
      commit('setVotes', votes);
    },

    initializeStore() {},
  },
});

export default store;
