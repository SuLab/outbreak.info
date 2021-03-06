<template>
<div class="home flex-column text-left d-flex">
  <div v-if="loading" class="loader">
    <font-awesome-icon class="fa-pulse fa-4x text-highlight" :icon="['fas', 'spinner']" />
  </div>
  <!-- INTRO -->
  <section>
    <div class="row m-0">
      <div class="col-sm-12 d-flex justify-content-center align-items-center bg-main__darker px-0 back-1">
        <div class="d-flex flex-column w-100 align-items-center my-2">
          <img src="@/assets/logo-full-white-01.svg" alt="Outbreak.info" class="w-20" />
          <p class="text-light my-1">
            a standardized, open-source database of COVID-19 resources and epidemiology data
          </p>
        </div>
      </div>
    </div>
  </section>

  <div class="col-sm-12 d-flex justify-content-center align-items-center p-0 bg-grey__lightest hero">
    <div class="row d-flex align-items-center p-3">
      <div class="col-sm-9 d-flex flex-column align-items-center justify-content-center px-4">
        <p class="larger">
          During the COVID-19 pandemic, researchers have been sharing thousands of datasets, papers, and tools each week.
        </p>
        <p class="text-dark larger">
          <b class="text-highlight">outbreak.info</b> compiles a database of COVID-19 and SARS-CoV-2 resources and epidemiology data to easily discover this information.
        </p>
        <small>
          <button class="btn btn-main-outline mt-3">
            <router-link :to="{ name: 'Latest' }" class="no-underline">View latest changes</router-link>
          </button>
        </small>
      </div>

      <div class="col-sm-3">
        <video class="w-100 mb-3" controls>
          <source src="@/assets/home/resources_demo.mp4" type="video/mp4">
          <!-- <source src="@/assets/home/resources_demo.ogv" type="video/ogg"> -->
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>

  <!-- SEARCH  -->
  <section class="d-flex justify-content-center align-items-center mb-4 text-light">
    <div class="row m-0 w-100 d-flex justify-content-center">
      <div class="col-sm-12 col-md-4 px-5 py-3 d-flex flex-column justify-content-between resources-intro">
        <div class="mb-3">
          <router-link :to="{name: 'Resource Summary'}" class="text-light">
            <h3 class="my-3">
              Resources</h3>
          </router-link>

          <div id="resourceBar-text" class="form-text d-block mb-3 text-light-highlight line-height-1">Find COVID-19 and SARS-CoV-2 publications, clinical trials, datasets, protocols, and more</div>
        </div>

        <div>
          <form autocomplete="off" class="w-100">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text bg-grey text-muted border-0" id="sb">
                  <font-awesome-icon :icon="['fas', 'search']" />
                </span>
              </div>
              <input id="resourceBar" class="form-control border" placeholder="Search resources" aria-label="search" aria-describedby="sb" type="text" v-model="searchQuery" @keydown.enter.prevent="submitSearch" />
            </div>
          </form>
          <small id="sBar-example" class="form-text d-block  text-left ml-5"> <span class="mr-2">Try:</span>
            <span class="mr-3">
              <router-link :to="{name: 'Resources', query: {q: 'remdesivir'}} " class="text-light">
                remdesivir
                <font-awesome-icon :icon="['fas', 'angle-double-right']" />
              </router-link>
            </span>
            <router-link :to="{name: 'NIAID'} " class="text-light">
              NIAID-related
              <font-awesome-icon :icon="['fas', 'angle-double-right']" />
            </router-link>
          </small>
        </div>
      </div>

      <div class="col-sm-12 col-md-4 px-5 py-3 d-flex flex-column justify-content-between variants-intro">
        <div  class="mb-3">
          <router-link :to="{name: 'SituationReports'}" class="text-light">
            <h3 class="my-3">Variants</h3>
          </router-link>

          <div id="resourceBar-text" class="form-text d-block mb-3 text-light-highlight line-height-1">Explore SARS-CoV-2 lineage, variant, and mutation situation reports</div>
        </div>

        <div class="">
          <form autocomplete="off" class="w-100">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text bg-grey text-muted border-0" id="sb">
                  <font-awesome-icon :icon="['fas', 'search']" />
                </span>
              </div>
              <TypeaheadSelect :isStandalone="false" class="form-control border" :queryFunction="queryPangolin" @selected="updatePangolin" :apiUrl="this.$genomicsurl" :removeOnSelect="true" placeholder="Search PANGO lineage" />
            </div>
          </form>
          <small id="sBar-example" class="form-text d-block text-left ml-5"> <span class="mr-2">Try:</span>
            <span class="mr-3">
              <router-link :to="{name: 'MutationReport', query: {pango: 'B.1.1.7', selected:'United Kingdom', selectedType: 'country'}} " class="text-light">B.1.1.7
                <font-awesome-icon :icon="['fas', 'angle-double-right']" />
              </router-link>
            </span>
            <span class="mr-3">
              <router-link :to="{name: 'MutationReport', query: {pango: 'B.1.526', muts: 'S:E484K', selected:'New York', selectedType: 'division'}} " class="text-light">B.1.526 with S:E484K
                <font-awesome-icon :icon="['fas', 'angle-double-right']" />
              </router-link>
            </span>
            <span class="mr-3">
              <router-link :to="{name: 'MutationReport', query: { muts: ['S:S13I','S:L452R'], selected:'California', selectedType: 'division'}} " class="text-light">S:S13I & S:L452R
                <font-awesome-icon :icon="['fas', 'angle-double-right']" />
              </router-link>
            </span>
          </small>
        </div>
      </div>


      <!-- EPI INTRO -->
      <div class="col-sm-12 col-md-4 px-5 py-3 d-flex flex-column justify-content-between epi-intro">
        <div class="mb-3">
          <router-link :to="{name: 'Epidemiology'}" class="text-light">
            <h3 class="my-3">Epidemiology</h3>
          </router-link>

          <div id="sBar-text" class="form-text d-block mb-3 text-light-highlight line-height-1">View COVID-19 trends by region, country, state/province, U.S.
            metropolitan area, or U.S. county</div>
        </div>

        <div>
          <SearchBar routeTo="/epidemiology?" placeholder="Search locations" class="w-100" :darkMode="false"></SearchBar>
          <small id="sBar-example" class="form-text d-block text-left ml-5">
            <span class="mr-2">Try:</span>
            <span class="mr-3">
              <router-link :to="{name: 'Epidemiology', query: {location: 'BRA'}} " class="text-light">Brazil
                <font-awesome-icon :icon="['fas', 'angle-double-right']" />
              </router-link>
            </span>
            <router-link :to="{name: 'Epidemiology', query: {location: 'METRO_28140'}} " class="text-light">Kansas City metro area
              <font-awesome-icon :icon="['fas', 'angle-double-right']" />
            </router-link>
          </small>
        </div>

      </div>
    </div>
  </section>

  <!-- RESOURCE EXAMPLES -->
  <section id="resource-examples" class="container my-3">
    <h3>Find COVID-19 resources</h3>
    <div class="row d-flex flex-wrap">

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'Resources'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">Search Resource Library</h5>
            <img src="@/assets/home/resources_search.png" alt="Search Outbreak.info resources" class="w-100 mb-3" />
          </router-link>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <h5 class="text-uppercase">Download metadata</h5>
          <a href="https://api.outbreak.info/try/resources" target="_blank" rel="noreferrer">
            <h6>API</h6>
            <img src="@/assets/home/api_resources.png" alt="Outbreak.info" class="w-100 mb-3" />
          </a>
          <router-link :to="{name: 'Sources', hash: '#resources'}">
            <h6>.tsv files</h6>
            <img src="@/assets/home/download_data.png" alt="Download Outbreak.info metadata" class="w-100 mb-3" />
          </router-link>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'Schema'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">View & adapt schema</h5>
            <div class="h-100 d-flex align-items-center">
              <img src="@/assets/home/schema_example.png" alt="Outbreak.info schema" class="w-100" />
            </div>
          </router-link>
        </div>
      </div>

    </div>
  </section>

  <!-- GENOMICS -->
  <section id="epi-examples" class="container my-3">
    <h3>View SARS-CoV-2 Mutation Reports</h3>
    <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'SituationReports'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">Curated Lineage | Mutation reports</h5>
            <div class="h-100 d-flex align-items-center">
              <img src="@/assets/home/b117_sitrep.png" alt="B.1.1.7 Report" class="w-100" />
            </div>
          </router-link>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'SituationReports', hash:'#custom-report'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">Custom Lineage | Mutation Tracker</h5>
          </router-link>
          <CustomReportForm :minimalistic="true" />
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'LocationReports'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">Location Tracker</h5>
            <div class="h-100 d-flex align-items-center">
              <img src="@/assets/home/usa_locrep.png" alt="USA Mutation Report" class="w-100" />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- EPI EXAMPLES -->
  <section id="epi-examples" class="container my-3">
    <h3>Explore epidemiology data</h3>
    <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'Epidemiology'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">Compare locations over time</h5>
            <img src="@/assets/home/epi_example.svg" alt="Outbreak.info epidemiology data over time" class="w-100" />
          </router-link>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'Maps'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">View by geography</h5>
            <img src="@/assets/home/map_example.svg" alt="Outbreak.info U.S. epidemiology data by metro area" class="w-100" />
          </router-link>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'Compare'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">Find similar regions</h5>
            <img src="@/assets/home/compare_example.png" alt="Outbreak.info compare regions" class="w-100" />
          </router-link>
        </div>
      </div>

      <!-- EPI CURVE SUMMARIES -->
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <section class="w-100 p-3 card" id="regional-epi-curves">
          <router-link :to="{name: 'Regions'}" class="text-dark h-100 d-flex flex-column justify-content-between">
            <h5 class="text-uppercase">Explore regions</h5>
            <div class="h-100 d-flex flex-column justify-content-center">
              <img src="@/assets/home/regions_example.svg" alt="Outbreak.info regional data" class="w-100" />
            </div>
          </router-link>
        </section>
      </div>


      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'Doubling Rates'}" class="text-dark h-100 d-flex flex-column">
            <h5 class="text-uppercase">View doubling rates</h5>
            <div class="h-100 d-flex flex-column justify-content-center">
              <img src="@/assets/home/doubling_example.svg" alt="Outbreak.info doubling rates" class="w-100" />
            </div>
          </router-link>
        </div>

      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <router-link :to="{name: 'Data'}" class="text-dark h-100 d-flex flex-column">
            <h5 class="text-uppercase">View tables</h5>
            <div class="h-100 d-flex flex-column justify-content-center">
              <img src="@/assets/home/data_table.png" alt="Outbreak.info doubling rates" class="w-100" />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Access data -->
  <section id="epi-examples" class="container my-3">
    <h3>Access data</h3>
    <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <a href="https://api.outbreak.info/try/covid19" target="_blank" rel="noreferrer">
            <h5 class="text-dark">API</h5>
            <img src="@/assets/home/api.png" alt="Outbreak.info" class="w-100 mb-3" />
          </a>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="w-100 p-3 card">
          <a href="https://github.com/outbreak-info/R-outbreak-info" target="_blank" rel="noreferrer">
            <h5 class="text-dark">R package</h5>
            <img src="@/assets/home/R_package.png" alt="Outbreak.info" class="w-100" />
          </a>
        </div>
      </div>
    </div>
  </section>


  <section class="d-flex flex-column justify-content-center align-items-left bg-grag-grey text-light px-3 pt-2 mb-5">
    <div class="d-flex justify-content-center align-items-center mb-2">
      <div>
        <h5 class="at-a-glance-header m-0">At a glance</h5>
        <p class="ml-3 mb-0">
          View the three locations with the largest increase in cases in the
          past day, or select your own locations
        </p>
        <button class="btn btn-main-outline router-link no-underline bg-white" @click="summaryDeletable = !summaryDeletable">
          {{ summaryDeletable ? "done" : "change locations" }}
        </button>
      </div>
    </div>

    <div class="row d-flex justify-content-center">
      <GlanceSummary v-for="(location, idx) in glanceSummaries" :key="idx" class="d-flex mx-2 mb-3" :data="location" :idx="location.location_id" :deletable="summaryDeletable" @removed="removeSummary" />

      <div class="d-flex mx-2 py-3 px-3 flex-column align-items-center box-shadow add-items bg-grag-main" v-if="summaryDeletable">
        <h6>Add locations</h6>
        <SearchBar @location="addSummary" class="search-bar"></SearchBar>
      </div>
    </div>
  </section>

