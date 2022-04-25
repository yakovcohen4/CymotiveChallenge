// Components
import CompanyInformation from './CompanyInformation';
import Statistics from './Statistics';

function Content() {
  return (
    <div id="content">
      <div className="content-container">
        <Statistics />
        <CompanyInformation />
      </div>
    </div>
  );
}

export default Content;
