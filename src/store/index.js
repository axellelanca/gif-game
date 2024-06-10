// src/store/index.js

import { createStore } from 'vuex';

const store = createStore({
  state: {
    socket: null,
    pseudo: ''
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
    setPseudo(state, pseudo) {
      state.pseudo = pseudo;
    }
  },
  actions: {
    connectWebSocket({ commit, state }) {
      if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
        const socket = new WebSocket('ws://10.0.4.53:4000');

        socket.onopen = () => {
          console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
          console.log('WebSocket message received:', event);
        };

        socket.onclose = () => {
          console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        commit('setSocket', socket);
      }
    },
    sendMessage({ state }, message) {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.send(message);
      } else {
        console.error('WebSocket is not open');
      }
    },
    closeWebSocket({ state }) {
      if (state.socket) {
        state.socket.close();
      }
    }
  }
});

export default store;
