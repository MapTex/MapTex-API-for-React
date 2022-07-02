import * as MapboxGl from '@maptex/mapbox-gl';
import * as React from 'react';
import { createPortal } from 'react-dom';

const isEqual = require('deep-equal'); //tslint:disable-line

import { Context } from './map-context';

import { Environment, Props, State } from './map-options';

import { Events, listenEvents, events, Listeners } from './map-events';

let isinitial = false;

// tslint:disable-next-line:no-namespace
declare global {
  namespace mapboxgl {
    export interface MapboxOptions {
      failIfMajorPerformanceCaveat?: boolean;
      transformRequest?: MapboxGl.TransformRequestFunction;
    }
  }
}

export class Mapbox extends React.Component<
  Environment & Props & Events,
  State
> {
  public state: State = {
    map: undefined,
    ready: false,
  };

  public listeners: Listeners = {};

  // tslint:disable-next-line:variable-name
  public _isMounted = true;

  private container: HTMLElement | undefined;

  public componentDidMount() {
    const {
      accessToken,
      apiUrl,

      antialias = false,
      attributionControl = true,
      bearing = 0,
      bearingSnap = 7,
      bounds = [-180, -90, 180, 90],
      boxZoom = true,
      center = [110, 30],
      clickTolerance = 3,
      collectResourceTiming = false,
      // container,
      // cooperativeGestures,
      crossSourceCollisions = true,
      customAttribution,
      doubleClickZoom = true,
      dragPan = true,
      dragRotate = true,
      fadeDuration = 300,
      failIfMajorPerformanceCaveat = false,
      // fitBoundsOptions,
      hash = false,
      interactive = true,
      keyboard = true,
      locale,
      localFontFamily = 'false',
      localIdeographFontFamily = 'sans-serif',
      logoPosition = 'bottom-left',
      maxBounds,
      maxPitch = 60,
      maxTileCacheSize,
      maxZoom = 22,
      minPitch = 0,
      minZoom = 0,
      optimizeForTerrain = true,
      pitch = 0,
      pitchWithRotate = true,
      preserveDrawingBuffer = false,
      projection = { name: 'mercator' },
      refreshExpiredTiles = true,
      renderWorldCopies = true,
      scrollZoom = true,
      mapStyle,
      testMode = false,
      touchPitch = true,
      touchZoomRotate = true,
      trackResize = true,
      transformRequest,
      zoom = 2,

      onStyleLoad,
    } = this.props;

    // tslint:disable-next-line:no-any
    (MapboxGl as any).accessToken = accessToken;
    if (apiUrl) {
      // tslint:disable-next-line:no-any
      (MapboxGl as any).config.API_URL = apiUrl;
    }

    const containerid = this.container
      ? this.container.id
      : 'maptex-default-map-id';

    const options: MapboxGl.MapboxOptions = {
      antialias,
      attributionControl,
      bearing,
      bearingSnap,
      bounds,
      boxZoom,
      center,
      clickTolerance,
      collectResourceTiming,
      container: containerid,
      // cooperativeGestures,
      crossSourceCollisions,
      customAttribution,
      doubleClickZoom,
      dragPan,
      dragRotate,
      fadeDuration,
      failIfMajorPerformanceCaveat,
      // fitBoundsOptions,
      hash,
      interactive,
      keyboard,
      locale,
      localFontFamily,
      localIdeographFontFamily,
      logoPosition,
      maxBounds,
      maxPitch,
      maxTileCacheSize,
      maxZoom,
      minPitch,
      minZoom,
      optimizeForTerrain,
      pitch,
      pitchWithRotate,
      preserveDrawingBuffer,
      projection,
      refreshExpiredTiles,
      renderWorldCopies,
      scrollZoom,
      style: mapStyle,
      testMode,
      touchPitch,
      touchZoomRotate,
      trackResize,
      transformRequest,
      zoom,
    };

    let map = this.state.map;

    if (!map && !isinitial) {
      map = new MapboxGl.Map(options);
      this.setState({ map });
      isinitial = true;
    }

    if (map) {
      // tslint:disable-next-line:no-any
      map.on('load', (evt: React.SyntheticEvent<any>) => {
        if (this._isMounted) {
          this.setState({ ready: true });
        }

        if (onStyleLoad) {
          onStyleLoad(map!, evt);
        }
      });

      this.listeners = listenEvents(events, this.props, map);
    }
  }

  public componentWillUnmount() {
    const { map } = this.state;
    this._isMounted = false;

    if (map) {
      map.remove();
    }
  }

  public componentDidUpdate(prevProps: Props & Events) {
    const { map } = this.state;
    if (!map) {
      return null;
    }

    if (!isEqual(prevProps.mapStyle, this.props.mapStyle)) {
      map.setStyle(this.props.mapStyle);
    }

    return null;
  }

  public setRef = (x: HTMLElement | null) => {
    this.container = x!;
  };

  public render() {
    const {
      containerStyle,
      className = 'maptex-default-map-class',
      children,
      renderChildrenInPortal,
    } = this.props;

    const { ready, map } = this.state;

    if (renderChildrenInPortal) {
      const container =
        ready && map && typeof map.getCanvasContainer === 'function'
          ? map.getCanvasContainer()
          : undefined;

      return (
        <Context.Provider value={map}>
          <div
            ref={this.setRef}
            className={className}
            style={{ ...containerStyle }}
          >
            {ready && container && createPortal(children, container)}
          </div>
        </Context.Provider>
      );
    }

    return (
      <Context.Provider value={map}>
        <div ref={this.setRef} id="maptex-default-map-id" className={className}>
          {ready && children}
        </div>
      </Context.Provider>
    );
  }
}

export default Mapbox;
