<template>
  <router-view></router-view>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('foci/get_case_clusters')
  }
}
</script>
