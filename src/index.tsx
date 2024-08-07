import Board from "./board";
import Camera from "./camera";
import Map from "./map";
import useSWR from "swr";

const Index = () => {
  const {data: route} = useSWR<string>(
    '/api/route',
    null,
    {fallbackData: 'map'}
  );

  if (!route) return <p>Loading...</p>;

  return (
    <main>
      {route == 'map' && (
        <>
          <Map />
          <Board />
        </>
      )}
      {/* camera:12 のようなパターンにマッチすればcameraコンポーネントを表示 */}
      {route.slice(0, 6) == 'camera' && <Camera />}
    </main>
  );
};

export default Index;
