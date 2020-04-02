/* eslint-env node */
const axios = require('axios');
const addDays = require('date-fns/addDays');

function getDate(d = new Date()) {
  return d.toJSON().split('T')[0];
}

// tests the structure of the json is the way we expect
function test() {
  return axios
    .get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${getDate()}&api_key=DEMO_KEY`
    )
    .then(({ data }) => {
      const day = getDate(addDays(new Date(), 1));

      // this will also throw if we can't access the value
      let dayData = null;
      try {
        dayData = data.near_earth_objects[day];
      } catch (e) {
        throw new Error(
          'Unexpected data structure, was looking for :root.near_earth_objects[array]'
        );
      }

      if (!dayData) {
        throw new Error('Missing any day for tomorrow');
      }

      const first = dayData[0];
      if (typeof first.is_potentially_hazardous_asteroid === 'undefined') {
        throw new Error(
          'Missing key "is_potentially_hazardous_asteroid" from first data point, presuming remaining data is wrong.'
        );
      }
    });
}

test().catch((e) => {
  console.log(`Failed: ${e.message}`);
  process.exit(1);
});
