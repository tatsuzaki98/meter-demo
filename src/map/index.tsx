import { MapContainer, Marker, Popup, TileLayer, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useSWR from 'swr';

const Map = () => {
  const { data: markers, mutate } = useSWR<Marker[]>('/api/markers', null, { fallbackData: [] });

  const AddMarker = () => {
    useMapEvents({
      click(e) {
        if (!markers) return;
        const newMarkers: Marker[] = [
          ...markers,
          {
            coordinates: [e.latlng.lat, e.latlng.lng],
            updatedAt: new Date().toISOString(),
            userNumber: "",
            meterValue: "",
          },
        ];
        mutate(newMarkers, false);
      },
    });
    return null;
  };

  if (!markers) return <p>Loading...</p>;

  const polylinePositions = markers.map(marker => marker.coordinates);

  return (
    <MapContainer
      center={[33.593, 130.398]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "60vh" }}
    >
      <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>,<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Mapdata: &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        url='https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png'
      />

      <AddMarker />

      {markers.map((marker, idx) => (
        <Marker key={`marker-${idx}`} position={marker.coordinates}>
          <Popup>
            <p>
              記入日時: {new Date(marker.updatedAt).toLocaleString()}
            </p>
            <p>
              番号: {idx + 1}
            </p>
          </Popup>
        </Marker>
      ))}

      <Polyline positions={polylinePositions} color="blue" />
    </MapContainer>
  );
};

export default Map;
