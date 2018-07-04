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

  export default {
    name: 'view_response',
    props: {
      response: {
        type: Object,
      },
    },
    computed: {
      sections() {
        if (!this.response) return [];
        return Object.keys(this.response);
      }
    },
    created() {
      if (!this.response) this.$router.push({name: 'irs_record_point'})
    },
    methods: {
      isObject: isObject,
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
