import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";

const CostBreakdown = ({ total, breakdown }) => {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <FaMoneyBillWave size={24} style={{ color: 'var(--primary)' }} className="mr-2" />
        <h2 className="text-xl font-semibold">Estimated Construction Cost</h2>
      </div>
      
      <p className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--primary)' }}>
        ₹ {total.toLocaleString()} /-
      </p>
      
      {breakdown && (
        <div className="divide-y">
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} className="py-2 flex justify-between">
              <span className="font-medium">{key}</span>
              <span>₹ {val.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CostBreakdown;