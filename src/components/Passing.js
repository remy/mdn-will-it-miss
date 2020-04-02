import React from 'react';
import formatNumber from 'format-number';
import format from 'date-fns/format';

const formatter = formatNumber();

export default function Passing({ data }) {
  return data.map((_, i) => (
    <p key={i}>
      Misses {_.orbiting_body} tomorrow at{' '}
      {format(_.epoch_date_close_approach, 'h:mmaaaa')} by{' '}
      {formatter(parseInt(_.miss_distance.miles, 10))} miles whilst travelling
      at {formatNumber({ truncate: 0 })(_.relative_velocity.miles_per_hour)}mph
    </p>
  ));
}
