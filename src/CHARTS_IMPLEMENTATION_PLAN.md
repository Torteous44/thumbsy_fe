CHARTS_IMPLEMENTATION_PLAN.md

# Charts Implementation Plan

## 1. Overview

You want to display a set of horizontal bar charts (using Chart.js) in a React application. 
The requirements are:
- There are **two main rows**.
- Each row contains **up to three columns**.
- Each column contains **three horizontal bar charts** (stacked vertically within the column).

The data for these charts comes from a backend (e.g., an API), and each chart will reflect a category (like "Minimalist," "Maximalist," etc.) with a numeric value. We will use React for the front end, `react-chartjs-2` (or directly Chart.js) for the charts, and standard CSS (or a CSS framework) for layout and styling.

---

## 2. Directory Structure
- **api/fetchChartData.js**: contains logic for fetching chart data from your backend.
- **components/charts/HorizontalBarChart.jsx**: a reusable component that renders a single horizontal bar chart using Chart.js.
- **components/charts/ChartGroup.jsx**: contains the logic for grouping 3 bar charts stacked vertically.
- **components/layout/RowOfCharts.jsx**: contains the layout logic that arranges columns side-by-side, up to 3 columns in a row.
- **styles/ChartStyles.css**: CSS for customizing the look of the Chart components.
- **styles/Layout.css**: CSS for controlling row and column layout (e.g., using flex or grid).

## 3. Data Flow

1. **Fetching the data**: 
   - In your `fetchChartData.js`, export an async function that hits your backend endpoint and returns the data in a structured format. 
   - The data might look like this for each category:
     ```json
     {
       "visualStyle": [
         { "label": "Minimalist", "value": 0.35 },
         { "label": "Maximalist", "value": 0.21 },
         { "label": "Modern", "value": 0.10 },
         { "label": "Vintage", "value": 0.35 }
       ],
       "colorPalette": [
         { "label": "Bright", "value": 0.35 },
         { "label": "Muted", "value": 0.21 },
         ...
       ],
       ...
     }
     ```
   - Adjust this structure as needed to match your real backend API.

2. **Passing data to components**: 
   - In `App.js` (or a parent container), you can call `fetchChartData()` within a `useEffect` hook, store the result in local state, and then pass down the relevant data to the layout components.

3. **Rendering chart groups**: 
   - Each set of 3 bar charts is grouped into a single column using `ChartGroup.jsx`.
   - Each chart is rendered by `HorizontalBarChart.jsx`.

4. **Arranging columns into rows**:
   - `RowOfCharts.jsx` accepts up to 3 `<ChartGroup />` components and arranges them side by side.
   - You will have two instances of `<RowOfCharts />` (one for the first row, another for the second row) in your parent container (e.g., `App.js`).

---

## 4. Step-by-Step Implementation

### 4.1 Install Dependencies

```bash
npm install react-chartjs-2 chart.js
# or
yarn add react-chartjs-2 chart.js

// src/api/fetchChartData.js
export async function fetchChartData() {
  try {
    const response = await fetch('/api/chart-data'); // Adjust URL
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data; // e.g., { visualStyle: [...], colorPalette: [...], ... }
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return null;
  }
}

// src/utils/chartConfig.js
export const baseChartOptions = {
  indexAxis: 'y',
  responsive: true,
  scales: {
    x: {
      beginAtZero: true,
      max: 1 // if your values are percentages 0–1
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

export function createChartData(labels, values) {
  return {
    labels,
    datasets: [
      {
        label: 'Value',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.7)' // Adjust as needed
      }
    ]
  };
}

// src/components/charts/HorizontalBarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { baseChartOptions, createChartData } from '../../utils/chartConfig';

const HorizontalBarChart = ({ chartData }) => {
  // chartData is an array of objects: [{ label, value }, { label, value }, ...]
  const labels = chartData.map(item => item.label);
  const values = chartData.map(item => item.value);

  const data = createChartData(labels, values);
  const options = { ...baseChartOptions };

  return <Bar data={data} options={options} />;
};

export default HorizontalBarChart;

// src/components/charts/ChartGroup.jsx
import React from 'react';
import HorizontalBarChart from './HorizontalBarChart';
import './ChartStyles.css'; // For any styling specific to charts

const ChartGroup = ({ groupData }) => {
  // groupData is an array of arrays, each sub-array for a single horizontal bar chart
  // e.g., groupData = [
  //   [{ label: 'Minimalist', value: 0.35 }, ... ],
  //   [{ label: 'Bright', value: 0.35 }, ... ],
  //   [{ label: 'Budget-friendly', value: 0.35 }, ... ]
  // ]
  return (
    <div className="chart-group-container">
      {groupData.map((chartData, idx) => (
        <div key={idx} className="single-chart-wrapper">
          <HorizontalBarChart chartData={chartData} />
        </div>
      ))}
    </div>
  );
};

export default ChartGroup;

.chart-group-container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space between stacked charts */
}

.single-chart-wrapper {
  /* Additional styling or padding can go here */
}

## 3. Data Flow

1. **Fetching the data**: 
   - In your `fetchChartData.js`, export an async function that hits your backend endpoint and returns the data in a structured format. 
   - The data might look like this for each category:
     ```json
     {
       "visualStyle": [
         { "label": "Minimalist", "value": 0.35 },
         { "label": "Maximalist", "value": 0.21 },
         { "label": "Modern", "value": 0.10 },
         { "label": "Vintage", "value": 0.35 }
       ],
       "colorPalette": [
         { "label": "Bright", "value": 0.35 },
         { "label": "Muted", "value": 0.21 },
         ...
       ],
       ...
     }
     ```
   - Adjust this structure as needed to match your real backend API.

2. **Passing data to components**: 
   - In `App.js` (or a parent container), you can call `fetchChartData()` within a `useEffect` hook, store the result in local state, and then pass down the relevant data to the layout components.

3. **Rendering chart groups**: 
   - Each set of 3 bar charts is grouped into a single column using `ChartGroup.jsx`.
   - Each chart is rendered by `HorizontalBarChart.jsx`.

4. **Arranging columns into rows**:
   - `RowOfCharts.jsx` accepts up to 3 `<ChartGroup />` components and arranges them side by side.
   - You will have two instances of `<RowOfCharts />` (one for the first row, another for the second row) in your parent container (e.g., `App.js`).

---

## 4. Step-by-Step Implementation

### 4.1 Install Dependencies

```bash
npm install react-chartjs-2 chart.js
# or
yarn add react-chartjs-2 chart.js

.row-of-charts-container {
  display: flex;
  flex-direction: row;
  gap: 2rem; /* spacing between columns */
  margin-bottom: 2rem; /* spacing between rows */
}

.chart-column {
  flex: 1; /* each column expands equally */
}

