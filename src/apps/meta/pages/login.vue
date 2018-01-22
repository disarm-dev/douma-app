<template>
  <div class='login'>

    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="login">
          <div>
            <md-icon class="login-icon">person</md-icon>
          </div>
          <p class="md-body-1 login-text">Welcome to {{instance_title}}</p>
          <p class="md-body-1 login-text login-error" v-if="error">{{error}}</p>
          <md-input-container>
            <label>Username</label>
            <md-input ref='username' v-model="user_details.username" required type="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input v-model="user_details.password" required type="password"></md-input>
          </md-input-container>

          <md-button class="md-accent md-raised login-button" :disabled='login_disabled || !can_login' type="submit">Login</md-button>
        </form>

     </md-card-content>
    </md-card>

    <custom_api_url></custom_api_url>

    <p>
      Version: {{commit_hash}}
      <span
        class='local_personalised_instance_id'
        @click="open_personalised_instance_id"
      >
        <span v-if="local_personalised_instance_id !== 'default'">{{local_personalised_instance_id}}</span>
        <md-icon :class="{'md-warn': local_personalised_instance_id !== 'default'}">local_laundry_service</md-icon>
      </span>
    </p>


    <md-dialog-prompt
      md-title="Generate or enter a personalised instance ID"
      md-content="Please only change this if you know what you're doing, e.g. for training or testing."
      md-ok-text="OK"
      md-cancel-text="Use default"
      @close="close_personalised_instance_id"
      v-model.trim="local_personalised_instance_id"
      ref="local_personalised_instance_id">
    </md-dialog-prompt>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {get} from 'lodash'
  import custom_api_url from '../components/custom_api_url.vue'
  import {generate_personalised_instance_id} from 'lib/debug/personalised_instance_id_generator'
  import BUILD_TIME from 'config/build-time'

  export default {
    components: {custom_api_url},
    data() {
      return {
        error: '',
        login_disabled: false,
        user_details: {
          username: '',
          password: ''
        },
        raw_local_personalised_instance_id: '',
      }
    },
    computed: {
      ...mapState({
        instance_title: state => state.instance_config.instance.title,
      }),
      can_login() {
        return this.user_details.username.length !== 0 && this.user_details.password.length !== 0
      },
      commit_hash() {
        return BUILD_TIME.VERSION_COMMIT_HASH_SHORT
      },
      local_personalised_instance_id: {
        get() { return this.raw_local_personalised_instance_id },
        set(value) { this.raw_local_personalised_instance_id = value.replace(/\s/g,'-') },
      }
    },
    mounted() {
      this.raw_local_personalised_instance_id = this.$store.state.meta.personalised_instance_id
      if (this.$store.state.meta.user) {
        this.$router.push('/')
      }
      this.$nextTick(() => {
        // sometimes this.$refs is not available
        if (!this.$refs.username) return
        this.$refs.username.$el.focus()
      })
    },
    methods: {
      open_personalised_instance_id() {
        if (this.local_personalised_instance_id === 'default') {
          this.local_personalised_instance_id = generate_personalised_instance_id()
        }
        this.$refs.local_personalised_instance_id.open()
      },
      close_personalised_instance_id(type) {
        if (type === 'cancel') {
          this.local_personalised_instance_id = 'default'
        }
      },
      valid_login_request() {
        if (!this.user_details.username) {
          this.error = "Please enter a username"
          return false
        }

        if (!this.user_details.password) {
          this.error = "Please enter a password"
          return false
        }

        return true
      },
      login() {
        this.$startLoading('meta/login')
        this.error = ""

        if (!this.valid_login_request()) return

        this.login_disabled = true


        const login_details = {
          username: this.user_details.username,
          password: this.user_details.password,
          personalised_instance_id: this.local_personalised_instance_id
        }

        this.$store.dispatch('meta/login', login_details).then(() => {
          this.$ga.set("user", `${this.$store.state.meta.user.username}/${this.$store.state.meta.user.name}`)
          this.$endLoading('meta/login')
          this.login_disabled = false
          this.continue()
        })
        .catch(e => {
          this.$endLoading('meta/login')
          this.login_disabled = false

          // 401 from server
          if (e.response && e.response.status === 401) {
            return this.error = e.response.data.message
          }

          // Anything with an error property
          if (e.error) {
            return this.error = e.error
          }

          // Some other error, best to log it out and take a look
          console.log(e)
          this.error = 'Sorry, cannot login. Network error. Please retry.'
        })

      },
      continue() {
        const next_path = this.get_next_path()
        this.$router.push(next_path)
      },
      get_next_path() {
        let next_path
        const allowed_read_apps = get(this.$store, 'state.meta.user.allowed_apps.read', [])

        if (allowed_read_apps.length === 1) {
          // Only have access to a single applet, go there.
          next_path = {name: allowed_read_apps[0]}
        } else if (this.$store.state.meta.previous_route) {
          // Multiple applets, previous_route set, go there.
          next_path = this.$store.state.meta.previous_route
        } else {
          // Multiple applets, no previous_route, head to root route.
          next_path = '/'
        }
        return next_path
      },
    }
  }
</script>

<style>
  .login {
    max-width: 500px;
    margin: 1em auto;
    padding: 0 0.5em;
  }

  .login-icon {
    margin: 0 auto;
    display: block;
    height: 50px;
    width: 50px;
    font-size: 50px;
  }

  .login-text {
    padding-top: 0.5em;
    text-align: center;
  }

  .login-error {
    color: red;
  }

  .login-button {
    margin: 0 auto;
    display: block;
  }

  .text-center {
    text-align: center;
  }

  .local_personalised_instance_id {
    float: right;
    color: #d4d4d4;
    cursor: pointer;
  }


</style>
