import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MaterialCostPieChart = ({ priceBreakdown }) => {
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

  // Validate priceBreakdown before rendering
  if (!priceBreakdown || typeof priceBreakdown !== 'object' || Object.keys(priceBreakdown).length === 0) {
    return (
      <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-text-light">No cost data available</p>
      </div>
    );
  }

  // Prepare data for the pie chart with validation
  const data = Object.entries(priceBreakdown)
    .map(([name, value]) => {
      try {
        const numericValue = parseFloat(value);
        return {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: isNaN(numericValue) ? 0 : numericValue
        };
      } catch (e) {
        console.error(`Error processing price data for ${name}:`, e);
        return { name: name.charAt(0).toUpperCase() + name.slice(1), value: 0 };
      }
    })
    .filter(item => item.value > 0); // Only show items with values

  // Handle empty data after filtering
  if (data.length === 0) {
    return (
      <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-text-light">No cost data available</p>
      </div>
    );
  }

  // Custom colors with our theme
  const COLORS = ['#5a67d8', '#7f9cf5', '#38b2ac', '#4fd1c5', '#81e6d9', '#b2f5ea', '#c3dafe'];

  // Chart container style with fixed height
  const chartContainerStyle = {
    height: '300px',
    maxHeight: '300px',
    overflow: 'hidden'
  };

  return (
    <div className="card" style={chartContainerStyle}>
      <h3 className="text-lg font-semibold mb-3 text-center">Material Cost Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            minAngle={3} // Ensure small values are still visible
            paddingAngle={1} // Add spacing between segments
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Cost']}
            contentStyle={{ 
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }} 
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ fontSize: '10px', color: 'var(--text)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaterialCostPieChart;
