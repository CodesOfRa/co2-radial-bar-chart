<template>
  <div id="app">
    <header class="header">
      <h1>CO2 Emissions by Country</h1>
      <a href="https://github.com/CodesOfRa/co2-radial-bar-chart">
        <h2>Github</h2>
      </a>
    </header>

    <div>
      <button @click="onStart" class="action-button">Start</button>
      <button @click="onStop" class="action-button">Stop</button>
    </div>
    <RadialChart :data="this.chartData" :year="year" class="center"></RadialChart>
    <footer></footer>
  </div>
</template>

<script>
import data from "../public/newData.json";
import RadialChart from "./components/RadialChart.vue";

export default {
  name: "app",
  components: {
    RadialChart
  },
  data() {
    return { chartData: data["1990"], year: 1990 };
  },
  mounted() {},
  methods: {
    onStop() {
      if (this.time) {
        clearInterval(this.time);
      }
    },
    onStart() {
      this.time = setInterval(
        function() {
          if (this.year < 2016) {
            this.year++;
            this.chartData = data[this.year.toString()];
          } else {
            this.year = 1990;
          }
        }.bind(this),
        1000
      );
    }
  }
};
</script>

<style>
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.action-button {
  padding: 0.5rem;
  background: #6367de;
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  margin: 0.5rem;
}
.header {
  display: flex;
  justify-content: space-between;
}
.center {
  display: flex;
  justify-content: center;
}
</style>
