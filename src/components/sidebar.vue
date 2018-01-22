<template>
  <md-sidenav class="md-left" ref="sidebar">
    <md-toolbar class="md-medium">
      <div class="md-toolbar-container">
        <h3>{{instance_title}}</h3>
      </div>

      <!--Status/top of sidebar: LOGGED-IN-->
      <div v-if="user">
        <p @click="navigate('meta:home')">Logged in: {{user.name}}</p>
        <p><em>Version {{commit_hash}}</em></p>
        <p v-if="personalised_instance_id !== 'default'">
          <em>Instance ID: {{personalised_instance_id}}</em>
          <md-icon :class="{'md-warn': personalised_instance_id !== 'default'}">local_laundry_service</md-icon>
        </p>
      </div>

      <!--Status/top of sidebar: LOGGED-OUT-->
      <div v-else>
        <p>Nope, not logged in.</p>
        <p><em>Version {{commit_hash}}</em></p>
      </div>
    </md-toolbar>

    <!--Sidebar: LOGGED IN-->
    <md-list v-if="user">
      <md-list-item v-for='applet in decorated_applets' :key='applet.name' @click="navigate(applet.name)">
        <md-icon>{{applet.icon}}</md-icon><span class="applet-item">{{applet.title}}</span>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>

      <md-list-item @click="navigate('meta:home')">
        <md-icon>person</md-icon><span>User</span>
      </md-list-item>

      <md-list-item class='md-primary' @click="toggle_help">
        <md-icon>help</md-icon><span>Help</span>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>

      <md-list-item class='md-accent' @click="navigate('meta:logout')">
        <md-icon>exit_to_app</md-icon><span>Logout</span>
      </md-list-item>

      <md-list-item @click="check_for_update">
        <md-icon :class="{'md-warn': can_update}">refresh</md-icon><span>Check for update</span>
      </md-list-item>
    </md-list>

    <!--Sidebar: LOGGED OUT-->
    <md-list v-else>
      <md-list-item class='md-primary' @click="toggle_help">
        <md-icon>help</md-icon><span>Help</span>
      </md-list-item>

      <md-list-item class='md-accent' @click="navigate('meta:login')">
        <md-icon>exit_to_app</md-icon><span>Login</span>
      </md-list-item>
    </md-list>

  </md-sidenav>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {need_to_update} from 'lib/remote/check-application-version'
  import BUILD_TIME from 'config/build-time'
  export default {
    name: 'sidebar',
    data() {
      return {
        can_update: false
      }
    },
    computed: {
      ...mapState({
        instance_title: state => state.instance_config.instance.title,
        user: state => state.meta.user,
        personalised_instance_id: state => state.meta.personalised_instance_id
      }),
      ...mapGetters({
        decorated_applets: 'meta/decorated_applets'
      }),
      commit_hash() {
        return BUILD_TIME.VERSION_COMMIT_HASH_SHORT
      },
    },
    watch: {
      '$store.state.trigger_sidebar_visible_irrelevant_value': 'show_hide_sidebar'
    },
    methods: {
      navigate(name) {
        this.$router.push({name})
        this.$store.commit('root:toggle_sidebar')
      },
      show_hide_sidebar() {
        this.$refs.sidebar.toggle()
      },
      toggle_help() {
        this.$store.commit('root:trigger_help_visible')
      },
      check_for_update() {
        need_to_update().then(need_update => {
          if (need_update.status === 'CAN_UPDATE') {
            this.can_update = true
            this.$store.commit("root:set_sw_message", {
              title: `Updated version of DiSARM is available`,
              message: "You may need to reload TWICE to refresh and start using the newer version. " +
              "You may lose unsaved work. Click 'Cancel' and then save if you prefer."
            })
          }
        })
      }
    },
  }
</script>

<style scoped>
  .applet-item {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
