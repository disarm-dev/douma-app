<template>
  <div class="detail-container">
    <span class="md-headline title">I am the detail view. {{foci_id}}</span>
    <md-card class="form">
      <md-card-content>
        <form  v-if="case_cluster" @submit.stop.prevent="save_changes">
          <span class="md-title">Attributes</span>
          <div v-for="key in fields_for_edit">
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
  export default {
    name: 'detail',
    props: {
      foci_id: String,

    },
    data() {
      return {
        case_cluster: null,
        excluded_fields: ['id', 'geometry'],
        fields_for_edit: []
      }
    },
    computed: {},
    created() {
      const case_cluster = this.$store.state.foci.case_clusters.find(case_cluster => case_cluster.id === this.foci_id)
      if (case_cluster) {
        this.case_cluster = case_cluster
        this.set_fields_for_edit(case_cluster)
      } else {

      }
    },
    methods: {
      save_changes() {
        console.log('saving changes....')
      },
      set_fields_for_edit(case_cluster) {
        const keys_without_excluded_keys = []
        const keys = Object.keys(case_cluster)
        keys.forEach(key => {
          if (!this.excluded_fields.includes(key)) {
            keys_without_excluded_keys.push(key)
          }
        })
        this.fields_for_edit = keys_without_excluded_keys
      }
    }
  }
</script>

<style scoped>
  .detail-container {
    width: 80%;
    margin: 1em auto;
    padding: 0 1em;
  }

  @media (max-width: 800px) {
    .detail-container {
      width: 100%;
    }
  }

  .title {
    margin: 1em 0;
  }

  .form {
    margin: 1em 0;
  }

  .map {
    height: 800px;

    /* Delete when real map */
    background-color: grey;
    justify-content: center;
    align-items: center;
  }
</style>