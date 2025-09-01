import React from 'react';
import { CameraView, CameraViewProps } from 'expo-camera';

export const ForwardedCameraView = React.forwardRef<CameraView, CameraViewProps>((props, ref) => {
  return <CameraView ref={ref} {...props} />;
});

ForwardedCameraView.displayName = 'ForwardedCameraView';