import {
  GeoJSONFeatureCollection,
  GeoJSONFeature,
  GeoJSONGeometry,
  GeoJSONPoint,
  GeoJSONPolygon,
  GeoJSON,
} from '../../format/geojson';

export class GrahamScan {
  public geojson: GeoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  private stack: GeoJSONFeature[] = [];
  private queue: GeoJSONFeature[] = [];
  private precsion: number = 12;

  public setPrecsion(precsion: number) {
    this.precsion = precsion;
  }

  public setFeatures(geojson: GeoJSONFeatureCollection) {
    this.calcPolarAngle(geojson);
    this.initQueueStack();
  }

  private calcPolarAngle(geojson: GeoJSONFeatureCollection) {
    const index = this.clacMinPoint(geojson);
    const a = (geojson.features[index]?.geometry as GeoJSONPoint)?.coordinates;
    if (!a) return;
    const axiosx = [1, 0];
    geojson.features = geojson.features
      .filter((f: GeoJSONFeature) => f.geometry.type === 'Point')
      .map((f: GeoJSONFeature) => {
        const geometry: GeoJSONGeometry = f.geometry;
        f.properties = f.properties || {};
        const b = (geometry as GeoJSONPoint).coordinates;
        const ab = [b[0] - a[0], b[1] - a[1]];

        f.properties._cos =
          ((b[0] - a[0]) * axiosx[0] + (b[1] - a[1]) * axiosx[1]) /
          (Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2)) * 1);

        return f;
      })
      .sort(
        (p1: GeoJSONFeature, p2: GeoJSONFeature) =>
          p1.properties._cos - p2.properties._cos,
      );
    this.geojson = geojson;
  }

  /**
   * find minx then miny === left bottom
   */
  private clacMinPoint(geojson: GeoJSONFeatureCollection): number {
    let index = -1;
    let minx: number = Number.MAX_VALUE;
    let miny: number = Number.MAX_VALUE;
    geojson.features.forEach((f: GeoJSONFeature, i: number) => {
      const geometry: GeoJSONGeometry = f.geometry;
      const { coordinates } = geometry as GeoJSONPoint;
      if (coordinates[1] < miny) {
        minx = coordinates[0];
        miny = coordinates[1];
        index = i;
      } else if (coordinates[1] === miny && coordinates[0] < minx) {
        index = i;
        minx = coordinates[0];
        miny = coordinates[1];
      }
    });
    return index;
  }

  private initQueueStack() {
    this.queue = [];
    this.stack = [];
    const { queue, stack } = this;
    this.geojson.features.forEach((f, i) => {
      if (i !== 0) {
        queue.push(f);
      } else {
        stack.push(f);
      }
    });
  }

  private rebuildStack() {
    const { stack } = this;
    while (stack.length >= 3) {
      const f1 = stack[stack.length - 3];
      const f2 = stack[stack.length - 2];
      const f3 = stack[stack.length - 1];
      const p1 = (f1.geometry as GeoJSONPoint).coordinates;
      const p2 = (f2.geometry as GeoJSONPoint).coordinates;
      const p3 = (f3.geometry as GeoJSONPoint).coordinates;
      const cross =
        (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p3[0] - p1[0]) * (p2[1] - p1[1]);
      if (cross >= 0) {
        stack.splice(stack.length - 2, 1);
      } else {
        break;
      }
    }
  }

  public convex() {
    const { queue, stack } = this;
    while (queue.length > 0) {
      // keep base triangle point
      const cur: GeoJSONFeature | undefined = queue.shift();
      if (!cur) continue;
      if (stack.length < 2) {
        stack.push(cur);
      } else {
        stack.push(cur);
        const f1 = stack[stack.length - 3];
        const f2 = stack[stack.length - 2];
        const f3 = stack[stack.length - 1];
        const p1 = (f1.geometry as GeoJSONPoint).coordinates;
        const p2 = (f2.geometry as GeoJSONPoint).coordinates;
        const p3 = (f3.geometry as GeoJSONPoint).coordinates;
        const cross =
          (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p3[0] - p1[0]) * (p2[1] - p1[1]);

        if (cross >= 0) {
          // clockwise
          this.rebuildStack();
        } else {
          // anti-clockwise
        }
      }
    }

    const { precsion } = this;
    const scale = Math.pow(10, precsion);
    const points: any = [];
    const polygon: GeoJSONFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
      properties: {},
    };
    let first: any;
    stack.forEach((f, i) => {
      const { coordinates } = f.geometry as GeoJSONPoint;
      if (i === 0) {
        first = coordinates;
      }
      points.push(coordinates);
    });
    if (first) {
      points.push(first);
    }
    if (points.length > 0) {
      (polygon.geometry as GeoJSONPolygon).coordinates = [points];
      return polygon;
    }

    return undefined;
  }
}

export default GrahamScan;
