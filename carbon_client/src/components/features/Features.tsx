import "./Features.css";
import cube from "../../assets/cube.png";

export const Features = () => {
  return (
    <>
      <div className="feature_container">
        <div className="feature_wrapper">
          <div className="feature_span">FEATURES</div>
          <h2 className="feature_heading">
            Calculate and Analyze Carbon Footprint
          </h2>

          <div className="feature_card_container">
            <div className="feature_card">
              <div className="card_image">
                <img src={cube} className="cube" alt="cube" />
              </div>
              <div className="card_content">
                <h3>Individual Carbon Footprint Calculation</h3>
                <div>Calculate the carbon footprint of an individual</div>
              </div>
            </div>
            <div className="feature_card">
              <div className="card_image">
                <img src={cube} className="cube" alt="cube" />
              </div>
              <div className="card_content">
                <h3>Organization Carbon Footprint Calculation</h3>
                <div>Calculate the carbon footprint of an organization</div>
              </div>
            </div>
          </div>

            

        </div>
      </div>
    </>
  );
};
