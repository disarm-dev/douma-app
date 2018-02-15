<template>
  <div class="container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Case clusters</div>
        <!-- <div class="md-subhead">Subtitle here</div> -->
      </md-card-header>
      <md-card-content>
        <p>There are {{case_clusters_count}} case clusters on the remote server. </p>
        <p>There are {{case_clusters.length}} case clusters currently saved on your device. </p>
      </md-card-content>
      <md-card-actions>
        <md-button id="read_remote_clusters_count" @click="read_remote_case_clusters_count" class="md-primary">Get remote number of clusters</md-button>
        <md-button id="rerun_model" @click="rerun_model" class="md-primary">Rerun remote model</md-button>
      </md-card-actions>
    </md-card>
    
    <md-card  class="card">
      <md-card-header>
        <div class="md-title">Cases</div>
        <!-- <div class="md-subhead">Subtitle here</div> -->
      </md-card-header>
      <md-card-content>
        <p>There are {{cases_count}} cases on the remote server. </p>
        <p>There are {{cases.length}} cases currently saved on your device. </p>
      </md-card-content>
      <md-card-actions>
        <md-button id="read_remote_cases_count" @click="read_remote_cases_count" class="md-primary">Get remote number of cases</md-button>
      </md-card-actions>
    </md-card>
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
    case_clusters_count() {
      const case_clusters_count = this.$store.state.foci.case_clusters_count
      if (case_clusters_count !== null) {
        return case_clusters_count
      } else {
        return 'X'
      }
    },
    cases() {
      const cases = this.$store.state.foci.cases
      if (cases && cases.length) {
        return cases
      } else {
        return []
      }
    },
    cases_count() {
      const cases_count = this.$store.state.foci.cases_count
      if (cases_count !== null) {
        return cases_count
      } else {
        return 'X'
      }
    },
  },
  methods: {
    rerun_model() {
      // TODO: Rerun model here
    },
    read_remote_case_clusters_count() {
      this.$store.dispatch('foci/get_case_clusters_count')
    },
    read_remote_cases_count() {
      this.$store.dispatch('foci/get_cases_count')
    }
  }
}
</script>
<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
  }

  .card {
    margin-bottom: 1em;
  }
</style>

