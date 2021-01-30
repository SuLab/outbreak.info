import axios from "axios";
import { from, forkJoin, BehaviorSubject } from "rxjs";
import { finalize, catchError, pluck, map, mergeMap } from "rxjs/operators";
import {
  timeParse,
  timeFormat, format
} from "d3";
import { rollingAverage, calcPrevalence } from "@/js/stats.js";
const parseDate = timeParse("%Y-%m-%d");
const formatPercent = format(".0%");

import store from "@/store";

// reminder: must be the raw verison of the file
const curatedFile = "https://raw.githubusercontent.com/andersen-lab/hCoV19-sitrep/master/curated_mutations.json";

const b117_global = [{"date_time":"2020-09-20","n":1},{"date_time":"2020-09-21","n":1},{"date_time":"2020-09-23","n":1},{"date_time":"2020-09-30","n":2},{"date_time":"2020-10-01","n":1},{"date_time":"2020-10-08","n":1},{"date_time":"2020-10-11","n":3},{"date_time":"2020-10-15","n":3},{"date_time":"2020-10-21","n":14},{"date_time":"2020-10-22","n":7},{"date_time":"2020-10-23","n":3},{"date_time":"2020-10-24","n":5},{"date_time":"2020-10-25","n":1},{"date_time":"2020-10-26","n":2},{"date_time":"2020-10-29","n":18},{"date_time":"2020-10-30","n":8},{"date_time":"2020-10-31","n":4},{"date_time":"2020-11-01","n":39},{"date_time":"2020-11-02","n":48},{"date_time":"2020-11-03","n":7},{"date_time":"2020-11-04","n":4},{"date_time":"2020-11-05","n":86},{"date_time":"2020-11-06","n":31},{"date_time":"2020-11-07","n":1},{"date_time":"2020-11-08","n":104},{"date_time":"2020-11-09","n":47},{"date_time":"2020-11-10","n":18},{"date_time":"2020-11-11","n":45},{"date_time":"2020-11-12","n":148},{"date_time":"2020-11-13","n":182},{"date_time":"2020-11-14","n":133},{"date_time":"2020-11-15","n":90},{"date_time":"2020-11-16","n":12},{"date_time":"2020-11-17","n":103},{"date_time":"2020-11-18","n":97},{"date_time":"2020-11-19","n":60},{"date_time":"2020-11-20","n":36},{"date_time":"2020-11-21","n":115},{"date_time":"2020-11-22","n":263},{"date_time":"2020-11-23","n":38},{"date_time":"2020-11-24","n":34},{"date_time":"2020-11-25","n":13},{"date_time":"2020-11-26","n":101},{"date_time":"2020-11-27","n":94},{"date_time":"2020-11-28","n":77},{"date_time":"2020-11-29","n":57},{"date_time":"2020-11-30","n":51},{"date_time":"2020-12-01","n":31},{"date_time":"2020-12-02","n":62},{"date_time":"2020-12-03","n":56},{"date_time":"2020-12-04","n":176},{"date_time":"2020-12-05","n":98},{"date_time":"2020-12-06","n":60},{"date_time":"2020-12-07","n":306},{"date_time":"2020-12-08","n":225},{"date_time":"2020-12-09","n":195},{"date_time":"2020-12-10","n":999},{"date_time":"2020-12-11","n":396},{"date_time":"2020-12-12","n":304},{"date_time":"2020-12-13","n":574},{"date_time":"2020-12-14","n":720},{"date_time":"2020-12-15","n":734},{"date_time":"2020-12-16","n":767},{"date_time":"2020-12-17","n":969},{"date_time":"2020-12-18","n":1012},{"date_time":"2020-12-19","n":547},{"date_time":"2020-12-20","n":479},{"date_time":"2020-12-21","n":731},{"date_time":"2020-12-22","n":394},{"date_time":"2020-12-23","n":358},{"date_time":"2020-12-24","n":414},{"date_time":"2020-12-25","n":253},{"date_time":"2020-12-26","n":869},{"date_time":"2020-12-27","n":628},{"date_time":"2020-12-28","n":598},{"date_time":"2020-12-29","n":1207},{"date_time":"2020-12-30","n":662},{"date_time":"2020-12-31","n":812},{"date_time":"2021-01-01","n":383},{"date_time":"2021-01-02","n":1394},{"date_time":"2021-01-03","n":1024},{"date_time":"2021-01-04","n":1192},{"date_time":"2021-01-05","n":924},{"date_time":"2021-01-06","n":452},{"date_time":"2021-01-07","n":439},{"date_time":"2021-01-08","n":819},{"date_time":"2021-01-09","n":851},{"date_time":"2021-01-10","n":431},{"date_time":"2021-01-11","n":282},{"date_time":"2021-01-12","n":32},{"date_time":"2021-01-13","n":12},{"date_time":"2021-01-14","n":9},{"date_time":"2021-01-15","n":6},{"date_time":"2021-01-16","n":6},{"date_time":"2021-01-17","n":9},{"date_time":"2021-01-18","n":15},{"date_time":"2021-01-19","n":64}];

