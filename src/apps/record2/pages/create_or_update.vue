<template>
  <div>
    <h1>create_or_update: {{response_id ? response_id : 'new'}}</h1>
    <md-tabs>

      <md-tab id="MetadataCapture" md-label="Metadata">
        <metadata-capture></metadata-capture>
      </md-tab>

      <md-tab id="LocationCapture" md-label="Location">
        <location-capture></location-capture>
      </md-tab>

      <md-tab id="SurveyForm" md-label="Form">
        <survey-form></survey-form>
      </md-tab>

      <md-tab id="SubmitCheck" md-label="Check and Submit">
        <submit-check></submit-check>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
  import MetadataCapture from './components/metadata_capture'
  import LocationCapture from './components/location_capture'
  import SurveyForm from './components/survey_form'
  import SubmitCheck from './components/submit_check'

  export default {
    name: 'create_or_update',
    components: {MetadataCapture, LocationCapture, SurveyForm, SubmitCheck},
    props: {
      response_id: Object,
    },

  }
</script>

<style scoped>

</style>