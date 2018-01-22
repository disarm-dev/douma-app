<template>
  <div>
    <!--DOWNLOAD BUTTON -->
    <md-button
      @click.native="$store.dispatch('irs_record_point/guess_response_locations',responses)"
      class="md-dense"
      :disabled="disabled"
    >
      Guess locations
    </md-button>

    <span v-if="guessed_responses_length > 0">{{guessed_responses_length}} {{guessed_responses_length > 1 ? 'responses' : 'response'}} guessed</span>

  </div>
</template>

<script>
  export default {
    name: "guess-locations",
    props: ['responses'],
    computed: {
      disabled() {
        return this.responses.length === 0
      },
      guessed_responses_length() {
        return this.responses.filter(r => r.location.selection.is_guessed).length
      },
    }
  }
</script>

<style scoped>

</style>
