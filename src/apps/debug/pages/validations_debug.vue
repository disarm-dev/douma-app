<template>
	<div class="applet_container">

	  <md-input-container v-if="show_upload">
      <label>Upload validations</label>
      <md-file @selected="upload_validations"></md-file>
    </md-input-container>

    <md-button class="md-raised" @click.native="download">Export validations</md-button>
    <md-button class="md-raised" @click.native="reset">Reset changes</md-button>
    <md-button class="md-raised" @click.native="show_upload = !show_upload">Upload</md-button>

    <h3>Current validations</h3>
    <div v-if="validations">
      <md-list>
        <md-list-item v-for="validation in validations" :key="validation.name" @click.native="set_active_validation(validation)">
          <md-icon>chevron_right</md-icon>
          <span>{{validation.name}} ({{validation.type}})</span>
        </md-list-item>
      </md-list>
      <md-button class='md-raised' @click.native="create_validation">Add new</md-button>
    </div>

    <template v-if="active_validation">
      <!--EXPRESSION EDITOR-->
      <md-card>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{active_validation.name}}</div>
          </md-card-header-text>
        </md-card-header>
        <md-card-actions>
          <md-button class='md-raised' :disabled='show_test || !active_validation.precondition' @click.native="prepare_test(active_validation.precondition)">test precondition</md-button>
          <md-button class='md-raised' :disabled='show_test || !active_validation.expression' @click.native="prepare_test(active_validation.expression)">test expression</md-button>
          <md-button class='md-raised md-warn' @click.native="delete_validation()">Delete</md-button>
          <md-button class='md-raised' @click.native="active_validation = null">close</md-button>
        </md-card-actions>
        <md-card-content>
          <div>
            <md-radio class='red' v-model="active_validation.type" name="active_validation_type" md-value="error">error</md-radio>
            <md-radio class='orange' v-model="active_validation.type" name="active_validation_type" md-value="warning">warning</md-radio>
          </div>
          <md-input-container>
            <label>Name</label>
            <md-input v-model="active_validation.name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Message</label>
            <md-input v-model="active_validation.message"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Precondition</label>
            <md-input :disabled="show_test" v-model="active_validation.precondition"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Expression</label>
            <md-input :disabled="show_test" v-model="active_validation.expression"></md-input>
          </md-input-container>
        </md-card-content>
      </md-card>

      <!--TEST EXPRESSION-->
      <md-card v-if="show_test">
        <md-card-header>
          <div class="md-title">Test expression</div>

          <md-input-container v-for="field in test_fields" :key="field">
            <label>{{field}}</label>
            <md-input @input='run_test' v-model="test_values[field]"></md-input>
          </md-input-container>
          <h4 v-if="test_result === 'passed'"><md-icon class="green">check</md-icon> Passed</h4>
          <h4 v-else-if="test_result === 'failed'"><md-icon class="red">error</md-icon> Failed</h4>
          <h4 v-else-if="test_result === 'waiting'"><span class="orange">...</span> Waiting for valid input</h4>
        </md-card-header>
        <md-card-actions>
          <md-button @click.native="close_test">close test</md-button>
        </md-card-actions>
      </md-card>

      <!--FORM ELEMENTS-->
      <md-card>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Form question names</div>
            <div class="md-subhead">For reference</div>
          </md-card-header-text>
        </md-card-header>
        <md-card-content>
          <md-chip v-for="element in get_form_elements" :key="element.name">{{element.name}}</md-chip>
        </md-card-content>
      </md-card>

    </template>

	</div>
</template>
<script type="text/javascript">
  import download from 'downloadjs'
  import moment from 'moment-mini'
  import deep_clone from 'deep-clone'
  import {Parser} from 'expr-eval'
  import {get_form_elements} from 'lib/instance_data/form_helpers'

  export default {
    data() {
      return {
        _original_validations: [],
        validations: [],
        active_validation: null,

        show_upload: false,
        show_form_elements: true,
        show_test: false,

        test_expr: null,
        test_values: {},
        test_result: ''

      }
    },
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      },
      form_elements() {
        return get_form_elements(this.$store.state.instance_config.form)
      },
      test_fields() {
        if (!this.test_expr) return []
        return this.test_expr.variables()
      },
    },
    created() {
      this.validations = this.instance_config.validations
      this._original_validations = deep_clone(this.validations)
    },
    methods: {
      reset() {
        this.active_validation = null
        this.show_test = false
        this.validations = deep_clone(this._original_validations)
      },
      set_active_validation(validation) {
        this.active_validation = validation
      },

      create_validation() {
        const name = 'new validation ' + this.validations.length
        const new_validation = {
          name:  name, message: '', precondition: '', expression: '', type: 'warning'
        }
        this.active_validation = new_validation
        this.validations.push(new_validation)
      },
      delete_validation() {
        const index = this.validations.findIndex(v => (v.name === this.active_validation.name) && (v.message === this.active_validation.message))
        if (index !== -1) {
          this.active_validation = null
          this.validations.splice(index, 1)
        }
      },


      // TEST
      prepare_test(validation_string) {
        if (!validation_string) return

        this.test_expr = new Parser.parse(validation_string)
        this.show_test = true
      },
      run_test() {
        this.test_result = 'waiting'

        if (!this.test_expr) return

        const questions_answered = Object.keys(this.test_values)

        if (this.test_fields.every(i => questions_answered.includes(i))) {
          let parsed_for_numbers = []
          questions_answered.forEach(i => {
            const value = this.test_values[i]
            const parsed = parseFloat(value)
            if (Number.isNaN(parsed)) {
              parsed_for_numbers[i] = value
            } else {
              parsed_for_numbers[i] = parsed
            }
          })
          const result = this.test_expr.evaluate(parsed_for_numbers)
          return result ? this.test_result = "passed" : this.test_result = "failed"
        } else {
          return
        }
      },
      close_test() {
        this.test_expr = null
        this.show_test = false
      },


      upload_validations(e) {
        if (e.length === 0) return

        const file = e.item(0)
        const file_reader = new FileReader();

        file_reader.onload = (f) => {
          this.validations = JSON.parse(f.target.result)
        }

        file_reader.readAsText(file)
      },
      download() {
        const content = JSON.stringify(this.validations)
        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.instance.slug}_validations_${date}.json`)
      }
    }
  }
</script>
<style scoped>
  .md-card {
    margin: 1em 0;
  }
  .md-chip {
    margin: 2px;
  }

  .green {
    color: green !important;
  }
  .red {
    color: red !important;
  }
  .orange {
    color: orange !important;
  }
</style>
