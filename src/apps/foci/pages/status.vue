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
      <md-card-actions class="responsive-card-actions">
        <md-button id="read_remote_clusters" @click="read_remote_clusters">Get remote</md-button>
        <md-button id="read_remote_clusters_count" @click="read_remote_case_clusters_count" class="md-primary">Get count</md-button>
        <md-button id="rerun_model" @click="rerun_model" class="md-primary">Rerun remote model</md-button>
      </md-card-actions>
    </md-card>
    
    <md-card  class="card">
      <md-card-header>
        <div class="md-title">Case_locations</div>
        <!-- <div class="md-subhead">Subtitle here</div> -->
      </md-card-header>
      <md-card-content>
        <p>There are {{case_locations_count}} case_locations on the remote server. </p>
        <p>There are {{case_locations.length}} case_locations currently saved on your device. </p>
      </md-card-content>
      <md-card-actions class="responsive-card-actions">
        <md-button id="read_remote_case_locations" @click="read_remote_case_locations">Get remote</md-button>
        <md-button id="read_remote_case_locations_count" @click="read_remote_case_locations_count" class="md-primary">Get count</md-button>
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
    case_locations() {
      const case_locations = this.$store.state.foci.case_locations
      if (case_locations && case_locations.length) {
        return case_locations
      } else {
        return []
      }
    },
    case_locations_count() {
      const case_locations_count = this.$store.state.foci.case_locations_count
      if (case_locations_count !== null) {
        return case_locations_count
      } else {
        return 'X'
      }
    },
  },
  methods: {
    // case_locations stuff
    read_remote_case_locations() {
      this.$store.dispatch('foci/get_case_locations')
    },
    read_remote_case_locations_count() {
      this.$store.dispatch('foci/get_case_locations_count')
    },

    // case clusters stuff
    rerun_model() {
      this.$store.dispatch('foci/run_model')
    },
    read_remote_clusters() {
      this.$store.dispatch("foci/get_case_clusters");
    },
    read_remote_case_clusters_count() {
      this.$store.dispatch('foci/get_case_clusters_count')
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
    margin: 1em 0;
  }

  @media screen and (max-width: 500px) {
    .responsive-card-actions {
      flex-direction: column;
      align-items: flex-end !important;
    }
  }
</style>

