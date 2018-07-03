import test from 'ava'
import {shallow} from 'vue-test-utils'
import sinon from 'sinon'
import Response from 'apps/irs_record_point/pages/view_response.vue'
import {ResponseController} from "../../../../src/lib/models/response/controller";


test('Should render response', async t => {
  const mock_store = {
    state: {
      instance_config: {
        instance: {
          slug: 'slug'
        }
      },
      meta: {
        personalised_instance_id: 'personalised_instance_id'
      }
    }
  }

  let read_all_cache = sinon.stub(ResponseController.prototype, 'read_all_cache')
  read_all_cache.resolves([{
    country: "bwa",
    id: "7af85a99-87b8-47eb-853f-0a9a120473a7",
    initial_form_completion_duration_seconds: 711
  }])


  const wrapper = await shallow(Response, {
    propsData: {response_id: '7af85a99-87b8-47eb-853f-0a9a120473a7'},
    mocks: {
      $store: mock_store
    }
  })

  t.true(wrapper.exists());
  t.deepEqual(wrapper.vm.sections.length, 3)
  t.deepEqual(wrapper.find('md-card-header div').text(),'Submitted response review')

})
