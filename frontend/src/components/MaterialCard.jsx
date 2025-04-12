import React, { useEffect, useState } from 'react';

const MaterialCard = ({ title, data }) => {
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
  
  // Adjust highlight gradient based on theme
  const highlightGradient = theme === 'dark' 
    ? 'linear-gradient(135deg, rgba(90, 103, 216, 0.15) 0%, transparent 100%)'
    : 'linear-gradient(135deg, rgba(90, 103, 216, 0.05) 0%, transparent 100%)';

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Highlight effect on hover */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: highlightGradient,
          opacity: 0,
          transition: 'opacity var(--transition-speed)',
          zIndex: 0,
        }}
        className="card-highlight"
      />
      
      <h3 className="text-lg font-semibold mb-2" style={{ position: 'relative', zIndex: 1 }}>{title}</h3>
      <div className="divide-y" style={{ position: 'relative', zIndex: 1 }}>
        <div className="pb-2">
          <p className="text-text-light">
            <span className="font-medium">Current:</span> {data.current}
          </p>
        </div>
        <div className="py-2">
          <p className="text-text-light">
            <span className="font-medium">Alternative:</span> {data.alternative || '—'}
          </p>
        </div>
        <div className="py-2">
          <p className="text-text-light">
            <span className="font-medium">Suggestion:</span> {data.suggestion}
          </p>
        </div>
        <div className="py-2">
          <p className="text-text-light">
            <span className="font-medium">Estimated Savings:</span> 
            <span className="tooltip" style={{ color: 'var(--success)' }}>
              {data.estimated_savings}
              <span className="tooltip-text">Potential cost reduction</span>
            </span>
          </p>
        </div>
        {data.benefits && data.benefits.length > 0 && (
          <div className="pt-2">
            <p className="font-medium mb-1">Benefits:</p>
            <ul className="text-text-light">
              {data.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span style={{ color: 'var(--primary)' }} className="mr-2">•</span> 
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .card:hover .card-highlight {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default MaterialCard;
