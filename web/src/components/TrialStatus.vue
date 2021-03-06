<template>
<div>
  <div class="d-flex flex-column  mb-3">
    <div class="status-container d-flex justify-content-between align-items-center py-1 px-2 mt-2">
      <div class="d-flex align-items-center">
        <!-- status -->
        <small class="status">
          {{ status.status }}
        </small>
        <!-- status date -->
        <span class="ml-3" v-if="includeDate">
          <small>
            <font-awesome-icon class="mr-1 text-muted" :icon="['far', 'clock']" />
            as of {{ status.statusDate }}
          </small>
        </span>
      </div>

      <small class="text-dark" v-if="status.enrollmentCount">
        {{ status.enrollmentType }} size:
        {{ status.enrollmentCount.toLocaleString() }}
      </small>
    </div>
    <small v-if="status.whyStopped" class="status-stopped  px-2">
      Why stopped: {{status.whyStopped}}
    </small>
  </div>
  <CountryMap :countries="countries" :width="mapWidth" v-if="countries.length" />
</div>
</template>

<script lang="js">
import Vue from "vue";
import CountryMap from "@/components/CountryMap.vue";
import uniq from "lodash/uniq";

// --- font awesome --
import {
  FontAwesomeIcon
} from "@fortawesome/vue-fontawesome";
import {
  library
} from "@fortawesome/fontawesome-svg-core";
import {
  faClock
} from "@fortawesome/free-regular-svg-icons";

library.add(faClock);

export default Vue.extend({
  name: "TrialStatus",
  props: {
    status: Object,
    locations: Array,
    includeDate: {
      type: Boolean,
      default: false
    },
    mapWidth: {
      type: Number,
      default: 200
    }
  },
  components: {
    CountryMap,
    FontAwesomeIcon
  },
  data() {
    return {
      phaseWidth: 37,
      triangleWidth: 10,
      allPhases: [1, 2, 3, 4],
      spacer: 7,
      height: 17
    };
  },
  watch: {},
  computed: {
    width() {
      return (this.phaseWidth * 5 + this.spacer * 4)
    },
    countries() {
      return (uniq(this.locations.map(d => d.studyLocationCountry).sort((a, b) => a < b ? -1 : 1)));
    }
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.status-container {
    background: lighten($clinical-trial-color, 32%);
}

.status {
    text-transform: uppercase;
    font-weight: 700;
    color: darken($clinical-trial-color, 15%);
}

.status-stopped {
    color: white;
    background: $clinical-trial-color;
}
</style>
