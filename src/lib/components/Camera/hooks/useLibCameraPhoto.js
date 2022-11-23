import { useState, useEffect } from 'react';
import LibCameraPhoto from 'jslib-html5-camera-photo';

let libCameraPhoto = null;
let needToClean = false;

export function useLibCameraPhoto (videoRef, idealFacingMode, idealResolution, isMaxResolution, allowChangeCamera) {
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraStartError, setCameraStartError] = useState(null);
  const [cameraStopError, setCameraStopError] = useState(null);
  const [idealCameraDevice, setIdealCameraDevice] = useState(idealFacingMode);
  const [availableDeviceIds, setAvailableDeviceIds] = useState([]);
  const [currentDevice, setCurrentDevice] = useState(null);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      libCameraPhoto = new LibCameraPhoto(videoRef.current);
    }
  }, [videoRef]);

  useEffect(() => {
    async function enableStream () {
      needToClean = true;
      try {
        let _mediaStream = null;
        if (isMaxResolution) {
          _mediaStream = await libCameraPhoto.startCameraMaxResolution(idealCameraDevice);
        } else {
          _mediaStream = await libCameraPhoto.startCamera(idealCameraDevice, idealResolution);
        }
        if (videoRef && videoRef.current) {
          setMediaStream(_mediaStream);
          setCameraStartError(null);

          // Store camera options for changing camera
          if (allowChangeCamera) {
            const inputDevices = await libCameraPhoto.enumerateCameras();
            setAvailableDeviceIds(
              inputDevices
                .map((device) => device.getCapabilities())
                .filter((device) => {
                  if (!idealFacingMode) {
                    return true;
                  }

                  if (!device.facingMode) {
                    return false;
                  }

                  return device.facingMode.includes(idealFacingMode);
                })
                .map((device) => device.deviceId)
            );

            setCurrentDevice(libCameraPhoto.getCameraSettings());
          }
        } else {
          await libCameraPhoto.stopCamera();
        }
      } catch (cameraStartError) {
        if (videoRef && videoRef.current) {
          setCameraStartError(cameraStartError);
        }
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return async function cleanup () {
        try {
          if (needToClean) {
            needToClean = false;
            await libCameraPhoto.stopCamera();
          }

          // protect setState from component umonted error
          // when the component is umonted videoRef.current == null
          if (videoRef && videoRef.current) {
            setMediaStream(null);
            setCameraStopError(null);
          }
        } catch (cameraStopError) {
          setCameraStopError(cameraStopError);
        }
      };
    }
  }, [videoRef, mediaStream, idealFacingMode, idealResolution, isMaxResolution, idealCameraDevice]);

  function getDataUri (configDataUri) {
    return libCameraPhoto.getDataUri(configDataUri);
  }

  function changeCamera () {
    if (!allowChangeCamera || availableDeviceIds.length <= 1) {
      return;
    }

    let currentDeviceId = idealCameraDevice;

    if (!availableDeviceIds.includes(currentDeviceId)) {
      const currentCameraSettings = libCameraPhoto.getCameraSettings();

      if (currentCameraSettings && currentCameraSettings.deviceId) {
        currentDeviceId = currentCameraSettings.deviceId;
      } else {
        return;
      }
    }

    if (availableDeviceIds[availableDeviceIds.length - 1] === currentDeviceId) {
      setIdealCameraDevice(availableDeviceIds[0]);
    } else {
      const currentDeviceIdIndex = availableDeviceIds.findIndex((availableDeviceId) => availableDeviceId === currentDeviceId);
      setIdealCameraDevice(availableDeviceIds[currentDeviceIdIndex + 1]);
    }
  }

  return [mediaStream, availableDeviceIds, currentDevice, cameraStartError, cameraStopError, getDataUri, changeCamera];
}
