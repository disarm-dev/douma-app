<template>
  <div>
    Just login already, ok?
    <md-button class="md-primary" @click="$router.push({name: 'instance_configs'})">Login</md-button>
  </div>
</template>

<script>
  export default {
    name: 'login'
  }
</script>

<style scoped>

</style>