const b117_us = [{"date_time":"2020-12-18","n":1},{"date_time":"2020-12-19","n":1},{"date_time":"2020-12-20","n":4},{"date_time":"2020-12-21","n":1},{"date_time":"2020-12-24","n":3},{"date_time":"2020-12-26","n":14},{"date_time":"2020-12-27","n":5},{"date_time":"2020-12-28","n":13},{"date_time":"2020-12-29","n":19},{"date_time":"2020-12-30","n":13},{"date_time":"2020-12-31","n":21},{"date_time":"2021-01-02","n":12},{"date_time":"2021-01-03","n":11},{"date_time":"2021-01-04","n":19},{"date_time":"2021-01-05","n":24},{"date_time":"2021-01-06","n":14},{"date_time":"2021-01-07","n":14},{"date_time":"2021-01-08","n":8},{"date_time":"2021-01-09","n":4},{"date_time":"2021-01-11","n":1},{"date_time":"2021-01-14","n":4},{"date_time":"2021-01-15","n":2},{"date_time":"2021-01-16","n":2},{"date_time":"2021-01-18","n":3}];

const b117_sd = [{"date_time":"2020-12-29","n":1}];

const all_global = [{"date_time":"2020-09-20","n":673},{"date_time":"2020-09-21","n":2316},{"date_time":"2020-09-22","n":883},{"date_time":"2020-09-23","n":962},{"date_time":"2020-09-24","n":2232},{"date_time":"2020-09-25","n":1107},{"date_time":"2020-09-26","n":438},{"date_time":"2020-09-27","n":978},{"date_time":"2020-09-28","n":1086},{"date_time":"2020-09-29","n":960},{"date_time":"2020-09-30","n":1005},{"date_time":"2020-10-01","n":1904},{"date_time":"2020-10-02","n":1092},{"date_time":"2020-10-03","n":930},{"date_time":"2020-10-04","n":582},{"date_time":"2020-10-05","n":2459},{"date_time":"2020-10-06","n":1873},{"date_time":"2020-10-07","n":1806},{"date_time":"2020-10-08","n":1428},{"date_time":"2020-10-09","n":1350},{"date_time":"2020-10-10","n":678},{"date_time":"2020-10-11","n":928},{"date_time":"2020-10-12","n":2976},{"date_time":"2020-10-13","n":1242},{"date_time":"2020-10-14","n":1613},{"date_time":"2020-10-15","n":2289},{"date_time":"2020-10-16","n":1275},{"date_time":"2020-10-17","n":1012},{"date_time":"2020-10-18","n":721},{"date_time":"2020-10-19","n":2001},{"date_time":"2020-10-20","n":1919},{"date_time":"2020-10-21","n":2750},{"date_time":"2020-10-22","n":2598},{"date_time":"2020-10-23","n":1232},{"date_time":"2020-10-24","n":1251},{"date_time":"2020-10-25","n":612},{"date_time":"2020-10-26","n":3787},{"date_time":"2020-10-27","n":1436},{"date_time":"2020-10-28","n":815},{"date_time":"2020-10-29","n":1630},{"date_time":"2020-10-30","n":1697},{"date_time":"2020-10-31","n":776},{"date_time":"2020-11-01","n":1972},{"date_time":"2020-11-02","n":4317},{"date_time":"2020-11-03","n":1454},{"date_time":"2020-11-04","n":2064},{"date_time":"2020-11-05","n":2007},{"date_time":"2020-11-06","n":1439},{"date_time":"2020-11-07","n":1134},{"date_time":"2020-11-08","n":2152},{"date_time":"2020-11-09","n":2860},{"date_time":"2020-11-10","n":1386},{"date_time":"2020-11-11","n":1998},{"date_time":"2020-11-12","n":2299},{"date_time":"2020-11-13","n":2341},{"date_time":"2020-11-14","n":2528},{"date_time":"2020-11-15","n":1236},{"date_time":"2020-11-16","n":2522},{"date_time":"2020-11-17","n":1606},{"date_time":"2020-11-18","n":2553},{"date_time":"2020-11-19","n":1028},{"date_time":"2020-11-20","n":1526},{"date_time":"2020-11-21","n":948},{"date_time":"2020-11-22","n":1262},{"date_time":"2020-11-23","n":3081},{"date_time":"2020-11-24","n":1894},{"date_time":"2020-11-25","n":1215},{"date_time":"2020-11-26","n":982},{"date_time":"2020-11-27","n":1156},{"date_time":"2020-11-28","n":635},{"date_time":"2020-11-29","n":638},{"date_time":"2020-11-30","n":3162},{"date_time":"2020-12-01","n":990},{"date_time":"2020-12-02","n":1125},{"date_time":"2020-12-03","n":1097},{"date_time":"2020-12-04","n":972},{"date_time":"2020-12-05","n":662},{"date_time":"2020-12-06","n":865},{"date_time":"2020-12-07","n":3980},{"date_time":"2020-12-08","n":1138},{"date_time":"2020-12-09","n":1230},{"date_time":"2020-12-10","n":2646},{"date_time":"2020-12-11","n":2058},{"date_time":"2020-12-12","n":1267},{"date_time":"2020-12-13","n":1433},{"date_time":"2020-12-14","n":5317},{"date_time":"2020-12-15","n":2173},{"date_time":"2020-12-16","n":2063},{"date_time":"2020-12-17","n":2421},{"date_time":"2020-12-18","n":2338},{"date_time":"2020-12-19","n":1581},{"date_time":"2020-12-20","n":1594},{"date_time":"2020-12-21","n":4892},{"date_time":"2020-12-22","n":1351},{"date_time":"2020-12-23","n":1111},{"date_time":"2020-12-24","n":1165},{"date_time":"2020-12-25","n":647},{"date_time":"2020-12-26","n":1855},{"date_time":"2020-12-27","n":1632},{"date_time":"2020-12-28","n":4450},{"date_time":"2020-12-29","n":2403},{"date_time":"2020-12-30","n":1502},{"date_time":"2020-12-31","n":1526},{"date_time":"2021-01-01","n":652},{"date_time":"2021-01-02","n":2059},{"date_time":"2021-01-03","n":1620},{"date_time":"2021-01-04","n":4947},{"date_time":"2021-01-05","n":1760},{"date_time":"2021-01-06","n":1132},{"date_time":"2021-01-07","n":911},{"date_time":"2021-01-08","n":1249},{"date_time":"2021-01-09","n":1139},{"date_time":"2021-01-10","n":586},{"date_time":"2021-01-11","n":1822},{"date_time":"2021-01-12","n":112},{"date_time":"2021-01-13","n":59},{"date_time":"2021-01-14","n":44},{"date_time":"2021-01-15","n":43},{"date_time":"2021-01-16","n":15},{"date_time":"2021-01-17","n":28},{"date_time":"2021-01-18","n":19},{"date_time":"2021-01-19","n":71}];

