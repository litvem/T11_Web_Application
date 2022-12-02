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
        <Map :dentistsArray="dentists"/>
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
          <b-button id="search-button" variant="outline-primary" v-on:click="patchTimeInterval()"
            >Search</b-button>
        </div>
        <div class="filtered-schedule">
          <b-button
            id="sample-button"
            variant="outline-secondary"
            v-b-modal.modal-prevent-closing
            >Sample time slot</b-button
          >
          <b-button
            id="error-button"
            variant="outline-secondary"
            v-b-modal.error_message
            >Error trigger</b-button
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
        <b-button size="md" variant="outline-primary" @click="handleOk">
          Submit
        </b-button>
        <b-button size="md" variant="outline-secondary" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
    <!--modal to display error message-->
    <b-modal id="error_message" ref="modal"
      ><h5>Error occured during your booking. Please try again.</h5>
      <template #modal-footer="{ cancel }">
        <!--Emulate built in modal footer ok and cancel button actions-->
        <b-button size="md" variant="outline-primary" @click="cancel()">
          OK
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
  mounted() {
    Api.post('/sessions')
        .then(response => {
          console.log(response);
          this.sessionId = response.data.user;
          console.log(this.sessionId);
        })
        .catch(err => {
          console.log(err);
        });
  },
  setup() {
    let test = ref("test");
    let mqttClient = null;
    let list = ref(["a"]);
    let message = "";
    let dentists = ref([]);
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
      mqttClient.subscribe("data/dentist/response", { qos: 0 });

      mqttClient.on("message", function (topic, message) {
        if (topic == "data/dentist/response") {
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
        }

        this.dentistsTest = dentists.value;
        console.log(this.dentistsTest);
        test.value = message.toString();
        list.value.push(message.toString());
        console.log(message.toString());
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

    return { message, test, list,dentists, sub, publishMessage };
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
    patchTimeInterval(){
      Api.patch('/sessions', {
        date: this.value
      })
          .then(response => {
            console.log(response)
          })
          .catch(err => {
            console.log(err)
          });
    }
  },

};
</script>
