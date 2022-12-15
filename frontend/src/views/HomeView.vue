<template>
  <div class="home">
    <ModalCB />
    <ModalSuccess :sessionId="sessionId" />
    <div class="welcome-message">
      <h4>
        Welcome to Dentistimo, digital portal where you can easy book your
        dental appointment.
      </h4>
    </div>
    <section>
      <div class="map">
        <!--<Map :dentistsArray="dentists" />-->
      </div>
      <div class="schedule-related">
        <!--SEARCH related items-->
        <div class="search">
          <!--DATEPICKER-->
          <label for="datepicker">Select a date</label>
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
          <!--SEARCH BUTTON-->
          <b-button
            id="search-button"
            variant="outline-primary"
            v-on:click="patchTimeInterval()"
            >Search</b-button
          >
        </div>
        <div class="filtered-schedule">
          <schedule
            :schedule="schedule"
            :key="schedule"
            :dentistsArray="dentists"
            :session="sessionId"
          />
          <!--SPINNER while waiting filtered response
          <b-spinner id="spinner" variant="primary"></b-spinner>-->
        </div>
      </div>
    </section>
    <!--MODAL to get name and email of the user-->
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
    <!--MODAL to display error message-->
    <div v-if="error_message" :key="error_message">
      <b-modal
        id="error_message"
        v-model="error_message"
        :hide-header="true"
        centered
        ref="modal"
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
          ></b-icon>
        </div>
        <h5 id="error_body">
          Error occured during your booking. <br />
          Please try again later.
        </h5>
        <template #modal-footer="{ cancel }">
          <!--Emulate built in modal footer ok and cancel button actions-->
          <b-button size="md" variant="outline-danger" @click="cancel()">
            OK
          </b-button>
        </template>
      </b-modal>
    </div>
    <div v-if="no_email_message" :key="no_email_message">
      <b-modal
        id="warning_message"
        v-model="no_email_message"
        :hide-header="true"
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
            icon="exclamation-triangle-fill"
            variant="warning"
          ></b-icon>
        </div>
        <h5 id="success_text">
          Your booking is confirmed <br />
          at <span class="bold">{{ time }}</span> on
          <span class="bold">{{ bDate }}</span> <br />
          at
          <span class="bold">{{ dentistName }}</span
          >. <br />
          Unfortunatelly confirmation email could
          <span class="bold">not</span> be sent.
        </h5>
        <template #modal-footer="{ cancel }">
          <!--Emulate built in modal footer OK button action-->
          <b-button size="md" variant="outline-warning" @click="cancel()">
            OK
          </b-button>
        </template>
      </b-modal>
    </div>
    <!--MODAL to display success message-->
    <div v-if="success_message" :key="success_message">
      <b-modal
        id="success_message"
        v-model="success_message"
        :hide-header="true"
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
          Your booking is confirmed <br />
          at <span class="bold">{{ time }}</span> on 
          <span class="bold">{{ bDate }}</span> <br /> 
          at
          <span class="bold">{{ dentistName }}</span
          >. <br />
          Confirmation has been sent to <span class="bold">{{ email }}</span
          >.
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
import Schedule from "../components/Schedule.vue";
import ModalCB from "../components/ModalCB.vue";
import { ref, onMounted } from "vue";
import mqttClient from "../mqttClient";

