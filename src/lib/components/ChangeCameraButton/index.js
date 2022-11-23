import React from 'react';
import PropTypes from 'prop-types';

import './styles/changeCameraButton.css';

export const ChangeCameraButton = ({ Component, onClick }) => {
  if (Component) {
    return <Component onClick={onClick} />;
  }
  return (
    <button id="change-camera-button" onClick={onClick} type="button">
      CHANGE CAMERA
    </button>
  );
};

ChangeCameraButton.propTypes = {
  Component: PropTypes.func,
  onClick: PropTypes.func.isRequired
};

ChangeCameraButton.defaultProps = {
  component: null
};

export default ChangeCameraButton;
