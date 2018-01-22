# Apps

DOUMA consists of several smaller applications bundled together. Each app can be found in the `src/apps` folder

# Permissions

A user can not access any part of the application unless they are logged in. By default a logged in user has access to any app. Restricting access to a certain app must be done by setting a `beforeEnter` function on the routes for that app. Read more about navigation guards on routes [here](https://router.vuejs.org/en/advanced/navigation-guards.html).