<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Form</div>
    </md-card-header>

    <md-card-content>
      <div id="surveyContainer"></div>
    </md-card-content>

    <md-card-actions>
      <!--Only for first page, take you back to Location tab/page -->
      <md-button v-if="show_back_to_location" @click.native="$emit('previous_view')" class="md-raised">Previous
      </md-button>

      <!-- SurveyJS navigation proxies -->
      <md-button v-if="show_previous" @click.native="previous_page" class="md-raised">Previous</md-button>
      <md-button v-if="show_next" :disabled="next_disabled" @click.native="next_page" class="md-raised">Next</md-button>
      <md-button v-if="show_complete" :disabled="complete_disabled" @click.native="complete"
                 class="md-raised md-primary">Complete
      </md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
  import * as Survey from 'survey-knockout'
  import 'survey-knockout/survey.css'
  import clonedeep from 'lodash.clonedeep'

  export default {
    name: 'form',
    props: ['initial_form_data', 'response_is_valid', 'validations', 'current_view'],
    data() {
      return {
        // UI
        show_back_to_location: true,

        // SurveyJS navigation proxies
        show_previous: false,
        show_next: false,
        show_complete: false,

        next_disabled: true,
        complete_disabled: true,

        initialised_form: false,

        // Data
        initial_survey_data:{},
        _survey: {},
      }
    },
    watch: {
      'response_is_valid': 'control_navigation',
      'current_view': 'control_navigation',
      'initial_form_data': 'create_form'
    },
    mounted() {
    //  this.create_form('Mounted')
    },
    methods: {
      on_initial_response(rspns) {
        console.log('Initial Response', this.initial_form_data)
      },
      create_form(caller) {
        console.log('Create Form ',this._survey)
        if(this._survey) return
        const form_options = {
          ...this.$store.state.instance_config.form,
          goNextPageAutomatic: false,
          showNavigationButtons: false,
        }

        // KNOCKOUT
        this._survey = new Survey.Model(form_options, 'surveyContainer')
        this._survey.onValueChanged.add(this.on_form_data_change)
        this._survey.onCurrentPageChanged.add(this.on_page_change)

        if (this.initial_form_data !== null) {
          this._survey.data = clonedeep(this.initial_form_data)
        }
      },
      on_form_data_change() { // Called from SurveyJS #onCurrentPageChanged
        this.$emit('change', this._survey) // For validations
        this.control_navigation()
      },
      on_page_change() { // Called from SurveyJS #onValueChanged
        this.control_navigation()
      },
      is_single_page_form() {
        return this._survey.isFirstPage && this._survey.isLastPage
      },

      // Main entry point to control navigation
      control_navigation() {
        this.$nextTick(() => {
          // All buttons off and disabled
          this.reset_navigation()

          // Back to location or previous question
          this.control_previous_and_location_button_visibility()

          // Control next/complete buttons
          if (this.is_single_page_form()) {
            // No next buttons, so only interested in completing
            this.control_single_page_form_complete()
          } else {
            // Multipage form, so want a 'next'
            this.control_next_button_visibility()
            if (!this.show_next) this.control_complete_button_visibility()
          }

        })
      },
      reset_navigation() {
        // SurveyJS navigation proxies
        this.show_previous = false
        this.show_next = false
        this.show_complete = false

        this.next_disabled = true
        this.complete_disabled = true
      },
      control_previous_and_location_button_visibility() {
        this.show_previous = !this._survey.isFirstPage
        this.show_back_to_location = !this.show_previous
      },

      // Next
      control_next_button_visibility() {
        this.show_next = !this._survey.isLastPage
        if (this.show_next) this.control_next_button_disabled()
      },
      control_next_button_disabled() {
        this.next_disabled = this.current_page_is_furthest_page_with_errors()
      },
      current_page_is_furthest_page_with_errors() {
        // check if the current page is the furthest page which has a validation_error
        // you can go backwards to fix validation_errors, but not forwards past the last page
        // which currently has a validation_error

        // get names of all questions answered (from validations)
        const questions_answered_names = this.validations.errors
          .filter(error => !error.is_location)
          .reduce((questions_array, err) => {
            return questions_array.concat(err.questions)
          }, [])

        // get page indices for every page with an answered question
        const question_page_indices = questions_answered_names.map((question_name) => {
          const question = this._survey.getQuestionByName(question_name)
          const page = this._survey.getPageByQuestion(question)

          const question_name_index = this._survey.pages.findIndex((survey_page) => {
            return survey_page.id === page.id
          })

          return question_name_index
        })

        // find last page with a VALIDATION error (good variable name!)
        const last_page_with_validation_error_index = Math.max(...question_page_indices)

        // get current page index, to compare with pages with errors
        const current_page_index = this._survey.pages.findIndex((survey_page) => {
          return this._survey.currentPage.id === survey_page.id
        })

        return (last_page_with_validation_error_index === current_page_index)
      },

      // Complete
      control_complete_button_visibility() {
        // Only interested in last page or single-page (most likely will never fail since we're checking
        // this already in #control_navigation)
        const neither_single_page_nor_last_page = !(this.is_single_page_form() || this._survey.isLastPage)
        if (neither_single_page_nor_last_page) return

        // No questions answered, don't validate until you start answering questions
        if (Object.keys(this._survey.data).length === 0) return

        // Check for errors
//        const some_errors = (this._survey.isCurrentPageHasErrors || !this.response_is_valid)
        const some_errors = !this.response_is_valid

        if (some_errors) {
          // Last page, but with errors
          this.show_complete = true
          this.complete_disabled = true
        } else {
          // All good, complete!
          this.show_complete = true
          this.complete_disabled = false
        }
      },
      control_single_page_form_complete() {
        this.show_complete = true
        this.complete_disabled = !this.response_is_valid
      },

      // Do navigation
      next_page() {
        this._survey.nextPage()
      },
      previous_page() {
        this._survey.prevPage()
      },
      complete() {
        // Cannot complete a single-page form with errors - we won't have checked until first time
        // 'complete' is clicked
        if (this.is_single_page_form() && this._survey.isCurrentPageHasErrors) return

        // If not a single_page_form, and you can click 'complete', then you're probably ok.
        if (this._survey.isCurrentPageHasErrors) return console.warn("Errors in (non single-page form), should not be able to click 'complete'")
        this.$emit('complete', this._survey)
      }
    }
  }
</script>

<style scoped>
  .md-card {
    margin: 10px;
  }
</style>
