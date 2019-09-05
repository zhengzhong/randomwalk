/**
 * Creates an object for the `Link` component's `to` property, containing the from location of
 * the link:
 *
 *   <Link to={createLinkTarget(this.props.location, '/target/pathname')}>...</Link>
 */
export function createLinkTarget(location, pathname) {
  const state = {
    from: {
      pathname: location.pathname,
      search: location.search,
    },
  };
  return { pathname, state };
}


/**
 * Returns the from link extracted from the `location` object. If the from location is not
 * available, returns the default value.
 */
export function getFromLink(location, defaultValue) {
  let fromLink = defaultValue || null;
  if (location.state && location.state.from) {
    const from = location.state.from;
    fromLink = `${from.pathname}${from.search || ''}`;
  }
  return fromLink;
}


export default {
  createLinkTarget,
  getFromLink,
};
