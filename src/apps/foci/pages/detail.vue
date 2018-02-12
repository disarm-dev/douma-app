<template>
  <div class="detail-container">
    <span class="md-headline title">I am the detail view. {{foci_id}}</span>
    <md-card class="form">
      <md-card-content>
        <form  v-if="case_cluster" @submit.stop.prevent="save_changes">
          <span class="md-title">Attributes</span>
          <div v-for="field in fields" :key="field.name">

            <md-input-container v-if="field.enum">
              <label for="movie">{{field.name}}</label>
              <md-select v-model="case_cluster[field.name]">
                <md-option v-for="value in field.enum" :value="value" :key="value">{{value}}</md-option>
              </md-select>
            </md-input-container>
            
            <md-input-container v-else>
              <label>{{field}}</label>
              <md-input v-model="case_cluster[field.name]" :type="field.type"></md-input>
            </md-input-container>

          </div>
          <md-button type="submit" class="md-primary md-raised" @click="save_changes">Save changes</md-button>
        </form>
      </md-card-content>
    </md-card>

    <md-card class="map">
      <h1>map</h1>
    </md-card>

  </div>
</template>

<script>
  import {case_cluster_schema} from '../lib/models/case_clusters/schema'

  export default {
    name: 'detail',
    props: {
      foci_id: String
    },
    data() {
      return {
        excluded_fields: ['_id', 'geometry'],
        fields: []
      }
    },
    computed: {
      case_cluster() {
        if (this.$store.state.foci.case_clusters) {
          const case_cluster = this.$store.state.foci.case_clusters.find(case_cluster => case_cluster._id === this.foci_id)
          return case_cluster
        } else {
          return null
        }
      }
    },
    created() {
      this.create_fields_for_edit()
    },
    methods: {
      save_changes() {
        this.$store.dispatch('foci/update_case_cluster', this.case_cluster).then(res => {
          console.log('res', res);
        })
        .catch(err => {
          console.log('err', err);
        })
        console.log('saving changes....')
      },
      create_fields_for_edit() {
        const excluded_fields = ['_id', 'geometry']
        const property_names = Object.keys(case_cluster_schema.properties)
        property_names.forEach(property_name => {
          if (excluded_fields.includes(property_name)) {
            return
          }

          const property = case_cluster_schema.properties[property_name]
          property.name = property_name

          if (property.type === 'string') {
            property.type = 'text'
          }

          this.fields.push(property)
        })
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