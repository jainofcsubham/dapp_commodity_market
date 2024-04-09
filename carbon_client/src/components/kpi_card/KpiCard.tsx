import { Tooltip } from "@mui/material";
import { KpiCardDetailsType } from "../../types/KpiCardDetails.type";
import "./KpiCard.css";
import info_icon from "../../assets/info.svg";

export const KpiCard = ({ label, value, info = "" }: KpiCardDetailsType) => {
  return (
    <div className="kpi_card_wrapper">
      {info ? (
        <Tooltip placement="top" title={info} arrow>
          <div className="kpi_card_info">
            <img src={info_icon}  alt="info_icon"/>
          </div>
        </Tooltip>
      ) : (
        <></>
      )}
      <div className="kpi_card_label">{label}</div>
      <div className="kpi_card_value">{value}</div>
    </div>
  );
};
