<template>
  <div>
    <!-- SNACKBAR -->
    <md-snackbar md-position="top center" ref="snackbar" :md-duration="snackbar.duration">
      <span>{{snackbar.message}}</span>
      <md-button class="md-accent" @click.native="snackbar_action">OK</md-button>
    </md-snackbar>

    <!--ServiceWorker message DIALOG -->
    <md-dialog ref="sw_dialog">
      <md-dialog-title>{{sw_message.title}}</md-dialog-title>
      <md-dialog-content>{{sw_message.message}}</md-dialog-content>
      <md-dialog-actions>
        <md-button @click.native="close_sw_dialog">Cancel</md-button>
        <md-button class="md-primary" @click.native="reload">Reload now</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'notifications',
    computed: {
      ...mapState({
        sw_message: state => state.sw_message,
        snackbar: state => ({ ...state.snackbar, duration: 7000}),
      }),
    },
    watch: {
      'snackbar': 'snackbar_open',
      'sw_message': 'open_sw_dialog',
    },
    methods: {
      // Dialog
      open_sw_dialog() {
        this.$refs.sw_dialog.open()
      },
      close_sw_dialog() {
        this.$refs.sw_dialog.close()
      },
      // Snackbar
      snackbar_open() {
        this.$refs.snackbar.open()
      },
      snackbar_action() {
        this.$refs.snackbar.close()
      },
      // Reload page
      reload() {
        location.reload()
      },
    }
  }
</script>

<style scoped>
  .center-spinner {
    display: block;
    margin: 0 auto;
  }
</style>
