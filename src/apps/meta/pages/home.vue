<template>
  <div class='profile'>
    <demo_create_fake_data v-if="show_demo_button"></demo_create_fake_data>

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

    <!--Licenses-->
    <a class="licenses_link " @click="openLicenseDialog()">Licenses</a>

    <!--Version commit hash-->
    <span class='version' style='cursor: pointer;' @click="toggle_debug_info">
      Version: {{commit_hash}} <br/>
      <span v-if="debug_info_visible">
        <p>Config ID: {{config_id}}</p>
        <p>Instance ID: {{instance_id}}</p>
        <p>UserAgent: {{userAgent}}</p>
        <p><a :href="bulk_download_url" target="_blank">Bulk download</a></p>
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
  import {__is_a_demo} from 'config/demo_config'
  import demo_create_fake_data from 'components/demo_create_fake_data'
  import {ResponseController} from 'lib/models/response/controller'

  const response_controller = new ResponseController('record')

  export default {
    name: 'home',
    components: {demo_create_fake_data},
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
        instance_id: state => state.instance_config.instance_id,
        instance_config: state => state.instance_config,
        config_id: state => state.instance_config._id,
        personalised_instance_id: state => state.meta.personalised_instance_id,
        api_key: state => state.meta.user.key
      }),
      commit_hash() {
        return BUILD_TIME.VERSION_COMMIT_HASH_SHORT
      },
      user() {
        return this.$store.state.meta.user
      },
      api_url() {
        return this.$store.state.api_url;
      },
      bulk_download_url() {
        return `${this.api_url}/download_records` +
          `?personalised_instance_id=${this.personalised_instance_id}` +
          `&download_key=${this.api_key}&instance_id=${this.instance_id}`
      },
      show_demo_button() {
        return __is_a_demo
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
