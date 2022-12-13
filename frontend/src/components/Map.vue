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
          :position="m.position"
          @click="toggleInfoWindow(m, index)">
      </gmap-marker>
      <gmap-info-window
      :options="infoOptions"
      :position="infoWindowPos"
      :opened="infoWinOpen"
      @closeclick="infoWinOpen=false"
      >
        <div v-html="infoContent"></div>
      </gmap-info-window>
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
      infoContent:'',
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      fullscreenChange: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
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
      return this.dentistsArray.map(({ name, coordinate: { longitude, latitude }, address, openinghours: {monday,
      tuesday, wednesday, thursday, friday} }) => ({
        name,
        address,
        position: {
          lng: longitude,
          lat: latitude
        },
        coordinate: { longitude, latitude },
        openinghours: {monday,
        tuesday,
        wednesday,
        thursday ,
        friday }
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
        },
        toggleInfoWindow: function (marker, idx) {
          this.infoWindowPos = marker.position
          this.infoContent = this.getInfoWindowContent(marker)
          if (this.currentMidx === idx) {
            this.infoWinOpen = !this.infoWinOpen
          } else {
            this.infoWinOpen = true
            this.currentMidx = idx
          }
        },
        getInfoWindowContent: function (dentistsArray) {
          return (`<div class="">
          <div>
            <div>
              <div class="m-2"><span style="font-weight: bold;">Address: </span>
                ${dentistsArray.address}
              </div>
            </div>
            <div class="m-2"><span style="font-weight: bold;">Name:  </span>
              ${dentistsArray.name}
              <br>
            </div>
            <div class="m-2"><span style="font-weight: bold;">Opening hours:  </span>
            <br>
            Monday:
              ${dentistsArray.openinghours.monday}
              <br>
               Tuesday:
              ${dentistsArray.openinghours.tuesday}
              <br> Wednesday:
              ${dentistsArray.openinghours.wednesday}
              <br> Thursday:
              ${dentistsArray.openinghours.thursday}
              <br> Friday:
              ${dentistsArray.openinghours.friday}
              <br>
            </div>
          </div>
        </div>`)
        }
      }
}
</script>

<style scoped>

</style>