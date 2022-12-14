<template>
  <div v-if="circuit_breaker">
    <b-modal
      id="cb"
      v-model="circuit_breaker"
      ref="modal"
      :hide-header="true"
      :hide-footer="true"
      centered
      no-close-on-esc
      no-close-on-backdrop
      ><div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 5%;
          margin-bottom: 5%;
        "
      >
        <b-icon
          id="error_sign"
          icon="exclamation-triangle-fill"
          variant="danger"
          animation="fade"
        ></b-icon>
      </div>
      <h5 id="cb_body">Service temporarily unavailable.</h5>
    </b-modal>
  </div>
</template>

<script>
import mqttClient from "../mqttClient";
import { ref, onMounted } from "vue";

export default {
  name: "cb-modal",
  data() {
    return {
      topic: "",
    };
  },
  setup() {
    let circuit_breaker = ref(false);

    onMounted(() => {
      mqttClient.subscribe("circuitbreak/open", { qos: 1 });
      mqttClient.subscribe("circuitbreak/close", { qos: 1 });

      mqttClient.on("message", function (topic, message) {
        if (topic === "circuitbreak/open") {
          console.log("circuit breaker open, servises stopped");
          circuit_breaker.value = true;
        } else if (topic === "circuitbreak/close") {
          console.log("circuit breaker closed, servises resumed");
          circuit_breaker.value = false;
        }
      });
    });
    return {
      circuit_breaker,
    };
  },
};
</script>
