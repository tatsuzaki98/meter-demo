import { FC } from "react";
import useSWR from 'swr';
import "leaflet/dist/leaflet.css";

const Dashboard: FC = () => {
  const { data: markers, mutate } = useSWR<Marker[]>('@markers', null, { fallbackData: [] });
  const { data: editor, mutate: mutateEditor } = useSWR<string>('@editor', null, { fallbackData: "" });
  const { data: focusedKey, mutate: mutateFocusedKey } = useSWR<number>('@focusedKey', null);
  const { mutate: mutateRoute } = useSWR<string>('@route', null);

  const handleDelete = (key: number) => {
    if (!markers) return;
    window.confirm(`${key}番のマーカーを削除します`) &&
      mutate(
        markers.filter((m) => m.key !== key),
        false
      )
  }

  if (!markers) return <p>Loading...</p>;

  return (
    <div
      className="p-4 bg-gray-100 space-y-2"
    >
      <div className="flex space-x-4 text-nowrap">
        <div className="flex items-center space-x-2">
          <label className="px-2">担当者</label>
          <input type="text" className="rounded border px-1" value={editor} onChange={(e) => mutateEditor(e.target.value)} />
        </div>
      </div>

      <div
        className="w-full overflow-auto"
        style={{ height: "40vh" }}
      >
        <div className="flex flex-col space-y-2">
          {markers.map((marker, idx) => (
            <div
              key={idx}
              className={`flex flex-col rounded bg-white shadow p-4 ${focusedKey === marker.key ? 'border-2 border-blue-400' : ''}`}
            >
              <div className="flex items-center pb-2">
                <span className="font-bold mr-2">
                  #{marker.key}
                </span>
                <button
                  className="ml-4 px-2 py-1 bg-green-600 text-white rounded shadow font-bold"
                  onClick={() => {
                    mutateFocusedKey(marker.key);
                    mutateRoute('each')
                  }}
                >
                  編集
                </button>
                <button
                  className="ml-4 py-1 text-blue-500 border-b border-blue-500"
                  onClick={() => handleDelete(marker.key)}
                >
                  削除
                </button>
              </div>
              <div className="flex flex-row space-x-2">
                <div className="flex flex-col w-full md:w-1/5 mb-2">
                  <label className="font-bold mb-1">お客様番号</label>
                  <p>
                    {marker.userNumber}
                  </p>
                </div>
                <div className="flex flex-col w-full md:w-1/5 mb-2">
                  <label className="font-bold mb-1">メーター位置</label>
                  <span>
                    {marker.locationText}
                  </span>
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <div className="flex flex-col w-full md:w-1/5 mb-2">
                  <label className="font-bold mb-1">記入日時</label>
                  <div className="">
                    {marker.updatedAt && new Date(marker.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-1/5 mb-2">
                  <label className="font-bold mb-1">記入者</label>
                  <span>
                    {marker.editor}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
