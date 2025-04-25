import type { ApexOptions } from 'apexcharts';

export const chartOptions: ApexOptions = {
  chart: {
    type: 'donut',
    height: 250
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: false
        }
      }
    }
  },
  colors: ['#00A86B', '#FF4747', '#FFAD43'],
  labels: ['Correct', 'Wrong', 'Left'],
  stroke: {
    lineCap: 'round'
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  }
};

export const swiperResponsiveClass = {
  320: {
    slidesPerView: 1.2,
    spaceBetween: 8
  },
  387: {
    slidesPerView: 1.25,
    spaceBetween: 10
  },
  420: {
    slidesPerView: 1.5,
    spaceBetween: 12
  },
  471: {
    slidesPerView: 1.7,
    spaceBetween: 14
  },
  487: {
    slidesPerView: 1.8,
    spaceBetween: 14
  },
  640: {
    slidesPerView: 2.25,
    spaceBetween: 16
  },
  800: {
    slidesPerView: 2.5,
    spaceBetween: 18
  },
  900: {
    slidesPerView: 2.7,
    spaceBetween: 18
  },
  1024: {
    slidesPerView: 2,
    spaceBetween: 18
  },
  1290: {
    slidesPerView: 2.2,
    spaceBetween: 18
  },
  1436: {
    slidesPerView: 2.5,
    spaceBetween: 21
  },
  1700: {
    slidesPerView: 3,
    spaceBetween: 24
  }
};
