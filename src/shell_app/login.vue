<template>
  <div class='login'>

    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="login">
          <div>
            <md-icon class="login-icon">person</md-icon>
          </div>
          <p class="md-body-1 login-text">Welcome to DiSARM</p>
          <p class="md-body-1 login-text login-error" v-if="error">{{error}}</p>

          <md-input-container ref='username_c'>
            <label>Username</label>
            <md-input ref='username' required type="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input v-model="password" required type="password"></md-input>
          </md-input-container>

          <md-button class="md-accent md-raised login-button" :disabled='login_disabled || !can_login' type="submit">
            Login
          </md-button>
        </form>

      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {get} from 'lodash'

  import BUILD_TIME from 'config/build-time'

  export default {
    data() {
      return {
        error: '',
        login_disabled: false,
        username: '',
        password: ''
      }
    },
    computed: {
      can_login() {
        return this.username.length !== 0 && this.password.length !== 0
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.username.$el.focus()
      })
    },
    methods: {
      valid_login_request() {
        if (!this.username) {
          this.error = 'Please enter a username'
          return false
        }

        if (!this.password) {
          this.error = 'Please enter a password'
          return false
        }

        return true
      },
      login() {
        this.$loading.startLoading('meta/login')
        this.error = ''

        if (!this.valid_login_request()) return

        this.login_disabled = true


        const login_details = {
          username: this.username,
          password: this.password,
          personalised_instance_id: this.local_personalised_instance_id
        }

        this.$store.dispatch('meta/login', login_details).then(() => {
          // dimension3 is the dimension we use for the user attribute we send to GA. Could refactor.
          this.$ga.set('dimension3', `${this.$store.state.meta.user.username}/${this.$store.state.meta.user.name}`)
          this.$loading.endLoading('meta/login')
          this.login_disabled = false


          if (this.$store.state.meta.user.instance_slug === 'all' && BUILD_TIME.DOUMA_PRODUCTION_MODE && this.local_personalised_instance_id === 'default') {
            this.$refs['warn-personal-instance-id'].open();
            return
          }

          this.continue_login()
        })
          .catch(e => {
            this.$loading.endLoading('meta/login')
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
      logout() {
        this.$router.push({name: 'meta:logout'})
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
