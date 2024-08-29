import type { CircleMarker as DCM } from "leaflet";
import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import useSWR from "swr";

const CustomMarker = ({ marker, idx }: { marker: Marker, idx: number }) => {
  const { mutate: mutateFocusedKey } = useSWR<number | null>('@focusedKey', null);
  const { mutate: mutateRoute } = useSWR<string>('@route', null);
  const { data: focusedKey } = useSWR<number | null>('@focusedKey', null);

  const [refReady, setRefReady] = React.useState(false);
  const ref: React.MutableRefObject<DCM | null> = React.useRef(null);

  React.useEffect(() => {
    if (!refReady) return;
    if (focusedKey === marker.key) {
      ref.current?.openPopup();
    }
  }, [refReady, focusedKey, marker.key]);

  return (
    <CircleMarker
      key={`marker-${idx}`}
      center={marker.coordinates}
      radius={5}
      color={"#cb4b16"}
      fillColor={"#cb4b16"}
      eventHandlers={{
        click: () => {
          mutateFocusedKey(marker.key);
          mutateRoute('each');
        },
      }}
      ref={(el) => {
        if (el && !refReady) {
          ref.current = el;
          setRefReady(true);
        }
      }}
      >
      <Popup
      >
        <p>
          #{marker.key}
        </p>
        {marker.locationText && (
          <p>
            位置: {marker.locationText}
          </p>
        )}
      </Popup>
    </CircleMarker>
  )
}

export default CustomMarker;
