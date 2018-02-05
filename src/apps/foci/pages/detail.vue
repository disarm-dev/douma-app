<template>
  <div class="detail-container">
    <span class="md-headline">I am the detail view. {{foci_id}}</span>
    <md-card class="form">
      <md-card-content>
        <form  v-if="case_cluster" @submit.stop.prevent="save_changes">
          <span class="md-title">Attributes</span>
          <div v-for="key in Object.keys(case_cluster)" v-if="!excluded_fields.includes(key)">
            <md-input-container>
              <label>{{key}}</label>
              <md-input v-model="case_cluster[key]"></md-input>
            </md-input-container>
          </div>
          <md-button type="submit" class="md-primary md-raised">Save changes</md-button>
        </form>
      </md-card-content>
    </md-card>

    <md-card class="map">
      <h1>map</h1>
    </md-card>

  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'detail',
    props: {
      foci_id: String,

    },
    data() {
      return {
        case_cluster: null,
        excluded_fields: ['id', 'geometry']
      }
    },
    computed: {},
    mounted() {
      const case_cluster = this.$store.state.foci.case_clusters.find(case_cluster => case_cluster.id === this.foci_id)
      this.case_cluster = case_cluster
    },
    methods: {
      save_changes() {
        console.log('saving changes....')
      }
    }
  }
</script>

<style scoped>
  .detail-container {
    margin: 2em 1em;
  }

  .form {
    max-width: 600px;
    margin: 1em auto;
  }

  .map {
    background-color: grey;

    width: 80%;
    margin: 0 auto;
    height: 800px;

    justify-content: center;
    align-items: center;
  }
</style>