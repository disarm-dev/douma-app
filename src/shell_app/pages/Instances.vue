<template>
  <div class="container">
    <div>
      <p>
        Hi {{user.name}}, you are logged in as
        <b>{{user.username}}</b>
        with personalised_instance_id:
        <b>{{personalised_instance_id}}</b>
      </p>
    </div>

    <div>
      <h4>Select instance to load</h4>
      <ul>
        <li v-for="instance in instances" :key="instance.id">
          <md-button @click="load_instance(instance)">{{instance.name}}</md-button>
        </li>
      </ul>
    </div>

    <md-button @click="logout()">Logout</md-button>
  </div>
</template>

<script>
import { InstancesController } from "shell_app/models/instances/controller";
import { InstanceConfigsController } from "shell_app/models/instance_configs/controller";
import { mapState } from "vuex";
import { launch_from_instance_config_id } from "shell_app/lib/check_geodata_and_launch";

export default {
  name: "instances",
  computed: {
    ...mapState({
      user: state => state.user,
      instances: state => state.instances,
      personalised_instance_id: state => state.personalised_instance_id
    })
  },
  mounted() {
    this.load_published();
  },
  methods: {
    async load_published() {
      const instances = await InstancesController.instances_for_user({
        user: this.user
      });
      this.$store.commit("set_instances", instances);
    },
    async load_instance(instance) {
      const config = await InstancesController.config_for_instance({
        instance
      });
      this.$store.commit("set_instance_config", config);
      launch_from_instance_config_id(this.$store, this.$router);
    },
    logout() {
      this.$router.push({ name: "shell:login" });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 0.5em;
}
</style>
