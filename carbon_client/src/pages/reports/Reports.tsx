import { useContext, useEffect, useState } from "react";
import "./Reports.css";
import { Dialog, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { UtilityContext } from "../../context/Utility.context";
import { useSmartContract } from "../../custom_hooks/useSmartContract";
import { Contract } from "ethers";
import { parseJSON } from "../../utility/JSONParser";
import { DonutChartDataType } from "../../types/DonutChartData.type";

interface RangeType {
  startDate: Date;
  endDate: Date;
}
export const Reports = () => {
  const defaultDates: RangeType = {
    endDate: moment(moment(new Date()).format("DD MMM YYYY")).toDate(),
    startDate: moment(moment(new Date()).format("DD MMM YYYY"))
      .subtract(30, "days")
      .toDate(),
  };

  const defaultDonutData: DonutChartDataType = {
    fuel: { labels: [], series: [] },
    energy: { labels: [], series: [] },
    travel: { labels: [], series: [] },
    meal: { labels: [], series: [] },
  };

  const [openRangePicker, setOpenRangePicker] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<RangeType>(defaultDates);
  const [barChartSeries, setBarChartSeries] = useState<
    Array<{ x: string; y: number }>
  >([]);
  const [donutChartSeries, setDonutChartSeries] =
    useState<DonutChartDataType>(defaultDonutData);

  const onRangeChange = (range: any) => {
    setDateRange({
      startDate: moment(
        moment(range["selection"].startDate).format("DD MMM YYYY")
      ).toDate(),
      endDate: moment(
        moment(range["selection"].endDate).format("DD MMM YYYY")
      ).toDate(),
    });
  };

  const { connectWallet, contractDetails } = useContext(UtilityContext);
  const { callSmartContractMethod } = useSmartContract();

  // Make sure to strip the time zone.
  const callSmartContractFetchMethod = async ({
    startDate,
    endDate,
  }: RangeType) => {
    let localContract: Contract | null = null;
    if (!contractDetails.contract) {
      localContract = (await connectWallet()).contract;
    } else {
      localContract = contractDetails.contract;
    }
    if (localContract) {
      const res = await callSmartContractMethod(
        localContract.fetchEmissions,
        true,
        {
          from: startDate.valueOf(),
          to: endDate.valueOf(),
        }
      );

      return { ...res, data: res.data ? parseJSON(res.data) : "" };
    }
  };

  // Make sure to strip the time zone.
  const fetchData = async ({ endDate, startDate }: RangeType) => {
    const myPromises: Array<Promise<any>> = [];
    let start = moment(moment(startDate).format("DD MMM YYYY"));
    let end = moment(moment(endDate).format("DD MMM YYYY"));
    while (start.valueOf() <= end.valueOf()) {
      let nextDate = moment(start).add(9, "days");
      if (nextDate.valueOf() < end.valueOf()) {
        myPromises.push(
          callSmartContractFetchMethod({
            startDate: start.toDate(),
            endDate: nextDate.toDate(),
          })
        );
        start.add(10, "days");
      } else {
        myPromises.push(
          callSmartContractFetchMethod({
            startDate: start.toDate(),
            endDate: end.toDate(),
          })
        );
        start = moment(end).add(1, "days");
      }
      //
    }

    const res = await Promise.all(myPromises);
    let mergedData: any[] = [];
    const isError = res.find((each) => each.status == "ERROR");
    if (!isError) {
      // fetch success
      res.forEach((each) => {
        mergedData = [
          ...mergedData,
          ...each.data
            .filter((eachDay: any) => Number(eachDay[0]))
            .map((eachDay: any) => ({
              date: moment(Number(eachDay[0])),
              emissions: eachDay[1].filter(
                (eachEmission: any) => eachEmission[0]
              ),
            })),
        ];
      });
    }
    const myBarData: Array<{ x: string; y: number }> = [];
    const myDonutData: DonutChartDataType = defaultDonutData;

    const myDonutEmissions: Record<
      keyof DonutChartDataType,
      Record<string, number>
    > = { energy: {}, fuel: {}, meal: {}, travel: {} };
    mergedData.forEach((data: any) => {
      const day = data.date.format("DD MMM YY");
      let emissions = 0;
      data.emissions.forEach((emission: any) => {
        emissions += Number(emission[4]);
        let categoryKey: "fuel" | "travel" | "energy" | "meal";
        if (emission[0] == "Fuel Consumption") categoryKey = "fuel";
        else if (emission[0] == "Travel") categoryKey = "travel";
        else if (emission[0] == "Energy Consumption") categoryKey = "energy";
        else categoryKey = "meal";
        myDonutEmissions[categoryKey][emission[1]] = myDonutEmissions[
          categoryKey
        ][emission[1]]
          ? myDonutEmissions[categoryKey][emission[1]] + Number(emission[4])
          : Number(emission[4]);
      });
      myBarData.push({ x: day, y: emissions });
    });
    for (let key in myDonutEmissions) {
      let tempKey: keyof DonutChartDataType = key as keyof DonutChartDataType;
      for (let key2 in myDonutEmissions[tempKey]) {
        myDonutData[tempKey].series.push(
          Number(myDonutEmissions[tempKey][key2].toFixed(2))
        );
        myDonutData[tempKey].labels.push(
          key2.charAt(0).toUpperCase() + key2.slice(1)
        );
      }
    }
    setBarChartSeries(myBarData);
    setDonutChartSeries(myDonutData);
  };

  const handleRangePickerClose = () => {
    setOpenRangePicker(false);
    fetchData({ ...dateRange });
  };

  useEffect(() => {
    fetchData({ ...defaultDates });
  }, []);

  const barChartData: ApexOptions = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    dataLabels: {
      formatter: function (val: any, _opt) {
        return val !== 0 ? val : "";
      },
    },
    xaxis: {
      title: {
        text: "Day",
      },
    },
    yaxis: {
      forceNiceScale: false,
      title: {
        text: "Carbon emissions (KG)",
      },
    },
    title: {
      text: `Carbon Emissions - [${moment(dateRange.startDate).format(
        "DD-MMM-YYYY"
      )},${moment(dateRange.endDate).format("DD-MMM-YYYY")}]`,
      offsetY: 0,
      align: "center",
      style: {
        color: "#444",
      },
    },
    series: [
      {
        name: "Carbon Emissions",
        data: barChartSeries,
        color : '#9E9EBF'
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

  return (
    <div className="reports_wrapper max_width">
      <div className="reports_header_title_container">
        <div className="reports_header_title_wrapper">
          <div className="reports_title_name">Reports</div>
          <div>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenRangePicker(true)}
              className="reports_edit_range"
            >
              <Edit />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="reports_body">
        <div className="reports_bar_chart">
          <ReactApexChart
            options={barChartData}
            series={barChartData.series}
            type="bar"
            height="600"
          />
        </div>
        <div className="reports_donut_charts_wrapper">
          {donutChartSeries.fuel.series &&
          donutChartSeries.fuel.series.length ? (
            <>
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
            </>
          ) : (
            <></>
          )}
          {donutChartSeries.energy.series &&
          donutChartSeries.energy.series.length ? (
            <>
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
            </>
          ) : (
            <></>
          )}
          {donutChartSeries.travel.series &&
          donutChartSeries.travel.series.length ? (
            <>
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
            </>
          ) : (
            <></>
          )}
          {donutChartSeries.meal.series &&
          donutChartSeries.meal.series.length ? (
            <>
              <div className="home_donut_wrapper">
                <ReactApexChart
                  options={{
                    ...chartDataDonut,
                    title: {
                      text: "Carbon emission - Food habits",
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
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      <Dialog open={openRangePicker} onClose={handleRangePickerClose}>
        <div className="reports_range_wrapper">
          <DateRangePicker
            ranges={[
              {
                ...dateRange,
                key: "selection",
              },
            ]}
            onChange={onRangeChange}
          />
          <div className="reports_picker_action">
            <button
              onClick={handleRangePickerClose}
              className="reports_save_date_button"
            >
              Update
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
