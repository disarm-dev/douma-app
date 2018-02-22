<template>
  <div class="detail-container">
    <span class="md-headline title">I am the detail view. {{foci_id}}</span>
    <md-card class="form">
      <md-card-content>
        <form  v-if="case_cluster" @submit.stop.prevent="save_changes" id="attributes">
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

    <md-card class="map" id="map_container">
      
    </md-card>

  </div>
</template>

<script>
  import {case_cluster_schema} from '../lib/models/case_clusters/schema'
  import {render_map, remove_map, add_polygon_layer, zoom_to_feature} from '../components/map'
  
  export default {
    name: 'detail',
    props: {
      foci_id: String
    },
    data() {
      return {
        map_id: 'map_container',
        excluded_fields: ['_id', 'geometry'],
        fields: [],
        case_cluster: null
      }
    },
    created() {
      this.create_fields_for_edit()
      this.case_cluster = this.get_case_cluster()
    },
    mounted() {
      this.render_map()
    },
    methods: {
      get_case_cluster() {
        if (this.$store.state.foci.case_clusters) {
          const case_cluster = this.$store.state.foci.case_clusters.find(case_cluster => case_cluster._id === this.foci_id)
          return case_cluster
        } else {
          return null
        }
      },
      save_changes() {
        this.$store.dispatch('foci/update_case_cluster', this.case_cluster).then(res => {
          this.$store.commit('root:set_snackbar', {message: "Successfully updated case cluster."})
          // we should just update the layer, but this is way simpler for now and works reliably
          this.rerender_map()
        })
        .catch(err => {
          this.$store.commit('root:set_snackbar', {message: "Error updating case cluster."})
        })
      },
      create_fields_for_edit() {
        const excluded_fields = ['_id', 'geometry', 'updated_at', 'personalised_instance_id']
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
      },
      async render_map() {
        this.map = await render_map(this.map_id)
        const case_cluster_fc = await this.$store.dispatch('foci/get_case_cluster_fc', this.foci_id)
        add_polygon_layer(this.map, case_cluster_fc)
        zoom_to_feature(this.map, case_cluster_fc)
      },
      remove_map() {
        remove_map(this.map)
      },
      async rerender_map() {
       this.remove_map()
       await this.render_map()
      }
    }
  }
</script>

<style scoped>
  .detail-container {
    width: 80%;
    margin: 1em auto;
  }

  @media (max-width: 800px) {
    .detail-container {
      width: 100%;
    }

    .form {
      margin: 1em !important;
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
  }
</style>