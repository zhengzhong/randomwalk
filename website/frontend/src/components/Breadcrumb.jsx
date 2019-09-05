import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Breadcrumb({ items }) {
  const lastIndex = items.length - 1;
  const $navItems = items.map((item, index) => {
    const key = index;
    let $content = null;
    if (item.link) {
      $content = <Link to={item.link}>{item.title}</Link>;
    } else {
      $content = item.title;
    }
    return (
      <li key={key} className={`breadcrumb-item ${index === lastIndex ? 'active' : ''}`}>
        {$content}
      </li>
    );
  });
  return (
    <nav>
      <ol className="breadcrumb">
        {$navItems}
      </ol>
    </nav>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string,
    title: PropTypes.string.isRequired,
  })).isRequired,
};

export default Breadcrumb;
