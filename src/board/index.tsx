import { FC } from "react";
import useSWR from 'swr';
import "leaflet/dist/leaflet.css";

const Dashboard: FC = () => {
  const { data: markers, mutate } = useSWR<Marker[]>('/api/markers', null, { fallbackData: [] });
  const {mutate: mutateRoute} = useSWR<string>('/api/route', null);

  const handleDelete = (idx: number) => {
    if (!markers) return;
    mutate(
      markers.filter((_, i) => i !== idx),
      false
    )
  }

  const handleInput = (idx: number, value: string) => {
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

  if (!markers) return <p>Loading...</p>;

  return (
    <div
      className="p-4 bg-gray-100 overflow-auto space-y-2"
      style={{ height: "40vh" }}
    >
      <div className="flex space-x-4 text-nowrap">
        {/* 担当者 プルダウンメニュー */}
        <div className="flex items-center space-x-2">
          <label className="px-2">担当者</label>
          <select className="rounded border border-gray-300 px-2 py-1">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>

        {/* 記入年月 */}
        <div className="flex items-center space-x-2">
          <span className="pr-2">記入年月</span>
          <span className="">西暦</span>
          <input type="number" className="rounded border border-gray-300 px-2 py-1 text-right w-24" />
          <span className="">年</span>
          <input type="number" className="rounded border border-gray-300 px-2 py-1 text-right w-24" />
          <span className="">月</span>
        </div>
      </div>

      <table className="w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">
              #
            </th>
            <th className="py-2 px-4 border-b">
              お客様番号
            </th>
            <th className="py-2 px-4 border-b">
              検針値
            </th>
            <th className="py-2 px-4 border-b">
              記入日時
            </th>
          </tr>
        </thead>
        <tbody
          className="text-nowrap"
        >
          {markers.map((marker, idx) => (
            <tr
              key={`marker-detail-${idx}`}
            >
              <td className="py-2 px-4 border-b">
                <span>
                  {idx + 1}
                </span>
                <button
                  className="ml-2 px-2 py-1 bg-red-700 text-white rounded shadow font-bold"
                  onClick={() => handleDelete(idx)}
                >
                  取消
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="rounded border border-gray-300 px-1"
                  value={marker.userNumber}
                  onChange={(e) => handleInput(idx, e.target.value)}
                />
              </td>
              <td className="py-2 px-4 border-b text-right">
                <span className="px-2">
                  {marker.meterValue !== "" && marker.meterValue}
                </span>
                <button
                  className="px-2 py-1 rounded shadow bg-green-600 text-white font-bold"
                  onClick={() => mutateRoute(`camera:${idx}`, false)}
                >
                  {marker.meterValue !== "" ? "訂正" : "記入"}
                </button>
              </td>
              <td className="py-2 px-4 border-b text-center">
                {marker.updatedAt && new Date(marker.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
