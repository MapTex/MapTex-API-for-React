// @flow strict

type GeoJSONPosition = [number, number] | [number, number, number];
type Geometry<T, C> = { type: T; coordinates: C };

export type GeoJSONPoint = Geometry<'Point', GeoJSONPosition>;
export type GeoJSONMultiPoint = Geometry<'MultiPoint', GeoJSONPosition[]>;

export type GeoJSONLineString = Geometry<'LineString', GeoJSONPosition[]>;
export type GeoJSONMultiLineString = Geometry<
  'MultiLineString',
  GeoJSONPosition[][]
>;

export type GeoJSONPolygon = Geometry<'Polygon', GeoJSONPosition[][]>;
export type GeoJSONMultiPolygon = Geometry<
  'MultiPolygon',
  GeoJSONPosition[][][]
>;

export type GeoJSONGeometry =
  | GeoJSONPoint
  | GeoJSONMultiPoint
  | GeoJSONLineString
  | GeoJSONMultiLineString
  | GeoJSONPolygon
  | GeoJSONMultiPolygon
  | GeoJSONGeometryCollection;

export type GeoJSONGeometryCollection = {
  type: 'GeometryCollection';
  geometries: GeoJSONGeometry[];
};

export type GeoJSONFeature = {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties: { [key: string]: any };
  id?: number | string;
  title?: string;
};

export type GeoJSONFeatureCollection = {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
};

export type GeoJSON =
  | GeoJSONGeometry
  | GeoJSONFeature
  | GeoJSONFeatureCollection;
