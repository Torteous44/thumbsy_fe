import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PriceRangeChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Under $100', '$100-300', 'Over $300'],
        datasets: [{
          data: [
            data.under_100 || 0,
            data['100_to_300'] || 0,
            data.over_300 || 0
          ],
          backgroundColor: '#000000',
          hoverBackgroundColor: '#1a1a1a',
          borderRadius: 6,
          maxBarThickness: 40,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#1a1a1a',
            bodyColor: '#1a1a1a',
            bodyFont: {
              family: 'sohneBuch',
              size: 13
            },
            titleFont: {
              family: 'sohneBuch',
              size: 13
            },
            borderColor: '#eee',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: function() {
                return '';
              },
              label: function(context) {
                return `${context.parsed.y} items`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                family: 'sohneBuch',
                size: 15
              },
              color: '#666',
              padding: 8
            },
            border: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f5f5f5',
              drawBorder: false
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                family: 'sohneExtraleicht',
                size: 13
              },
              color: '#666',
              padding: 8,
              stepSize: 1,
              maxTicksLimit: 5
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ height: '200px', marginTop: '1.5rem' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PriceRangeChart; 