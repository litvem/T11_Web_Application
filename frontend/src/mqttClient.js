import mqtt from "mqtt";

const host = "ws://localhost:9001";
const client = mqtt.connect(host);

export default client;
