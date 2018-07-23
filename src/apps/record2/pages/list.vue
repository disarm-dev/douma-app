<template>
  <div>
    <h1>list</h1>
    <h4>existing records</h4>
    <ul v-if="records.length > 0">
      <li></li>
    </ul>
    <span v-else>No records</span>
  </div>
</template>

<script>
  export default {
    name: 'list',
    data() {
      return {
        records: []
      }
    },
  }
</script>

<style scoped>

</style>