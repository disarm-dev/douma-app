<template>
  <md-card>
    <md-card-content>
      <md-list>
        <md-list-item v-for="config in configurations" :key="config.config_id" @click="select_instance(config.config_id)">
          {{config.config_id}}@{{config.config_version}}
        </md-list-item>
      </md-list>
    </md-card-content>
  </md-card>
</template>

<script>
import {mapState} from 'vuex'
import {do_stuff_after_login_and_we_know_which_applets_you_are_allowed_to_use_but_first_we_need_to_select_an_instance} from 'config/configure_application'
export default {
  mounted() {
    this.$store.dispatch('meta/get_instances')
  },
  computed: {
    ...mapState({
      configurations: state => state.meta.configurations,
    })
  },
  methods: {
    select_instance(config_id) {
      console.log('select', config_id);
      do_stuff_after_login_and_we_know_which_applets_you_are_allowed_to_use_but_first_we_need_to_select_an_instance(config_id, this.$store, this.$router)
    }
  }
}
</script>

