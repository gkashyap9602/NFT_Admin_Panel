import React from "react"
import ReactApexChart from "react-apexcharts"
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import {Pie,Doughnut} from "react-chartjs-2"

const PieChart = ({dataColors}) => {
  const PieApexChartColors = getChartColorsArray(dataColors);

  const series = [44, 55, 41, 17]
  const options = {
    chart: {
      height: 420,

      type: 'pie',
    },
    series: [55, 18, 15, 12],
    labels: ["Free", "Platinum", "Gold", "Silver"],
    colors: PieApexChartColors,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          height: 240
        },
        legend: {
          show: false
        },
      }
    }]
  }
  const data = {
    labels: ["Free ", "Platinum", "Gold", "Silver"],
    datasets: [
      {
        data: series,
        backgroundColor: PieApexChartColors,
        hoverBackgroundColor: PieApexChartColors,
        hoverBorderColor: "#fff",
      },
    ],
  }
    {/* <ReactApexChart options={options} series={series} type="pie" height="320" /> */}

  return (
     <Doughnut width={851} height={360} data = {data}/>
  )
}

export default PieChart
