import React from 'react';
import { render } from 'react-dom';
import { useAsync } from 'react-async-hook';
import formatNumber from 'format-number';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import './index.css';

const formatter = formatNumber();

const YesNo = new Map([
  [true, 'YES 😱'],
  [false, 'nope'],
]);

function getDate(d = new Date()) {
  return d.toJSON().split('T')[0];
}

const Hazard = ({ yes }) => <span className="hazard">{YesNo.get(yes)}</span>;

const Passing = ({ body, data }) => {
  return data.map((_, i) => (
    <p key={i}>
      Misses {_.orbiting_body} tomorrow at{' '}
      {format(_.epoch_date_close_approach, 'h:mmaaaa')} by{' '}
      {formatter(parseInt(_.miss_distance.miles, 10))} miles whilst travelling
      at {formatNumber({ truncate: 0 })(_.relative_velocity.miles_per_hour)}mph
    </p>
  ));
};

const Orbital = ({
  name,
  is_potentially_hazardous_asteroid,
  close_approach_data,
  nasa_jpl_url,
}) => {
  return (
    <div
      className={is_potentially_hazardous_asteroid ? 'is-hazard' : 'no-hazard'}
    >
      <h2>{name.replace(/[()]/g, '')}</h2>
      <p>
        Potentially hazardous?{' '}
        <Hazard yes={is_potentially_hazardous_asteroid} />
      </p>
      <Passing data={close_approach_data} />
      <p className="more">
        <a href={nasa_jpl_url} target="_blank">
          Find out more
        </a>
      </p>
    </div>
  );
};

const fetchData = () =>
  fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${getDate()}&api_key=DEMO_KEY`
  ).then(res => res.json());

function App() {
  const data = useAsync(fetchData, []);

  if (data.loading) {
    document.title = 'Counting potential earth HAZARDS…';

    return (
      <p>
        Getting data from NASA right now to check whether something from space
        is going to hit us. One moment…
      </p>
    );
  }

  const day = getDate(addDays(new Date(), 1));
  const hazards = data.result.near_earth_objects[day].reduce((acc, curr) => {
    if (curr.is_potentially_hazardous_asteroid) {
      return acc + 1;
    }
    return acc;
  }, 0);

  document.title = `${hazards} potential HAZARDS ${hazards > 0 ? '😱' : '👍'}`;

  const results = data.result.near_earth_objects[day];
  return (
    <div>
      <p>
        Tomorrow there will be <strong>{results.length}</strong> near misses.
      </p>
      <hr></hr>
      {results
        .sort(a => (a.is_potentially_hazardous_asteroid ? -1 : 1))
        .map(data => (
          <Orbital key={data.id} {...data}></Orbital>
        ))}
    </div>
  );
}

render(<App />, document.getElementById('app'));
