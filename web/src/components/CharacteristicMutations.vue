<template>
<div>
  <h4 class="mb-0">{{ definitionLabel }}</h4>
  <small class="text-muted">Mutations in at least {{charMutThreshold}} of sequences <router-link v-if="reportType != 'mutation'" :to="{name: 'SituationReportMethodology', hash: '#characteristic'}" target="_blank">(read more)</router-link></small>

  <SARSMutationMap :mutationKey="mutationName" :lineageMutations="mutations" :additionalMutations="additionalMutations" class="mb-3" v-if="mutations || additionalMutations" :copyable="true" />

  <div class="d-flex align-items-center ml-2 mr-3">
    <button class="btn btn-main-outline btn-mut router-link px-1 collapsed" data-toggle="collapse" href="#mutation-table" aria-expanded="false" aria-controls="mutation-table">
      <small><span class="if-collapsed">View</span>
        <span class="if-not-collapsed">Hide</span>
        mutation table</small>
    </button>
    <DownloadReportData :data="mutations" figureRef="mutation-map" dataType="Mutation Map" />
  </div>


  <div class="collapse ml-2" id="mutation-table">
    <div class="row">
      <div class="col" v-if="lineageName">
        <MutationTable :mutations="mutations" :tableTitle="`Characteristic mutations of ${lineageName}`" />
      </div>
      <div class="col" v-if="additionalMutations.length > 0">
        <MutationTable :mutations="additionalMutations" tableTitle="Additional Mutations" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from "vue";
// --- store / Vuex ---
import {
  mapState
} from "vuex";

import { format } from "d3";

import SARSMutationMap from "@/components/SARSMutationMap.vue";
import MutationTable from "@/components/MutationTable.vue";
import DownloadReportData from "@/components/DownloadReportData.vue";

export default {
  name: "CharacteristicMutations",
  computed: {
    ...mapState("genomics", ["characteristicThreshold"]),
    charMutThreshold() {
      return(format(".0%")(this.characteristicThreshold))
    }
  },
  props: {
    mutations: Array,
    definitionLabel: String,
    mutationName: String,
    lineageName: String,
    reportType: String,
    additionalMutations: Array
  },
  components: {
    SARSMutationMap,
    MutationTable,
    DownloadReportData
  }
}
</script>

<style lang="scss">
[data-toggle="collapse"] {
    &.collapsed .if-not-collapsed {
        display: none;
    }
    &:not(.collapsed) .if-collapsed {
        display: none;
    }
}

.btn-mut {
    flex-basis: 210px;
    line-height: 1 !important;
}
</style>
