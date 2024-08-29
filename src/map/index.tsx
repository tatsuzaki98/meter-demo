import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useSWR from 'swr';
import CustomMarker from "./customMarker";

const Map = () => {
  const { data: markers, mutate } = useSWR<Marker[]>('@markers', null, { fallbackData: [] });
  const { data: mapProps, mutate: mutateMapProps } = useSWR<MapProps>(
    '@map',
    null,
    {fallbackData: { center: [33.593, 130.398], zoom: 13 }}
  );
  const { data: editor } = useSWR<string>('@editor', null);
  const { mutate: mutateFocusedKey } = useSWR<number | null>('@focusedKey', null);
  const { mutate: mutateRoute } = useSWR<string>('@route', null);

  const MapController = () => {
    const map = useMapEvents({
      moveend: () => {
        if (!mapProps) return;
        mutateMapProps({
          ...mapProps,
          center: [map.getCenter().lat, map.getCenter().lng],
          zoom: map.getZoom(),
        });
      },
      click: (e) => {
        if (!markers) return;
        const markerKey = markers.reduce((acc, cur) => Math.max(acc, cur.key), 0) + 1;
        const newMarkers: Marker[] = [
          ...markers,
          {
            key: markerKey,
            coordinates: [e.latlng.lat, e.latlng.lng],
            editor: editor || "",
            userNumber: "",
            meterValue: "",
            locationText: "",
            updatedAt: new Date().toISOString(),
          },
        ];
        mutateFocusedKey(markerKey);
        mutate(newMarkers, false);
        mutateRoute('each');
      },
    });
    return null;
  };

  if (!markers) return <p>Loading...</p>;

  return (
    <MapContainer
      center={mapProps?.center}
      zoom={mapProps?.zoom}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "50vh" }}
    >
      <TileLayer
        attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
        url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
      />

      <MapController />

      {markers.map((marker, idx) => (
        <CustomMarker key={idx} marker={marker} idx={idx} />
      ))}
    </MapContainer>
  );
};

export default Map;
