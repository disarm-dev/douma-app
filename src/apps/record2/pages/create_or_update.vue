<template>
  <h1>create_or_update: {{response_model ? response_model : 'new'}}</h1>
</template>

<script>
  export default {
    name: 'create_or_update',
    props: {
      response_model: Object,
    }
  }
</script>

<style scoped>

</style>