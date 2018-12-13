import BUILD_TIME from 'config/build-time'

export class User {
  constructor(user_json) {
    this.model = user_json
    this.decorate()
  }

  decorate() {
    this.model.app_commit_hash = BUILD_TIME.VERSION_COMMIT_HASH_SHORT
  }
}
