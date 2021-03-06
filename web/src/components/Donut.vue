<template>
<div class="donut-group d-flex" :id="`donut-${id}`">
  <svg :width="width" :height="width" class="donut">
    <g :transform="`translate(${this.width/2},${this.width/2})`" ref="pie"></g>
  </svg>
  <div class="ml-2" style="max-width: 150px;">
    <div v-for="(d, idx) in nonZero" :key="idx" class="line-height-sm text-left text-break">
      <small :style="{color: colorScale(d.term)}" v-if="colorScale && idx < 5">{{d.term}}</small>
    </div>
    <small v-if="nonZero.length > 5" style="color: #bababa"  class="line-height-sm text-left d-block">other</small>
  </div>
</div>
</template>

<script lang="js">
import Vue from "vue";

import {
  select,
  selectAll,
  pie,
  arc,
  scaleOrdinal,
  scaleBand,
  schemeSet2
} from "d3";

export default Vue.extend({
  name: "Donut",
  props: {
    data: Array,
    id: String,
    width: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      holeFrac: 0.4,
      //data
      nonZero: [],
      // refs
      svg: null,
      // methods
      pie: null,
      arc: null,
      colorScale: null
    };
  },
  watch: {
    data: function() {
      this.updatePlot();
    }
  },
  methods: {
    setupPlot() {
      this.svg = select(this.$refs.pie);

      this.pie = pie()
        .sort((a, b) => a.value > b.value ? -1 : 1)
        .value(d => d.count);

      this.arc = arc()
        .innerRadius(this.width / 2 * this.holeFrac)
        .outerRadius(this.width / 2 - 1);
    },
    updatePlot() {
      if (this.data && this.data[0] && this.width) {
        // this.updateScales();
        this.drawPlot();
      }
    },
    updateScales() {},
    drawPlot() {
      this.nonZero = this.data.filter(d => d.count);
      const arcs = this.pie(this.nonZero);
      if (this.id == "Type") {
        this.colorScale = scaleOrdinal()
          .range(["#507ea3", // blue (Dataset)
            "#f28e2c", // orange (WebSite)
            "#e15759", // coral (Publication)
            "#76b7b2", // teal (Analysis)
            "#59a14f", // green (Protocol)
            "#edc949", // yellow (ImageObject)
            "#b475a3", // purple (ClinicalTrial)
            "#ff98a8", // pink (Book)
            "#9c755f"
          ])
          .domain(["Dataset", "WebSite", "Publication", "Analysis", "Protocol", "ImageObject", "ClinicalTrial", "Book"])
          .unknown("#bababa");
      } else {
        this.colorScale = scaleOrdinal(schemeSet2)
          .domain(this.nonZero.map(d => d.term).slice(0, 5))
          .unknown("#bababa");
      }

      const donutSelector = this.svg.selectAll("path").data(arcs);

      donutSelector.join(enter => {
          enter.append("path")
            .attr("d", this.arc)
            .style("fill", d => this.colorScale(d.data.term))
        },
        update => update
        .attr("d", this.arc)
        .style("fill", d => this.colorScale(d.data.term)))
    }
  },
  mounted() {
    this.setupPlot();
    this.updatePlot();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
