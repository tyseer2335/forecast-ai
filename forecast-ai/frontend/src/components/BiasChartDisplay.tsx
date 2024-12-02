// src/components/BiasChartDisplay.tsx
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Answer, BiasColorForChart } from "../hooks/types";
import {
  biasColorToBiasNameMap,
  biasColorToHexCodeMap,
} from "../hooks/constants";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

type BiasChartDisplayProps = {
  answer: Answer;
  visibleBiasColor: BiasColorForChart | "";
};

const BiasChartDisplay: React.FC<BiasChartDisplayProps> = ({
  answer,
  visibleBiasColor,
}) => {
  const calculateAverageBias = (feature: string) => {
    const featureData = answer.llm_features[feature];
    const values = Object.values(featureData) as number[];
    return values.reduce((acc, val) => acc + val, 0) / values.length;
  };

  const getBiasData = () => {
    const biasData: { [key: string]: number } = {};

    Object.values(BiasColorForChart).forEach((biasColor) => {
      const biasName = biasColorToBiasNameMap[biasColor as BiasColorForChart];
      if (answer.llm_features[biasName]) {
        biasData[biasName] = calculateAverageBias(biasName);
      }
    });

    return biasData;
  };

  const biasData = getBiasData();
  // Update the chart data configuration
  const pieChartData = {
    labels: Object.keys(biasData),
    datasets: [
      {
        data: Object.values(biasData),
        backgroundColor: Object.keys(biasData).map((biasName) => {
          // Find the corresponding BiasColor for this bias name
          const biasColor = Object.entries(biasColorToBiasNameMap).find(
            ([_, name]) => name === biasName
          )?.[0] as BiasColorForChart;
          return biasColorToHexCodeMap[biasColor];
        }),
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(biasData),
    datasets: [
      {
        label: "Bias Score",
        data: Object.values(biasData),
        backgroundColor: Object.keys(biasData).map((biasName) => {
          const biasColor = Object.entries(biasColorToBiasNameMap).find(
            ([_, name]) => name === biasName
          )?.[0] as BiasColorForChart;
          return biasColorToHexCodeMap[biasColor];
        }),
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "white",
          padding: 20,
          font: {
            size: 11,
          },
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets[0];
            return chart.data.labels.map((label: string, i: number) => ({
              text: label,
              fillStyle: datasets.backgroundColor[i],
              strokeStyle: datasets.backgroundColor[i],
              lineWidth: 0,
              hidden: false,
              index: i,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `Score: ${(value * 100).toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
          callback: (value: number) => `${(value * 100).toFixed(0)}%`,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-sidebar-bg rounded-md flex flex-col space-y-6 w-full max-w-[933px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">
          Bias Analysis
        </h3>

        {/* Legend */}
        <div className="flex gap-4 text-[8px] sm:text-xs">
          {Object.values(BiasColorForChart).map((biasColor) => {
            const biasName = biasColorToBiasNameMap[biasColor];
            const hexColor = biasColorToHexCodeMap[biasColor];
            return (
              <div
                key={biasColor}
                className="flex items-center gap-1 group relative"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: hexColor, opacity: 0.7 }}
                />
                <span className="text-white">{biasName}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#2A2A2A] p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">
              Distribution of Bias Intensity Scores
            </h4>
            <div className="text-xs text-gray-400">Relative Proportion</div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={pieChartData} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#2A2A2A] p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Bias Intensity Scores</h4>
            <div className="text-xs text-gray-400">Scale: 0-1</div>
          </div>
          <div className="h-[300px]">
            <Bar data={barChartData} />
          </div>
        </div>
      </div>

      {/* Explanation footer */}
      <div className="text-xs text-gray-400 bg-[#1A1A1A] p-3 rounded-md">
        <p>The charts above show two perspectives of bias in the forecast:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>
            Left: Relative distribution showing which bias types are most
            prevalent
          </li>
          <li>Right: Absolute scores showing the strength of each bias type</li>
        </ul>
      </div>
    </div>
  );
};

export default BiasChartDisplay;
