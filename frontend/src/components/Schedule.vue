<template>
  <div class="wrapper">
    <div class="titles">
      <div class="day">
        <p>Day</p>
      </div>
      <div class="weekday" v-for="day in week.length - 2">
        <p>{{ week[day - 1].day }} {{ week[day - 1].date }}</p>
      </div>
    </div>
    <div class="timeline">
      <div class="timeline-timestamps">
        <div class="timestamp" v-for="time in timestamps">
          <p>{{ time }}</p>
        </div>
      </div>
      <div
        v-for="day in week.length - 2"
        :class="week[day - 1].day"
        class="schedule"
      >
        <timeslot
          v-for="time in timestamps.length - 1"
          :dentists="dentistsArray"
          :sessionId="session"
          :data="getTimeSlot(day - 1, timestamps[time - 1], timestamps[time])"
          :day="week[day - 1].day"
          :date="week[day - 1].date"
          :timeslot="getTimeSlotKey(timestamps[time - 1], timestamps[time])"
          :today="today"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Timeslot from "@/components/Timeslot.vue";

export default {
  name: "schedule",
  components: { Timeslot },
  props: ["schedule", "dentistsArray", "session"],
  data() {
    return {
      week: [
        { day: "Mon" },
        { day: "Tue" },
        { day: "Wed" },
        { day: "Thu" },
        { day: "Fri" },
        { day: "Sat" },
        { day: "Sun" },
      ],
      timestamps: [],
      today: new Date(),
    };
  },
  created() {
    let am_pm = "AM";
    for (let i = 6; i <= 19; i++) {
      let j = i;
      if (i >= 12) {
        am_pm = "PM";
      }
      if (i > 12) {
        j = i - 12;
      }
      this.timestamps.push(j + `:00 ${am_pm}`);
      this.timestamps.push(j + `:30 ${am_pm}`);
    }
    this.timestamps.pop();

    this.getWeek();
  },
  methods: {
    random() {
      return Math.round(Math.random() * 20);
    },
    /**
     * Merger data passed as a prop to this component with the component's internal array of day objects
     */
    getWeek() {
      let date = new Date(this.schedule[0].date);
      let mon = date.getDate() - date.getDay() + 1;
      for (let i = 0; i < 7; i++) {
        this.week[i].date = new Date(date.setUTCDate(mon + i))
          .toISOString()
          .split("T")[0];
        mon = date.getDate() - date.getDay() + 1;
        this.week[i].schedule = this.schedule[i].schedule;
      }
    },
    /**
     * Takes two timestamps in analogue format and returns a string representing the interval in digital format
     * <br>
     * Example: ("12:30 PM", "1:00 PM") -> "12:30-13:00"
     * @param from the starting timestamp
     * @param to the ending timestamp
     * @returns {string} a formatted string representing the interval passed
     */
    getTimeSlotKey(from, to) {
      // Gets the first number of the timestamp
      // Example: "9:30 AM" -> 9
      let fromHour = parseInt(from.substring(0, from.indexOf(":")));
      let toHour = parseInt(to.substring(0, to.indexOf(":")));

      fromHour =
        fromHour === 12 || from.endsWith("AM") ? fromHour : fromHour + 12;
      toHour = toHour === 12 || to.endsWith("AM") ? toHour : toHour + 12;

      return `${
        fromHour + from.substring(from.indexOf(":"), from.length - 3)
      }-${toHour + to.substring(to.indexOf(":"), to.length - 3)}`;
    },
    /**
     * Retrieves the number of available slots for a certain timeslot
     * @param day the index of the day of the timeslot
     * @param fromTimeStamp the starting timestamp of the timeslot
     * @param toTimeStamp the ending timestamp of the timeslot
     * @returns {Array} the timeslot data, or undefined if it doesn't exist
     */
    getTimeSlot(day, fromTimeStamp, toTimeStamp) {
      return this.week[day].schedule[
        this.getTimeSlotKey(fromTimeStamp, toTimeStamp)
      ]; // ? slot.map((s) => s["slots"]).reduce((acc, s) => acc + s) : 0;
    },
  },
};
</script>

<style scoped>
.wrapper {
  --scrollbar-width: 5px;
  --time-width: 110px;
  --slot-height: 60px;
  width: 100%;
  --day-width: calc((100% - var(--time-width)) / 5 - 7px);
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.titles {
  display: flex;
  align-content: center;
  justify-content: space-between;
  padding-right: calc(2% + var(--scrollbar-width));
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
  padding-right: 2%;

  overflow-y: scroll;
  scroll-behavior: smooth;
}

.timeline::-webkit-scrollbar {
  width: var(--scrollbar-width);
}

.timeline::-webkit-scrollbar-thumb {
  background-color: rgba(33, 33, 33, 0.2);
  border-radius: calc(var(--scrollbar-width) / 2);
}

.timeline::-webkit-scrollbar-thumb:hover {
  background-color: rgba(33, 33, 33, 0.4);
}

.timeline::-webkit-scrollbar-thumb:active {
  background-color: rgba(33, 33, 33, 0.6);
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
  padding-top: calc(var(--slot-height) / 2);
  width: var(--day-width);
}
</style>
