// import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import useSWR from "swr";

const CustomMarker = ({ marker, idx }: { marker: Marker, idx: number }) => {
  const { mutate: mutateFocusedKey } = useSWR<number | null>('@focusedKey', null);
  const { mutate: mutateRoute } = useSWR<string>('@route', null);
  // const { data: focusedKey } = useSWR<number | null>('@focusedKey', null);

  // const [refReady, setRefReady] = React.useState(false);
  // let ref: any = React.useRef(null);

  // React.useEffect(() => {
  //   if (!refReady) return;
  //   ref.leafletElement.openPopup();
  // }, [refReady]);

  return (
    <CircleMarker
      key={`marker-${idx}`}
      center={marker.coordinates}
      radius={5}
      color={marker.meterValue ? "#657b83" : "#cb4b16"}
      fillColor={marker.meterValue ? "#657b83" : "#cb4b16"}
      eventHandlers={{
        click: () => {
          mutateFocusedKey(marker.key);
          mutateRoute('each');
        },
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
