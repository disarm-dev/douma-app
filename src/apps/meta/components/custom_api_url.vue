<template>
  <md-card v-if="instance_allows_custom_api_url">
    <md-card-header>
      <div v-if="!show_api_url_config" @click="show_api_url_config = !show_api_url_config">API url: {{custom_api_url}}
        <md-icon>edit</md-icon>
      </div>
      <div v-if="show_api_url_config" @click="show_api_url_config = !show_api_url_config">Hide</div>
    </md-card-header>

    <md-card-content v-if="show_api_url_config">
      <div>Change the API Server URL if you've been given one and it's not already set below.</div>
      <md-input-container>
        <md-input v-model="custom_api_url"></md-input>

      </md-input-container>
      <md-button @click="save_custom_api_url" :disabled="save_disabled">Save new api URL</md-button>
      <md-button @click="reset_default_api_url" :disabled="reset_disabled">reset api URL</md-button>
    </md-card-content>
  </md-card>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'

  import CONFIG from 'config/common'
  import {remove_param, retrieve_stored_param, store_param} from 'lib/helpers/hash_params'

  const key = CONFIG.hash_params.API_URL

  export default {
    name: 'custom_api_url',
    mounted() {
    },
    data() {
      return {
        show_api_url_config: false,
        custom_api_url: retrieve_stored_param(key) || CONFIG.api.url
      }
    },
    computed: {
      ...mapState({
        instance_allows_custom_api_url: state => state.instance_config.instance.customisable_api_url
      }),
      save_disabled() {
        return this.custom_api_url === retrieve_stored_param(key) || this.custom_api_url === CONFIG.api.url
      },
      reset_disabled() {
        return this.custom_api_url === CONFIG.api.url
      },
    },
    methods: {
      save_custom_api_url() {
        if (this.custom_api_url === CONFIG.api.url) return
        console.log(this.custom_api_url)
        const key = CONFIG.hash_params.API_URL
        const value = this.custom_api_url
        store_param(key, value)
      },
      reset_default_api_url() {
        const key = CONFIG.hash_params.API_URL
        this.custom_api_url = CONFIG.api.url
        remove_param(key)
      }
    }
  }
</script>

<style scoped>
  .md-card {
    margin-top: 30px
  }
</style>