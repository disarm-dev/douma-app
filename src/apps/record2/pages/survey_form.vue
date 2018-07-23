<template>
  <div>
    <h1>create_or_update: {{response_id ? response_id : 'new'}}</h1>
    <span>State: {{survey_state}}</span>
    <span>Page: {{survey_page}}</span>
    <md-button
        v-for="page in visible_pages"
        :key="page.name"
        @click="jump_page(page)"
    >{{page.name}}
    </md-button>
    <md-button
        class="md-warn md-raised"
        @click="log_errors"
    >log errors
    </md-button>
    <md-button
        class="md-primary md-raised"
        :disabled="list_errors.length > 0"
        @click="complete"
    >Complete
    </md-button>
    <survey v-if='survey_form' :survey="survey_form"></survey>
  </div>
</template>

<script>
  import {get} from 'lodash'
  import {Survey, Model} from 'survey-vue'

  import 'survey-vue/survey.css'

  export default {
    name: 'survey_form',
    components: {Survey},
    props: {
      response_id: Object,
    },
    data() {
      return {
        survey_form: null,
      }
    },
    computed: {
      survey_state() {
        return get(this.survey_form, 'state', 'not loaded')
      },
      survey_page() {
        return 1
      },
      visible_pages() {
        return get(this.survey_form, 'visiblePages', [])
      },
      list_errors() {
        if (!this.survey_form) return []
        const questions = this.survey_form.getAllQuestions()
        return questions
          .map(q => {
            q.checkForErrors();
            return q.getAllErrors()
          })
          .filter(a => a.length)
      }
    },
    mounted() {
      const surveyJSON = {
        title: 'Tell us, what technologies do you use?', pages: [
          {
            name: 'Frontend',
            questions: [
              {
                type: 'radiogroup',
                choices: ['Yes', 'No'],
                isRequired: true,
                name: 'frameworkUsing',
                title: 'Do you use any front-end framework like Bootstrap?'
              },
              {
                type: 'checkbox',
                choices: ['Bootstrap', 'Foundation'],
                hasOther: true,
                isRequired: true,
                name: 'framework',
                title: 'What front-end framework do you use?',
                visibleIf: '{frameworkUsing} = \'Yes\''
              }
            ]
          },
          {
            name: 'MVMM',
            questions: [
              {
                type: 'radiogroup',
                choices: ['Yes', 'No'],
                isRequired: true,
                name: 'mvvmUsing',
                title: 'Do you use any MVVM framework?'
              },
              {
                type: 'checkbox',
                choices: ['AngularJS', 'KnockoutJS', 'React'],
                hasOther: true,
                isRequired: true,
                name: 'mvvm',
                title: 'What MVVM framework do you use?',
                visibleIf: '{mvvmUsing} = \'Yes\''
              }]
          },
          {
            name: 'comments',
            questions: [
              {
                type: 'comment',
                name: 'about',
                title: 'Please tell us about your main requirements for Survey library'
              }]
          }
        ]
      }
      const options = {
        showNavigationButtons: false,
        checkErrorsMode: 'onValueChanged',
      }
      const sm = new Model({...surveyJSON, ...options})
      this.survey_form = sm
      window.s = sm
      this.survey_form.onComplete.add(() => console.log('completed survey'))
    },
    methods: {
      jump_page(page) {
        this.survey_form.currentPage = page
      },
      complete() {
        this.survey_form.doComplete()
        console.log('complete survey with data:', this.survey_form.data)
      },
      log_errors() {
        console.log(this.list_errors)
      }
    }
  }
</script>

<style scoped>

</style>