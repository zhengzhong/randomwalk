import React from 'react';
import PropTypes from 'prop-types';

const FIXED_TOP = 'fixed-top';
const FIXED_BOTTOM = 'fixed-bottom';

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.timeoutId = null;
    this.state = {
      percentage: 0,
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading !== this.props.loading) {
      // Whenever the `loading` prop is changed, we reset the percentage to 0 and restart.
      this._resetAndAnimate();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  _resetAndAnimate() {
    this.setState({ percentage: 0 }, () => this._animate());
  }

  _animate() {
    let { percentage } = this.state;
    if (!this.props.loading) {
      if (percentage > 100) {
        return;
      }
      // If the percentage has not yet reached 100%, make it 100% so that we will show a fully
      // completed progress. If it is already fully completed, make the percentage greater than
      // 100% so that the progress bar will disappear.
      if (percentage < 100) {
        percentage = 100;
      } else {
        percentage += 1;
      }
    } else if (percentage < 50) {
      percentage += 5;
    } else if (percentage < 80) {
      percentage += 3;
    } else if (percentage < 99) {
      percentage += 1;
    }
    this.timeoutId = setTimeout(() => {
      this.setState({ percentage }, () => this._animate());
    }, 50);
  }

  render() {
    const position = this.props.position || FIXED_TOP;
    const { percentage } = this.state;
    if (percentage > 100) {
      return <div style={{ display: 'none' }} />;
    }
    return (
      <div className={`progress my-0 ${position}`} style={{ height: '3px' }}>
        <div className="progress-bar" role="progressbar" style={{ width: `${percentage}%` }} />
      </div>
    );
  }
}


ProgressBar.propTypes = {
  loading: PropTypes.bool.isRequired,
  position: PropTypes.oneOf([FIXED_TOP, FIXED_BOTTOM]),
};

ProgressBar.defaultProps = {
  position: null,
};
