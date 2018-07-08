<template>
  <div class="container">

    <h4>Input</h4>
    <md-input-container>

      <label>Enter input string (Will convert to required JSON format)</label>
      <md-input v-model="input_string"></md-input>
    </md-input-container>

    <md-button :disable='model_running' @click="run_model">Run model</md-button>

    <h4>Output</h4>
    {{output}}
  </div>
</template>

<script>
  import Algorithmia from 'lib/algorithmia-0.2.0'

  export default {
    name: 'applet',
    data() {
      return {
        input_string: 'guy',
        output: '',
        model_running: false,
      }
    },
    computed: {
      input_json() {
        return {name: this.input_string}
      }
    },
    methods: {
      async run_model() {
        try {
          const client = Algorithmia.client('simnHu2YBsHV0/bHJQnkJi5aJ2N1');
          const res = await client.algo('locational/testalgo1').pipe(this.input_json)
          this.output = res.result
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
</script>

<style scoped>

</style>