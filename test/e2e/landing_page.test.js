import {Selector} from 'testcafe'

const instances = {bwa: 'Botswana', nam: 'Namibia', 'zwe-mats': 'Zimbabwe', 'zwe-matn': 'Zimbabwe', swz: 'Swaziland'}

for (const instance_name in instances) {
  (function (_instance_name){
    fixture `${_instance_name} landing page title`
      .page `http://localhost:8080#instance=${_instance_name}`

    test('correct title', async t => {
      const expected = instances[_instance_name]

      const instance_title = Selector('.login-text')
      const actual = instance_title.textContent

      await t
        .expect(actual).contains(expected)
    })
  })(instance_name)
}

