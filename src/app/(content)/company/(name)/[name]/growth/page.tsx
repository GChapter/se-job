"use client";
import BarChart, { chartinfo } from "@/components/Chart/barchart";
import PieChart from "@/components/Chart/piechart";
import Appbar from "@/components/appbar";
import { fetchChart } from "@/components/controller";
import React, { useState, useEffect } from "react";

export default function ChartGrowth() {
  const [chartData, setChartData] = useState<chartinfo[]>([]);
  const fetchData = async () => {
    const data = await fetchChart();
    setChartData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Appbar />
      <main className={`flex flex-row h-[100vh] mt-5`}>
        <div className="w-1/5 h-full">
          <h1>Number of applications in each job of company</h1>
        </div>
        <div className="w-2/5 h-full mx-2">
          <BarChart data={chartData} />
        </div>
        <div className="w-2/5 h-full mx-2">
          <PieChart data={chartData} />
        </div>
      </main>
    </>
  );
}
