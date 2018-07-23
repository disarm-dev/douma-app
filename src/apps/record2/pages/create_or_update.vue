<template>
  <div>
    <h1>create_or_update: {{response_id ? response_id : 'new'}}</h1>
    <span>State: {{survey_state}}</span>
    <span>Page: {{survey_page}}</span>
    <survey v-if='survey_form' :survey="survey_form"></survey>
  </div>
</template>

<script>
  import {get} from 'lodash'
  import {Survey, Model} from 'survey-vue'

  import 'survey-vue/survey.css'

  export default {
    name: 'create_or_update',
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
      }
    },
    mounted() {
      const surveyJSON = {
        title: 'Tell us, what technologies do you use?', pages: [
          {
            name: 'page1', questions: [
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
            name: 'page2', questions: [
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
            name: 'page3', questions: [
              {
                type: 'comment',
                name: 'about',
                title: 'Please tell us about your main requirements for Survey library'
              }]
          }
        ]
      }
      // window.j = surveyJSON
      const sm = new Model(surveyJSON)
      this.survey_form = sm
      this.survey_form.onComplete.add(() => console.log('completed survey'))
    }
  }
</script>

<style scoped>

</style>