<template>
  <div>
    <md-input-container>
      <md-input>Username</md-input>
      <md-input>Password</md-input>
      <md-button @click="start_login">Login</md-button>
    </md-input-container>
  </div>
</template>

<script>
  export default {
    name: 'login',
    methods: {
      start_login() {
        this.$store.commit('shell/set_user', {username: 'bob'})
        this.$router.push('select_instance')
      }
    }
  }
</script>
