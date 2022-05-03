import { useCallback, useRef, useState } from 'react';
import axios from 'axios';

const initStats = {
  numberofreports: { name: 'Reports', value: 0 },
  numberofanomalies: { name: 'Anomalies', value: 0 },
  numberofvehicles: { name: 'Vehicles', value: 0 },
};

function Statistics() {
  // State for the statistics
  const [data, setData] = useState<DataInterface.data>(initStats);

  // Ref for loading
  const refsParagraph = useRef<HTMLParagraphElement[]>([]);

  const getDataFromLambda = useCallback(
    async (numOf: DataInterface.dataName, index: number) => {
      refsParagraph.current[index].classList.add('loader');
      try {
        const response = await axios.get(
          `https://l3uaqlkj4l.execute-api.eu-west-1.amazonaws.com/prod/${numOf}`
        );
        const dataFromRequest = await response.data;

        const newData = { ...data };
        newData[numOf].value = dataFromRequest;

        refsParagraph.current[index].classList.remove('loader');
        return setData(newData);
      } catch (error) {
        console.log(error);
        refsParagraph.current[index].classList.remove('loader');
      }
    },
    [data]
  );

  return (
    <div>
      <h2 id="statistics">Statistics</h2>

      <div className="statistics-explanation">
        These statistics give the most up-to-date information on mobility
        status. <br />
        The total number of reports and vehicles stored in the company. <br />{' '}
        The number of anomalies, which are reports that are not consistent with
        the data stored in the company, are also displayed.
      </div>

      <div className="statistics-container">
        {Object.keys(data).map((key, index) => (
          <div className="statistics-item" key={key}>
            <p
              ref={ref =>
                (refsParagraph.current[index] = ref as HTMLParagraphElement)
              }
              className="button button-primary"
              onClick={() => {
                getDataFromLambda(
                  key as DataInterface.dataName,
                  index as number
                );
              }}
            >
              {data[key as DataInterface.dataName].value ? (
                <span title={data[key as DataInterface.dataName].name}>
                  {data[key as DataInterface.dataName].value}
                </span>
              ) : (
                <span>{data[key as DataInterface.dataName].name}</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Statistics;
