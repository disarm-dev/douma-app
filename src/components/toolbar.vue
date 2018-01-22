<template>
  <div class="douma-toolbar">
    <md-toolbar class="md-whiteframe-1dp md-dense">
      <md-button class="md-icon-button" @click.native="toggle_sidebar">
        <md-icon>menu</md-icon>
      </md-button>

      <!-- BREADCRUMBS -->
      <h2 class="md-title" style="flex: 1">
          <!--Display custom applet header if exists -->
          <span v-if="current_applet_header">
            <md-icon>{{current_applet_header.icon}}</md-icon>
            {{current_applet_header.title}}
          </span>

          <span v-else>
            {{instance_title}}
          </span>
      </h2>

      <md-button v-if="update_chip_visible" @click="close_update_chip" class="md-raised md-accent">Update available</md-button>

      <!-- OFFLINE , TRY RECONNECT-->
      <md-button v-if="!online" @click="try_reconnect" class="md-icon-button md-dense md-warn">
        <md-icon>signal_wifi_off</md-icon>
      </md-button>

      <!--HELP ICON-->
      <md-button class="md-icon-button md-dense" @click.native="toggle_help_visible">
        <md-icon>help</md-icon>
      </md-button>

    </md-toolbar>

  </div>

</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {try_reconnect} from 'lib/remote/util'

  export default {
    name: 'toolbar',
    mounted() {
    },
    data() {
      return {
        update_chip_visible: false
      }
    },
    computed: {
      ...mapState({
        instance_title: state => state.instance_config.instance.title,
        online: state => state.network_online,
        sw_update_available: state => state.sw_update_available,
      }),
      ...mapGetters({
        decorated_applets: 'meta/decorated_applets',
      }),
      current_applet_header() {
        let current_applet_name
        if (this.$route.name) {
          current_applet_name = this.$route.name.split(':')[0]
        } else {
          return false
        }

        const found = this.decorated_applets.find(applet => applet.name === current_applet_name)
        if (found) {
          return found
        } else {
          return false // view will render the instance_title
        }
      }
    },
    watch: {
      'sw_update_available': 'show_update_chip'
    },
    methods: {
      toggle_sidebar() {
        this.$store.commit('root:toggle_sidebar')
      },
      // Help
      toggle_help_visible() {
        this.$store.commit('root:trigger_help_visible')
      },
      try_reconnect() {
        try_reconnect()
      },
      show_update_chip() {
        this.update_chip_visible = true
      },
      close_update_chip() {
        this.update_chip_visible = false
        this.$store.commit("root:set_sw_message", {
          title: `Updated version of DiSARM is available`,
          message: "Please click 'Reload' (or reload browser) to refresh and start using the newer version. " +
          "You may lose unsaved work. Click 'Cancel' and then save if you prefer."
        })
      }
    }
  }
</script>

<style scoped>
  .douma-toolbar {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 5;
  }

  .help_button {
    cursor: pointer;
  }

</style>

<style>
  .spinner svg circle {
    stroke: white !important;
  }

</style>

