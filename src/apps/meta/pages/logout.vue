<template>
</template>

<script>

  import {main_or_shell} from '../../../shell_app/main_or_shell'

  export default {
    mounted() {
      this.$store.dispatch('meta/logout').then(() => {
        setTimeout(() => {
          main_or_shell({forget_instance: true})
        }, 1000)
      })
    }
  }
</script>

<style>
  
</style>
