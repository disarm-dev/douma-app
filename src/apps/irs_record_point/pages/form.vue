<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Form</div>
    </md-card-header>

    <md-card-content>
      <survey :survey="survey"></survey>
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
  import * as SurveyVue from 'survey-vue'
  import 'survey-vue/survey.css'
  const Survey = SurveyVue.Survey
  window.s = SurveyVue

  import clonedeep from 'lodash.clonedeep'

  export default {
    name: 'form_renderer',
    components: {Survey},
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
        survey: {},
      }
    },
    computed: {
      form() { return this.$store.state.instance_config.form}
    },
    watch: {
      // 'response_is_valid': 'control_navigation',
      // 'current_view': 'control_navigation',
      // 'initial_form_data': 'create_form'
    },
    mounted() {
      this.create_form()
    },
    methods: {
      on_initial_response(rspns) {
        console.log('Initial Response', this.initial_form_data)
      },
      create_form(caller) {
        console.log('Create Form ',this.survey)
        // if(this.survey) return
        const form_options = {
          ...this.form,
          // goNextPageAutomatic: false,
          // showNavigationButtons: false,
        }

        this.survey = new SurveyVue.Model(form_options)
        // this.survey.onValueChanged.add(this.on_form_data_change)
        // this.survey.onCurrentPageChanged.add(this.on_page_change)
        //
        // if (this.initial_form_data !== null) {
        //   this.survey.data = clonedeep(this.initial_form_data)
        // }
      },
      on_form_data_change() { // Called from SurveyJS #onCurrentPageChanged
        this.$emit('change', this.survey) // For validations
        this.control_navigation()
      },
      on_page_change() { // Called from SurveyJS #onValueChanged
        this.control_navigation()
      },
      is_single_page_form() {
        return this.survey.isFirstPage && this.survey.isLastPage
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
        this.show_previous = !this.survey.isFirstPage
        this.show_back_to_location = !this.show_previous
      },

      // Next
      control_next_button_visibility() {
        this.show_next = !this.survey.isLastPage
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
          const question = this.survey.getQuestionByName(question_name)
          const page = this.survey.getPageByQuestion(question)

          const question_name_index = this.survey.pages.findIndex((survey_page) => {
            return survey_page.id === page.id
          })

          return question_name_index
        })

        // find last page with a VALIDATION error (good variable name!)
        const last_page_with_validation_error_index = Math.max(...question_page_indices)

        // get current page index, to compare with pages with errors
        const current_page_index = this.survey.pages.findIndex((survey_page) => {
          return this.survey.currentPage.id === survey_page.id
        })

        return (last_page_with_validation_error_index === current_page_index)
      },

      // Complete
      control_complete_button_visibility() {
        // Only interested in last page or single-page (most likely will never fail since we're checking
        // this already in #control_navigation)
        const neither_single_page_nor_last_page = !(this.is_single_page_form() || this.survey.isLastPage)
        if (neither_single_page_nor_last_page) return

        // No questions answered, don't validate until you start answering questions
        if (Object.keys(this.survey.data).length === 0) return

        // Check for errors
//        const some_errors = (this.survey.isCurrentPageHasErrors || !this.response_is_valid)
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
        this.survey.nextPage()
      },
      previous_page() {
        this.survey.prevPage()
      },
      complete() {
        // Cannot complete a single-page form with errors - we won't have checked until first time
        // 'complete' is clicked
        if (this.is_single_page_form() && this.survey.isCurrentPageHasErrors) return

        // If not a single_page_form, and you can click 'complete', then you're probably ok.
        if (this.survey.isCurrentPageHasErrors) return console.warn("Errors in (non single-page form), should not be able to click 'complete'")
        this.$emit('complete', this.survey)
      }
    }
  }
</script>

<style scoped>
  .md-card {
    margin: 10px;
  }
  #surveyContainer {
    font-size: 24px;
  }
</style>
