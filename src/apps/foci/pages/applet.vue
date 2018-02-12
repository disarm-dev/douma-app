<template>
  <div>
    <div>
      <md-button @click="get_local">
        Get local case clusters
      </md-button>

      <md-button @click="get_case_clusters">
        Get remote case clusters 
      </md-button>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    this.get_local()
  },
  methods: {
    get_case_clusters() {
      this.$store.dispatch('foci/get_case_clusters')
    },
    get_local() {
      this.$store.dispatch('foci/get_case_clusters_local')
    }
  }
}
</script>
