import test from 'ava'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuex from 'vuex'
import sinon from 'sinon'
import Seasons from 'apps/seasons/seasons.vue'
const localVue = createLocalVue()
localVue.use(Vuex)

let getters
let store

const  irs_seasons = [
  new Date('2017-9-1').toString(),
  new Date('2017-9-1').toString(),
  new Date('2017-9-1').toString()
]

test.beforeEach(()=>{
  getters = {
    irs_seasons: () =>   [
      new Date('2017-9-1').toString(),
      new Date('2017-9-1').toString(),
      new Date('2017-9-1').toString()
    ]
  }

  store = new Vuex.Store({
    getters
  })
})



test('should render', t => {
  shallow(Seasons,{store,localVue})
  t.pass()
})

test.failing('should render the correct amount of pills', t => {
  const wrapper = shallow(Seasons,{store,localVue})
  //expect(wrapper.classes()).toContain('md-chip')
  t.is(wrapper.findAll('md-chip').length,irs_seasons.length)
})
