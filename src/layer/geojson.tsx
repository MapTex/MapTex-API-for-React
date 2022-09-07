import React, { useState, useEffect } from 'react';
import * as MapboxGl from '@maptex/mapbox-gl';
// import deepEqual from 'deep-equal';
// import diff from '../util/diff';

import {
  MapCommonProps,
  LayerCommonProps,
  LayerEvents,
  EventToHandlersType,
  ImageDefinitionWithOptions,
  eventToHandler,
} from './layer-options';

export type GeojsonProps = {
  data:
    | GeoJSON.Feature<GeoJSON.Geometry>
    | GeoJSON.FeatureCollection<GeoJSON.Geometry>
    | string;
  // tslint:disable-next-line:no-any
  formatFeature?: (obj: any, id: number) => {};
};

export type Props = MapCommonProps &
  LayerCommonProps &
  LayerEvents &
  GeojsonProps;

function GeojsonLayer(props: Props) {
  // common use
  const { map, type, before, id } = props;
  // data soure & control
  const { sourceId, sourceLayer, data } = props;
  // data filter
  const { minZoom, maxZoom, filter = ['all'] } = props;
  // data style & control
  const { images, layout, paint } = props;

  // tslint:disable-next-line:no-any
  const sourceobj: any = {
    type: 'geojson',
    ...props.geoJSONSourceOptions,
    data,
  };

  const [source, setSource] = useState(sourceobj);

  useEffect(() => {
    mount();
    map.on('styledata', onStyleDataChange);
    return function destroy() {
      ummount();
    };
  }, []);

  useEffect(() => {
    if (data) {
      console.log('datachange', data);
      const find = map.getSource(sourceId || id) as MapboxGl.GeoJSONSource;
      if (find) {
        find.setData(data);
      }
    }
  }, [data]);

  /* useEffect(() => {
    if (paint) {
      Object.keys(paint).forEach((key) => {
        map.setPaintProperty(id, key, paint[key]);
      });
    }

    return () => {
      if (paint) {
        Object.keys(paint).forEach((key) => {
          map.setPaintProperty(id, key, undefined);
        });
      }
    };
  }, [paint]);

  useEffect(() => {
    if (layout) {
      Object.keys(layout).forEach((key) => {
        map.setLayoutProperty(id, key, layout[key]);
      });
    }

    return () => {
      if (layout) {
        Object.keys(layout).forEach((key) => {
          map.setLayoutProperty(id, key, undefined);
        });
      }
    };
  }, [layout]);

  useEffect(() => {
    if (!filter) {
      map.setFilter(id, ['all']);
    } else {
      map.setFilter(id, filter);
    }
  }, [filter]);

  useEffect(() => {
    map.moveLayer(id, before);
  }, [before]);

  useEffect(() => {
    map.setLayerZoomRange(id, minZoom!, maxZoom!);
  }, [minZoom, maxZoom]); */

  const mount = () => {
    // tslint:disable-next-line:no-any
    const layer: any = {
      id,
      source: sourceId || id,
      filter,
      type,
      layout,
      paint,
      minzoom: minZoom,
      maxzoom: maxZoom,
    };

    if (sourceLayer) {
      layer['source-layer'] = sourceLayer;
    }

    if (images) {
      const normalizedImages = !Array.isArray(images[0]) ? [images] : images;
      (normalizedImages as ImageDefinitionWithOptions[])
        .filter((image) => !map.hasImage(image[0]))
        .forEach((image) => {
          map.addImage(image[0], image[1], image[2]);
        });
    }

    if (!sourceId && !map.getSource(id)) {
      map.addSource(id, source);
    }

    if (!map.getLayer(id)) {
      map.addLayer(layer, before);
    }

    (
      Object.entries(eventToHandler) as [
        keyof EventToHandlersType,
        keyof LayerEvents,
      ][]
    ).forEach(([event, propName]) => {
      const handler = props[propName];
      if (handler) {
        map.on(event, id, handler);
      }
    });
  };

  const ummount = () => {
    if (!map || !map.getStyle()) return;

    map.off('styledata', onStyleDataChange);

    (
      Object.entries(eventToHandler) as [
        keyof EventToHandlersType,
        keyof LayerEvents,
      ][]
    ).forEach(([event, propName]) => {
      const handler = props[propName];
      if (handler) {
        map.off(event, id, handler);
      }
    });

    if (map.getLayer(id)) {
      map.removeLayer(id);
    }

    /*
    // for multil layer ref same source, removeSource is not necessary
    if (!sourceId) {
      map.removeSource(id);
    } */

    if (images) {
      const normalizedImages = !Array.isArray(images[0]) ? [images] : images;
      (normalizedImages as ImageDefinitionWithOptions[])
        .map(([key, ...rest]) => key)
        .forEach(map.removeImage.bind(map));
    }
  };

  const onStyleDataChange = () => {
    if (!map.getLayer(id)) {
      mount();
    }
  };

  return <span />;
}

GeojsonLayer.defaultProps = {
  type: 'symbol',
  minZoom: 0,
  maxZoom: 24,
  layout: {},
  paint: {},
  // tslint:disable-next-line:no-any
  formatFeature: (obj: any, id: number) => ({
    type: 'Feature',
    geometry: obj.geometry,
    properties: { ...obj.properties, id },
  }),
};

export default GeojsonLayer;
