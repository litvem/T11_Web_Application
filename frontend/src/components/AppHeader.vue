<template>
  <header class="navbar fixed-top">
    <div id="logo"><img id="logo-filler" src="@/assets/logo.png" /></div>
    <h3>DENTISTIMO</h3>
  </header>
</template>

<script>
export default {
  name: "app-header",
};
</script>

<style scoped>
.navbar {
  padding: 3px 25px;
  background-image: linear-gradient(135deg, #daedffc9 10%, #027adce7 100%);
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  min-width: 100%;
  min-height: 61px;
}

#logo-filler {
  background-image: url("@/assets/logo.jpg");
  width: 60px;
  height: 55px;
  padding: 0 1% 0 3.5%;
  margin: 0;
  z-index: 1000;
}

#logo {
  animation: spin 1.5s ease-out;
}

@keyframes spin {
  from {
    margin-left: -90px;
    margin-right: 90px;
  }
  to {
    margin: 0;
    transform: rotate(calc(360deg * 3));
  }
}

h3 {
  font-size: 30px;
  font-weight: 500;
  color: #000000;
  text-decoration: none;
  padding: 0%;
  align-self: center;
  margin: 0;
}
</style>
