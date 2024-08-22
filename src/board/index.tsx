import { FC } from "react";
import useSWR from 'swr';
import "leaflet/dist/leaflet.css";

const Dashboard: FC = () => {
  const { data: markers, mutate } = useSWR<Marker[]>('@markers', null, { fallbackData: [] });
  const { data: editor, mutate: mutateEditor } = useSWR<string>('@editor', null, { fallbackData: "" });
  const { data: focusedKey } = useSWR<number>('@focusedKey', null);

  const handleDelete = (idx: number) => {
    if (!markers) return;
    window.confirm(`${idx + 1}番のマーカーを削除します`) &&
      mutate(
        markers.filter((_, i) => i !== idx),
        false
      )
  }

  const handleInputUserNumber = (idx: number, value: string) => {
    if (!markers) return;
    mutate(
      markers.map((marker, i) => {
        if (i === idx) {
          return {
            ...marker,
            userNumber: value
          }
        }
        return marker;
      }),
      false
    )
  }

  const handleInputLocation = (idx: number, value: string) => {
    if (!markers) return;
    mutate(
      markers.map((marker, i) => {
        if (i === idx) {
          return {
            ...marker,
            locationText: value
          }
        }
        return marker;
      }),
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
        className="w-full bg-white overflow-auto"
        style={{ height: "40vh" }}
      >
        <div className="flex flex-col">
          {markers.map((marker, idx) => (
            <div
              key={`marker-detail-${idx}`}
              className={`flex flex-col p-4 border-b-4 border-gray-100 ${focusedKey === idx ? 'bg-gray-200' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="font-bold mr-2">
                    #{marker.key + 1}
                  </span>
                  <button
                    className="ml-4 px-2 py-1 bg-red-700 text-white rounded shadow font-bold"
                    onClick={() => handleDelete(idx)}
                  >
                    取消
                  </button>
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <div className="flex flex-col w-full md:w-1/5 mb-2">
                  <label className="font-bold mb-1">お客様番号</label>
                  <input
                    type="text"
                    className="rounded border border-gray-300 px-2 py-1"
                    value={marker.userNumber}
                    onChange={(e) => handleInputUserNumber(idx, e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/5 mb-2">
                  <label className="font-bold mb-1">メーター位置</label>
                  <input
                    type="text"
                    className="rounded border border-gray-300 px-2 py-1"
                    value={marker.locationText}
                    onChange={(e) => handleInputLocation(idx, e.target.value)}
                  />
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
                  <input
                    className="rounded border border-gray-300 px-2 py-1"
                    type="text"
                    value={marker.editor}
                  />
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