const all_us = [{"date_time":"2020-09-20","n":46},{"date_time":"2020-09-21","n":141},{"date_time":"2020-09-22","n":135},{"date_time":"2020-09-23","n":188},{"date_time":"2020-09-24","n":163},{"date_time":"2020-09-25","n":182},{"date_time":"2020-09-26","n":97},{"date_time":"2020-09-27","n":57},{"date_time":"2020-09-28","n":179},{"date_time":"2020-09-29","n":154},{"date_time":"2020-09-30","n":174},{"date_time":"2020-10-01","n":212},{"date_time":"2020-10-02","n":206},{"date_time":"2020-10-03","n":73},{"date_time":"2020-10-04","n":115},{"date_time":"2020-10-05","n":334},{"date_time":"2020-10-06","n":243},{"date_time":"2020-10-07","n":233},{"date_time":"2020-10-08","n":226},{"date_time":"2020-10-09","n":201},{"date_time":"2020-10-10","n":77},{"date_time":"2020-10-11","n":91},{"date_time":"2020-10-12","n":285},{"date_time":"2020-10-13","n":225},{"date_time":"2020-10-14","n":228},{"date_time":"2020-10-15","n":280},{"date_time":"2020-10-16","n":234},{"date_time":"2020-10-17","n":104},{"date_time":"2020-10-18","n":104},{"date_time":"2020-10-19","n":327},{"date_time":"2020-10-20","n":274},{"date_time":"2020-10-21","n":294},{"date_time":"2020-10-22","n":282},{"date_time":"2020-10-23","n":218},{"date_time":"2020-10-24","n":105},{"date_time":"2020-10-25","n":70},{"date_time":"2020-10-26","n":322},{"date_time":"2020-10-27","n":257},{"date_time":"2020-10-28","n":240},{"date_time":"2020-10-29","n":211},{"date_time":"2020-10-30","n":234},{"date_time":"2020-10-31","n":90},{"date_time":"2020-11-01","n":79},{"date_time":"2020-11-02","n":317},{"date_time":"2020-11-03","n":218},{"date_time":"2020-11-04","n":295},{"date_time":"2020-11-05","n":235},{"date_time":"2020-11-06","n":189},{"date_time":"2020-11-07","n":111},{"date_time":"2020-11-08","n":55},{"date_time":"2020-11-09","n":288},{"date_time":"2020-11-10","n":275},{"date_time":"2020-11-11","n":167},{"date_time":"2020-11-12","n":224},{"date_time":"2020-11-13","n":238},{"date_time":"2020-11-14","n":143},{"date_time":"2020-11-15","n":128},{"date_time":"2020-11-16","n":442},{"date_time":"2020-11-17","n":406},{"date_time":"2020-11-18","n":431},{"date_time":"2020-11-19","n":342},{"date_time":"2020-11-20","n":377},{"date_time":"2020-11-21","n":120},{"date_time":"2020-11-22","n":124},{"date_time":"2020-11-23","n":447},{"date_time":"2020-11-24","n":397},{"date_time":"2020-11-25","n":318},{"date_time":"2020-11-26","n":73},{"date_time":"2020-11-27","n":220},{"date_time":"2020-11-28","n":126},{"date_time":"2020-11-29","n":180},{"date_time":"2020-11-30","n":625},{"date_time":"2020-12-01","n":355},{"date_time":"2020-12-02","n":410},{"date_time":"2020-12-03","n":253},{"date_time":"2020-12-04","n":253},{"date_time":"2020-12-05","n":65},{"date_time":"2020-12-06","n":36},{"date_time":"2020-12-07","n":198},{"date_time":"2020-12-08","n":165},{"date_time":"2020-12-09","n":181},{"date_time":"2020-12-10","n":200},{"date_time":"2020-12-11","n":231},{"date_time":"2020-12-12","n":97},{"date_time":"2020-12-13","n":24},{"date_time":"2020-12-14","n":213},{"date_time":"2020-12-15","n":273},{"date_time":"2020-12-16","n":160},{"date_time":"2020-12-17","n":192},{"date_time":"2020-12-18","n":160},{"date_time":"2020-12-19","n":122},{"date_time":"2020-12-20","n":210},{"date_time":"2020-12-21","n":237},{"date_time":"2020-12-22","n":98},{"date_time":"2020-12-23","n":125},{"date_time":"2020-12-24","n":138},{"date_time":"2020-12-25","n":48},{"date_time":"2020-12-26","n":336},{"date_time":"2020-12-27","n":199},{"date_time":"2020-12-28","n":433},{"date_time":"2020-12-29","n":339},{"date_time":"2020-12-30","n":323},{"date_time":"2020-12-31","n":247},{"date_time":"2021-01-01","n":56},{"date_time":"2021-01-02","n":226},{"date_time":"2021-01-03","n":189},{"date_time":"2021-01-04","n":508},{"date_time":"2021-01-05","n":340},{"date_time":"2021-01-06","n":421},{"date_time":"2021-01-07","n":259},{"date_time":"2021-01-08","n":199},{"date_time":"2021-01-09","n":57},{"date_time":"2021-01-10","n":31},{"date_time":"2021-01-11","n":97},{"date_time":"2021-01-12","n":44},{"date_time":"2021-01-13","n":17},{"date_time":"2021-01-14","n":30},{"date_time":"2021-01-15","n":25},{"date_time":"2021-01-16","n":6},{"date_time":"2021-01-17","n":2},{"date_time":"2021-01-18","n":7}];

