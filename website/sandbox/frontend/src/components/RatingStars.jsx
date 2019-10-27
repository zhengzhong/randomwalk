import React from 'react';
import PropTypes from 'prop-types';

function RatingStars({ score, count }) {
  const normalizedScore = Math.max(Math.min(score, 5), 0);
  const width = `${normalizedScore * 100 / 5}%`;
  const scoreDisplay = normalizedScore.toFixed(1);
  return (
    <div>
      <div>
        <span className="stars">
          <span className="stars-fill" style={{ width: width }} />
        </span>
      </div>
      <div>
        <span className="badge-group">
          <span className="badge badge-primary">{scoreDisplay}</span>
          <span className="badge badge-primary badge-outline">{count} 人评价</span>
        </span>
      </div>
    </div>
  );
}

RatingStars.propTypes = {
  score: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

export default RatingStars;
