<template>
  <span>
    <md-card-header>
      <div class="md-subheading">
        <b>{{options.title}}</b>
      </div>
    </md-card-header>
    <md-card-content v-html="formatted_text">
    </md-card-content>
  </span>
</template>

<script>
  import showdown from 'showdown'

  export default {
    name: 'text-widget',
    props: ['chart_id', 'responses', 'targets', 'aggregations', 'options'],
    computed: {
      formatted_text() {
        const converter = new showdown.Converter({simpleLineBreaks: true})
        let makeHtml = converter.makeHtml(this.options.text)
        return makeHtml
      }
    }
  }
</script>

<style scoped>

</style>
