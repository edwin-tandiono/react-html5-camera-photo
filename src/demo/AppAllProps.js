import React from 'react';
import PropTypes from 'prop-types';
import Camera, { FACING_MODES, IMAGE_TYPES } from '../lib';
import './reset.css';

// Note: Change camera button is hidden when there is <= 1 camera to choose
function CustomChangeCameraButton ({ onClick }) {
  return (
    <button
      style={{
        bottom: '40px',
        left: 'calc(50% + 37px)',
        margin: '0 10px',
        position: 'absolute'
      }}
      onClick={onClick}
    >
      CHANGE CAMERA
    </button>
  );
}

CustomChangeCameraButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

function App (props) {
  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
  }

  function handleTakePhotoAnimationDone (dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
  }

  function handleCameraError (error) {
    console.log('handleCameraError', error);
  }

  function handleCameraStart (stream) {
    console.log('handleCameraStart');
  }

  function handleCameraStop () {
    console.log('handleCameraStop');
  }

  return (
    <Camera
      allowChangeCamera
      ChangeCameraButtonComponent={CustomChangeCameraButton}
      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
      onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
      onCameraError = { (error) => { handleCameraError(error); } }
      idealFacingMode = {FACING_MODES.ENVIRONMENT}
      idealResolution = {{width: 640, height: 480}}
      imageType = {IMAGE_TYPES.JPG}
      imageCompression = {0.97}
      isMaxResolution = {true}
      isImageMirror = {false}
      isSilentMode = {false}
      isDisplayStartCameraError = {true}
      isFullscreen = {false}
      sizeFactor = {1}
      onCameraStart = { (stream) => { handleCameraStart(stream); } }
      onCameraStop = { () => { handleCameraStop(); } }
    />
  );
}

export default App;
