import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from 'recharts';

const LabourCostBarChart = ({ labourData }) => {
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

  if (!labourData) return null;

  // Safely extract data with improved error handling
  const data = Object.entries(labourData || {})
    .map(([role, info]) => {
      try {
        const total = typeof info === 'object' && info !== null && 'total' in info 
          ? parseFloat(info.total) 
          : 0;
        
        return {
          name: role.charAt(0).toUpperCase() + role.slice(1),
          cost: isNaN(total) ? 0 : Math.round(total)
        };
      } catch (e) {
        return { name: role.charAt(0).toUpperCase() + role.slice(1), cost: 0 };
      }
    })
    .filter(item => item.cost > 0);

  // Handle empty data
  if (data.length === 0) {
    return (
      <div className="card h-80 flex items-center justify-center">
        <p className="text-text-light">No labour cost data available</p>
      </div>
    );
  }

  // Fixed domain to prevent growth
  const staticDomain = [0, 50000];
  
  // Chart container style with fixed height to prevent expansion
  const chartContainerStyle = {
    height: '300px',
    maxHeight: '300px',
    overflow: 'hidden'
  };
  
  return (
    <div className="card" style={chartContainerStyle}>
      <h3 className="text-lg font-semibold mb-3 text-center">Labour Cost Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: 'var(--text)' }}
            stroke="var(--text-light)"
            interval={0}
          />
          <YAxis 
            stroke="var(--text-light)"
            tick={{ fontSize: 10, fill: 'var(--text)' }}
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
            domain={staticDomain}
            allowDecimals={false}
          >
            <Label
              value="Cost (₹)"
              position="insideLeft"
              angle={-90}
              style={{ textAnchor: 'middle', fill: 'var(--text-light)' }}
            />
          </YAxis>
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Cost']}
            contentStyle={{ 
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: 'var(--text)' }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar dataKey="cost" fill="var(--primary-dark)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LabourCostBarChart;
