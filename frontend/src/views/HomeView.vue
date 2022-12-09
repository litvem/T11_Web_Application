<template>
  <div class="home">
    <div class="welcome-message">
      <h4>
        Welcome to Dentistimo, digital portal where you can easy book your
        dental appointment.
      </h4>
    </div>
    <section>
      <div class="map">
        <!--Map :dentistsArray="dentists"/-->
      </div>
      <div class="schedule-related">
        <!--search related items-->
        <div class="search">
          <label for="datepicker">Select a date</label>
          <template class="w-50 p-3">
            <div>
              <b-form-datepicker
                id="datepicker"
                v-model="value"
                class="mb-2"
                today-button
                reset-button
                close-button
                locale="en"
              ></b-form-datepicker>
            </div>
          </template>
          <b-button
            id="search-button"
            variant="outline-primary"
            v-on:click="patchTimeInterval()"
            >Search</b-button
          >
        </div>
        <div class="filtered-schedule">
          <!--spinner while waiting filtered response
          <b-spinner id="spinner" variant="primary"></b-spinner>-->
        </div>
      </div>
    </section>
    <!--modal to get name and email of the user-->
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Provide following information to complete your booking:"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Email"
          label-for="email-input"
          invalid-feedback="Email is required"
          :state="emailState"
        >
          <b-form-input
            id="email-input"
            v-model="email"
            :state="emailState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <template #modal-footer="{ cancel }">
        <!--Emulate built in modal footer ok and cancel button actions-->
        <b-button size="md" variant="outline-success" @click="handleOk">
          Submit
        </b-button>
        <b-button size="md" variant="outline-danger" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
    <!--modal to display error message-->
    <div v-if="error_message" :key="error_message">
      <b-modal id="error_message" v-model="error_message" ref="modal"
        ><h5>Error occured during your booking. Please try again later.</h5>
        <template #modal-footer="{ cancel }">
          <!--Emulate built in modal footer ok and cancel button actions-->
          <b-button size="md" variant="outline-primary" @click="cancel()">
            OK
          </b-button>
        </template>
      </b-modal>
    </div>
    <!--modal in case of circuit breaker open/closed-->
    <div v-if="circuit_breaker">
      <b-modal
        id="cb"
        v-model="circuit_breaker"
        ref="modal"
        hide-header="true"
        hide-footer="true"
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
            id="warning_sign"
            icon="exclamation-triangle-fill"
            variant="danger"
            animation="fade"
          ></b-icon>
        </div>
        <h5 id="cb_body">Service temporarily unavailable.</h5>
      </b-modal>
    </div>
    <div v-else></div>
    <!--modal to display success message-->
    <div v-if="success_message" :key="success_message">
      <b-modal
        id="success_message"
        v-model="success_message"
        hide-header="true"
        centered
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
            id="warning_sign"
            icon="check-circle-fill"
            variant="success"
          ></b-icon>
        </div>
        <h5 id="success_text">
          Your booking was successful. <br />
          Confirmation has been sent to you via email.
        </h5>
        <template #modal-footer="{ cancel }">
          <!--Emulate built in modal footer OK button action-->
          <b-button size="md" variant="outline-success" @click="cancel()">
            OK
          </b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { Api } from "../Api.js";
import Map from "../components/Map.vue";
import { ref, onMounted } from "vue";
import mqtt from "mqtt";

export default {
  components: {
    Map,
  },
  data() {
    return {
      value: "",
      sessionId: "",
      name: "",
      email: "",
      nameState: null,
      emailState: null,
      topic: "",
    };
  },
  created() {
    Api.post("/sessions")
      .then((response) => {
        console.log(response);
        this.sessionId = response.data.user;
        console.log(this.sessionId);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  setup() {
    let test = ref("test");
    let mqttClient = null;
    let list = ref(["a"]);
    let message = ref("");
    let dentists = ref([]);
    let error_message = ref(false);
    let success_message = ref(false);
    let circuit_breaker = ref(false);
    onMounted(() => {
      const host = "ws://localhost:9001";
      mqttClient = mqtt.connect(host);
      mqttClient.on("error", (err) => {
        console.log(err);
        mqttClient.end();
      });

      mqttClient.on("connect", () => {
        console.log(`mqtt client connected`);
      });

      mqttClient.subscribe("data/dentist/response", { qos: 1 });
      mqttClient.subscribe("booking/emailconfirmation", { qos: 2 });
      mqttClient.subscribe("booking/error/", { qos: 2 });
      mqttClient.subscribe("circuitbreak/open", { qos: 1 });
      mqttClient.subscribe("circuitbreak/close", { qos: 1 });

      mqttClient.on("message", function (topic, message) {
        switch (topic) {
          case "data/dentist/response":
            var arrayOfDentists = JSON.parse(message.toString());
            dentists.value = [];
            arrayOfDentists.map((dentist) => {
              dentists.value.push({
                name: dentist.name,
                coordinate: {
                  longitude: dentist.coordinate.longitude,
                  latitude: dentist.coordinate.latitude,
                },
                address: dentist.address,
              });
            });
            break;
          case "booking/emailconfirmation":
            console.log("booking confirmation received");
            success_message.value = true;
            break;
          case "booking/error":
            console.log("error message received");
            error_message.value = true;
            break;
          case "circuitbreak/open":
            console.log("error message received");
            circuit_breaker.value = true;
            break;
          case "circuitbreak/close":
            console.log("error message received");
            circuit_breaker.value = false;
        }
      });

      mqttClient.on("close", () => {
        console.log(`mqtt client disconnected`);
      });
      mqttClient.publish("data/dentist/request");
    });
    const publishMessage = (payload) => {
      mqttClient.publish("/test", payload);
    };

    const sub = () => {
      mqttClient.subscribe("/sub", { qos: 1 });
      console.log("/sub");
    };

    return {
      message,
      test,
      list,
      dentists,
      error_message,
      success_message,
      circuit_breaker,
      sub,
      publishMessage,
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.emailState = valid;
      return valid;
    },
    resetModal() {
      this.name = "";
      this.email = "";
      this.nameState = null;
      this.emailState = null;
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    patchTimeInterval() {
      Api.patch("/sessions", {
        date: this.value,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>
