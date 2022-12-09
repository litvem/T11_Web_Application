<template>
  <div class="timeslot" :class="`amount-${available}`">
    <p class="slot">
      Available slots: {{ available }}
    </p>
  </div>
</template>

<script>
export default {
  name: "timeslot",
  props: ["data"],
  computed: {
    available() {
      console.log(this.data)
      return this.data ? this.data.map((s) => s["slots"]).reduce((acc, s) => acc + s) : 0;
    },
    bookable() {
      return this.available() > 0;
    }
  }
}
</script>

<style scoped>
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

.timeslot:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
  transition: all 0.3s ease;
}

.amount-0:hover {
  cursor: not-allowed;
  transform: none;
}
</style>