import concaveman from 'concaveman';

import {
  GeoJSONFeatureCollection,
  GeoJSONFeature,
  GeoJSONGeometry,
  GeoJSONPoint,
  GeoJSONPolygon,
  GeoJSON,
} from '../../format/geojson';

/**
 * @see mapbox offcial mehod improve korea paper
 * @see https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.676.6258&rep=rep1&type=pdf
 */
export class ConcaveMan {
  public geojson: GeoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  private concavity: number = 2;
  private lengthThreshold: number = 0;

  public setConcavity(concavity: number) {
    this.concavity = concavity;
  }

  public setLengthThreshold(lengthThreshold: number) {
    this.lengthThreshold = lengthThreshold;
  }

  public setFeatures(geojson: GeoJSONFeatureCollection) {
    geojson.features = geojson.features.filter(
      (f: GeoJSONFeature) => f.geometry.type === 'Point',
    );
    this.geojson = geojson;
  }

  public concave() {
    const { concavity, lengthThreshold, geojson } = this;

    const points: any = geojson.features.map(
      (f) => (f.geometry as GeoJSONPoint).coordinates,
    );
    if (points.length === 0) return undefined;
    const result: any = concaveman(points, concavity, lengthThreshold);

    const polygon: GeoJSONFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
      properties: {},
    };
    if (result.length > 0) {
      (polygon.geometry as GeoJSONPolygon).coordinates = [result];
      return polygon;
    }

    return undefined;
  }
}

export default ConcaveMan;
