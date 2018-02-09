<template>
  <div>
    <div>
      <md-button @click="get_case_clusters">
        Get case clusters 
      </md-button>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    get_case_clusters() {
      this.$store.dispatch('foci/get_case_clusters')
    }
  }
}
</script>
