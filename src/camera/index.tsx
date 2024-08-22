import { FC, useState } from "react";
import useSWR from "swr";
import imgUrl from "./image.png";

const Camera: FC = () => {
  const {data: route, mutate: mutateRoute} = useSWR<string>('@route', null);
  const {data: markers, mutate} = useSWR<Marker[]>('@markers', null, {fallbackData: []});

  const [state, setState] = useState({meterValue: '0001'});

  if (!route) return <p>Loading...</p>;
  if (!markers) return <p>Loading...</p>;

  const key: string = route?.slice(7);

  return (
    <section className="flex justify-center items-center p-4">
      <div className="p-4 rounded-lg shadow-lg flex flex-col w-96">
        <div>
          <button className="text-blue-500 hover:text-blue-700 border-b border-blue-500" onClick={() => mutateRoute('map')}>
            戻る
          </button>
        </div>
        <div className="flex justify-center items-center">
          <img
            id="meterImage"
            src={imgUrl}
            alt="メーター画像"
            className="w-64 object-cover mb-4"
          />
        </div>
        <button id="captureButton" className="bg-gray-300 hover:bg-gray-500 text-gray-800 hover:text-white shadow font-bold py-2 px-4 rounded mb-4">
          撮影
        </button>
        <div className="mb-4 flex justify-center items-center flex-col">
          <p className="text-gray-700 font-bold text-lg">検針値</p>
          <div className="flex">
            <input
              type="text"
              value={state.meterValue}
              className="text-6xl w-full text-center"
              onChange={(e) => setState({meterValue: e.target.value})}
            />
          </div>
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            mutateRoute('map');
            mutate(
              markers.map((marker, idx) => {
                if (idx == Number(key)) {
                  return {
                    ...marker,
                    meterValue: state.meterValue,
                    updatedAt: new Date().toISOString(),
                  };
                }
                return marker;
              }
            ));
          }}
        >
          保存
        </button>
      </div>
    </section>
  );
}

export default Camera;
