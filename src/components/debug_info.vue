<template>
  <div>
    <p>Config ID: {{config_id}}</p>
    <p>Instance ID: {{instance_id}}</p>
    <p>Personalised instance id: {{personalised_instance_id}}</p>
    <p>API URL: {{api_url}}</p>
    <p>API key: {{api_key}}</p>
    <p>UserAgent: {{userAgent}}</p>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import {get} from 'lodash'

  export default {
    data() {
      return {
        userAgent: get(navigator, 'userAgent', 'unknown'),
      }
    },
    computed: {
      ...mapState({
        config_id: state => state.instance_config._id,
        instance_id: state => state.instance_config.instance_id,
        personalised_instance_id: state => state.meta.personalised_instance_id,
        api_key: state => state.meta.user.key,
        api_url: state => state.api_url,
      }),
    }
  };
</script>