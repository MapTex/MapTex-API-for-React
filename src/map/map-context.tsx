import * as React from 'react';
import * as MapboxGl from '@maptex/mapbox-gl';

// const mapinstance = undefined; // new MapboxGl.Map();
export const Context = React.createContext(undefined) as React.Context<
  MapboxGl.Map | undefined
>;

// tslint:disable-next-line:no-any
export function withMap(Component: React.ComponentClass<any>) {
  return function MappedComponent<T>(props: T) {
    return (
      <Context.Consumer>
        {(map) => <Component map={map} {...props} />}
      </Context.Consumer>
    );
  };
}
