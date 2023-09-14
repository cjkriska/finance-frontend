import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

function App() {



  const chart = {
    labels: [],
    datasets: [
      {
        label: "Total Savings",
        data: []
      }
    ]
  };

  const [currSavings, setCurrSavings] = useState("");
  const [annIncome, setAnnIncome] = useState("");
  const [annExpenses, setAnnExpenses] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [totalYears, setTotalYears] = useState("0");
  const [chartData, setChartData] = useState(chart);
  const [totalMonths, setTotalMonths] = useState(0);

  async function addSavings(event) {
    event.preventDefault();
    await fetch("http://localhost:8080/savings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: 1,
        income: annIncome,
        expenses: annExpenses,
        currentSavings: currSavings,
        expectedReturn: expectedReturn
      })
    });
  }

  function calcYears(e) {
    e.preventDefault();

    const retire = 25*annExpenses;
    let current = parseFloat(currSavings);
    const monthlyContribution = (parseFloat(annIncome) - parseFloat(annExpenses))/12;
    let months = 0;

    while(current < retire) {
      current += monthlyContribution;
      current *= (1 + expectedReturn/12/100);
      months++;
      months % 12 == 0 ? chart.labels.push(months/12) : chart.labels.push("");
      chart.datasets[0].data.push(current);
    }

    setTotalMonths(months-1);
    setTotalYears((months/12).toFixed(1));
    chart.labels[chart.labels.length-1] = (months/12).toFixed(1);

    // Set extended chart data
    for(let i=months; i < months*1.1; i++) {
      current += monthlyContribution;
      current *= (1 + expectedReturn/12/100);
      chart.labels.push("");
      chart.datasets[0].data.push(current);
    }

    setChartData(chart);

  }

  return (
    <div className="flex flex-col bg-backgroundgreen h-screen App">

        <nav className="bg-navgreen justify-center shadow-xl bg-blue-200 flex space-x-4 px-5 py-3">
            <div className="text-xl">Retirement Goal</div>
            {/* <a
              href="#"
              className="bg-slate-100 shadow-lg rounded-lg px-3 py-2 text-green-700 font-medium hover:shadow-inner hover:text-green-900"
            >
              Home
            </a>
            <a
              href="#"
              className="bg-slate-100 shadow-lg rounded-lg px-3 py-2 text-green-700 font-medium hover:shadow-inner hover:text-green-900"
            >
              Debt Payoff
            </a>
            <a
              href="#"
              className="bg-slate-100 shadow-lg rounded-lg px-3 py-2 text-green-700 font-medium hover:shadow-inner hover:text-green-900"
            >
              Financial Independence
            </a> */}
        </nav>


        <div className="grow flex flex-col gap-5 mt-4 mr-4 ml-4 p-3">

          <div className="flex gap-5">
      
            <div className="w-1/2 bg-boxbeige rounded p-3 shadow-xl">
              <form onSubmit={e => {
                                    calcYears(e);
                                    addSavings(e);}}>
                <div className="grid grid-cols-2">
                  <div>
                    <label htmlFor="annual_income" className="block mb-2 text-sm font-medium text-gray-900">Annual Income</label>
                    <input type="text" id="annual_income" value={annIncome} onChange={(e)=>{setAnnIncome(e.target.value)}} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rouned-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="50000" required/>
                  </div>
                  <div>
                    <label htmlFor="current_savings" className="block mb-2 text-sm font-medium text-gray-900">Current Savings</label>
                    <input type="text" id="current_savings" value={currSavings} onChange={(e)=>{setCurrSavings(e.target.value)}} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rouned-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="10000" required/>
                  </div>
                  <div>
                    <label htmlFor="annual_expenses" className="block mb-2 text-sm font-medium text-gray-900">Annual Expenses</label>
                    <input type="text" id="annual_expenses" value={annExpenses} onChange={(e)=>{setAnnExpenses(e.target.value)}} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rouned-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="25000" required/>
                  </div>
                  <div>
                    <label htmlFor="expected_return" className="block mb-2 text-sm font-medium text-gray-900">Expected Return</label>
                    <input type="text" id="expected_return" value={expectedReturn} onChange={(e)=>{setExpectedReturn(e.target.value)}} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rouned-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="5" required/>
                  </div>
                </div>
                <button className="bg-slate-200 rounded-full shadow-lg text-lg block m-auto my-2 px-6 hover:shadow-inner" type="submit">
                  Submit
                </button>
              </form>
            </div>


            <div className="grow bg-boxbeige grid content-center bg-green-200 rounded p-3 shadow-xl">
              <div className="text-3xl text-slate-500">Time to Retirement:</div>
              <div className="text-5xl">{totalYears} years</div>
            </div>

          </div>

          <div className="grow bg-boxbeige p-4 bg-slate-200 rounded shadow-xl">

            <Line
              data={chartData}
              options={{
                scales: {
                  x: {
                    ticks: {
                      autoSkip: false
                    }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: "Total Retirement Savings",
                  fontSize: 20
                },
                plugins: {
                  annotation: {
                    annotations: {
                      line1: {
                        type: 'line',
                        yMin: 25*annExpenses,
                        yMax: 25*annExpenses,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2
                      },
                      line2: {
                        type: 'line',
                        xMin: totalMonths,
                        xMax: totalMonths,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2
                      }
                    }
                  }
                }
              }}
            />

          </div>

        </div>
    </div>
  );
}

export default App;