const all_sd = [{"date_time":"2020-09-20","n":2},{"date_time":"2020-09-21","n":16},{"date_time":"2020-09-22","n":9},{"date_time":"2020-09-23","n":6},{"date_time":"2020-09-24","n":4},{"date_time":"2020-09-25","n":10},{"date_time":"2020-09-28","n":17},{"date_time":"2020-09-29","n":11},{"date_time":"2020-09-30","n":2},{"date_time":"2020-10-01","n":5},{"date_time":"2020-10-02","n":3},{"date_time":"2020-10-05","n":12},{"date_time":"2020-10-06","n":14},{"date_time":"2020-10-07","n":9},{"date_time":"2020-10-08","n":4},{"date_time":"2020-10-09","n":7},{"date_time":"2020-10-10","n":1},{"date_time":"2020-10-11","n":1},{"date_time":"2020-10-12","n":3},{"date_time":"2020-10-13","n":5},{"date_time":"2020-10-14","n":1},{"date_time":"2020-10-15","n":3},{"date_time":"2020-10-16","n":5},{"date_time":"2020-10-18","n":1},{"date_time":"2020-10-19","n":8},{"date_time":"2020-10-20","n":9},{"date_time":"2020-10-21","n":14},{"date_time":"2020-10-22","n":8},{"date_time":"2020-10-23","n":2},{"date_time":"2020-10-26","n":7},{"date_time":"2020-10-27","n":6},{"date_time":"2020-10-28","n":13},{"date_time":"2020-10-29","n":3},{"date_time":"2020-10-30","n":9},{"date_time":"2020-11-02","n":10},{"date_time":"2020-11-03","n":5},{"date_time":"2020-11-04","n":15},{"date_time":"2020-11-05","n":4},{"date_time":"2020-11-06","n":4},{"date_time":"2020-11-09","n":5},{"date_time":"2020-11-10","n":8},{"date_time":"2020-11-11","n":5},{"date_time":"2020-11-12","n":16},{"date_time":"2020-11-13","n":1},{"date_time":"2020-11-14","n":1},{"date_time":"2020-11-15","n":5},{"date_time":"2020-11-17","n":4},{"date_time":"2020-11-18","n":6},{"date_time":"2020-11-19","n":3},{"date_time":"2020-11-22","n":1},{"date_time":"2020-11-23","n":4},{"date_time":"2020-11-24","n":2},{"date_time":"2020-11-25","n":15},{"date_time":"2020-11-27","n":5},{"date_time":"2020-11-28","n":1},{"date_time":"2020-11-29","n":5},{"date_time":"2020-11-30","n":15},{"date_time":"2020-12-01","n":13},{"date_time":"2020-12-02","n":6},{"date_time":"2020-12-03","n":13},{"date_time":"2020-12-04","n":11},{"date_time":"2020-12-05","n":3},{"date_time":"2020-12-06","n":4},{"date_time":"2020-12-07","n":3},{"date_time":"2020-12-08","n":8},{"date_time":"2020-12-09","n":7},{"date_time":"2020-12-10","n":5},{"date_time":"2020-12-11","n":2},{"date_time":"2020-12-12","n":2},{"date_time":"2020-12-13","n":1},{"date_time":"2020-12-14","n":5},{"date_time":"2020-12-15","n":5},{"date_time":"2020-12-16","n":2},{"date_time":"2020-12-17","n":7},{"date_time":"2020-12-29","n":1}];


