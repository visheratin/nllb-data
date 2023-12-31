"use client";
import { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";
import { getDataFromDB, openDatabase, storeDataInDB } from "@/db/indexedDB";

interface Coords {
  id: string;
  x: number;
  y: number;
  cluster: number;
}

interface PlotData {
  x: number[];
  y: number[];
  c: number[];
}

interface ChartComponentProps {
  onZoom: (ids: string[]) => void;
}

const ChartComponent = (props: ChartComponentProps) => {
  const [data, setData] = useState<Coords[]>([]);
  const [plotData, setPlotData] = useState<PlotData>({ x: [], y: [], c: [] });
  const [markerSize, setMarkerSize] = useState<number>(2);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const plotContainerRef = useRef(null);

  const updateSize = () => {
    if (plotContainerRef.current) {
      setSize({
        // @ts-ignore
        width: plotContainerRef.current.offsetWidth,
        // @ts-ignore
        height: plotContainerRef.current.offsetHeight,
      });
    }
  };

  const updateMarkerSize = (xDiff: number, yDiff: number) => {
    if (xDiff < 40 || yDiff < 40) {
      setMarkerSize(5);
    } else {
      setMarkerSize(2);
    }
  };

  const filterData = (eventData: any) => {
    const xMin = eventData["xaxis.range[0]"];
    const xMax = eventData["xaxis.range[1]"];
    const yMin = eventData["yaxis.range[0]"];
    const yMax = eventData["yaxis.range[1]"];
    updateMarkerSize(xMax - xMin, yMax - yMin);
    const ids = [];
    const xc = [];
    const yc = [];
    const cc = [];
    for (let i = 0; i < data.length; i++) {
      const { id, x, y, cluster } = data[i];
      let ok = true;
      if (xMin && xMax) {
        ok = ok && x >= xMin && x <= xMax;
      }
      if (yMin && yMax) {
        ok = ok && y >= yMin && y <= yMax;
      }
      if (ok) {
        ids.push(id);
        xc.push(x);
        yc.push(y);
        cc.push(cluster);
      }
    }
    props.onZoom(ids);
    setPlotData({ x: xc, y: yc, c: cc });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const db = await openDatabase();
        let jsonData = await getDataFromDB(db);

        if (!jsonData) {
          const response = await fetch(
            "https://nllb-data.com/view/coords.json"
          );
          jsonData = (await response.json()) as Coords[];
          await storeDataInDB(db, jsonData);
        }

        jsonData.sort(() => Math.random() - 0.5);
        setData(jsonData);
        const subset = jsonData.slice(0, 96);
        const ids = subset.map((item: Coords) => item.id);
        props.onZoom(ids);

        const xc: number[] = [];
        const yc: number[] = [];
        const cc: number[] = [];
        for (let i = 0; i < jsonData.length; i++) {
          xc.push(jsonData[i].x);
          yc.push(jsonData[i].y);
          cc.push(jsonData[i].cluster);
        }
        setPlotData({ x: xc, y: yc, c: cc });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div ref={plotContainerRef} className="w-full h-full">
      <Plot
        data={[
          {
            x: plotData.x,
            y: plotData.y,
            mode: "markers",
            type: "scattergl",
            marker: {
              color: "rgb(17, 157, 255)",
              size: markerSize,
            },
            showlegend: false,
          },
        ]}
        layout={{
          width: size.width,
          height: size.height,
          autosize: true,
          hovermode: false,
          xaxis: {
            showgrid: false,
            zeroline: false,
          },
          yaxis: {
            showgrid: false,
            zeroline: false,
          },
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
          },
        }}
        onRelayout={filterData}
      />
    </div>
  );
};

export default ChartComponent;
