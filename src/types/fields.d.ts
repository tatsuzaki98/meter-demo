interface Marker {
  coordinates: [number, number];
  updatedAt?: string;
  userNumber: string;
  meterValue: string;
}

interface MapProps {
  zoom: number;
  center: [number, number];
}
