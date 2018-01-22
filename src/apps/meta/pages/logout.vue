<template>
  <div class='logout'>

  </div>
</template>

<script>

  export default {
    mounted() {
      this.$store.dispatch('meta/logout').then(() => {
        this.$router.push('/')
      })
    }
  }
</script>

<style>
  
</style>
