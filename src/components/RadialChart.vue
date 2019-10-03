<template>
  <div>
    <svg :width="width" :height="height">
      <!-- lines for each rectangle -->
      <g :transform="translate">
        <g>
          <g v-for="(data ,index) in data" :key="'xAxis'+index">
            <line y2="-400" class="lines" :transform="generateLine(index)" />
          </g>
        </g>
        <!-- yAxis -->
        <g text-anchor="middle">
          <g fill="none" v-for="(data ,index) in yAxis" :key="'yAxis'+index">
            <circle :r="yScale(data)" stroke-opacity="0.5" stroke="#cccfd2" />
            <text
              :y="-yScale(data)"
              dy="0.35em"
              stroke="#fff"
              stroke-width="5"
              v-if="index !==0"
            >{{data}}</text>
            <text
              :y="-yScale(data)"
              dy="0.35em"
              stroke="none"
              stroke-width="5"
              fill="#000"
              v-if="index !==0"
            >{{data}}</text>
          </g>
        </g>

        <!-- data rectangles  -->

        <g>
          <path
            v-for="(data,index) in data"
            :id="'arc'+index"
            :key="'arc'+index"
            :d="calculateArc(data,index)"
            stroke="#fff"
            :fill="returnColor(data.Consumption_Emissions)"
            @mouseenter="(event) => hovered = hovered = {data:data,event:event}"
            @mouseleave="() => hovered = null"
          />
        </g>
        <!-- year in the middle value -->
        <g text-anchor="middle">
          <text class="year-legend">{{this.year}}</text>
        </g>
        <g text-anchor="middle">
          <g
            v-for="(data ,index) in data"
            :key="'xAxis'+index"
            :transform="generateCountryPosition(data)"
          >
            <text :transform="generateCountryLabel(data)" class="country-legend">{{data.Code}}</text>
          </g>
        </g>
      </g>
    </svg>
    <!-- legend -->
    <div
      v-if="hovered"
      class="hovered"
      :style="{
      top: `${hovered.event.clientY + 20}px`,
      left: `${hovered.event.clientX}px`,
      }"
    >
      <strong>Country :</strong>
      {{ hovered.data.Code}}
      <br />
      <strong>CO2 :</strong>
      {{formatCO2Value(hovered.data.Consumption_Emissions) }}
      <br />
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { TweenMax, Power1 } from "gsap";
export default {
  name: "RadialChart",
  props: {
    data: Array,
    year: Number
  },
  data() {
    return {
      width: 830,
      height: 830,
      margin: 100,
      y0: 0,
      hovered: null
    };
  },
  watch: {
    data(newValue) {
      newValue.map((data, index) => {
        var id = "#arc" + index;
        var d = this.calculateArc(data, index);
        TweenMax.to(id, 2, {
          attr: {
            d: d
          },
          ease: Power1.easeInOut,
          repeat: 0,
          yoyo: true
        });
      });
    }
  },
  computed: {
    arc() {
      return d3.arc();
    },
    radius() {
      return Math.min(this.width, this.height) / 2 - this.margin;
    },
    translate() {
      return `translate(${this.width / 2},${this.height / 2})`; //upper bars are longer
    },
    xScale() {
      return d3
        .scaleBand()
        .range([0, 2 * Math.PI])
        .domain(this.data.map(x => x["Code"]));
    },
    yScale() {
      return d3
        .scaleLinear()
        .range([80, this.radius])
        .domain([0, 1700 * 3.664]);
    },
    textScale(data) {
      return -this.yScale(data);
    },
    yAxis() {
      return this.yScale.ticks(3);
    },
    returnColor() {
      return d3
        .scaleLinear()
        .domain([0, 1700 * 3.664])
        .range(["orange", "red"]);
    }
  },
  methods: {
    calculateArc(data) {
      this.arc
        .innerRadius(80) // This is the size of the donut hole
        .outerRadius(() =>
          this.yScale(
            data["Consumption_Emissions"] < 100 * 3.664
              ? data["Consumption_Emissions"] * 7
              : data["Consumption_Emissions"]
          )
        )
        .startAngle(() => this.xScale(data["Code"]))
        .endAngle(() => {
          return this.xScale(data["Code"]) + this.xScale.bandwidth();
        })
        .padAngle(0.01)
        .padRadius(80);
      this.y0 = this.yScale(0);
      return this.arc(data);
    },
    generateLine(i) {
      return "rotate(" + (i * 360) / this.data.length + ")";
    },
    generateCountryPosition(d) {
      return `
          rotate(${((this.xScale(d.Code) + this.xScale.bandwidth() / 2) * 180) /
            Math.PI -
            90})
          translate(410,0)
        `;
    },
    generateCountryLabel(d) {
      return (this.xScale(d.Code) + this.xScale.bandwidth() / 2 + Math.PI / 2) %
        (2 * Math.PI) <
        Math.PI
        ? "rotate(90)translate(0,15)"
        : "rotate(-90)translate(0,-9)";
    },

    formatCO2Value(value) {
      return value.toFixed(2);
    }
  }
};
</script>

<style>
.year-legend {
  font-size: 2rem;
  font-weight: 600;
}
.yAxis {
  stroke: grey;
  stroke-width: 0.5px;
}
.country-legend {
  font-size: 7px;
}
path:hover {
  fill-opacity: 0.5;
}
path {
  transition: fill-opacity 1s;
}
.lines {
  stroke: #f5f0f0;
  opacity: 0.7;
}
.hovered {
  background-color: #fff;
  box-shadow: 0 0 5px #cfcfcf;
  position: absolute;
  pointer-events: none;
  padding: 5px;
  line-height: 1.6;
  transform: translate(-50%);
  width: 140px;
}
</style>