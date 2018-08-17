<template>
  <div class='container'>
    Returning to login/shell_app. Please wait...
  </div>
</template>

<script>

  import {launch_shell_app} from '../../../shell_app/launch_shell_app'

  export default {
    mounted() {
      this.$store.dispatch('meta/logout').then(() => {
        setTimeout(() => {
          // location.reload()
          launch_shell_app()
        }, 1000)
      })
    }
  }
</script>

<style>
  
</style>
