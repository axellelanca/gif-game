// src/store/index.js

import { createStore } from "vuex";

const store = createStore({
  state: {
    socket: null,
    pseudo: "",
    users: [],
    updatePhrase: null,
    gameStatus: "waiting",
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
    setUpdateRound(state, updateRound) {
      state.updateRound = updateRound;
    }
  },
  actions: {
    connectWebSocket({ commit, state }) {
      if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
        const socket = new WebSocket("ws://10.0.4.53:4000");

        socket.onopen = () => {
          console.log("WebSocket connected");
          if (state.pseudo && state.uuid) {
            const message = JSON.stringify({
              type: "join",
              pseudo: state.pseudo,
              status: "online",
              uuid: state.uuid,
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
            } else if (message.type === "updateRound") {
              commit("setUpdatePhrase", message.phrase);
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
    sendMessage({ state }, message) {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.send(message);
      } else {
        console.error("WebSocket is not open");
      }
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
