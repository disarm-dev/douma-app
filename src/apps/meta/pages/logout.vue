<template>
  <div class='container'>
    Returning to login/shell_app. Please wait...
  </div>
</template>

<script>

  import {slow_or_fast_boot} from '../../../shell_app/slow_or_fast_boot'

  export default {
    mounted() {
      this.$store.dispatch('meta/logout').then(() => {
        setTimeout(() => {
          // location.reload()
          slow_or_fast_boot({reset_instance: true})
        }, 1000)
      })
    }
  }
</script>

<style>
  
</style>
