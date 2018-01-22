<template>
  <div class='record-container'>

    <div class="record-controls">
      <!--BACK TO LIST-->
      <md-button class="md-icon-button" @click="close_form">
        <md-icon v-if="response_id">arrow_back</md-icon>
        <md-icon v-else class="md-warn">delete</md-icon>
      </md-button>

      <!--VALIDATIONS CARD TOGGLE-->
      <md-button
        class="animated"
        :class="{orange: have_warnings, red: have_errors, 'md-raised': !show_validation_result, shake: shake_button}"
        :disabled="validation_result_empty"
        @click.native="toggle_show_validation_result"
      >

        <span v-if="!validation_result_empty">
          {{validation_result.errors.length + validation_result.warnings.length}}
        </span>

        {{ validation_result_empty ? "No validation issues" : (validation_length === 1 ? "Validation issue" :
        "Validation issues")}}
      </md-button>

    </div>

    <!-- CONFIRM CLOSE FORM -->
    <md-dialog-confirm
      md-title="Closing form - you will lose any changes"
      md-content-html="Do you want to continue?"
      md-ok-text="continue"
      md-cancel-text="cancel"
      @close="respond_to_close_form_confirm"
      ref="close_form_confirm">
    </md-dialog-confirm>


    <!--VALIDATION CARD-->
    <transition name="slide-fade">
      <md-card v-show="show_validation_result">
        <review
          ref="validation_result"
          :validations='validation_result'
          :survey="survey"
          v-on:show_location="go_back_to_location_view"
        ></review>
        <md-card-actions>
          <md-button @click.native="show_validation_result = false">Hide</md-button>
        </md-card-actions>
      </md-card>
    </transition>


    <!-- METADATA EDITOR (PAGE 1)-->
    <md-card v-show="current_view === 'metadata'">
      <md-card-content>
        <md-card-header>
          <div class="md-title">Metadata</div>
        </md-card-header>
        <md-list>
          <!-- REQUIRED METADATA FIELDS-->
          <md-list-item>
            <md-input-container :class="{'md-input-invalid': response.username !== username}">
              <label>username</label>
              <md-input v-model="response.username"></md-input>
              <span v-if="response.username !== username" class="md-error">Note username changed</span>
            </md-input-container>
            <md-input-container :class="{'md-input-invalid': response.user_id !== user_id}">
              <label>user ID</label>
              <md-input v-model="response.user_id"></md-input>
              <span v-if="response.user_id !== user_id" class="md-error">Note user ID changed</span>
            </md-input-container>
          </md-list-item>
          <md-list-item>
            <md-input-container>
              <label>Date recorded on</label>
              <md-input disabled type='text' v-model="formatted_recorded_on"></md-input>
            </md-input-container>

          </md-list-item>

          <!-- OPTIONAL FIELDS -->
          <md-list-item v-for="field in optional_fields" :key="field">
            <md-input-container>
              <label>{{field}}</label>
              <md-input v-model.lazy="response[field]" @change="field_changed(field)"></md-input>
            </md-input-container>
          </md-list-item>
        </md-list>

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="go_to_next_view()" class="md-raised">Next</md-button>
      </md-card-actions>
    </md-card>

    <!--LOCATION CARD (PAGE 2)-->
    <md-card v-show="current_view === 'location'" class='location'>
      <md-card-content>
        <md-card-header>
          <div class="md-title">Location</div>
        </md-card-header>

        <location_coords
          @change='on_location_change'
          :initial_location='response.location.coords'
        ></location_coords>

        <location_selection
          @change="on_location_selection_change"
          :initial_location_selection="response.location.selection"
        >
        </location_selection>

      </md-card-content>
      <md-card-actions>
        <md-button v-if="current_index !== 0" @click.native="go_to_previous_view()" class="md-raised">Previous
        </md-button>
        <md-button @click.native="go_to_next_view()" class="md-raised">Next</md-button>
      </md-card-actions>
    </md-card>


    <!--FORM-->
    <form_renderer
      v-show="current_view === 'form'"
      ref="form"
      @complete='on_form_complete'
      @change="on_form_change"
      @previous_view="go_to_previous_view()"
      :initial_form_data='response.form_data'
      :response_is_valid="response_is_valid"
      :validations='validation_result'
      :current_view="current_view"
    ></form_renderer>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {Response} from 'lib/models/response/model'
  import {Validator} from 'lib/models/response/validations/validations'

  import location_coords from './location_coords.vue'
  import location_selection from './location_selection'
  import review from './validation.vue'
  import form_renderer from './form.vue'


  export default {
    name: 'Record',
    components: {location_coords, location_selection, form_renderer, review},
    props: ['response_id'],
    data() {
      return {
        // User data
        not_response_response: null, // This is the only response which exists

        // Support
        _validator: null,
        survey: null, // TODO: @refac Should only be in one place, currently created on form_renderer

        // Validation result will return object looking like this:
        validation_result: {
          errors: [],
          warnings: []
        },
        show_validation_result: false,
        show_location: false,

        // UI
        shake_button: false,
        pages: ['metadata', 'location', 'form'],
        current_view: 'metadata'
      }
    },
    watch: {
      'validation_length': 'shake_validations'
    },
    computed: {
      ...mapState({
        username: state => state.meta.user.username,
        user_id: state => state.meta.user._id,
        instance_slug: state => state.instance_config.instance.slug,
        personalised_instance_id: state => state.meta.personalised_instance_id,
        instance_config: state => state.instance_config,
        team_name: state => state.irs_record_point.team_name
      }),
      formatted_recorded_on() {
        return this.response.recorded_on + ""
      },
      response() {
        return this.not_response_response ? this.not_response_response.model : {location: {}}
      },
      page_title() {
        return this.response_id ? 'Update' : 'Create'
      },
      response_is_valid() {
        return (this.validation_result.errors.length === 0)
      },
      validation_result_empty() {
        return (this.validation_result.errors.length === 0) && (this.validation_result.warnings.length === 0)
      },
      location_is_valid() {
        return this.validation_result.errors.filter(e => e.is_location).length === 0
      },
      have_errors() {
        return this.validation_result.errors.length
      },
      have_warnings() {
        return this.validation_result.warnings.length
      },
      validation_length() {
        return this.validation_result.errors.length + this.validation_result.warnings.length
      },
      current_index() {
        const current_index = this.pages.findIndex(page_name => {
          return page_name === this.current_view
        })
        return current_index
      },
      irs_record_point_config() {
        return this.instance_config.applets.irs_record_point
      },
      optional_fields() {
        return this.instance_config.applets.irs_record_point.metadata.optional_fields
      }
    },
    async created() {
      await this.$store.dispatch('irs_record_point/read_records')
      this._validator = new Validator(this.instance_config.validations)
      if (this.response_id) {
        /*
          found becomes undefined if this.$store.dispatch('irs_record_point/read_records') is not awaited
         */
        const found = this.$store.state.irs_record_point.responses.find(r => r.id === this.response_id)
        if (found.uneditable) {
          return this.$router.replace({name: 'irs_record_point:view', params: {response_id: this.response_id}})
        } else {
          this.not_response_response = new Response(found)
        }
      } else {
        // TODO: @refac Definitely don't do this in here...
        const empty_response = {
          personalised_instance_id: this.personalised_instance_id,
          user_id: this.user_id,
          username: this.username,
          instance_slug: this.instance_slug,
          team_name: this.team_name // TODO: @refac Brittle: this needs to match what's set in `instance.json`
        }
        this.not_response_response = new Response(empty_response)
      }

      // Remove meta page if necessary
      if (this.irs_record_point_config.metadata.show === false) {
        this.pages.splice(0, 1)
      }

      this.current_view = this.pages[0]
    },
    mounted() {

    },
    methods: {
      go_to_next_view() {
        // Check that we are not on the last page
        const can_go_to_next_page = (this.pages.length - 1) > this.current_index

        if (can_go_to_next_page) {
          const next_page = this.pages[this.current_index + 1]

          if (next_page === 'form') {
            this.validate(this.response)
          }

          this.current_view = next_page
        }
      },
      go_to_previous_view() {
        // Check that we are not on the first page
        const can_go_to_previous_page = this.current_index !== 0

        if (can_go_to_previous_page) {
          this.current_view = this.pages[this.current_index - 1]
        }
      },
      go_back_to_location_view() {
        if (this.survey) {
          this.survey.currentPage = this.survey.pages[0]
        }
        const location_index = this.pages.findIndex(page => page === 'location')
        this.current_view = this.pages[location_index]
      },
      shake_validations(newVal, oldVal) {
        if (newVal > oldVal) {
          this.shake_button = !this.shake_button
          setTimeout(() => {
            this.shake_button = !this.shake_button
          }, 2000)
        }
      },
      toggle_show_validation_result() {
        this.show_validation_result = !this.show_validation_result
      },
      toggle_show_location() {
        this.show_location = !this.show_location
      },
      on_location_change(coords) {
        this.response.location.coords = coords
      },
      on_location_selection_change(location_selection) {
        this.response.location.selection = location_selection
      },
      on_form_change(survey) {
        this.response.form_data = survey.data
        this.survey = survey
        this.validate(this.response)
      },
      on_form_complete(survey) {
        this.on_form_change(survey)

        if (this.response_is_valid) {
          this.save_response()
        } else {
          console.log('No idea what we do here.')
        }
      },
      validate(response) {
        this.validation_result = this._validator.validate(response)
        if (this.validation_result_empty) this.show_validation_result = false

        // Events
        const non_location_errors = this.validation_result.errors.filter(r => !r.is_location).length
        if (non_location_errors) {
          this.$ga.event('irs_record', 'validation_issues', 'errors', this.validation_result.errors.map(r => r.name).join('.'))
        }
        if (this.validation_result.warnings.length) {
          this.$ga.event('irs_record', 'validation_issues', 'warning', this.validation_result.warnings.map(w => w.name).join('.'))
        }
      },
      save_response() {
        const decorated_response = this.not_response_response.decorate_for_sending()

        if (this.response_id) {
          this.update_response(decorated_response)
        } else {
          this.create_response(decorated_response)
        }
      },
      create_response(response) {
        this.$store.dispatch('irs_record_point/create_response_local', response).then(() => {
          this.$router.push('/irs/record_point/')
        })
      },
      update_response(response) {
        this.$store.dispatch('irs_record_point/update_response_local', response).then(() => {
          this.$router.push('/irs/record_point/')
        })
      },

      close_form() {
        // TODO: @refac Check for closing a record without saving in the router instead (and block page changes)
        if (this.response_id) {
          this.$router.push('/irs/record_point')
        } else {
          this.$refs.close_form_confirm.open()
        }
      },
      respond_to_close_form_confirm(type) {
        if (type === 'cancel') {
        } else {
          this.$router.push('/irs/record_point')
        }
      },
      field_changed(field) {
        // TODO: @refac Stop this being only able to do team_name!
        this.$store.commit('irs_record_point/set_team_name', this.response[field])
      }
    }
  }
</script>

<style lang="css" scoped>
  .record-container {
    margin: 0 auto;
    max-width: 760px;
  }

  .location {
    overflow: visible;
    z-index: 2;
  }

  .record-controls { /* Not related to controls component */
    margin: 10px;
  }

  .md-card {
    margin: 10px;
  }

  .orange {
    background-color: orange !important;
    color: white !important;
  }

  .red {
    background-color: red !important;
    color: white !important;
  }

  .green {
    background-color: green !important;
    color: white !important;
  }

  .slide-fade-enter-active {
    transition: all 1s ease;
  }

  .slide-fade-leave-active {
    transition: all 1s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-5px);
    opacity: 0;
  }

  /* From animate.css */
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }

  @keyframes shake {
    from, to {
      transform: translate3d(0, 0, 0);
    }

    10%, 30%, 50%, 70%, 90% {
      transform: translate3d(-10px, 0, 0);
    }

    20%, 40%, 60%, 80% {
      transform: translate3d(10px, 0, 0);
    }
  }

  .shake {
    background-color: orange !important;
    animation-name: shake;
  }

</style>
