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

          <md-input-container>
            <label>Username</label>
            <md-input v-model='username' ref='username' required type="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input v-model="password" required type="password"></md-input>
          </md-input-container>

          <md-button class="md-accent md-raised login-button"
                     :disabled="$loading.isLoading('shell:login') || !can_login"
                     type="submit">
            Login
          </md-button>
        </form>

      </md-card-content>
    </md-card>
  </div>
</template>

<script>

  import Controller from 'shell_app/models/auth/controller'

  export default {
    data() {
      return {
        error: '',
        username: '',
        password: '',
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      can_login() {
        return this.username_valid && this.password_valid
      },
      username_valid() {
        return this.username.length > 0
      },
      password_valid() {
        return this.password.length > 0
      }
    },
    mounted() {
      this.$nextTick(() => this.$refs.username.$el.focus())

      if (this.user) {
        this.$router.push({name: 'shell:instance_configs'})
      }
    },
    methods: {
      validate_login_request() {
        if (!this.username_valid) {
          this.error = 'Please enter a username'
          return false
        }

        if (!this.password_valid) {
          this.error = 'Please enter a password'
          return false
        }

        return true
      },
      login() {
        this.$loading.startLoading('shell:login')
        this.error = ''

        if (!this.validate_login_request()) return

        const credentials = {
          username: this.username,
          password: this.password,
        }

        Controller.login(credentials)
          .then((res) => {
            if (res.status === 200) {
              this.$store.commit('set_user', res.data)
              this.$router.push({name: 'shell:instance_configs'})
            } else {
              console.error('some error logging-in', res)
            }
            // dimension3 is the dimension we use for the user attribute we send to GA. Could refactor.
            // this.$ga.set('dimension3', `${this.$store.state.meta.user.username}/${this.$store.state.meta.user.name}`)
            this.$loading.endLoading('shell:login')
          })
          .catch(e => {
            this.$loading.endLoading('shell:login')

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
