import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export function Chart(props) {
    const {position, text, labels, values}=props
    // labels: array of X axis tags
    // values: datasets: [ { label: 'SerieName', data: [array of Y values], backgroundColor: 'rgba'} ]

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: position || 'top',
          },
          title: {
            display: !!text,
            text: text,
          },
        },
      };
            
      const data = { labels, datasets: values };

  return <Bar options={options} data={data} />;
}
