<template>
  <div>
    <md-button v-if="sw_update_downloading" @click='dismiss_downloading_notification' class="md-raised md-primary">
      Update downloading
    </md-button>
    <md-button v-if="sw_update_available" @click="reload" class="md-raised md-accent">
      Update available
    </md-button>

    <!-- OFFLINE , TRY RECONNECT-->
    <md-button v-if="!online" @click="try_reconnect" class="md-icon-button md-dense md-warn">
      <md-icon>signal_wifi_off</md-icon>
    </md-button>

    <!--HELP ICON-->
    <md-button class="md-icon-button md-dense" @click.native="show_help">
      <md-icon>help</md-icon>
    </md-button>

    <!-- Help -->
    <help></help>
  </div>
</template>

<script>
  import help from 'components/help.vue'

  export default {
    name: 'toolbar_controls',
    components: {help},
    props: {
      sw_update_downloading: {
        type: Boolean,
        default: 'false'
      },
      sw_update_available: {
        type: Boolean,
        default: 'false'
      },
      online: {
        type: Boolean,
        default: 'true'
      },
    },
    methods: {
      dismiss_downloading_notification() {
        console.log('dismiss_downloading_notification')
      },
      reload() {
        console.log('reload')
      },
      try_reconnect() {
        console.log('try_reconnect')
      },
      show_help() {
        this.$root.$emit('help:show')
      }
    }
  }
</script>

<style scoped>

</style>