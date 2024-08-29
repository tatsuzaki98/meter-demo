import React from "react";
import useSWR from "swr";

const EachComponent = () => {
  const { data: markers, mutate } = useSWR<Marker[]>('@markers', null, { fallbackData: [] });
  const { data: focusedKey } = useSWR<number | null>('@focusedKey', null);
  const { mutate: mutateRoute } = useSWR<string>('@route', null);

  const [state, setState] = React.useState({
    userNumber: "",
    meterValue: "",
    locationText: "",
    editor: "",
  });

  const handleInputUserNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      userNumber: e.target.value,
    });
  }

  const handleInputLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      locationText: e.target.value,
    });
  }

  React.useEffect(() => {
    if (!markers) return;
    const marker = markers.find((m) => m.key === focusedKey);
    if (!marker) {
      mutateRoute('map');
      return;
    }
    setState({
      userNumber: marker.userNumber,
      meterValue: marker.meterValue,
      locationText: marker.locationText,
      editor: marker.editor,
    });
  }, [markers, focusedKey, mutateRoute]);

  if (!markers) return <p>Loading...</p>;
  const marker = markers.find((m) => m.key === focusedKey);
  if (!marker) return null;

  return (
    <div
      className={`flex flex-col p-4 bg-gray-100 flex-1`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="font-bold mr-2">
            #{marker.key}
          </span>
        </div>
      </div>
      <form className="bg-white p-4 rounded shadow">
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <div className="flex flex-col w-full md:w-1/5 mb-2">
            <label className="font-bold mb-1">お客様番号</label>
            <input
              type="text"
              className="rounded border border-gray-300 px-2 py-1"
              value={state.userNumber}
              onChange={handleInputUserNumber}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/5 mb-2">
            <label className="font-bold mb-1">メーター位置</label>
            <input
              type="text"
              className="rounded border border-gray-300 px-2 py-1"
              value={state.locationText}
              onChange={handleInputLocation}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-2">
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
              value={state.editor}
              onChange={(e) => {
                setState({
                  ...state,
                  editor: e.target.value,
                });
              }}
            />
          </div>
        </div>

        {/* 完了して、mutateRoute('board') */}
        <div className="flex mt-4">
          <div className="flex flex-1 justify-center">
            <button
              className="px-2 py-1 bg-green-600 text-white rounded shadow font-bold w-24"
              onClick={(e) => {
                e.preventDefault();
                mutate(markers.map((m) => {
                  if (m.key === focusedKey) {
                    return {
                      ...m,
                      ...state,
                      updatedAt: new Date().toISOString(),
                    };
                  }
                  return m;
                }));
                mutateRoute('map')
              }}
            >
              完了
            </button>
          </div>
          <div className="flex flex-1 justify-center">
            <button
              className="text-blue-500 border-b border-blue-500"
              onClick={(e) => {
                e.preventDefault();
                window.confirm(`#${marker.key}を削除します`) &&
                  mutate(markers.filter((m) => m.key !== focusedKey));
              }}
            >
              削除
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EachComponent;
