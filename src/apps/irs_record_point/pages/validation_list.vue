<template>
  <md-list>
    <md-list-item v-for="{message, name, questions, is_location} in messages" :key="name">
      <!-- Show message for everything-->
      <span>{{message}}</span>

      <!--Show button to trigger location tab if 'location' kind of question-->
      <md-button class='md-warn' v-if="is_location" @click.native="$emit('show_location')">Fix location</md-button>

      <!-- Show questions where there are questions-->
      <md-list-expand v-if="!is_location">
        <md-list>
          <md-list-item
            @click.native="go_to_page_for(question_name)"
            v-for="question_name in questions"
            :key="question_name"
          >
            <a class="question-name">{{title_for_question_name(question_name)}}</a>
            <span class="question-value">{{current_value_for(question_name)}}</span>
          </md-list-item>
        </md-list>
      </md-list-expand>
    </md-list-item>
  </md-list>
</template>

<script>
  export default {
    name: 'validation_list',
    props: ['messages', 'survey'],
    methods: {
      go_to_page_for(question_name) {
        if(!question_name) return
        if(!this.survey) return
        const question = this.survey.getQuestionByName(question_name)
        const page = this.survey.getPageByQuestion(question)
        this.survey.currentPage = page
      },
      current_value_for(question_name) {
        if(!question_name) return
        return this.survey.data[question_name]
      },
      title_for_question_name(question_name) {
        if (!this.survey) return
        return this.survey.getQuestionByName(question_name).title
      },
    }
  }
</script>
<style scoped>
  .question-name {
    padding-left: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .question-value {
    padding-left: 15px;
  }
</style>