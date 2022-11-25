<template>
  <div class="home">
    <div class="welcome-message">
      <h4>
        Welcome to Dentistimo, digital portal where you can easy book your
        dental appointment.
      </h4>
    </div>
    <section>
      <div class="map"></div>
      <div class="schedule-related">
        <!--search related items-->
        <div class="search">
          <label for="datepicker">Choose a date</label>
          <template class="w-50 p-3">
            <div>
              <b-form-datepicker
                id="datepicker"
                v-model="date"
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
            v-on:click="getDate"
            >Search</b-button
          >
        </div>
        <div class="filtered-schedule">
          <b-button
            id="sample-button"
            variant="outline-secondary"
            v-b-modal.modal-prevent-closing
            >Sample time slot</b-button
          >
          <!--spinner while waiting filtered response
          <b-spinner id="spinner" variant="primary"></b-spinner>-->
        </div>
      </div>
    </section>
    <!--modal to get name and email of the user-->
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Your Name"
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
        <b-button size="md" variant="outline-primary" @click="handleOk">
          Submit
        </b-button>
        <b-button size="md" variant="outline-secondary" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
    <!--<h1>{{ test }}</h1>
    <h1>{{ list }}</h1>
    <input type="text" v-model="message" value="" />
    <button @click="publishMessage(message)">publish</button>
    <button @click="sub">sub</button>-->
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import mqtt from "mqtt";

export default {
  data() {
    return {
      date: "",
      value: "",
      name: "",
      email: "",
      nameState: null,
      emailState: null,
      topic: "",
    };
  },
  setup() {
    let test = ref("test");
    let mqttClient = null;
    let list = ref(["a"]);
    let message = "";
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

      mqttClient.subscribe("/test", { qos: 1 });

      mqttClient.on("message", function (topic, message) {
        test.value = message.toString();
        list.value.push(message.toString());
        console.log(message.toString());
      });

      mqttClient.on("close", () => {
        console.log(`mqtt client disconnected`);
      });
    });
    const publishMessage = (payload) => {
      mqttClient.publish("/test", payload);
    };

    const sub = () => {
      mqttClient.subscribe("/sub", { qos: 1 });
      console.log("/sub");
    };

    return { message, test, list, sub, publishMessage };
  },
  methods: {
    getDate() {
      console.log(this.date);
    },
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
      // Print the concatinated input into console
      //this.message = this.date + "/" + this.name + "/" + this.email;
      //console.log(this.message);
      console.log(this.name);
      console.log(this.email);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
  },
};
</script>