</div>
</template>
<script>
// @ is an alias to /src
// import Vue from "vue";
import SearchBar from "@/components/SearchBar.vue";
import CustomReportForm from "@/components/CustomReportForm";
import TypeaheadSelect from "@/components/TypeaheadSelect";
import GlanceSummary from "@/components/GlanceSummary";
import {
  getGlanceSummary
} from "@/api/epi-basics.js";
import Vue from "vue";
import {
  mapState
} from "vuex";

import store from "@/store";

// --- font awesome --
import {
  FontAwesomeIcon
} from "@fortawesome/vue-fontawesome";
import {
  library
} from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner,
  faAngleDoubleRight,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

library.add(faSpinner, faAngleDoubleRight, faSearch);

import {
  findPangolin
} from "@/api/genomics.js";

export default {
  name: "Home",
  components: {
    SearchBar,
    GlanceSummary,
    FontAwesomeIcon,
    CustomReportForm,
    TypeaheadSelect
  },
  data() {
    return {
      searchQuery: "",
      glanceLocations: [],
      glanceSummaries: [],
      summaryDeletable: false,
      dataSubscription: null,
      queryPangolin: null,
    };
  },
  computed: {
    ...mapState("admin", ["loading"])
  },
  methods: {
    submitSearch() {
      this.$router.push({
        name: "Resources",
        query: {
          q: this.searchQuery
        }
      });
    },
    updatePangolin(selected) {
      this.$router.push({
        name: "MutationReport",
        query: {
          pango: selected.name
        }
      });
    },
    removeSummary: function(idx) {
      this.glanceLocations = this.glanceLocations.filter((d, i) => d !== idx);
      Vue.$cookies.set("custom_locations", this.glanceLocations);
      if (this.glanceLocations.length > 0) {
        this.updatedSubscription = getGlanceSummary(
          this.$apiurl,
          this.glanceLocations
        ).subscribe(d => {
          this.glanceSummaries = this.sortSummaries(d);
        });
      } else {
        this.glanceSummaries = [];
      }
    },
    addSummary: function(location_id) {
      this.glanceLocations = this.glanceLocations.concat(location_id);
      Vue.$cookies.set("custom_locations", this.glanceLocations);
      this.updatedSubscription = getGlanceSummary(
        this.$apiurl,
        this.glanceLocations
      ).subscribe(d => {
        this.glanceSummaries = this.sortSummaries(d);
      });
    },
    sortSummaries(data) {
      if (this.glanceLocations && this.glanceLocations.length > 0) {
        data.sort(
          (a, b) =>
          this.glanceLocations.indexOf(a.location_id) -
          this.glanceLocations.indexOf(b.location_id)
        );
      }
      return data;
    }
  },
  destroyed() {
    this.dataSubscription.unsubscribe();
    if (this.updatedSubscription) {
      this.updatedSubscription.unsubscribe();
    }
  },
  mounted() {
    const locations = Vue.$cookies.get("custom_locations");
    this.glanceLocations = locations ? locations.split(",") : [];

    this.queryPangolin = findPangolin;

    this.dataSubscription = getGlanceSummary(
      this.$apiurl,
      this.glanceLocations
    ).subscribe(d => {
      this.glanceSummaries = this.sortSummaries(d);
      this.glanceLocations = d.map(d => d.location_id);
      Vue.$cookies.set("custom_locations", this.glanceLocations);
    });
  }
}
</script>

<style lang="scss" scoped>
.resources-intro {
    background: $primary-color;
}

.variants-intro {
    background: $secondary-color;
    border-left: 3px solid white;
}

.epi-intro {
    background: #507192;
    border-left: 3px solid white;
}

@media (max-width:767px) {
    .epi-intro {
        border: none !important;
    }
    .variants-intro {
        border: none !important;
    }
}

.text-light-highlight {
    color: #d5d5d5 !important;
}

.at-a-glance-header {
    text-transform: uppercase;
}
.search-bar {
    width: 250px;
}

.add-items {
    height: 120px;
}

.w-20 {
    width: 20% !important;
}

.larger {
    font-size: larger;
}
</style>
