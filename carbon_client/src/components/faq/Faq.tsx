import "./Faq.css";

export const Faq = () => {
  return (
    <>
      <div className="faq_container" id="faq_section">
        <div className="faq_wrapper">
          <div className="faq_left_block">
            <div className="section_name">FAQ</div>
            <h2 className="section_heading">Common Questions</h2>
            {/* <div>Here are some of the most common questions that we get.</div> */}
          </div>
          <div className="faq_right_block">
            <div className="question_block">
              <div className="question">What is a carbon footprint?</div>
              <div className="answer">
                A carbon footprint is the total amount of greenhouse gases,
                primarily carbon dioxide, emitted directly or indirectly by an
                individual, organization, event, or product.
              </div>
            </div>

            <div className="question_block">
              <div className="question">
                Why is it important to calculate carbon footprint?
              </div>
              <div className="answer">
                Calculating carbon footprint helps individuals and organizations
                understand their impact on the environment and identify areas
                where they can reduce emissions to mitigate climate change.
              </div>
            </div>

            <div className="question_block">
              <div className="question">
                How can I calculate my carbon footprint?
              </div>
              <div className="answer">
                You can calculate your carbon footprint by considering various
                factors such as energy consumption, transportation, waste
                generation, and lifestyle choices. Our website provides a
                user-friendly tool to help you calculate your carbon footprint
                accurately.
              </div>
            </div>

            <div className="question_block">
              <div className="question">
                Can organizations calculate their carbon footprint?
              </div>
              <div className="answer">
                Yes, organizations can calculate their carbon footprint by
                analyzing their energy usage, transportation methods, waste
                management practices, and other relevant factors. Our website
                offers a comprehensive solution for organizations to measure and
                manage their carbon emissions.
              </div>
            </div>

            <div className="question_block">
              <div className="question">
                What can I do to reduce my carbon footprint?
              </div>
              <div className="answer">
                There are several ways to reduce your carbon footprint, such as
                using energy-efficient appliances, opting for renewable energy
                sources, reducing water consumption, practicing sustainable
                transportation methods, and adopting eco-friendly habits. Our
                website provides tips and resources to help you make sustainable
                choices.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
