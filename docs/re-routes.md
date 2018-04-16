# Re-routing

Rethinking the routing, to make it easier:

1. to boot the application without any config
1. stop using subdomains for instance identification
1. handle multiple configurations on one device


## Routes list

### `/` Root route
Where everything starts.
Render something useful here - like a login page?

### `/:config_id` Instance root.
By this point we have an instance_config loaded (or it's failed and we're redirected back to root_route. This is similar to the current root route.

### `/:config_id/irs/monitor` Applet route
As per the existing applet routes, these are all nested under the root.


## Relations

