const get_form_elements = (form) => {
  return form.pages.reduce((acc, page, page_number) => {
    return acc.concat(page.elements.map(elm => {
      return {
        page: page_number,
        name: elm.name,
        type: elm.type
      }
    }))
  }, [])
}

const get_form_fields = (form) => {
  return get_form_elements(form).map(e => e.name)
}

export {get_form_elements, get_form_fields}
