import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from 'recharts';

const MaterialQuantityBarChart = ({ totalCost }) => {
  const [theme, setTheme] = useState('light');
  
  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setTheme(document.documentElement.getAttribute('data-theme') || 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Set initial theme
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    
    return () => observer.disconnect();
  }, []);

  if (!totalCost) return null;

  // Safely extract values
  const extractSafeValue = (value) => {
    if (value === undefined || value === null) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Format the data
  const data = [
    { name: 'Bricks', qty: Math.round(extractSafeValue(totalCost.bricks)) },
    { name: 'Cement', qty: Math.round(extractSafeValue(totalCost.cement?.totalBags)) },
    { name: 'Steel', qty: Math.round(extractSafeValue(totalCost.steel?.kg)) },
    { name: 'Sand', qty: parseFloat(extractSafeValue(totalCost.sand?.total).toFixed(2)) },
    { name: 'Aggregate', qty: parseFloat(extractSafeValue(totalCost.aggregate).toFixed(2)) },
    { name: 'Water', qty: Math.round(extractSafeValue(totalCost.water)) }
  ].filter(item => item.qty > 0);

  // If no data, return a message
  if (data.length === 0) {
    return (
      <div className="card h-80 flex items-center justify-center">
        <p className="text-text-light">No material quantity data available</p>
      </div>
    );
  }

  // FIXED domain and chart style
  const staticDomain = [0, 10000]; // Fixed domain for all cases
  
  // Chart container style with fixed height to prevent expansion
  const chartContainerStyle = {
    height: '300px',
    maxHeight: '300px',
    overflow: 'hidden'
  };

  return (
    <div className="card" style={chartContainerStyle}>
      <h3 className="text-lg font-semibold mb-3 text-center">Material Quantities</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
          barSize={20} // Fixed bar width
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: 'var(--text)' }}
            stroke="var(--text-light)"
            interval={0} // Show all labels
            angle={-45} // Angle for better readability
            textAnchor="end" // Align angled text
            height={60} // More space for angled labels
          />
          <YAxis 
            stroke="var(--text-light)"
            tick={{ fontSize: 10, fill: 'var(--text)' }}
            tickFormatter={(value) => value.toLocaleString()}
            domain={staticDomain} // FIXED domain - critical fix
            allowDecimals={false}
          />
          <Tooltip 
            formatter={(value) => [value.toLocaleString(), 'Quantity']}
            contentStyle={{ 
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: 'var(--text)' }}
          />
          <Bar dataKey="qty" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaterialQuantityBarChart;
