<template>
  <div>
    <p>Case clusters: {{case_clusters.length}}</p>
    <p>Cases: {{cases.length}}</p>
  </div>
</template>
<script>
export default {
  computed: {
    case_clusters() {
      const case_clusters = this.$store.state.foci.case_clusters
      if (case_clusters && case_clusters.length) {
        return case_clusters
      } else {
        return []
      }
    },
    cases() {
      const cases = this.$store.state.foci.cases
      if (cases && cases.length) {
        return cases
      } else {
        return []
      }
    }
  }
}
</script>

