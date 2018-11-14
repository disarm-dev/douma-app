<template>
  <div class='profile'>
    <md-card>
      <md-card-content>
        <div>Hi <em>{{user.name}}</em>, you are logged in as <em>{{user.username}}</em>, with access to</div>

        <md-list>
          <md-list-item v-for='applet in decorated_applets' :key='applet.name' @click="$router.push({name: applet.name})">
            <md-icon>{{applet.icon}}</md-icon><span class="applet-item">{{applet.title}}</span>
          </md-list-item>

          <md-divider class="md-inset"></md-divider>

          <md-list-item @click="$router.push({name: 'meta:geodata'})">
            <md-icon>explore</md-icon><span class="applet-item">Geodata</span>
          </md-list-item>
        </md-list>

      </md-card-content>
    </md-card>

    <!--Licenses-->
    <a class="licenses_link " @click="openLicenseDialog()">Licenses</a>

    <!--Version commit hash-->
    <span class='version' style='cursor: pointer;' @click="toggle_debug_info">
      Version: {{commit_hash}} <br/>
      <span v-if="debug_info_visible">
        <p>Config: {{which_config}}</p>
        <p>UserAgent: {{userAgent}}</p>
        <p><a :href="bulk_download_url">Bulk download</a></p>
      </span>
    </span>


    <md-dialog-alert
        class="licenses_dialog"
        :md-title="license_text.title"
        :md-content="license_text.content"
        ref="license_dialog">
    </md-dialog-alert>



  </div>
</template>

<script>
  import axios from 'axios'
  import {mapGetters, mapState} from 'vuex'
  import {get} from 'lodash';

  import BUILD_TIME from 'config/build-time'
  import {get_api_url} from 'config/api_url'

  export default {
    name: 'home',
    data() {
      return {
        license_text: {
          title: 'Licenses',
          content: 'Loading license text...',
        },
        userAgent: get(navigator, 'userAgent', 'unknown'),
        debug_info_visible: false,
      }
    },
    computed: {
      ...mapGetters({
        decorated_applets: 'meta/decorated_applets'
      }),
      ...mapState({
        slug: state => state.instance_config.instance.slug,
        config_version: state => state.instance_config.config_version,
        personalised_instance_id: state => state.meta.personalised_instance_id,
        api_key: state => state.meta.user.key
      }),
      commit_hash() {
        return BUILD_TIME.VERSION_COMMIT_HASH_SHORT
      },
      user() {
        return this.$store.state.meta.user
      },
      which_config() {
        return `${this.slug}@${this.config_version}`
      },
      bulk_download_url() {
        return `${get_api_url()}/v7/download_records?country=${this.slug}&personalised_instance_id=${this.personalised_instance_id}&download_key=${this.api_key}`
      }
    },
    methods: {
      openLicenseDialog() {
        this.$refs['license_dialog'].open()
        this.load_license_text()
      },
      async load_license_text() {
        const response = await axios.get('/static/3rdpartylicenses.txt')
        this.license_text.content = response.data
      },
      toggle_debug_info() {
        this.debug_info_visible = !this.debug_info_visible;
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
    cursor: pointer;
  }

  .licenses_dialog {
    white-space: pre-wrap;
  }

  .version {
    color: #969696;
  }

</style>
