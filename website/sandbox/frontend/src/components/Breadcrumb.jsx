import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Breadcrumb({ items }) {
  const lastIndex = items.length - 1;
  const $navItems = items.map((item, index) => {
    const key = index;
    let $content = null;
    if (item.path) {
      $content = <Link to={item.path}>{item.title}</Link>;
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
    title: PropTypes.string.isRequired,
    path: PropTypes.string,
  })).isRequired,
};
