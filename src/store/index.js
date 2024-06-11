// src/store/index.js

import { createStore } from 'vuex';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const store = createStore({
  state: {
    socket: null,
    pseudo: '',
    uuid: '',
    users: [] // Initialisez `users` en tant que tableau vide
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
    setPseudo(state, pseudo) {
      state.pseudo = pseudo;
      setCookie('pseudo', pseudo, 7);
    },
    setUUID(state, uuid) {
      state.uuid = uuid;
      setCookie('uuid', uuid, 7);
    },
    setUsers(state, users) {
      state.users = users;
    }
  },
  actions: {
    connectWebSocket({ commit, state }) {
      if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
        const socket = new WebSocket('ws://10.0.4.53:4000');

        socket.onopen = () => {
          console.log('WebSocket connected');
          if (state.pseudo && state.uuid) {
            const message = JSON.stringify({
              type: 'join',
              pseudo: state.pseudo,
              status: 'online',
              uuid: state.uuid
            });
            socket.send(message);
          }
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'userList') {
              commit('setUsers', message.users);
            }
            console.log('WebSocket message received:', message);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
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
    },
    initializeStore({ commit }) {
      const uuid = getCookie('uuid') || generateUUID();
      const pseudo = getCookie('pseudo') || '';
      commit('setUUID', uuid);
      commit('setPseudo', pseudo);
    }
  }
});

export default store;
