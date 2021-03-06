<template>
<div class="d-flex flex-column text-left" v-if="data">
  <!-- authors -->
  <div class="author-container d-flex flex-wrap" v-if="data.author || data.creator">
    <template v-if="data.author && (data.author.length || data.author.name)">
      <template v-if="Array.isArray(data.author)">
        <div class="author" v-for="(author, idx) in data.author" :key="'author2'+idx" id="authors">
          <span>{{
            author.name
              ? author.name
              : (author.givenName ? author.givenName + " " + author.familyName : "")
          }}</span>
          <span v-if="idx < data.author.length - 2" v-html="',&nbsp;'"></span>
          <span v-if="idx == data.author.length - 2 && data.author.length == 2" v-html="'&nbsp;and&nbsp;'"></span>
          <span v-if="idx == data.author.length - 2 && data.author.length > 2" v-html="',&nbsp;and&nbsp;'"></span>
        </div>
      </template>
      <div class="author" v-else id="authors">
        <span>{{
            data.author.name
              ? data.author.name
              : ( data.author.givenName ? data.author.givenName + " " + data.author.familyName : "")
          }}</span>
      </div>

      <a @click.prevent="showAffiliation = !showAffiliation" href=""><small class="text-muted ml-2">
          <span>{{
              showAffiliation ? "hide affiliations" : "view affiliations"
            }}</span>
          <font-awesome-icon :icon="['fas', 'angle-double-down']" class="mx-1" v-if="!showAffiliation" />
          <font-awesome-icon :icon="['fas', 'angle-double-up']" class="mx-1" v-if="showAffiliation" />
        </small>
      </a>

      <div id="author-affiliations" class="d-flex flex-column w-100 mb-3" v-if="showAffiliation && Array.isArray(data.author)">
        <small v-for="(author, idx) in data.author" :key="'author3' +idx" class="text-muted">
          <b>{{
              author.name
                ? author.name
                : (author.givenName ? author.givenName + " " + author.familyName : "")
            }}</b>:
          <template v-if="Array.isArray(author.affiliation)">
            <span v-for="(affiliation, idx) in author.affiliation" :key="'author'+idx">{{ affiliation.name }}</span>
          </template>
          <template v-else>
            <span>{{ author.affiliation.name }}</span>
          </template>
        </small>
      </div>

      <div id="author-affiliations" class="d-flex flex-column w-100 mb-3" v-else-if="showAffiliation">
        <small class="text-muted">
          <b>{{
              data.author.name
                ? data.author.name
                : (data.author.givenName ? data.author.givenName + " " + data.author.familyName : "")
            }}</b>:
          <template v-if="Array.isArray(data.author.affiliation)">
            <span v-for="(affiliation, idx) in data.author.affiliation" :key="'affiliation'+idx">{{ affiliation.name }}</span>
          </template>
          <template v-else>
            <span>{{ data.author.affiliation.name }}</span>
          </template>
        </small>
      </div>
    </template>

    <template v-else-if="data.creator">
      <div class="creator" v-for="(creator, idx) in data.creator" :key="'creator'+idx" id="authors">
        <span>{{
            creator.name
              ? creator.name
              : (creator.givenName ? creator.givenName + " " + creator.familyName : "")
          }}</span>
        <span v-if="idx < data.creator.length - 2" v-html="',&nbsp;'"></span>
        <span v-if="idx == data.creator.length - 2 && !data.creator.length == 2" v-html="',&nbsp;and&nbsp;'"></span>
        <span v-if="idx == data.creator.length - 2 && data.creator.length == 2" v-html="'&nbsp;and&nbsp;'"></span>
      </div>

      <a @click.prevent="showAffiliation = !showAffiliation" href=""><small class="text-muted ml-2">
          <span>{{
              showAffiliation ? "hide affiliations" : "view affiliations"
            }}</span>
          <font-awesome-icon :icon="['fas', 'angle-double-down']" class="mx-1" v-if="!showAffiliation" />
          <font-awesome-icon :icon="['fas', 'angle-double-up']" class="mx-1" v-if="showAffiliation" />
        </small>
      </a>

      <div id="creator-affiliations" class="d-flex flex-column w-100 mb-3" v-if="showAffiliation">
        <small v-for="(creator, idx) in data.creator" :key="'affiliation2' + idx" class="text-muted">
          <b>{{
              creator.name
                ? creator.name
                : (creator.givenName ? creator.givenName + " " + creator.familyName : "")
            }}</b>:
          <template v-if="Array.isArray(creator.affiliation)">
            <span v-for="(affiliation, idx) in creator.affiliation" :key="'affiliation3'+idx">{{ affiliation.name }}</span>
          </template>
          <template v-else>
            <span>{{ creator.affiliation }}</span>
          </template>
        </small>
      </div>
    </template>
  </div>
  <div class="sponsor text-muted" v-if="data.sponsor" id="sponsor">
    sponsored by <span v-for="(sponsor, idx) in data.sponsor" :key="idx">
      {{sponsor.name}}
      <!-- <span v-if="sponsor.role"> ({{sponsor.role}})</span> -->
      <span v-if="idx < data.sponsor.length - 1">,&nbsp;</span>
    </span>
  </div>

  <!-- mini-citation -->
  <div v-if="data['@type'] && data['@type'] == 'Publication'" class="text-muted">
    <span v-if="data.journalName">{{data.journalName}}</span>
    <span v-if="data.volumeNumber">, volume {{data.volumeNumber}}</span>
    <span v-if="data.issueNumber">, issue {{data.issueNumber}}</span>
  </div>

  <!-- dates -->
  <div id="dates">
    <div v-if="
        data.dateModified ||
          data.dateCreated ||
          data.dataUpdated ||
          data.datePublished ||
            data.curatedBy.curationDate ||
          data.curatedBy.versionDate" class="text-muted">

      <span class="badge bg-grey__lightest" v-if="data.dateModified">
        <font-awesome-icon class="mr-1" :icon="['far', 'clock']" />
        updated {{ this.formatDate(data.dateModified) }}
      </span>

      <span v-if="data.datePublished && data.dateModified
        " class="mx-1">&bull;</span>
      <span class="badge bg-grey__lightest" v-if="data.datePublished">
        <font-awesome-icon class="mr-1" :icon="['far', 'clock']" v-if="!data.dateModified" />
        published {{ this.formatDate(data.datePublished) }}
      </span>

      <span v-if="data.dateCreated && (data.datePublished || data.dateModified)" class="mx-1">&bull;</span>

      <span class="badge bg-grey__lightest" v-if="data.dateCreated">
        <font-awesome-icon class="mr-1" :icon="['far', 'clock']" v-if="!data.datePublished && !data.dateModified" />
        created {{ this.formatDate(data.dateCreated) }}
      </span>

      <span v-if="data.curatedBy && data.curatedBy.versionDate && (data.dateCreated || data.datePublished || data.dateModified)" class="mx-1">&bull;</span>
      <span class="badge bg-grey__lightest" v-if="data.curatedBy && data.curatedBy.versionDate">
        version {{ this.formatDate(data.curatedBy.versionDate) }}
      </span>

      <span v-if="data.curatedBy && data.curatedBy.curationDate && (data.dateCreated || data.datePublished || data.dateModified ||  data.curatedBy.versionDate )" class="mx-1">&bull;</span>
      <span class="badge bg-grey__lightest" v-if="data.curatedBy && data.curatedBy.curationDate">
        accessed {{ this.formatDate(data.curatedBy.curationDate) }}
      </span>
    </div>
  </div>

  <!-- keywords -->
  <div class="keyword-container flex flex-wrap mt-2">
    <template v-if="data.topicCategory">
      <template v-if="Array.isArray(data.topicCategory)">
        <small class="topic uppercase px-2 py-1 mb-1 mr-1" v-for="(topic, idx) in data.topicCategory" :key="idx" :data-tippy-info="`search ${topic}`">
          <router-link :to="{
            name: 'Resources',
            query: { q: `&quot;${topic}&quot;` }
          }" class="no-underline">
            {{ topic }}
          </router-link>
        </small>
      </template>

      <small class="topic uppercase px-2 py-1 mb-1 mr-1" :data-tippy-info="`search ${data.topicCategory}`" v-else>
        <router-link :to="{
            name: 'Resources',
            query: { q: `&quot;${data.topicCategory}&quot;` }
          }" class="no-underline">
          {{ data.topicCategory }}
        </router-link>
      </small>
    </template>

    <div v-for="(keyword, idx) in data.keywords" :key="'keyword'+idx" class="mb-1 mr-1">
      <small class="keyword px-2 py-1" v-if="keyword != ''" :data-tippy-info="`search ${keyword}`">
        <router-link :to="{
            name: 'Resources',
            query: { q: `&quot;${keyword}&quot;` }
          }" class="no-underline text-dark">
          {{ keyword }}
        </router-link>
      </small>
    </div>
  </div>
  <!-- source -->
  <div class="mt-2" v-if="data.curatedBy">
    <small>Record provided by
      <a :href="data.curatedBy.url" target="_blank" rel="noreferrer">{{ data.curatedBy.name }}<img v-if="getLogo(data.curatedBy.name)" :src="require(`@/assets/resources/${getLogo(data.curatedBy.name)}`)" alt="data.curatedBy.name" width="auto"
          height="25" class="ml-1 mr-4" />
      </a>
      <router-link :to="{ name: 'Sources' }" aria-label="Learn more about data sources">Learn more</router-link>
    </small>
  </div>

  <ClinicalTrialSummary :data="data" v-if="type == 'ClinicalTrial'" />

  <!-- description -->
  <div class="mt-4" id="description">
    <div v-html="data.description" v-if="data.description"></div>
    <div v-html="data.abstract" v-else-if="data.abstract"></div>
    <div v-else>
      <h6 class="m-0 text-muted">Description</h6>
      <small class="text-muted">not provided</small>
    </div>

  </div>
