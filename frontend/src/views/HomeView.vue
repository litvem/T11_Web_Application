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
        <div class="search">
          <label for="datepicker">Choose a date</label>
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
          <b-button id="search-button" variant="outline-primary"
            >Search</b-button
          >
        </div>
        <div class="filtered-schedule"></div>
      </div>
    </section>

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
      value: "",
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

      mqttClient.subscribe("/test", { qos: 0 });

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
      mqttClient.subscribe("/sub", { qos: 0 });
      console.log("/sub");
    };

    return { message, test, list, sub, publishMessage };
  },
};
</script>
