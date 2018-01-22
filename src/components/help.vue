<template>
  <keep-alive>
    <md-dialog ref="help" class="help">
      <md-dialog-title>Help</md-dialog-title>

      <md-dialog-content>
        <md-input-container>
          <label>Search</label>
          <md-input v-model="search_term"></md-input>
        </md-input-container>

        <div class='section' v-for="section in sections" :key="section">
          <h4>
            {{section}}
          </h4>
          <div
            class="item"
            v-for="{title, image, content, show_excerpt} in items_for_section(section)"
            :key="title"

          >
            <h5 v-if='show_excerpt' @click="toggle_show_excerpt(title, section)" class="item-header"><md-icon>expand_more</md-icon> {{title}}</h5>
            <h5 v-if='!show_excerpt' @click="toggle_show_excerpt(title, section)" class="item-header"><md-icon>expand_less</md-icon> {{title}}</h5>
            <div v-if="!show_excerpt" v-html="content"></div>
            <img v-if="!show_excerpt && image" :src="`/static/help_images/${image}`">
          </div>
          <hr>
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="close_dialog_help">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </keep-alive>
</template>

<script>
  import array_unique from 'array-unique'
  import Fuse from 'fuse.js'
  import showdown from 'showdown'

  const help_content = require("json-loader!yaml-include-loader!../help_articles/help.yaml")

  export default {
    name: 'help',
    data() {
      return {
        search_term: '',
        flat_help: []
      }
    },
    computed: {
      filtered_help_content() {
        if (this.search_term === '') return this.flat_help

        const options = {
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 2,
          keys: [
            {name: 'content', weight: 0.7},
            {name: 'title', weight: 0.2},
            {name: 'section_title', weight: 0.1}
          ]
        }
        const fuse = new Fuse(this.flat_help, options)

        return fuse.search(this.search_term)

      },
      sections() {
        return array_unique(this.filtered_help_content.map(c => c.section_title))
      },
    },
    watch: {
      '$store.state.trigger_help_visible_irrelevant_value': 'open_dialog_help',
    },
    created() {
      this.prepare_help_items()
    },
    methods: {
      open_dialog_help() {
        this.$refs.help.open()
        this.$ga.event('meta','trigger_help')
      },
      close_dialog_help() {
        this.$refs.help.close()
      },
      prepare_help_items() {
        const converter = new showdown.Converter()

        const section_titles = help_content.map(section => {
          return section.section_title
        })

        section_titles.forEach(section_title => {
          help_content.find(section => section.section_title === section_title).articles.forEach(article => {
            article.content = converter.makeHtml(article.content)
            article.section_title = section_title
            article.show_excerpt = true
            this.flat_help.push(article)
          })
        })
      },
      items_for_section(section_title) {
        return this.filtered_help_content.filter(c => c.section_title === section_title)
      },
      toggle_show_excerpt(title, section) {
        const item = this.filtered_help_content.filter(item => {
          return item.section_title == section && item.title == title
        })[0]

        if (item) {
          item.show_excerpt = !item.show_excerpt
        }
      }
    }
  }
</script>

<style scoped>
  .applet_container {
    padding: 10px;
    width: 100%;
  }
  .item-header {
    cursor: pointer;
  }
  .item-header a {
    cursor: pointer;
  }
</style>

<style>
  .help > .md-dialog {
    min-width: 90%;
    height: 90%;
  }
</style>
