import React, { useEffect, useContext, useState, useCallback } from 'react';
import { cloneDeep } from 'lodash';
import MapboxGl from '@maptex/mapbox-gl';

import { Context } from '../map/map-context';
import Popup from './popup';

import MapboxInspect from '@mapgis/mapbox-gl-inspect';

export interface Props {
  mode: 'none' | 'single';
  titleField: string;
  fields: string[];
  showMapPopupOnHover: boolean;
}

const DefaultFeatures: any[] = [];

function Inspect(props: Props) {
  const { mode, titleField, fields, showMapPopupOnHover } = props;
  const map: MapboxGl.Map | undefined = useContext(Context);

  const [features, setFeatures] = useState(DefaultFeatures);
  const [inspect, setInspect] = useState(undefined);
  let dom: any;

  const popupRef = useCallback((node: any) => {
    if (node !== null) {
      // setDom(node);
      dom = node;
      enableInspect();
    }
  }, []);

  const enableInspect = () => {
    if (!map || !map.getStyle()) {
      return;
    }

    const inspectControl = new MapboxInspect({
      popup: new MapboxGl.Popup({
        closeOnClick: true,
        closeButton: true,
      }),
      // showInspectMap: true,
      showMapPopup: true,
      showMapPopupOnHover,
      showInspectMapPopupOnHover: showMapPopupOnHover,
      showInspectButton: false,
      blockHoverPopupOnClick: false,
      renderPopup: (infos: any[]) => {
        const fs = cloneDeep(infos);
        const newfeatrues: any[] = fs.map((f) => {
          const properties = f.properties;

          if (fields) {
            f.properties = {};
            fields.forEach((field) => {
              f.properties[field] = properties[field];
            });
          }
          if (f.layer) {
            f.title = f.layer.id;
          }
          if (titleField) {
            f.title = properties[titleField];
          }

          return f;
        });
        setFeatures(newfeatrues);
        if (dom) {
          return dom;
        } else {
          return <span />;
        }
      },
    });
    map.addControl(inspectControl);
    setInspect(inspectControl);
  };

  return (
    <div ref={popupRef}>
      <Popup features={features} />
    </div>
  );
}

Inspect.defaultProps = {
  mode: 'none',
  titleField: undefined,
  fields: undefined,
  showMapPopupOnHover: false,
};

export default Inspect;
