import { MapContainer, CircleMarker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useSWR from 'swr';

const Map = () => {
  const { data: markers, mutate } = useSWR<Marker[]>('@markers', null, { fallbackData: [] });
  const { data: mapProps, mutate: mutateMapProps } = useSWR<MapProps>(
    '@map',
    null,
    {fallbackData: { center: [33.593, 130.398], zoom: 13 }}
  );
  const { data: editor } = useSWR<string>('@editor', null);
  const { mutate: mutateFocusedKey } = useSWR<number | null>('@focusedKey', null);

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
    });
    return null;
  };

  const AddMarker = () => {
    useMapEvents({
      click(e) {
        if (!markers) return;
        const newMarkers: Marker[] = [
          ...markers,
          {
            key: markers.length,
            coordinates: [e.latlng.lat, e.latlng.lng],
            editor: editor || "",
            userNumber: "",
            meterValue: "",
            locationText: "",
            updatedAt: new Date().toISOString(),
          },
        ];
        mutate(newMarkers, false);
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
      style={{ width: "100%", height: "60vh" }}
    >
      <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>,<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Mapdata: &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        url='https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png'
      />

      <AddMarker />
      <MapController />

      {markers.map((marker, idx) => (
        <CircleMarker
          key={`marker-${idx}`}
          center={marker.coordinates}
          radius={5}
          color={marker.meterValue ? "#657b83" : "#cb4b16"}
          fillColor={marker.meterValue ? "#657b83" : "#cb4b16"}
          eventHandlers={{
            click: () => mutateFocusedKey(idx),
          }}
        >
          <Popup
            eventHandlers={{
              remove: () => mutateFocusedKey(null),
            }}
          >
            <p>
              #{marker.key + 1}
            </p>
            <p>
              位置: {marker.locationText}
            </p>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default Map;
