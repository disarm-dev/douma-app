# Kinto collection endpoints


GET /clusters - return all Clusters, without Tasks
GET /clusters/:id - return single Cluster

PUT/POST /clusters/:id - create/update new Cluster


GET `/tasks?ids=cluster.task_ids` - return all Tasks for given Cluster (might have to use URL paramters to work with plumber) - need to pass it `cluster.task_ids`

GET `/tasks?cluster_id=cluster.id`
