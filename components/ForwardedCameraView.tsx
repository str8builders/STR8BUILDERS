import React from 'react';
import { CameraView, CameraViewProps } from 'expo-camera';
import { Platform } from 'react-native';

export const ForwardedCameraView = React.forwardRef<CameraView, CameraViewProps>((props, ref) => {
  // Only pass ref on non-web platforms where CameraView supports it
  const cameraProps = Platform.OS === 'web' ? props : { ...props, ref };
  return <CameraView {...cameraProps} />;
});

ForwardedCameraView.displayName = 'ForwardedCameraView';