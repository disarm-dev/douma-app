<template>
  <div>
    <md-button @click="read_records">Check</md-button>

    <div>{{responses_with_error.length}} records have an issue</div>

    <md-list>
      <virtual_list :size="40" :remain="10">
        <md-list-item
                v-for='response in responses_with_error'
                :index='response'
                :class="{'md-primary': !response.synced}"
                :key="response.id"
        >
          <md-icon>
            {{response.synced ? 'check' : 'mode_edit'}}
          </md-icon>
          <div>
            {{format_response(response)}}
            <a
                style="color: red"
                v-if="!response.hasOwnProperty('personalised_instance_id')"
                @click="fix_record(response)">Fix</a>

            <span v-else style="color: green">Fixed</span>
          </div>
        </md-list-item>
      </virtual_list>
    </md-list>

  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'
  import virtual_list from 'vue-virtual-scroll-list'
  import moment from "moment"
  import {get} from 'lodash'

  import Local from "lib/models/response/local"

  export default {
    name: 'fix_personalised_instance_id_record',
    components: {virtual_list},
    mounted() {
      this.local = new Local('record')
    },
    data() {
      return {
        responses_with_error: []
      }
    },
    methods: {
      async read_records() {
        const responses = await this.local.read_all()
        const responses_with_error = responses.filter(r => {
          return !r.hasOwnProperty('personalised_instance_id')
        })
        this.responses_with_error = responses_with_error
      },
      fix_record(record) {
        this.$set(record, 'personalised_instance_id', this.$store.state.meta.personalised_instance_id)
        this.local.update(record)
      },



      format_response(response) {
        const id = this.short_id(get(response, 'id', 'no id'))
        const location_name = get(response, 'location.selection.name', '')
        const ago = this.format_datetime_from_now(response.recorded_on)

        return `${ago} in ${location_name} (id: ${id})`
      },
      format_datetime_from_now(date) {
        return moment(date).fromNow()//format('hh:mm a DD MMM YYYY')
      },
      short_id(id) {
        return id.substring(0,5)
      }
    }
  }
</script>

<style scoped>

</style>