import { useEffect, useState } from "react";
import "./CalculationSession.css";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAxios } from "../../custom_hooks/useAxios";
import moment from "moment";

const staticColumns: GridColDef[] = [
  {
    field: "created_on",
    headerName: "Created On",
    width: 200,
    editable: false,
  },
  {
    field: "start_date",
    headerName: "From",
    width: 200,
    editable: false,
  },
  {
    field: "end_date",
    headerName: "To",
    width: 200,
    editable: false,
  },
];

export const CalculationSession = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<ReadonlyArray<GridColDef>>([]);
  const [tableData, setTableData] = useState<ReadonlyArray<any>>([
    { id: "temp" },
  ]);

  const { doCall } = useAxios();

  const addSession = () => {
    navigate("/dashboard/add-session");
  };

  const doInit = async () => {
    const categories = await doCall({
      method: "get",
      url: "/questions",
    });
    if (categories.res && categories.res.data && categories.res.data.length) {
      setColumns([
        ...staticColumns,
        ...categories.res.data.map((category: any) => {
          return {
            field: category.category_name,
            headerName: category.category_name,
            width: 200,
            editable: false,
          };
        }),
      ]);
    } else {
      alert("Something went wrong!! Please refresh the page.");
      return;
    }

    const answers = await doCall({
      method: "get",
      url: "/user-session",
    });

    console.log(answers);

    if (answers.res && answers.res.data && answers.res.data.length) {
      // Set table data and calculate category answers.
      const rows = answers.res.data.map((each: any) => {
        let questionIdWithValues: Record<string, any> = {};
        each.details.forEach((detail: any) => {
          questionIdWithValues = {
            ...questionIdWithValues,
            [detail.question_id]: detail.value,
          };
        });

        let row = {
          id: each.session_id,
          start_date: each.start_date,
          end_date: each.end_date,
          created_on: moment(each.created_on).format("DD/MM/YYYY HH:mm:ss"),
        };
        if (categories.res) {
          categories.res.data.forEach((category: any) => {
            // if(category.options && category.options.length && category.category_name === "Food Habits"){
            //     let ans = 0;
            //     let days =  moment(row.end_date).diff(
            //       moment(row.start_date),
            //       "days"
            //     );
            //     const value =
            // }else if(category.options && category.options.length === 0){

            // }
            if (category.category_name === "Food Habits") {
              let ans = 0;
              let days = moment(row.end_date).diff(
                moment(row.start_date),
                "days"
              );
              category.questions[0].options.forEach((option: any) => {
                if (
                  option.value ==
                  questionIdWithValues[category.questions[0].question_id]
                ) {
                  ans += option.factor * days;
                }
              });
              row = { ...row, [category.category_name]: ans.toFixed(2) };
            } else {
              let ans = 0;
              category.questions.forEach((question: any) => {
                ans +=
                  question.factor *
                  Number(questionIdWithValues[question.question_id]);
              });
              row = { ...row, [category.category_name]: ans.toFixed(2) };
            }
          });
        }
        return row;
      });
      setTableData(rows);
    } else {
      alert("Something went wrong!! Please refresh the page.");
      return;
    }
  };

  useEffect(() => {
    doInit();
  }, []);

  return (
    <>
      <div className="calculation_session_main_container max_width">
        <div className="calculation_session_header">
          <div className="calculation_session_title">Your calculations</div>
          <div className="calculation_session_actions">
            {tableData.length ? (
              <button
                className="calculation_session_add_button"
                onClick={addSession}
              >
                New Estimate
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        {tableData.length ? (
          <>
            <div className="calculation_session_table_container">
              <DataGrid
                rows={tableData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </div>
          </>
        ) : (
          <>
            <div className="calculation_session_empty_container">
              <div className="calculation_session_empty_text">
                No calculations available.
              </div>
              <div>
                <button
                  className="calculation_session_add_button"
                  onClick={addSession}
                >
                  Add Estimation
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
