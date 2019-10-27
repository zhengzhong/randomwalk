import React from 'react';
import PropTypes from 'prop-types';

import { uniqueId } from 'lodash';


export default function Carousel({ pictures }) {
  if (!pictures || pictures.length === 0) {
    return <div />;
  }

  const carouselId = uniqueId('carousel');
  const carouselRef = `#${carouselId}`;

  const $indicators = pictures.map((picture, index) => (
    <li
      key={`indicator:${picture}`}
      className={index === 0 && 'active'}
      data-target={carouselRef}
      data-slide-to={index}
    />
  ));

  const $items = pictures.map((picture, index) => (
    <div key={`item:${picture}`} className={`carousel-item ${index === 0 && 'active'}`}>
      <img className="d-block w-100" src={picture} alt={picture} />
    </div>
  ));

  return (
    <div id={carouselId} className="carousel slide" data-ride="carousel">
      <ol className="carousel-indicators">
        {$indicators}
      </ol>
      <div className="carousel-inner">
        {$items}
      </div>
      <a className="carousel-control-prev" href={carouselRef} role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href={carouselRef} role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
}


Carousel.propTypes = {
  pictures: PropTypes.arrayOf(PropTypes.string).isRequired,
};
