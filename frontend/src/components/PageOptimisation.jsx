import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MaterialCard from '../components/MaterialCard';
import { FaChevronLeft, FaFileDownload, FaLightbulb, FaSave } from 'react-icons/fa';

const PageOptimisation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [optimisedData, setOptimisedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  const formData = state?.formData;
  const result = state?.result;

  useEffect(() => {
    if (formData && result) {
      const dataToSend = {
        materials: {
          bricks: {
            quantity: result.totalCost?.bricks || 0,
            rate: formData.rates?.brickRate || 0
          },
          cement: {
            quantity: result.totalCost?.cement?.totalBags || 0,
            rate: formData.rates?.cementRate || 0
          },
          steel: {
            quantity: result.totalCost?.steel?.kg || 0,
            rate: formData.rates?.steelRate || 0
          },
          sand: {
            quantity: result.totalCost?.sand?.total || 0,
            rate: formData.rates?.sandRate || 0
          },
          aggregate: {
            quantity: result.totalCost?.aggregate || 0,
            rate: formData.rates?.aggregateRate || 0
          },
          water: {
            quantity: result.totalCost?.water || 0,
            rate: formData.rates?.waterRate || 0
          }
        },
        labour: Object.entries(formData.labour).map(([type, { rate, days }]) => ({
          type,
          rate,
          days
        })),
        totalCost: result.totalCost?.totalEstimatedCost || 0
      };

      setLoading(true);
      const optimizeurl = import.meta.env.VITE_Optimize_url;
      axios.post(`${optimizeurl}/api/optimize`, dataToSend)
        .then(res => {
          setOptimisedData(res.data.suggestions);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error from optimisation backend:', err);
          setLoading(false);
        });
    }
  }, [formData, result]);

  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
  
    const htmlContent = element.outerHTML;
    const optimizeurl = import.meta.env.VITE_Optimize_url;
    try {
      const response = await axios.post(
        `${optimizeurl}/api/generate-pdf`,
        { htmlContent },
        { responseType: 'blob' }
      );
  
      // Trigger file download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'optimisation_summary.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  
  if (!formData || !result) {
    return (
      <div className="card text-center">
        <p className="text-error">No data found. Please calculate cost first.</p>
        <button
          className="btn btn-primary mt-4 flex items-center justify-center mx-auto"
          onClick={() => navigate('/')}
        >
          <FaChevronLeft className="mr-2" /> Go Back to Estimator
        </button>
      </div>
    );
  }

  const summaryData = optimisedData?.Summary;
  const materialKeys = Object.keys(optimisedData || {}).filter(key => key !== 'Summary');

  return (
    <div className="pb-6">
      <div className="card">
        <div className="flex items-center mb-4">
          <FaLightbulb size={24} style={{ color: 'var(--primary)' }} className="mr-2" />
          <h1 className="text-2xl font-bold">Cost Optimisation Insights</h1>
        </div>

        {loading ? (
          <div className="text-center py-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" style={{ color: 'var(--primary)' }}></div>
            <p className="mt-4">Analyzing opportunities for cost savings...</p>
          </div>
        ) : optimisedData ? (
          <div className="fade-in">
            <div ref={reportRef}>
              <div className="grid md:grid-cols-2 gap-4 mb-6" style={{ maxHeight: 'none', overflow: 'visible' }}>
                {materialKeys.map((key, index) => (
                  <MaterialCard key={index} title={key} data={optimisedData[key]} />
                ))}
              </div>

              {summaryData && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Summary of Estimated Savings</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--background)' }}>
                          <th className="text-left p-3 border-b border-t" style={{ borderColor: 'var(--border)' }}>Category</th>
                          <th className="text-left p-3 border-b border-t" style={{ borderColor: 'var(--border)' }}>Estimated Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(summaryData).map(([category, savings], index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>{category}</td>
                            <td className="p-3 border-b" style={{ borderColor: 'var(--border)', color: 'var(--success)' }}>{savings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="btn btn-primary flex items-center mr-4"
                onClick={downloadPDF}
              >
                <FaFileDownload className="mr-2" /> Download PDF Report
              </button>
              <button
                className="btn btn-outline flex items-center"
                onClick={() => navigate('/')}
              >
                <FaChevronLeft className="mr-2" /> Back to Estimator
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p>Failed to load optimisation data. Please try again.</p>
            <button 
              className="btn btn-outline mt-4"
              onClick={() => navigate('/')}
            >
              <FaChevronLeft className="mr-2" /> Back to Estimator
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageOptimisation;
