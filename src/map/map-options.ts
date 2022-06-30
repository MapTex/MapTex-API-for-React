import * as MapboxGl from 'mapbox-gl';

export interface PaddingOptions {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface FitBoundsOptions {
  linear?: boolean;
  easing?: (time: number) => number;
  padding?: number | PaddingOptions;
  offset?: MapboxGl.Point | [number, number];
  maxZoom?: number;
  duration?: number;
}

export type LngLatLike =
  | MapboxGl.LngLat
  | [number, number]
  | { lng: number; lat: number }
  | { lon: number; lat: number }
  | undefined;

export type LngLatBoundsLike =
  | MapboxGl.LngLatBounds
  | [MapboxGl.LngLat, MapboxGl.LngLat]
  | [number, number, number, number];

export interface AnimationOptions {
  duration: number;
  animate: boolean;
  easing(time: number): number;
  offset: number[];
}

export interface FlyToOptions {
  curve: number;
  minZoom: number;
  speed: number;
  screenSpeed: number;
}

export type ProjectionSpecification = {
  name:
    | 'albers'
    | 'equalEarth'
    | 'equirectangular'
    | 'lambertConformalConic'
    | 'mercator'
    | 'naturalEarth'
    | 'winkelTripel'
    | 'globe';
  center?: [number, number];
  parallels?: [number, number];
};

export type RequestTransformFunction = (
  url: string,
  resourceType: any, // tslint:disable-line:no-any
) => any; // tslint:disable-line:no-any

export interface Environment {
  accessToken?: string;
  apiUrl?: string;
}

export interface Props {
  antialias?: boolean;
  attributionControl?: boolean;
  bearing?: number;
  bearingSnap?: number;
  bounds?: LngLatBoundsLike;
  boxZoom?: boolean;
  center?: LngLatLike
  clickTolerance?: number;
  collectResourceTiming?: boolean;
  container: HTMLElement | string;
  cooperativeGestures?: boolean;
  crossSourceCollisions?: boolean;
  customAttribution?: string | string[];
  doubleClickZoom?: boolean;
  dragPan?: boolean | object;
  dragRotate?: boolean;
  fadeDuration?: number;
  failIfMajorPerformanceCaveat?: boolean;
  fitBoundsOptions?: FitBoundsOptions;
  hash?: boolean | string;
  interactive?: boolean;
  keyboard?: boolean;
  locale?: { [key: string]: string } | undefined;
  localFontFamily?: string;
  localIdeographFontFamily?: string;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  maxBounds?: LngLatBoundsLike;
  maxPitch?: number;
  maxTileCacheSize?: number;
  maxZoom?: number;
  minPitch?: number;
  minZoom?: number;
  optimizeForTerrain?: boolean;
  pitch?: number;
  pitchWithRotate?: boolean;
  preserveDrawingBuffer?: boolean;
  projection?: ProjectionSpecification;
  refreshExpiredTiles?: boolean;
  renderWorldCopies?: boolean;
  scrollZoom?: boolean | object;
  style: string | MapboxGl.Style;
  testMode?: boolean;
  touchPitch?: boolean | object;
  touchZoomRotate?: boolean | object;
  trackResize?: boolean;
  transformRequest?: RequestTransformFunction;
  zoom?: number | undefined;

  className?: string;
  containerStyle: React.CSSProperties;
  renderChildrenInPortal?: boolean;
  children?: JSX.Element | JSX.Element[];
}

export interface State {
  map?: MapboxGl.Map;
  ready: boolean;
}
