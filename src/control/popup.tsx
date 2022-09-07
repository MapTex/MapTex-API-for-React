import React from 'react';
import { GeoJSONFeature } from '../format';

interface Props {
  features?: GeoJSONFeature[];
}

function Popup(props: Props) {
  const { features = [] } = props;

  const renderHeader = (feature: GeoJSONFeature) => (
    <div className="flex top flex--space-between-main flex--center-cross px12 bg-white border-b border--gray-faint py12 sticky">
      <div className="flex flex--center-cross txt-truncate">
        <div className="flex-child-no-shrink">
          <div className="flex flex--stretch-cross">
            <div className="border border--white mr6 round bg-black w6" />
            <div>
              <svg className="icon" style={{ width: '18px', height: '18px' }}>
                <use xlinkHref="#icon-marker" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex-child-grow txt-truncate ml3" title="place_label">
          {feature.title}
        </div>
      </div>
    </div>
  );

  const renderListHeader = (feature: GeoJSONFeature) => (
    <div className="flex flex--space-between mb3 txt-bold list" role="listitem">
      <div>id</div>
      <div className="flex-child-grow align-r txt-mono">{feature.id}</div>
    </div>
  );

  const renderListItems = (feature: GeoJSONFeature) =>
    Object.keys(feature.properties).map((k) => (
      <div
        className="border-t border--gray-light border--dash flex flex--space-between flex--center-cross mt3 pt3"
        key={k}
      >
        <div
          className="flex-child-no-shrink flex flex--center-cross"
          title="Property: abbr"
          aria-label="Property: abbr"
          style={{ lineHeight: '17px', overflowWrap: 'break-word' }}
        >
          {k}
          <span
            className="flex-child-no-shrink flex flex--center-cross ml6 color-blue-light"
            title="string"
            aria-label="string"
          >
            <svg className="icon events-none w15 h15 mt-neg1 inline-block align-t">
              <use xlinkHref="#icon-quotes" />
            </svg>
          </span>
        </div>
        <div
          className="flex-child-grow align-r txt-mono ml3"
          title="Value: Mont."
          aria-label="Value: Mont."
          style={{ overflowWrap: 'break-word' }}
        >
          {feature.properties[k]}
        </div>
      </div>
    ));

  const renderList = (feature: GeoJSONFeature) => {
    const header = renderListHeader(feature);
    const lists = renderListItems(feature);

    return (
      <div className="mt6 mb12 px12">
        <div>
          <div className="mb12" role="list">
            {header}
            {lists}
          </div>
        </div>
      </div>
    );
  };

  const renderFeature = (feature: GeoJSONFeature) => {
    const header = renderHeader(feature);
    const list = renderList(feature);
    return (
      <div>
        {header}
        {list}
      </div>
    );
  };

  const renderChildren = (fs: GeoJSONFeature[]) =>
    fs.map((f) => renderFeature(f));

  const children = renderChildren(features);

  return (
    <div className="maptex-map-popup round bg-white absolute txt-xs w240 hmax240 scroll-styled overflow-auto shadow-darken75">
      <div className="py0">{children}</div>
    </div>
  );
}

Popup.defaultProps = {
  features: [],
};

export default Popup;
