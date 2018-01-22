import schema from 'js-schema'

export const UserSchema = schema({
  _id: [String, Number],
  app_commit_hash: String,
  name: String,
  username: String,
  instance_slug: String,
  key: String,
  allowed_apps: {
    read: Array.of_x(1, Infinity, String),
    write: Array.of_x(0, Infinity, String)
  }
})
