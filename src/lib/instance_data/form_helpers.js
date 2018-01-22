const get_form_elements = (form) => {
  let arr = []
  form.pages.forEach((page, i) => {
    if (page.elements)
    page.elements.forEach(element => {
      if (arr.find(i => i.name === element.name)) return

      arr.push({
        page: i,
        name: element.name,
        type: element.type
      })
    })
  })
  return arr
}

const get_form_fields = (form) => {
  return get_form_elements(form).map(e => e.name)
}

export {get_form_elements, get_form_fields}
