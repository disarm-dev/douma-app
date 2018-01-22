<template>
  <div class='profile'>
    <md-card>
      <md-card-content>
        <div>Hi <em>{{user.name}}</em>, you are logged in as <em>{{user.username}}</em>, with access to</div>

        <md-list>
          <md-list-item v-for='applet in decorated_applets' :key='applet.name' @click="$router.push({name: applet.name})">
            <md-icon>{{applet.icon}}</md-icon><span class="applet-item">{{applet.title}}</span>
          </md-list-item>
        </md-list>

      </md-card-content>
    </md-card>

    <span>Version: {{commit_hash}}</span>
    <a class='licenses_link' href="/static/3rdpartylicenses.txt"><span>Licenses</span></a>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import BUILD_TIME from 'config/build-time'

  export default {
    name: 'home',
    computed: {
      ...mapGetters({
        decorated_applets: 'meta/decorated_applets'
      }),
      commit_hash() {
        return BUILD_TIME.VERSION_COMMIT_HASH_SHORT
      },
      user() {
        return this.$store.state.meta.user
      }   
    }
  }
</script>

<style scoped>
  .profile {
    max-width: 500px;
    margin: 0 auto;
    padding: 1em 0.5em;
  }

  .md-card {
    margin: 1em 0;
  }

  .profile-title {
    padding: 8px 16px;
  }

  .profile-text {
    padding-left: 16px;
  }

  .debug-info {
    color: rgba(0,0,0,.54);
  }

  .applet-item {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .licenses_link {
    float: right;
  }

</style>
