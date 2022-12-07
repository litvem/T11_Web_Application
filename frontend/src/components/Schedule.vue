<template>
  <div class="wrapper">
    <div class="titles">
      <div>
        <p class="day">Day</p>
      </div>
      <p class="weekday" v-for="day in week.length - 2">
        {{ week[day - 1].day }} {{ week[day - 1].date }}
      </p>
    </div>
    <div class="timeline">
      <div class="timeline-timestamps">
        <div class="timestamp" v-for="time in timestamps">
          <p>{{ time }}</p>
        </div>
      </div>
      <div v-for="day in week.length - 2" :class="week[day - 1].day" class="schedule">
        <div class="timeslot" v-for="time in timestamps.length - 1" :class="`amount-${getTimeSlot(
          day - 1,
          timestamps[time - 1],
          timestamps[time]
        )}`">
          <p class="slot">
            Available slots:
            {{ getTimeSlot(day - 1, timestamps[time - 1], timestamps[time]) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "schedule",
  props: ["schedule"],
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
    };
  },
  created() {
    let am_pm = 'AM'
    for (let i = 6; i <= 19; i++) {
      let j = i;
      if (i >= 12) { am_pm = 'PM' }
      if (i > 12) { j = i - 12 }
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

      return `${fromHour + from.substring(from.indexOf(":"), from.length - 3)
        }-${toHour + to.substring(to.indexOf(":"), to.length - 3)}`;
    },
    /**
     * Retrieves the number of available slots for a certain timeslot
     * @param day the index of the day of the timeslot
     * @param fromTimeStamp the starting timestamp of the timeslot
     * @param toTimeStamp the ending timestamp of the timeslot
     * @returns {number} the number of slots available for booking, 0 if slot doesn't exist
     */
    getTimeSlot(day, fromTimeStamp, toTimeStamp) {
      let slot =
        this.week[day].schedule[
        this.getTimeSlotKey(fromTimeStamp, toTimeStamp)
        ];

      return slot ? slot.map((s) => s["slots"]).reduce((acc, s) => acc + s) : 0;
    },
  },
};
</script>

<style scoped>
.wrapper {
  --day-width: 100%;
  --time-width: 110px;
  --slot-height: 60px;
  width: calc(var(--time-width) + var(--day-width) * 5 + 40px);
  padding: 10px;
  background-color: rgba(173, 216, 230, 0.71);
  border-radius: 15px;
  overflow-y: scroll;
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
  padding-top: calc(var(--slot-height) / 2);
}

.timeslot {
  margin: 0 0 5px;
  width: var(--day-width);
  height: var(--slot-height);
  background-color: mediumspringgreen;
  border-radius: 10px;
  display: flex;
  align-content: center;
  transition: all 0.3s ease;
}

.amount-0 {
  background-color: palevioletred;
}

.amount-1 {
  background-color: lemonchiffon;
}

.timeslot:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
  transition: all 0.3s ease;
}
</style>