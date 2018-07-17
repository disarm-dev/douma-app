<template>
  <div class='container'>
    Returning to login/shell_app. Please wait...
  </div>
</template>

<script>

  export default {
    mounted() {
      this.$store.dispatch('meta/logout').then(() => {
        setTimeout(() => location.reload(), 1000)
      })
    }
  }
</script>

<style>
  
</style>
