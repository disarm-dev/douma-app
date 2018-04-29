<template>
  <div>
    <h3>Root for {{id}}</h3>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'root',
    props: ['id']
  }
</script>

<style scoped>

</style>
