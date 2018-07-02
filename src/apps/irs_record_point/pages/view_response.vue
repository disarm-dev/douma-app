<template>
  <div class="applet_container">
    <md-card>
      <md-card-header>
        <div class="md-title">Submitted response review</div>
      </md-card-header>

      <md-card-content>
        <div v-for="section in sections">
          <h4>{{section}}</h4>
          <div v-if="isObject(flat_section(section))">
            <div v-for="(val, key) in flat_section(section)">
              {{key}}: {{val}}
            </div>
          </div>
          <div v-else>
            {{flat_section(section)}}
          </div>

        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import flatten from 'flat'
  import {isDate, isObject} from 'lodash'

  import {ResponseController} from 'lib/models/response/controller'

  const controller = new ResponseController('record')

  export default {
    name: 'view_response',
    props: {
      response_id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        response: null,
      }
    },
    computed: {
      sections() {
        if (!this.response) return [];
        return Object.keys(this.response);
      }
    },
    mounted() {
      this.set_response_by_id(this.response_id)
    },
    methods: {
      isObject: isObject,
      async set_response_by_id(response_id) {
        const personalised_instance_id = this.$store.state.meta.personalised_instance_id
        const instance = this.$store.state.instance_config.instance.slug

        const responses = await controller.read_all_cache({personalised_instance_id, instance})
        const found = responses.find(response => response.id === this.response_id)

        if (found) {
          this.response = found
        } else {
          console.error('No response found for id', this.response_id)
        }
      },
      flat_section(section) {
        if (!this.response || !section) return false

        const chunk = this.response[section]

        if (isObject(chunk) && !isDate(chunk)) {
          return flatten(chunk)
        } else if (isDate(chunk)) {
          return chunk.toLocaleString()
        } else {
          return chunk
        }
      }
    }
  }
</script>

<style scoped>
  h4 {
    margin-bottom: 0;
  }
</style>
