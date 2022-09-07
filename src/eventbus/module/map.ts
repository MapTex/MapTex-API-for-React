import { eventbus, EventMap, EventBus } from '../event';

export type LayerVisible = {
  layerid: string | string[];
  visible: boolean;
};

export const mapEventBus: EventBus<EventMap> = eventbus<{
  onMapLoad: () => void;
  onMapIdle: () => void;
  onMapChangeLayerVisible: (payload: LayerVisible) => void;
}>();

export default mapEventBus;
