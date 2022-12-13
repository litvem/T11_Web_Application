<template>
  <schedule :schedule="schedule" />
</template>

<script>
import Schedule from "@/components/Schedule.vue";
import schedule from "@/assets/schedule.json";
export default {
  name: "CalendarView",
  components: { Schedule },
  data() {
    return {
      schedule: schedule,
    };
  },
};
</script>

<style scoped>

</style>