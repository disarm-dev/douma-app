import test from 'ava'
import {shallow} from 'vue-test-utils'
import sinon from 'sinon'
import Response from 'apps/irs_record_point/pages/view_response.vue'
import {ResponseController} from "../../../../src/lib/models/response/controller";


test('Should render response', t =>{
  const mock_store = {
    state: {
      instance_config: {
        applets: {
          irs_monitor: {
            season_start_dates: []
          }
        },
        instance:{
          slug:'slug'
        }
      },
      meta:{
        personalised_instance_id:'personalised_instance_id'
      }
    }
  }

  let read_all_cache = sinon.stub(ResponseController.prototype,'read_all_cache')
  read_all_cache.resolve([{
  country:"bwa",
  id:"7af85a99-87b8-47eb-853f-0a9a120473a7",
  initial_form_completion_duration_seconds:711,
  instance_slug:"bwa",
  personalised_instance_id:"default",
  recorded_on:"Tue Jul 03 2018 09:43:19 GMT+0200 (South Africa Standard Time)",
  synced:true,
  team_name:"Team2",
  userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
  username:"sm"}])

  const wrapper = shallow(Response, {
  mocks: {
    $store: mock_store,
    params:{response_id: 'response.id'}
  }
})

  t.true(wrapper.exists());

})
