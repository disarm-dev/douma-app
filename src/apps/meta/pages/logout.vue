<template>
  <div class='container'>
    Returning to login/shell_app. Please wait...
  </div>
</template>

<script>

  import {main_or_shell} from '../../../shell_app/main_or_shell'

  export default {
    mounted() {
      this.$store.dispatch('meta/logout').then(() => {
        setTimeout(() => {
          // location.reload()
          main_or_shell({reset_instance: true})
        }, 1000)
      })
    }
  }
</script>

<style>
  
</style>
