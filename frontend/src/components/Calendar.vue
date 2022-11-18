<template>
  <div class="wrapper">
    <div class="titles">
      <p class="day">Day</p>
      <p class="weekday" v-for="day in days">{{day}}</p>
    </div>
    <div class="timeline">
      <div class="timeline-timestamps">
        <div class="timestamp" v-for="time in timestamps"><p>{{time}}</p></div>
      </div>
      <div class="schedule" v-for="day in days">
        <div class="timeslot" v-for="time in timestamps">
          <p class="slot">Available slots: {{random()}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "calendar",
  data() {
    return {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hours: ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"],
      timestamps: []
    }
  },
  created() {
    this.hours.forEach(hour => {
      let num = hour.substring(0, hour.length - 2)
      let suffix = hour.substring(hour.length - 2)
      this.timestamps.push(`${num}:00 ${suffix}`)
      this.timestamps.push(`${num}:30 ${suffix}`)
    })

    this.timestamps.pop()
  },
  methods: {
    random() {
      return Math.round(Math.random() * 20)
    }
  }
}
</script>

<style scoped>
.wrapper {
  --day-width: 150px;
  --time-width: 80px;
  --slot-height: 60px;
  width: calc(var(--time-width) + var(--day-width) * 5 + 40px);
  padding: 10px;
  background-color: rgba(173, 216, 230, 0.71);
  border-radius: 15px;
}

.titles {
  display: flex;
  align-content: center;
  justify-content: space-between;
}

p {
  text-align: center;
  margin: auto;
}

.day {
  width: var(--time-width);
}

.weekday {
  width: var(--day-width);
}

.timeline {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;

  height: 450px;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.timeline::-webkit-scrollbar {
  display: none;
}

.timestamp {
  margin: 0 0 5px;
  width: var(--time-width);
  height: var(--slot-height);
  display: flex;
  align-content: center;
  justify-content: center;
}

.schedule {
  margin: 0;
}

.timeslot {
  margin: 0 0 5px;
  width: var(--day-width);
  height: var(--slot-height);
  background-color: mediumspringgreen;
  border-radius: 10px;
  display: flex;
  align-content: center;
}
</style>