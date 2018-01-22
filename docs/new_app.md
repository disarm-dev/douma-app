# To add a new app

1. create a new folder under `src/apps` titled `app_name`
1. inside:
  1. add an empty `routes.js` file, where the root has a `name`, and there's no URL conflicts with any other app 
  1. add an empty `store.js` file
  1. add an `index.js` that exports the `routes.js` and `store.js` files
  1. add an empty `pages` folder to hold the components
1. open `config/common` file
  1. add an `app_name` entry to the `applet` property, give it a default title and icon
1. ensure at least one user has access to the `app_name` in the auth side
1. ensure at least one instance includes it in the `<slug>.instance.json` file
