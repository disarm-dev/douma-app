export function remove_app(app_instance) {
  if (app_instance) {
    app_instance.$destroy()
    app_instance.$off()
    app_instance.$el.remove()
    app_instance = null
    console.info('[switching app] app_instance destroyed')
  } else {
    console.info('[switching app] app_instance DOES NOT exists - no need to remove',)
  }
}