interface Marker {
  key: number;
  coordinates: [number, number];
  updatedAt?: string;
  editor: string;
  userNumber: string;
  meterValue: string;
  locationText: string;
}

interface MapProps {
  zoom: number;
  center: [number, number];
}
