


import React, { useState } from 'react';
import axios from 'axios';
import MaterialCostPieChart from './MaterialCostPieChart';
import MaterialQuantityBarChart from './MaterialQuantityBarChart';
import LabourCostBarChart from './LabourCostBarChart';
import { useNavigate } from 'react-router-dom'; // Add at the top

// Inside your component

const InputForm = () => {
  const [formData, setFormData] = useState({
    length: 10,
    breadth: 8,
    slabThickness: 0.15,
    height: 3,
    walls: 160,
    floors: 5,
    brickThickness: 0.1,
    wallThickness: 0.23,
    brickLength: 0.19,
    brickWidth: 0.09,
    brickHeight: 0.09,
    rates: {
      brickRate: 7,
      cementRate: 350,
      steelRate: 60,
      sandRate: 50,
      aggregateRate: 45,
      waterRate: 1
    },
    labour: {
      masonry: { rate: 0, days: 0 },
      helpers: { rate: 0, days: 0 },
      shuttering: { rate: 0, days: 0 },
      plumber: { rate: 0, days: 0 },
      electrician: { rate: 0, days: 0 },
      painter: { rate: 0, days: 0 },
      misc: { rate: 0, days: 0 }
    }
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.rates) {
      setFormData({
        ...formData,
        rates: {
          ...formData.rates,
          [name]: parseFloat(value)
        }
      });
    } else if (name.startsWith('labour.')) {
      const [, role, field] = name.split('.');
      setFormData({
        ...formData,
        labour: {
          ...formData.labour,
          [role]: {
            ...formData.labour[role],
            [field]: parseFloat(value)
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    console.log("Sending data:", formData);
    const optimizeurl = process.env.Optimize_url
    try {
      const response = await axios.post(`${optimizeurl}/api/cost/estimate`, formData);
      setResult(response.data);
      console.log("Response from backend:", response.data);
    } catch (err) {
      console.error("Error calculating cost:", err);
      setError('Failed to calculate. Please check backend and inputs.');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Construction Material  Cost Estimator</h1>
<h2>Dimensions</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[{ label: 'Length (m)', name: 'length', placeholder: 'Enter length in meters (e.g. 10)' },
          { label: 'Breadth (m)', name: 'breadth', placeholder: 'Enter breadth in meters (e.g. 8)' },
          { label: 'Slab Thickness (m)', name: 'slabThickness', placeholder: 'Enter thickness in meters (e.g. 0.15)' },
          { label: 'Floor Height (m)', name: 'height', placeholder: 'Enter height per floor in meters (e.g. 3)' },
          { label: 'Wall Area (sq. meters)', name: 'walls', placeholder: 'Enter total wall area in m² (e.g. 160)' },
          { label: 'Floors', name: 'floors', placeholder: 'Enter number of floors (e.g. 5)' },
          { label: 'Brick Thickness (m)', name: 'brickThickness', placeholder: 'Enter brick thickness in meters (e.g. 0.1)' },
          { label: 'Wall Thickness (m)', name: 'wallThickness', placeholder: 'Enter wall thickness in meters (e.g. 0.23)' },
          { label: 'Brick Length (m)', name: 'brickLength', placeholder: 'Enter brick length in meters (e.g. 0.19)' },
          { label: 'Brick Width (m)', name: 'brickWidth', placeholder: 'Enter brick width in meters (e.g. 0.09)' },
          { label: 'Brick Height (m)', name: 'brickHeight', placeholder: 'Enter brick height in meters (e.g. 0.09)' }
        ].map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border p-2 rounded"
              step="any"
              required
            />
          </div>
        ))}

        <h2 className="col-span-2 font-semibold mt-4">Rates</h2>
        {[{ label: 'Brick Rate (₹/brick)', name: 'brickRate', placeholder: '₹7 per brick' },
          { label: 'Cement Rate (₹/bag)', name: 'cementRate', placeholder: '₹350 per bag' },
          { label: 'Steel Rate (₹/kg)', name: 'steelRate', placeholder: '₹60 per kg' },
          { label: 'Sand Rate (₹/m³)', name: 'sandRate', placeholder: '₹50 per m³' },
          { label: 'Aggregate Rate (₹/m³)', name: 'aggregateRate', placeholder: '₹45 per m³' },
          { label: 'Water Rate (₹/litre)', name: 'waterRate', placeholder: '₹1 per litre' }
        ].map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={formData.rates[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border p-2 rounded"
              step="any"
              required
            />
          </div>
        ))}

        <h2 className="col-span-2 font-semibold mt-4">Labour Cost (₹/day × Days)</h2>
        {[{ label: 'Masonry (Mistri)', key: 'masonry', placeholder:'enter no. of days' },
          { label: 'Helpers (Mazdoor)', key: 'helpers' , placeholder:'enter no. of days'},
          { label: 'Shuttering / Bar-bending', key: 'shuttering', placeholder:'enter no. of days' },
          { label: 'Plumber', key: 'plumber' , placeholder:'enter no. of days'},
          { label: 'Electrician', key: 'electrician', placeholder:'enter no. of days' },
          { label: 'Painter', key: 'painter', placeholder:'enter no. of days' },
          { label: 'Misc Labour', key: 'misc' , placeholder:'enter no. of days'}
        ].map(({ label, key }) => (
          <div key={key} className="col-span-2 grid grid-cols-2 gap-2">
            <label className="col-span-2 font-medium">{label}</label>
            <input
              type="number"
              name={`labour.${key}.rate`}
              value={formData.labour[key].rate}
              onChange={handleChange}
              placeholder="Rate (₹/day)"
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name={`labour.${key}.days`}
              value={formData.labour[key].days}
              onChange={handleChange}
              placeholder="Days"
              className="border p-2 rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Calculate
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result?.totalCost && (
        <div className="mt-8 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">🔢 Material Breakdown</h2>

          <p>🧱 <strong>Bricks:</strong> {result.totalCost.bricks} bricks × ₹{formData.rates.brickRate}/brick = ₹{result.totalCost.priceBreakdown.bricks}</p>
          <p>🪨 <strong>Cement Bags:</strong> {result.totalCost.cement.totalBags} bags × ₹{formData.rates.cementRate}/bag = ₹{result.totalCost.priceBreakdown.cement}</p>
          <p>🧰 <strong>Steel:</strong> {result.totalCost.steel.kg} kg × ₹{formData.rates.steelRate}/kg = ₹{result.totalCost.priceBreakdown.steel}</p>
          <p>🏝️ <strong>Sand:</strong> {result.totalCost.sand.total.toFixed(2)} m³ × ₹{formData.rates.sandRate}/m³ = ₹{result.totalCost.priceBreakdown.sand}</p>
          <p>🏗️ <strong>Aggregate:</strong> {result.totalCost.aggregate.toFixed(2)} m³ × ₹{formData.rates.aggregateRate}/m³ = ₹{result.totalCost.priceBreakdown.aggregate}</p>
          <p>🚰 <strong>Water:</strong> {result.totalCost.water} litres × ₹{formData.rates.waterRate}/litre = ₹{result.totalCost.priceBreakdown.water}</p>
          <h2 className="text-lg font-bold mt-2">🧮 Total Labour Cost: ₹{result.totalCost.materialTotal}</h2>
          {result.totalCost.labour && (
            <>
              <hr className="my-3" />
              <h2 className="text-lg font-semibold">👷 Labour Breakdown</h2>
              {Object.entries(result.totalCost.labour).map(([role, { rate, days, total }]) => (
                <p key={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}: ₹{rate}/day × {days} days = ₹{total}
                </p>
              ))}
              <h2 className="text-lg font-bold mt-2">🧮 Total Labour Cost: ₹{result.totalCost.totalLabourCost}</h2>
            </>
          )}
            
             {/* Charts */}
          <MaterialCostPieChart priceBreakdown={result.totalCost.priceBreakdown} />
          <MaterialQuantityBarChart totalCost={result.totalCost} />
          <LabourCostBarChart labourData={result.totalCost.labour} />
          <hr className="my-3" />
          <h2 className="text-lg font-bold">💰 Total Cost: ₹{Math.round(result.totalCost.totalEstimatedCost)}</h2>
        </div>
      )}
      <button
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  onClick={() => navigate('/optimisation', { state: { formData, result } })}
>
  View Page Optimisation
</button>
    </div>
  );
};

export default InputForm;