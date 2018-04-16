<template>
</template>

<script>
  export default {
    created() {
      this.$store.commit('shell/set_user', null)
      this.$router.push('/')
    }
  }
</script>

