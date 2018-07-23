<template>
  <div>
    <h1>show</h1>
    <span v-if="record_id">Record id: {{record_id}}</span>
    <span v-else>No record</span>
  </div>
</template>

<script>
  export default {
    name: 'show',
    props: {
      record_id: {
        type: String,
      },
    },
  }
</script>

<style scoped>

</style>