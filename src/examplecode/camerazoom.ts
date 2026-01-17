import { useCallback, useMemo, useRef, useState } from 'react';
import { Gesture, PinchGestureHandlerEventPayload } from 'react-native-gesture-handler';

export interface UsePinchZoomOptions {
  sensitivity?: number;
  initialZoom?: number;
  deadzone?: number;
  min?: number;
  max?: number;
  onZoomChange?: (zoom: number) => void;
}

export interface UsePinchZoomResult {
  zoom: number;
  setZoom: (zoom: number) => void;
  gesture: ReturnType<typeof Gesture.Pinch>;
}

/** Creates a natural-feeling pinch-to-zoom gesture. Zoom is between 0 and 1. */
export function usePinchZoom(options?: UsePinchZoomOptions): UsePinchZoomResult {
  const sensitivity = options?.sensitivity ?? 0.35;
  const deadzone = options?.deadzone ?? 0.002;
  const minZoom = options?.min ?? 0;
  const maxZoom = options?.max ?? 1;

  const [zoom, setZoom] = useState(options?.initialZoom ?? 0);
  const pinchStartZoomRef = useRef(zoom);

  const onBegin = useCallback(() => {
    pinchStartZoomRef.current = zoom;
  }, [zoom]);

  const onUpdate = useCallback((event: PinchGestureHandlerEventPayload) => {
    const logScale = Math.log2(event.scale || 1);
    const delta = logScale * sensitivity;
    if (Math.abs(delta) < deadzone) return;

    let newZoom = pinchStartZoomRef.current + delta;
    if (newZoom < minZoom) newZoom = minZoom;
    else if (newZoom > maxZoom) newZoom = maxZoom;

    setZoom(newZoom);
    if (options?.onZoomChange) options.onZoomChange(newZoom);
  }, [sensitivity, deadzone, minZoom, maxZoom, options?.onZoomChange]);

  const onEnd = useCallback((event: PinchGestureHandlerEventPayload) => {
    pinchStartZoomRef.current = zoom;
  }, [zoom]);

  const gesture = useMemo(() => {
    return Gesture.Pinch().runOnJS(true).onBegin(onBegin).onUpdate(onUpdate).onEnd(onEnd);
  }, [onBegin, onUpdate, onEnd]);

  return { zoom, setZoom, gesture };
}