export function getDates(scope) {
  if (scope == "global") {
    return (rollingAverage(b117_global, all_global))
  } else if (scope == "US") {
    return (rollingAverage(b117_us, all_us))
  } else {
    return (rollingAverage(b117_sd, all_sd))
  }
}


export function getReportData(apiurl, locations, mutationVar, mutationString, locationType = "country") {
  store.state.admin.reportloading = true;

  return forkJoin([
    getTemporalPrevalence(apiurl, "Worldwide", mutationString, mutationVar, null),
    getCountryPrevalence(apiurl, mutationString, mutationVar),
    getCuratedMetadata(mutationString)
  ]).pipe(
    map(([longitudinal, byCountry, md]) => {
      return({ longitudinal: longitudinal, byCountry: byCountry, md: md })
    }),
    catchError(e => {
      console.log("%c Error in getting initial report data!", "color: red");
      console.log(e);
      return from([]);
    }),
    finalize(() => store.state.admin.reportloading = false)
  )
}

export function updateLocationData() {

}

export function getCountryPrevalence(apiurl, mutationString, mutationVar) {
  const url = `${apiurl}lineage-by-country-most-recent?${mutationVar}=${mutationString}`;
  return from(axios.get(url, {
    headers: {
      "Content-Type": "application/json"
    }
  })).pipe(
    pluck("data", "results"),
    map(results => {
      results.forEach(d => {
        d["name"] = d.country;
        d["proportion_formatted"] = formatPercent(d.proportion);
        d["dateTime"] = parseDate(d.date);
        d["location_id"] = d.country.replace(/\s/g, "");
      })
      return(results)
    }),
    catchError(e => {
      console.log("%c Error in getting recent prevalence data by country!", "color: red");
      console.log(e);
      return from([]);
    })
)
}

