<template>
    <GmapMap
        :center="coordinates"
        :zoom="10"
        style="width: 100%; height: 100%; display: flex">
      <GmapAutocomplete
          @place_changed='setPlace'
      />
      <gmap-marker
          :key="index"
          v-for="(m,index) in markers"
          :position="m.position">
      </gmap-marker>
    </GmapMap>
</template>

<script>
export default {
  name: 'Map',
  props: ["dentistsArray"],
  data() {
    return {
      map: null,
      center: { lat: 0, lng: 0 },
      currentPlace: null,
      dentists: [],
      places: [],
      coordinates: {
        lat: 0,
        lng: 0
      }
    }
  },
  created() {
    this.$getLocation({})
        .then(coordinates => {
          this.coordinates = coordinates
        })
        .catch(error => alert(error))
  },
  mounted() {
    this.geolocate()
  },
  computed: {
    markers() {
      return this.dentistsArray.map(({ name, coordinate: { longitude, latitude }, address }) => ({
        name: {
          name,
          color: '#de1313',
          fontsize: '100px'
        },
        address,
        position: {
          lng: longitude,
          lat: latitude
        }
      }))
    }
  },
  methods:
      {
        geolocate: function () {
          navigator.geolocation.getCurrentPosition(position => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        },
        setPlace(place) {
          this.currentPlace = place
        }
      }
}
</script>

<style scoped>

</style>