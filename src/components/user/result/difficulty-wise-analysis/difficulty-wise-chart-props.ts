import type { Props } from 'react-apexcharts';

export const ChartDataProps: Props = {
  type: 'donut',
  options: {
    chart: {
      type: 'donut',
      width: '100%'
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        startAngle: 0,
        donut: {
          size: '75%'
        }
      }
    },
    labels: [],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    colors: ['#00A86B', '#FF4747', '#FFAD43'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          }
        }
      }
    ]
  },
  series: []
};
