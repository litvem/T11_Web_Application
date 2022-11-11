<template>
  <div class="test">
    <h1>{{ test }}</h1>
    <h1>{{ list }}</h1>
    <input type="text" v-model="message" value="" />
    <button @click="publishMessage(message)">publish</button>
    <button @click="sub">sub</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import mqtt from "mqtt";
export default {
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
