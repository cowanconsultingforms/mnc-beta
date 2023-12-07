// MortgageCalculator.js
import React, { useEffect, useState } from "react";
import calculator from "../assets/img/calculator.jpg";

const MortgageCalculator = ({ onClose }) => {
  const [principal, setPrincipal] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);

  const toggleCalculator = () => {
    setCalculatorOpen(!isCalculatorOpen);
  };

  useEffect(() => {
    
  }, [principal]);
  const calculateMonthlyPayment = () => {
    // Calculate the monthly mortgage payment here
    // You can use the formula for calculating the monthly payment:
    // M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const mortgage =
      (principal *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    setMonthlyPayment(mortgage.toFixed(2));
  };

  return (
    <main
      className="object-cover h-[calc(100vh-40px)]"
      style={{
        backgroundImage: `url(${calculator})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-96 p-4 border rounded-lg shadow-md bg-gray-600 text-white">
        <h2 className="text-2xl font-semibold mb-4">Mortgage Calculator</h2>
        <label className="block mb-2">
          Principal Amount ($):
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:border-blue-500"
          />
        </label>
        <label className="block mb-2">
          Annual Interest Rate (%):
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus-border-blue-500"
          />
        </label>
        <label className="block mb-2">
          Loan Term (years):
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 text-black rounded focus:outline-none focus:border-blue-500"
          />
        </label>
        <button
          onClick={calculateMonthlyPayment}
          className="w-full p-2 mt-4 bg-white text-gray-700 text-black border border-gray-300 rounded hover:bg-gray-400 hover:text-white focus:outline-none focus:bg-gray-400 focus:text-white"
        >
          Calculate
        </button>
        <div className="mt-4">
          Monthly Payment: ${monthlyPayment}
        </div>
        {/* <button
          onClick={onClose}
          className="w-full p-2 mt-4  text-white rounded  focus:outline-none"
        >
          Close
        </button> */}
      </div>
    </div>
    </main>
  );
};

export default MortgageCalculator;
