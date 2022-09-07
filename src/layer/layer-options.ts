import * as MapboxGl from '@maptex/mapbox-gl';

export type Paint =
  | MapboxGl.BackgroundPaint
  | MapboxGl.FillPaint
  | MapboxGl.FillExtrusionPaint
  | MapboxGl.SymbolPaint
  | MapboxGl.LinePaint
  | MapboxGl.RasterPaint
  | MapboxGl.CirclePaint
  | MapboxGl.HeatmapPaint;

export type Layout =
  | MapboxGl.BackgroundLayout
  | MapboxGl.FillLayout
  | MapboxGl.FillExtrusionLayout
  | MapboxGl.LineLayout
  | MapboxGl.SymbolLayout
  | MapboxGl.RasterLayout
  | MapboxGl.CircleLayout
  | MapboxGl.HeatmapLayout;

export interface ImageOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
}
export type ImageDefinition = [string, HTMLImageElement];
export type ImageDefinitionWithOptions = [
  string,
  HTMLImageElement,
  ImageOptions,
];

// tslint:disable-next-line:no-any
export type MouseEvent = (evt: any) => any;

export interface LayerEvents {
  onMouseMove?: MouseEvent;
  onMouseEnter?: MouseEvent;
  onMouseLeave?: MouseEvent;
  onMouseDown?: MouseEvent;
  onMouseUp?: MouseEvent;
  onClick?: MouseEvent;
  onTouchStart?: MouseEvent;
  onTouchEnd?: MouseEvent;
  onTouchCancel?: MouseEvent;
}

export interface MapCommonProps {
  map: MapboxGl.Map;
}

export interface LayerCommonProps {
  id: string;
  type?:
    | 'symbol'
    | 'line'
    | 'fill'
    | 'circle'
    | 'raster'
    | 'fill-extrusion'
    | 'background'
    | 'heatmap';
  sourceId?: string;
  images?:
    | ImageDefinition
    | ImageDefinition[]
    | ImageDefinitionWithOptions
    | ImageDefinitionWithOptions[];
  before?: string;
  paint?: Paint;
  layout?: Layout;
  // tslint:disable-next-line:no-any
  metadata?: any;
  sourceLayer?: string;
  minZoom?: number;
  maxZoom?: number;
  geoJSONSourceOptions?: MapboxGl.GeoJSONSourceOptions;
  // tslint:disable-next-line:no-any
  filter?: any[];
  children?: JSX.Element | JSX.Element[];
}

export type EventToHandlersType = {
  [key in keyof MapboxGl.MapLayerEventType]?: keyof LayerEvents;
};

export const eventToHandler: EventToHandlersType = {
  touchstart: 'onTouchStart',
  touchend: 'onTouchEnd',
  touchcancel: 'onTouchCancel',
  mousemove: 'onMouseMove',
  mouseenter: 'onMouseEnter',
  mouseleave: 'onMouseLeave',
  mousedown: 'onMouseDown',
  mouseup: 'onMouseUp',
  click: 'onClick',
};
