<template>
  <div>
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

      </md-toolbar>

    </div>
    <div>
      <sidebar :show_sidebar="show_sidebar"></sidebar>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {try_reconnect} from 'lib/remote/util'
  import sidebar from 'components/sidebar.vue'

  export default {
    name: 'toolbar',
    components: {sidebar},
    data() {
      return {
        update_chip_visible: false,
        show_sidebar: true
      }
    },
    computed: {
      ...mapState({
        instance_title: state => state.instance_config.instance.title,
        online: state => state.network_online,
        sw_update_available: state => state.sw_update_available,
        sw_update_downloading: state => {
          return state.sw_update_downloading
            && !state.sw_update_available
            && state.network_online
        },
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
    methods: {
      toggle_sidebar() {
        this.show_sidebar = !this.show_sidebar
      },
      // Help
      show_help() {
        this.$root.$emit('help:show')
      },
      try_reconnect() {
        try_reconnect()
      },
      reload() {
        console.log('trigger location.reload()')
        location.reload()
      },
      dismiss_downloading_notification() {
        this.$store.commit('root:set_sw_update_downloading', false)
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

