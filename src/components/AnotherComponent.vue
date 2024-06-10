<template>
  <div>
    <h1>Another Component</h1>
    <router-link to="/">Go back to PseudoForm</router-link>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['pseudo'])
  },
  methods: {
    ...mapActions(['connectWebSocket']),
  },
  mounted() {
    this.connectWebSocket();
    console.log('AnotherComponent mounted');
    console.log('Pseudo:', this.pseudo);
  }
};
</script>
