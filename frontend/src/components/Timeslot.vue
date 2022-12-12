<template>
  <div>
    <div v-b-modal="`timeslot-modal-${day}-${timeslot}`" class="timeslot" :class="`amount-${available}`" >
      <p class="slot">
        Available slots: {{ available }}
      </p>
    </div>
    <!-- Modal displaying dentists' slots -->
    <b-modal
        :id="`timeslot-modal-${day}-${timeslot}`"
        v-if="bookable"
        :hide-footer="true"
    >
      <template #modal-header>
        <div style="width: 100%; display: flex; justify-content: center">
          <h4>
            {{ day }} {{ timeslot }}
            <br>
            Choose a dentist
          </h4>
        </div>
      </template>
      <div id="modal-wrapper">
        <div id="dentists">
          <div
              v-b-modal="`booking-modal-${day}-${timeslot}`"
              class="dentist-data"
              v-for="dentist in data"
              v-if="dentist.slots > 0 && bookable"
              @click="onClick(dentist.dentist)"
          >
            <p>{{ getName(dentist.dentist) }}</p>
            <p>Available slots: {{ dentist.slots }}</p>
          </div>
        </div>
      </div>
    </b-modal>
    <!-- Modal for user input -->
    <b-modal
      :id="`booking-modal-${day}-${timeslot}`"
      @cancel="cancelInfo"
    >
      <template #modal-header>
        <div style="width: 100%; display: flex; justify-content: center">
          <h4>
            {{ day }} {{ timeslot }}
            <br>
            Input your data
          </h4>
        </div>
      </template>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
            label="Dentist"
            label-for="dentist"
        >
          <b-form-input
              id="dentist"
              v-model="dentistName"
              disabled
          ></b-form-input>
        </b-form-group>
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
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "timeslot",
  props: ["data", "day", "timeslot", "dentists"],
  data() {
    return {
      dentistID: null,
      dentistName: null,
      name: "",
      email: "",
      nameState: null,
      emailState: null}

  },
  methods: {
    onClick(dentist) {
      this.dentistID = dentist;
      this.dentistName = this.getName(dentist)
      this.$bvModal.hide(`timeslot-modal-${this.day}-${this.timeslot}`);
    },
    getName(dentist) {
      let name = this.dentists[this.index.indexOf(dentist)].name;
      return name;
    },
    cancelInfo() {
      this.resetInfoModal();
      this.$bvModal.show(`timeslot-modal-${this.day}-${this.timeslot}`)
    },
    resetInfoModal() {
      this.dentistID = null;
      this.dentistName = null;
      this.name = "";
      this.email = "";
      this.nameState = null;
      this.emailState = null;
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.emailState = valid;
      return valid;
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
        this.$bvModal.hide(`booking-modal-${this.day}-${this.timeslot}`);
        this.resetInfoModal();
      });
    },
  },
  computed: {
    /**
     * Returns the number of available slots for the timeslot
     * @returns {number} the reduced number of the data array
     */
    available() {
      return this.data ? this.data.map((s) => s["slots"]).reduce((acc, s) => acc + s) : 0;
    },
    /**
     * Checks whether the timeslot is bookable or not
     * @returns {boolean} whether there are slots available or not
     */
    bookable() {
      return this.available > 0;
    },
    index() {
      return this.dentists.map(d => d.dentistId);
    }
  }
}
</script>

<style scoped>
h4 {
  text-align: center;
}

p {
  text-align: center;
  margin: auto;
}

.timeslot {
  margin: 0 0 5px;
  height: var(--slot-height);
  background-color: rgba(0, 250, 154, 0.53);
  display: flex;
  align-content: center;
  transition: all 0.3s ease;
}

.amount-0 {
  color: #606060;
  background-color: rgba(0, 0, 0, 0.2);
}

.amount-1 {
  background-color: rgba(231, 216, 91, 0.2);
}

#modal-wrapper {
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

#dentists {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
}

.dentist-data {
  margin: 0 0 5px;
  height: var(--slot-height);
  background-color: rgba(151, 201, 255, 0.8);
  transition: all 0.3s ease;
}

.timeslot:hover, .dentist-data:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
  transition: all 0.3s ease;
}

.amount-0:hover {
  cursor: not-allowed;
  transform: none;
}

.timeslot:active, .dentist-data:active {
  transform: scale(0.95, 0.95);
  transition: all 0.1s ease;
}

.amount-0:active {
  transform: none;
}
</style>