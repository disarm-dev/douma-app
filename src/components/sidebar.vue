<template>
  <md-sidenav class="md-left" ref="sidebar" v-if="user">
    <md-toolbar class="md-medium">
      <div class="md-toolbar-container">
        <h3>{{instance_title}}</h3>
      </div>

      <!--Status/top of sidebar: LOGGED-IN-->
      <div @click="navigate('meta:home')">Logged in: {{user.name}}</div>
      <div class="version"><em>Config Version</em> {{instance_config_version}}</div>
      <div class="version"><em>App Version</em> {{commit_hash}}</div>
      <div class="personalised-instance-id" v-if="personalised_instance_id !== 'default'">
        <em>Instance ID: {{personalised_instance_id}}</em>
        <md-icon :class="{'md-warn': personalised_instance_id !== 'default'}">local_laundry_service</md-icon>
      </div>
    </md-toolbar>

    <md-list>
      <!--Sidebar: LOGGED IN-->
      <template>
        <md-list-item v-for='applet in decorated_applets' :key='applet.name' @click="navigate(applet.name)">
          <md-icon>{{applet.icon}}</md-icon>
          <span class="applet-item">{{applet.title}}</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item @click="navigate('meta:home')">
          <md-icon>person</md-icon>
          <span>User</span>
        </md-list-item>

        <md-list-item class='md-primary' @click="show_help">
          <md-icon>help</md-icon>
          <span>Help</span>
        </md-list-item>

        <md-list-item class='md-accent' @click="navigate('meta:logout')">
          <md-icon>exit_to_app</md-icon>
          <span>Logout</span>
        </md-list-item>

      </template>
    </md-list>

  </md-sidenav>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import BUILD_TIME from 'config/build-time'

  export default {
    name: 'sidebar',
    props: ['show_sidebar'],
    data() {
      return {
        can_update: false
      }
    },
    computed: {
      ...mapState({
        config_version: state => state.instance_config.config_version,
        slug: state => state.instance_config.instance.slug,
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
      instance_config_version() {
        return `${this.slug}@${this.config_version}`
      }
    },
    watch: {
      'show_sidebar': 'show_hide_sidebar'
    },
    methods: {
      navigate(name) {
        this.$router.push({name})
        this.show_hide_sidebar()
      },
      show_hide_sidebar() {
        this.$refs.sidebar.toggle()
      },
      show_help() {
        this.$root.$emit('help:show')
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