</div>
</template>

<script lang="js">
import Vue from "vue";

import tippy from "tippy.js";
import "tippy.js/themes/light.css";

import {
  timeFormat,
  timeParse
} from "d3";

import {
  mapState
} from "vuex";

import {
  getResourceMetadata
} from "@/api/resources.js";

import ClinicalTrialSummary from "@/components/ClinicalTrialSummary.vue";

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
import {
  faAngleDoubleDown,
  faAngleDoubleUp
} from "@fortawesome/free-solid-svg-icons";

library.add(faClock, faAngleDoubleDown, faAngleDoubleUp);

export default Vue.extend({
  name: "ResourceDescription",
  props: {
    data: Object,
    type: String
  },
  components: {
    ClinicalTrialSummary,
    FontAwesomeIcon
  },
  data() {
    return ({
      showAffiliation: false
    })
  },
  methods: {
    getLogo(curator) {
      const source = this.resources.flatMap(d => d.sources).filter(d => d.id === curator.toLowerCase() || d.name.toLowerCase() === curator.toLowerCase());
      return source.length == 1 ? source[0].img : null;
    },
    formatDate(dateStr) {
      const parseDate = timeParse("%Y-%m-%d");
      const formatDate = timeFormat("%d %B %Y");
      return dateStr ? formatDate(parseDate(dateStr)) : null;
    }
  },
  computed: {
    ...mapState("admin", ["loading", "resources"]),
    datePublished: function() {
      return (this.formatDate(this.data.dateModified))
    }
  },
  mounted() {
    const id = this.$route.params.id;

    // console.log(this.data)

    tippy(".topic", {
      content: "Loading...",
      maxWidth: "200px",
      placement: "bottom",
      animation: "fade",
      theme: "light",
      onShow(instance) {
        let info = instance.reference.dataset.tippyInfo;
        instance.setContent(info);
      }
    });

    tippy(".keyword", {
      content: "Loading...",
      maxWidth: "200px",
      placement: "bottom",
      animation: "fade",
      theme: "light",
      onShow(instance) {
        let info = instance.reference.dataset.tippyInfo;
        instance.setContent(info);
      }
    });
  }
});
</script>

<style lang="scss" scoped>
.resource-type {
    font-weight: 700;
    text-transform: uppercase;
    opacity: 0.7;
}

.pub-type {
    opacity: 0.6;
}

.topic {
    background: $warning-color;
    color: white;
    border-radius: 5px;
    white-space: nowrap;
    & a {
        color: white;
    }
}

.keyword-container {
    display: flex;
    min-width: 0;
}

.keyword {
    background: lighten($warning-color, 35%);
    border-radius: 5px;
    white-space: nowrap;
}

.pub-type {
    opacity: 0.6;
}

.helper {
    line-height: 1.2em;
}

.section-header {
    text-transform: uppercase;
}
</style>
