<template>
  <div>
    <!-- SNACKBAR -->
    <md-snackbar md-position="top center" ref="snackbar" :md-duration="snackbar.duration">
      <span>{{snackbar.message}}</span>
      <md-button class="md-accent" @click.native="snackbar_action">OK</md-button>
    </md-snackbar>

    <!-- ANOTHER SNACKBAR, controlled by $root events instead -->
    <!-- Calling it 'toast' to differentiate -->
    <md-snackbar md-position="top center" ref="toast" :md-duration="toast_duration">
      <span>{{toast_message}}</span>
      <md-button class="md-accent" @click.native="close_toast">OK</md-button>
    </md-snackbar>

    <!--ServiceWorker message DIALOG -->
    <md-dialog ref="sw_dialog">
      <md-dialog-title>{{sw_message.title}}</md-dialog-title>
      <md-dialog-content>{{sw_message.message}}</md-dialog-content>
      <md-dialog-actions>
        <md-button @click.native="close_sw_dialog">OK</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {get} from 'lodash'

  export default {
    name: 'notifications',
    data() {
      return {
        toast_message: '',
        toast_duration: 7000,
      }
    },
    computed: {
      ...mapState({
        sw_message: state => state.sw_message,
        snackbar: state => ({ ...state.snackbar, duration: 7000}),
      }),
    },
    watch: {
      'snackbar': function () {
        if (this.snackbar.message) {
          this.$refs.snackbar.open()
        }
      },
      'sw_message': function () {
        if (this.sw_message.message) {
          this.$refs.sw_dialog.open()
        }
      },
    },
    mounted() {
      this.$root.$on('notify:toast', (message_object) => {
        this.toast_message = get(message_object, 'message', message_object)
        this.$refs.toast.open()
      })
    },
    methods: {
      // Dialog
      close_sw_dialog() {
        this.$refs.sw_dialog.close()
      },
      // Snackbar
      snackbar_action() {
        this.$refs.snackbar.close()
      },
      // Alt snackbar/toast
      close_toast() {
        this.$refs.toast.close()
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
