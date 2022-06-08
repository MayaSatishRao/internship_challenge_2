// importing the required components

import React, { Fragment, useState } from "react";
import { Line } from "react-chartjs-2";
import "./FileUpload.css"

// importing the elements of chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

// getting the colors for different datasets
const colors = ["#D291BC", "#B8DBD0", "#FFAF68", "#E8A68E","9BB8ED","A39FE1","B3D9B2"];

// initial label values
let labels = ["January", "February", "March", "April", "May", "June", "July"];

// initial datasets
const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => Math.random() * 1000 + 1),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => Math.random() * 1000 + 1),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

// variables to store datasets obtained from csv file
let labels1 = [],
  datasets = [],
  xAxis = "";

// react FileUpload componenet
const FileUpload = () => {
  // when new file is selected the previous datasets should be erased.
  // so we are emptying the previous datasets
  labels1 = [];
  datasets = [];
  xAxis = "";

  // creating a state for csv file uploaded and chartdata
  const [file, setFile] = useState();
  const [chartData, setChartData] = useState(data);
  const [Title, setTitle] = useState("Line Chart");

  // the standard options for the chart where only title is changed
  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: Title,
      },
    },
  };
  // this function is used to create dataset from text which we obtain from csv file
  const createJson = (text) => {
    const headers = text.slice(0, text.indexOf("\n")).split(",");
    const rows = text.slice(text.indexOf("\n") + 1, text.length).split("\n");

    const colNumber = headers.length;
    const rowNumber = rows.length;

    for (let i = 1; i < colNumber; i++) {
      const arr = [];
      for (let j = 0; j < rowNumber; j++) {
        arr.push(rows[j].split(",")[i]);
      }
      const obj = {
        label: headers[i],
        data: arr,
        borderColor: colors[i - 1],
        backgroundColor: colors[i - 1],
      };
      datasets.push(obj);
    }

    console.log(datasets);
    for (let j = 0; j < rowNumber; j++) labels1.push(rows[j].split(",")[0]);

    xAxis = headers[0];

    const finalObject = { labels: labels1, datasets };
    setChartData(finalObject);
  };

  // function to read the file
  const readFile = () => {
    const uploadedFile = file;
    if (uploadedFile != null) {
      // creating a file reader and reading the csv file and converting into text
      const reader = new FileReader();
      reader.onload = (e) => {
        
        createJson(e.target.result);
      };
      reader.readAsText(uploadedFile);
      const newTitle = uploadedFile.name
        .slice(0, file.name.length - 4)
        .toUpperCase();
      setTitle(newTitle);
      //console.log(uploadedFile);
    }
  };

  // jsx code for the component
  return (
    <Fragment>
      <form id="file-form">
      <div class="mb-3">
      <input
          type="file"
          accept=".csv"
          id="inputGroupFile02"
          class="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
        class="btn btn-primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (file) readFile();
          }}>
          Submit
        </button>
        
          
      </div>
        
        
      </form>
      <Line options={options} data={chartData} height="1000" width="2000"/>
    </Fragment>
  );
};

export default FileUpload;
