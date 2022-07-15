import React, { useEffect, useContext } from 'react';
import MapboxGl from '@maptex/mapbox-gl';
import { Context } from '../map/map-context';

export interface Props {
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
  position?: string;
}

function Navigation(props: Props) {
  const { showCompass, showZoom, visualizePitch } = props;
  const map: MapboxGl.Map | undefined = useContext(Context);

  useEffect(() => {
    const navi = new MapboxGl.NavigationControl({
      showCompass,
      showZoom,
      visualizePitch,
    });
    if (map) {
      map.addControl(navi);
    }
  }, []);

  return null;
}

Navigation.defaultProps = {
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
  position: 'top-right',
};

export default Navigation;