export function getTemporalPrevalence(apiurl, location, mutationString, mutationVar, indivCall = false, locationType = "country") {
  store.state.admin.reportloading = true;
  let url;
  if (location == "Worldwide") {
    url = `${apiurl}prevalence?${mutationVar}=${mutationString}`;
  } else {
    url = `${apiurl}prevalence-by-country?${mutationVar}=${mutationString}&${locationType}=${location}`;
  }

  return from(axios.get(url, {
    headers: {
      "Content-Type": "application/json"
    }
  })).pipe(
    pluck("data", "results"),
    map(results => {
      results.forEach(d => {
        d["dateTime"] = parseDate(d.date);
      })
      return(results)
    }),
    catchError(e => {
      console.log("%c Error in getting temporal data by location!", "color: red");
      console.log(e);
      return from([]);
    }),
    finalize(() => indivCall ? store.state.admin.reportloading = false : null)
  )
}

export function getCuratedMetadata(id) {
  return from(
    axios.get(curatedFile, {
      headers: {
        "Content-Type": "application/json"
      }
    })
  ).pipe(
    pluck("data"),
    map(results => {
      const curated = results.filter(d => d.mutation_name == id);
      if (curated.length === 1) {
        return (curated[0])
      } else {
        console.log("No reports or more than one report metadata found!")
      }
    }),
    // mergeMap(md => getLineageResources(apiUrl, md, 10, 1).pipe(
    //   map(resources => {
    //     resources["md"] = md;
    //     return(resources)
    //   })
    // )),
    catchError(e => {
      console.log("%c Error in getting curated data!", "color: red");
      console.log(e);
      return from([]);
    })
  )
}

export function getLineageResources(apiUrl, queryString, size, page, sort = "-date") {
  const fields = "@type, name, author, date, journalName"
  const timestamp = Math.round(new Date().getTime() / 36e5);


  return from(
    axios.get(`${apiUrl}query?q=${queryString}&sort=${sort}&size=${size}&from=${page}&fields=${fields}&timestamp=${timestamp}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
  ).pipe(
    pluck("data"),
    map(results => {
      const formatDate = timeFormat("%e %B %Y");

      results["hits"].forEach(d => {
        const parsedDate = parseDate(d.date)
        d["dateFormatted"] = formatDate(parsedDate);
      })

      return ({
        resources: results["hits"],
        total: results["total"]
      })
    }),
    catchError(e => {
      console.log("%c Error in getting resource metadata!", "color: red");
      console.log(e);
      return from([]);
    })
  )

}
