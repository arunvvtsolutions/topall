import { ApexOptions } from 'apexcharts';

// Chart Options
export const chartOptions: ApexOptions = {
  chart: {
    type: 'radialBar',
    sparkline: { enabled: true },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    },
    redrawOnWindowResize: true,
    redrawOnParentResize: true
  },
  plotOptions: {
    radialBar: {
      startAngle: 0,
      endAngle: 360, // Full circle
      track: {
        background: '#e7e7e7',
        strokeWidth: '97%'
      },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: 5,
          fontSize: '15px',
          color: '#000000',
          formatter: (val) => `${val}%` // Ensure TypeScript infers the correct type
        }
      },
      hollow: { margin: 0, size: '60%' }
    }
  },
  fill: { colors: ['#0D068E'] },
  stroke: { lineCap: 'round' }
};

// Function to determine colors based on status
export const getStatusColors = (isActive: boolean) => ({
  barColor: isActive ? '#0D068E' : '#FF0000',
  trackColor: isActive ? '#0D068E80' : '#E3171780',
  changeColor: isActive ? 'text-[#0F9D58]' : 'text-[#FF4747]'
});
