import React, { useEffect, useContext } from 'react';
import MapboxGl from '@maptex/mapbox-gl';
import { Context } from '../map/map-context';

export interface Props {
    background?: string,
    barWidth?: number,
    color?: string,
    font: string,
    graphHeight: number,
    graphWidth: number,
    graphTop: number,
    graphRight: number,
    width: number
}

function Navigation(props: Props) {
    const { background, barWidth, color, font, width } = props;
    const { graphHeight, graphWidth, graphTop, graphRight } = props;
    const map: MapboxGl.Map | undefined = useContext(Context);

    useEffect(() => {
        // tslint:disable-next-line:no-string-literal
        const fps = new MapboxGl['FpsControl']({
            background, barWidth, color, font, width,
            graphHeight, graphWidth, graphTop, graphRight
        });
        if (map) {
            map.addControl(fps);
        }
    }, []);

    return null;
}

Navigation.defaultProps = {
    background: 'rgba(0,0,0,0.9)',
    barWidth: 4,
    color: '#7cf859',
    font: 'Monaco, Consolas, Courier, monospace',
    graphHeight: 60,
    graphWidth: 120,
    graphTop: 0,
    graphRight: 5,
    width: 130
};

export default Navigation;
