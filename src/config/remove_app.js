export function remove_app(app_instance) {
  if (app_instance) {
    app_instance.$destroy()
    app_instance.$off()
    app_instance.$el.remove()
    app_instance = null
    console.log('app_instance destroyed')
  } else {
    console.log('app_instance DOES NOT exists - no need to remove',)
  }
}