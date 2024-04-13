import { Dialog, IconButton, Slide } from "@mui/material";
import { KpiCard } from "../../components/kpi_card/KpiCard";
import "./Home.css";
import React, { useContext, useEffect, useState } from "react";
import { Calculator } from "../calculator/Calculator";
import { TransitionProps } from "@mui/material/transitions";
import { Close, Edit } from "@mui/icons-material";
import moment, { Moment } from "moment";
import { StaticDatePicker } from "@mui/x-date-pickers";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { parseJSON } from "../../utility/JSONParser";
import { useSmartContract } from "../../custom_hooks/useSmartContract";
import { UtilityContext } from "../../context/Utility.context";
import { Contract } from "ethers";
import footprint_info from "../../assets/footprint_info.png";
import { staticQuestions } from "../../constants/CalculatorQuestions";
import { DonutChartDataType } from "../../types/DonutChartData.type";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Home = () => {
  const todaysDate = moment(moment(new Date()).format("DD/MMM/YYYY"));
  const defaultDonutData: DonutChartDataType = {
    fuel: { labels: [], series: [] },
    energy: { labels: [], series: [] },
    travel: { labels: [], series: [] },
    meal: { labels: [], series: [] },
  };

  const [todayEmissions, setTodayEmissions] = useState<boolean>(false);
  const [barChartSeries, setBarChartSeries] = useState<
    Array<{ x: string; y: number }>
  >([]);
  const [donutChartSeries, setDonutChartSeries] =
    useState<DonutChartDataType>(defaultDonutData);
  const [openEmissionsForm, setOpenEmissionsForm] = useState<boolean>(false);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Moment>(todaysDate);
  const [kpiPerformanceValues, setKpiPerformanceValues] = useState<
    Record<string, number>
  >({
    ecoTrace : 0,
    credits : 4,
    neutrality : 40,
    total : 4
  });

  const { connectWallet, contractDetails } = useContext(UtilityContext);
  const { callSmartContractMethod } = useSmartContract();

  const fetchData = async () => {
    let localContract: Contract | null = null;
    if (!contractDetails.contract) {
      localContract = (await connectWallet()).contract;
    } else {
      localContract = contractDetails.contract;
    }
    if (localContract) {
      const {
        status,
        data = "",
        error = "",
      } = await callSmartContractMethod(localContract.fetchEmissions, true, {
        from: todaysDate.valueOf(),
        to: todaysDate.valueOf(),
      });
      if (status == "SUCCESS" && data) {
        const parsedData = parseJSON(data)[0];
        let myAnswers: Record<string, Record<string, number>> = {};
        let isDataFound = false;
        parsedData[1].forEach((each: any) => {
          if (each[0]) {
            isDataFound = true;
            if (!myAnswers[each[0]]) {
              myAnswers[each[0]] = { [each[1]]: Number(each[2]) };
            } else {
              myAnswers[each[0]] = {
                ...myAnswers[each[0]],
                [each[1]]: Number(each[2]),
              };
            }
          }
        });
        if (isDataFound) {
          setTodayEmissions(true);
          // Setting bar data
          const myBarData: Array<{ x: string; y: number }> = [];
          const myDonutData: DonutChartDataType = defaultDonutData;
          let todaysTotalEmission = 0;
          staticQuestions.forEach((category) => {
            let ans = 0;
            let categoryKey: "fuel" | "travel" | "energy" | "meal";
            if (category.category == "Fuel Consumption") categoryKey = "fuel";
            else if (category.category == "Travel") categoryKey = "travel";
            else if (category.category == "Energy Consumption")
              categoryKey = "energy";
            else categoryKey = "meal";

            category.questions.forEach((question) => {
              let answerForTheQuestion = 0;
              if (question.type == "radio") {
                question.options?.forEach((option) => {
                  if (
                    option.value ==
                    myAnswers[category.category][question.name]
                  ) {
                    answerForTheQuestion = option.factor;
                    ans += option.factor;
                  }
                });
              } else {
                ans +=
                  myAnswers[category.category][question.name] *
                  question.factor;
                answerForTheQuestion =
                  myAnswers[category.category][question.name] *
                  question.factor;
              }
              myDonutData[categoryKey].labels.push(
                question.name.charAt(0).toUpperCase() + question.name.slice(1)
              );
              myDonutData[categoryKey].series.push(
                Number(answerForTheQuestion.toFixed(2))
              );
            });
            myBarData.push({
              x: category.category,
              y: Number(ans.toFixed(2)),
            });
            todaysTotalEmission += ans;
          });
          setKpiPerformanceValues(prev => ({...prev,ecoTrace:todaysTotalEmission}))
          setBarChartSeries(myBarData);
          setDonutChartSeries(myDonutData);
        }
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpiValues = [
    {
      label: "Total Emissions",
      value: `${String(Math.floor(kpiPerformanceValues.total)).padStart(2,'0')}`,
      info: "Total Carbon emissions in tonnes.",
    },
    {
      label: `Eco-Trace of the Day`,
      value: `${String(Math.floor(kpiPerformanceValues.ecoTrace)).padStart(2,'0')}`,
      info: "Carbon emissions in KGs for today.",
    },
    {
      label: "Neutrality",
      value: `${String(Math.floor(kpiPerformanceValues.neutrality)).padStart(2,'0')}%`,
      info: "Amount of Emissions you have neutralized.",
    },
    {
      label: "Carbon Credits",
      value: `${String(Math.floor(kpiPerformanceValues.credits)).padStart(2,'0')}`,
      info: "Total carbon credits in your account. One carbon credit is equal to neutralizing one ton of CO2e.",
    },
  ];

  const onDateChange = (e: Moment | null) => {
    if (e) {
      setSelectedDate(e);
    }
  };

  const barChartData: ApexOptions = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
       
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
      offsetY: 0,
      align: "center",
      style: {
        color: "#444",
      },
    },
    series: [
      {
        name: "Carbon Emission",
        data: barChartSeries,
        color : '#9E9EBF'
        // color : '#FF6B6B'
        // color : '#FFD166'
        // color : '#6A4C93'
        // color : '#45A29E'
        // color : '#F4D35E'
        // color : '#277DA1'

        // color : '#9ABF9E'
        // color : '#BF9E9E'
        // color : '#9EBFBD'
        // color : '#BF9EBF'
      },
    ],
  };

  const chartDataDonut: ApexOptions = {
    chart: {
      type: "donut",
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false, // Disable legends
    },
    colors : ['#FF6B6B','#FFD166','#45A29E','#F4D35E','#277DA1','#A1684C','#8E8E8E']
  };

  const onCalculatorClose = () => {
    setOpenEmissionsForm(false);
    setTimeout(() => {
      setSelectedDate(todaysDate);
      fetchData()
      // Do fetch call again.
    }, 0);
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
          <div className="home_title_name">Eco-Trace of the Day</div>
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
                    options={barChartData}
                    series={barChartData.series}
                    type="bar"
                    height="600"
                    width={600}
                  />
                </div>
                <div className="home_donut_charts">
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={{
                        ...chartDataDonut,
                        title: {
                          text: "Carbon emission - Fuel Consumption",
                          align: "center",
                        },
                        labels: donutChartSeries.fuel.labels,
                        series: donutChartSeries.fuel.series,
                      }}
                      series={donutChartSeries.fuel.series}
                      type="donut"
                      height="300"
                      width={300}
                    />
                  </div>
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={{
                        ...chartDataDonut,
                        title: {
                          text: "Carbon emission - Energy Consumption",
                          align: "center",
                        },
                        labels: donutChartSeries.energy.labels,
                        series: donutChartSeries.energy.series,
                      }}
                      series={donutChartSeries.energy.series}
                      type="donut"
                      height="300"
                      width={300}
                    />
                  </div>
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={{
                        ...chartDataDonut,
                        title: {
                          text: "Carbon emission - Travel",
                          align: "center",
                        },
                        labels: donutChartSeries.travel.labels,
                        series: donutChartSeries.travel.series,
                      }}
                      series={donutChartSeries.travel.series}
                      type="donut"
                      height="300"
                      width={300}
                    />
                  </div>
                  <div className="home_donut_wrapper">
                    <ReactApexChart
                      options={{
                        ...chartDataDonut,
                        title: {
                          text: "Carbon emission - Food Habits",
                          align: "center",
                        },
                        labels: donutChartSeries.meal.labels,
                        series: donutChartSeries.meal.series,
                      }}
                      series={donutChartSeries.meal.series}
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
              <div className="home_no_emissions_wrapper">
                <div className="home_no_emissions_left">
                  <img
                    src={footprint_info}
                    className="home_footprint_infographic"
                    alt="footprint"
                  />
                </div>
                <div className="home_no_emissions_right">
                  <div className="home_no_emissions_text">
                    Your carbon mark is absent.
                  </div>
                  <div>
                    <button
                      className="home_add_emission_button"
                      onClick={() => setOpenEmissionsForm(true)}
                    >
                      Add Emissions
                    </button>
                  </div>
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
                Add Emissions: {selectedDate.format("DD MMM YYYY")}
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
                  onClick={onCalculatorClose}
                  aria-label="close"
                >
                  <Close />
                </IconButton>
              </div>
            </div>
            {/* <div className="home_dialog_close_icon_wrapper">
              
            </div> */}
            <Calculator date={selectedDate} onFinish={onCalculatorClose} />
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
