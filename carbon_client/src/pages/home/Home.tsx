import { Dialog, IconButton, Slide } from "@mui/material";
import { KpiCard } from "../../components/kpi_card/KpiCard";
import "./Home.css";
import React, { useEffect, useState } from "react";
import { Calculator } from "../calculator/Calculator";
import { TransitionProps } from "@mui/material/transitions";
import { Close, Edit } from "@mui/icons-material";
import moment, { Moment } from "moment";
import { StaticDatePicker } from "@mui/x-date-pickers";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Home = () => {
  // const[selectedDate,setSelectedDate] = useState<Moment>(moment(new Date()));
  const [todayEmissions, setTodayEmissions] = useState<any>(true);
  const [openEmissionsForm, setOpenEmissionsForm] = useState<boolean>(false);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment(new Date()));

  useEffect(() => {
    // fetch today emissions
  }, []);

  const kpiValues = [
    {
      label: "Neutrality",
      value: "40%",
      info: "Amount of Carbon Emission you have neutralized.",
    },
    {
      label: "Total Emissions",
      value: "20",
      info: "Total carbon emissions in tonnes.",
    },
    {
      label: "Carbon Credits",
      value: "04",
      info: "Total carbon credits in your account. One carbon credit is equal to neutralizing one ton of CO2e",
    },
    {
      label: "Carbon Credits",
      value: "04",
      info: "Total carbon credits in your account. One carbon credit is equal to neutralizing one ton of CO2e",
    },
    {
      label: "Carbon Credits",
      value: "04",
      info: "Total carbon credits in your account. One carbon credit is equal to neutralizing one ton of CO2e",
    },
  ];

  const onDateChange = (e: Moment | null) => {
    if (e) {
      setSelectedDate(e);
    }
  };

  const chartData: ApexOptions = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: 50,
      },
    },
    xaxis: {
      title: {
        text: "Categories",
      },
    },

    yaxis: {
      forceNiceScale: false,
      title: {
        text: "Carbon emissions (KG)",
      },
    },
    title: {
      text: `Carbon Emissions - ${selectedDate.format("DD-MMM-YYYY")}`,
      // floating: true,
      offsetY: 0,
      align: "center",
      style: {
        color: "#444",
      },
    },
    // Example data series, you can replace it with your own data
    series: [
      {
        name: "Carbon Emission",
        data: [
          {
            x: "Fuel",
            y: 20,
          },
          {
            x: "Travel",
            y: 120,
          },
          {
            x: "Energy",
            y: 50,
          },
          {
            x: "Food habits",
            y: 10,
          },
        ],
      },
    ],
  };

  const chartDataDonut: ApexOptions = {
    chart: {
      type: "donut",
      // stacked: true, // Set to true to create a stacked column chart
    },
    title: {
      text: "Carbon emission - Travel",
      align: "center",
    },
    labels: ["Car", "Electric Car", "Rail", "Metro"],
    series: [10, 20, 40, 70],
    legend: {
      show: false, // Disable legends
    },
  };

  return (
    <>
      <div className="home_wrapper max_width">
        <div className="home_kpi_container">
          {kpiValues.map((each, index: number) => (
            <KpiCard key={index} {...each} />
          ))}
        </div>

        <div className="home_tracker_header_title_wrapper">
          <div className="home_title_name">Today's Emissions</div>
          <div>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenEmissionsForm(true)}
              className="home_edit_emission"
            >
              <Edit />
            </IconButton>
          </div>
          <div className="home_title_horizontal_line"></div>
        </div>

        {/* <div className="home_date_field_wrapper">
          <div>
          <DatePicker
            className="home_date_field_picker"
            format="DD/MM/YYYY"
            onChange={onDateChange}
            value={selectedDate}
          />
          </div>
        </div> */}

        <div className="home_tracker_body_wrapper">
          {todayEmissions ? (
            <>
              <div className="home_reports">
                <div className="home_bar_chart">
                  <ReactApexChart
                    options={chartData}
                    series={chartData.series}
                    type="bar"
                    height="600"
                    width={600}
                  />
                </div>
                <div className="home_donut_charts">
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={chartDataDonut}
                      series={chartDataDonut.series}
                      type="donut"
                      height="300"
                      width={300}
                    />
                  </div>
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={chartDataDonut}
                      series={chartDataDonut.series}
                      type="donut"
                      height="300"
                      width={300}
                    />
                  </div>
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={chartDataDonut}
                      series={chartDataDonut.series}
                      type="donut"
                      height="300"
                      width={300}
                    />
                  </div>
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={chartDataDonut}
                      series={chartDataDonut.series}
                      type="donut"
                      height="300"
                      width={300}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="home_mo_emissions_wrapper">
                <div>No Emissions added</div>
                <div>
                  <button onClick={() => setOpenEmissionsForm(true)}>
                    Add Emissions
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <Dialog
          fullScreen
          open={openEmissionsForm}
          TransitionComponent={Transition}
        >
          <div className="home_dialog_wrapper">
            <div className="home_dialog_header">
              <div>
                Add Emissions - {selectedDate.format("DD-MMM-YYYY")}
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setOpenDatePicker(true)}
                  className="home_dialog_edit_date"
                >
                  <Edit />
                </IconButton>
              </div>
              <div>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setOpenEmissionsForm(false)}
                  aria-label="close"
                >
                  <Close />
                </IconButton>
              </div>
            </div>
            {/* <div className="home_dialog_close_icon_wrapper">
              
            </div> */}
            <Calculator />
          </div>
        </Dialog>

        <Dialog open={openDatePicker} onClose={() => setOpenDatePicker(false)}>
          <StaticDatePicker
            maxDate={moment(new Date())}
            onAccept={onDateChange}
            value={selectedDate}
            onClose={() => setOpenDatePicker(false)}
          />
        </Dialog>

        {/* <div>
          <Calculator />
        </div> */}
      </div>
    </>
  );
};