export default {
  components: {
    Map,
    Schedule,
    ModalCB,
  },
  data() {
    return {
      date: "",
      name: "",
      nameState: null,
      emailState: null,
      topic: "",
      newInterval: "",
      previousInterval: "",
      count: 0,
    };
  },
  setup() {
    let sessionId = ref("");
    let dentists = ref([]);
    let initialInterval = ref("");
    let schedule = ref([]);
    let error_message = ref(false);
    let success_message = ref(false);
    let no_email_message = ref(false);
    let time = ref(null);
    let bDate = ref(null);
    let dentistId = ref(null);
    let dentistName = ref("");
    let email = ref(null);

    const post = () =>
      new Promise((resolve, reject) => {
        Api.post("/sessions")
          .then((response) => {
            console.log(response);
            sessionId.value = response.data.user;
            console.log(sessionId.value);
            initialInterval.value = JSON.stringify(response.data.interval);
            mqttClient.publish(
              "schedule/initial/request",
              initialInterval.value,
              1
            );
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });

    const index = () => {
      console.log(dentists);
      return dentists.value.map(d => d.dentistId);
    };

    const getName = (dentist) => {
      let name = dentists.value[index().indexOf(dentist)].name;
      console.log(index());
      return name;
    };

    onMounted(async () => {
      await post();

      mqttClient.on("error", (err) => {
        console.log(err);
        mqttClient.end();
      });

      mqttClient.on("connect", () => {
        console.log(`mqtt client connected`);
      });

      mqttClient.subscribe("data/dentist/response", { qos: 1 });
      mqttClient.subscribe("schedule/initial/response", { qos: 1 });
      mqttClient.subscribe(`emailconfirmation/${sessionId.value}`, {
        qos: 2,
      });
      mqttClient.subscribe(`emailconfirmation/error/${sessionId.value}`, {
        qos: 2,
      });
      mqttClient.subscribe(`booking/error/${sessionId.value}`, { qos: 2 });

      mqttClient.on("message", function (topic, message) {
        switch (topic) {
          case "data/dentist/response":
            var arrayOfDentists = JSON.parse(message.toString());
            dentists.value = [];
            arrayOfDentists.map((dentist) => {
              dentists.value.push({
                dentistId: dentist.id,
                name: dentist.name,
                coordinate: {
                  longitude: dentist.coordinate.longitude,
                  latitude: dentist.coordinate.latitude,
                },
                address: dentist.address,
                openinghours: {
                  monday: dentist.openinghours.monday,
                  tuesday: dentist.openinghours.tuesday,
                  wednesday: dentist.openinghours.wednesday,
                  thursday: dentist.openinghours.thursday,
                  friday: dentist.openinghours.friday,
                },
              });
            });
            break;
          case "schedule/initial/response":
            schedule.value = JSON.parse(message.toString());
            mqttClient.unsubscribe("schedule/initial/response");
            break;
          case `emailconfirmation/${sessionId.value}`:
            console.log("booking confirmation received");
            success_message.value = true;
            var booking = JSON.parse(message.toString());
            console.log(booking);
            bDate.value = booking.date.slice(0, 10);
            time.value = booking.time;
            dentistId.value = booking.dentistId;
            dentistName.value = getName(dentistId.value);
            email.value = booking.userid;
            break;
          case `emailconfirmation/error/${sessionId.value}`:
            console.log("booking confirmed, no email sent");
            no_email_message.value = true;
            var bookingIncomplete = JSON.parse(message.toString());
            console.log(bookingIncomplete);
            bDate.value = bookingIncomplete.date;
            time.value = bookingIncomplete.time;
            dentistId.value = bookingIncomplete.dentistId;
            dentistName.value = getName(dentistId.value);
            break;
          case `booking/error/${sessionId.value}`:
            console.log("error message received");
            error_message.value = true;
            break;
        }
      });

      mqttClient.on("close", () => {
        console.log(`mqtt client disconnected`);
      });
      mqttClient.publish("data/dentist/request");
    });

    const publishSchedule = (oldInterval, latestInterval) => {
      mqttClient.publish(
        "schedule/request",
        `{ "previousInterval" : ${oldInterval}, "newInterval" : ${latestInterval} }`,
        1
      );
      console.log(
        `{ "previousInterval" : ${oldInterval}, "newInterval" : ${latestInterval} }`
      );
    };

    const subscribeToSchedule = (interval) => {
      const fromTo = JSON.parse(interval);
      mqttClient.subscribe(`schedule/response/${fromTo.from}-${fromTo.to}`, {
        qos: 1,
      });
      mqttClient.on("message", function (topic, message) {
        if (topic === `schedule/response/${fromTo.from}-${fromTo.to}`) {
          schedule.value = JSON.parse(message.toString());
        }
      });
    };

    window.onbeforeunload = function () {
      Api.patch("/sessions", {
        date: new Date().toString(),
      }).then((response) => {
        initialInterval.value = JSON.stringify(response.data.interval);
      });
      mqttClient.publish("schedule/remove/client", `${initialInterval.value}`);
    };
    return {
      dentists,
      schedule,
      initialInterval,
      sessionId,
      subscribeToSchedule,
      publishSchedule,
      success_message,
      no_email_message,
      error_message,
      bDate,
      time,
      dentistId,
      dentistName,
      email,
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
      this.count++;
      Api.patch("/sessions", {
        date: this.date,
      })
        .then((response) => {
          if (this.count === 1) {
            this.previousInterval = this.initialInterval;
            this.newInterval = JSON.stringify(response.data.interval);
            this.subscribeToSchedule(this.newInterval);
            this.publishSchedule(this.previousInterval, this.newInterval);
          } else {
            this.previousInterval = this.newInterval;
            this.newInterval = JSON.stringify(response.data.interval);
            this.subscribeToSchedule(this.newInterval);
            this.publishSchedule(this.previousInterval, this.newInterval);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
