import unique from 'array-unique'

/**
 * Checks if next applet is included in user's applets with 'read' permission
 * @param user
 * @param applet_name
 */
export const has_permission = ({user, applet_name}) => {
  if (['meta'].includes(applet_name)) return true

  const list_of_applets = user.permissions.map(p => p.replace('write:', '').replace('read:', ''))
  const user_allowed_applets = unique(list_of_applets)
  return user_allowed_applets.includes(applet_name)
}
