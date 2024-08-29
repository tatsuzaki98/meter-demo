import Board from "./board";
import Camera from "./camera";
import EachComponent from "./each";
import Map from "./map";
import useSWR from "swr";

const Index = () => {
  const {data: route} = useSWR<string>(
    '@route',
    null,
    {fallbackData: 'map'}
  );

  if (!route) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-green-200 flex flex-col">
      {(route == 'map' || route == 'each') && (
        <Map />
      )}

      {route == 'map' && (
        <Board />
      )}

      {route === 'each' && (
        <EachComponent />
      )}

      {/* camera:12 のようなパターンにマッチすればcameraコンポーネントを表示 */}
      {route.slice(0, 6) == 'camera' && <Camera />}
    </main>
  );
};

export default Index;
