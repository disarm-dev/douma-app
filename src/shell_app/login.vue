<template>
  <div>
    Just login already, ok?
    <md-button class="md-primary" @click="do_login">Login</md-button>
  </div>
</template>

<script>
  export default {
    name: 'login',
    methods: {
      do_login() {
        this.$store.commit('set_user', {username: 'bob'})
        this.$router.push({name: 'shell:instance_configs'})
      }
    }
  }
</script>

<style scoped>

</style>