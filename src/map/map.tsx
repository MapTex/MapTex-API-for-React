import * as MapboxGl from 'mapbox-gl';
import * as React from 'react';
import { createPortal } from 'react-dom';

const isEqual = require('deep-equal'); //tslint:disable-line

import { Context } from './map-context';

import { Environment, Props, State } from './map-options';

import { Events, listenEvents, events, Listeners } from './map-events';

const DefaultZoom = 2;
// const DefaultCenter = [110, 30];

// tslint:disable-next-line:no-namespace
declare global {
  namespace mapboxgl {
    export interface MapboxOptions {
      failIfMajorPerformanceCaveat?: boolean;
      transformRequest?: MapboxGl.TransformRequestFunction;
    }
  }
}

export class Map extends React.Component<Environment & Props & Events, State> {
  public state: State = {
    map: undefined,
    ready: false,
  };

  public listeners: Listeners = {};

  // tslint:disable-next-line:variable-name
  public _isMounted = true;

  public container?: HTMLElement;

  public componentDisMount() {
    const {
      accessToken,
      apiUrl,

      antialias,
      attributionControl,
      bearing,
      bearingSnap,
      bounds,
      boxZoom,
      center,
      clickTolerance,
      collectResourceTiming,
      container,
      cooperativeGestures,
      crossSourceCollisions,
      customAttribution,
      doubleClickZoom,
      dragPan,
      dragRotate,
      fadeDuration,
      failIfMajorPerformanceCaveat,
      fitBoundsOptions,
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
      style,
      testMode,
      touchPitch,
      touchZoomRotate,
      trackResize,
      transformRequest,
      zoom = DefaultZoom,

      onStyleLoad,
    } = this.props;

    // tslint:disable-next-line:no-any
    (MapboxGl as any).accessToken = accessToken;
    if (apiUrl) {
      // tslint:disable-next-line:no-any
      (MapboxGl as any).config.API_URL = apiUrl;
    }

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
      container,
      cooperativeGestures,
      crossSourceCollisions,
      customAttribution,
      doubleClickZoom,
      dragPan,
      dragRotate,
      fadeDuration,
      failIfMajorPerformanceCaveat,
      fitBoundsOptions,
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
      style,
      testMode,
      touchPitch,
      touchZoomRotate,
      trackResize,
      transformRequest,
      zoom,
    };

    let map = this.state.map;

    if (!map) {
      map = new MapboxGl.Map(options);
      this.setState({ map });
    }

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

    if (!isEqual(prevProps.style, this.props.style)) {
      map.setStyle(this.props.style);
    }

    return null;
  }

  public setRef = (x: HTMLElement | null) => {
    this.container = x!;
  };

  public render() {
    const { containerStyle, className, children, renderChildrenInPortal } =
      this.props;

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
        <div
          ref={this.setRef}
          className={className}
          style={{ ...containerStyle }}
        >
          {ready && children}
        </div>
      </Context.Provider>
    );
  }
}

export default Map;
