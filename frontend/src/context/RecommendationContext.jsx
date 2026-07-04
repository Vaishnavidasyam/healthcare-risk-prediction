// frontend/src/context/RecommendationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [latestAssessment, setLatestAssessment] = useState(() => {
    const saved = localStorage.getItem('latest_assessment');
    return saved ? JSON.parse(saved) : null;
  });

  const updateAssessment = (data) => {
    setLatestAssessment(data);
    localStorage.setItem('latest_assessment', JSON.stringify(data));
  };

  const getRecommendations = () => {
    if (!latestAssessment) return null;

    const { diseaseType, risk_level, input_data, risk_percentage } = latestAssessment;
    const level = risk_level || (risk_percentage >= 70 ? "High" : risk_percentage >= 40 ? "Medium" : "Low");

    const data = {
      Heart: {
        Low: {
          points: [
            "Maintain healthy cholesterol levels",
            "Continue regular physical activity",
            "Monitor blood pressure annually",
            "Maintain healthy BMI"
          ],
          diet: {
            name: "Mediterranean Diet",
            foods: ["Fruits", "Vegetables", "Oats", "Fish", "Nuts"],
            avoid: ["Excess fried foods", "Excess salt"]
          },
          exercise: {
            plan: ["Walking 30 mins/day", "Cycling", "Light Cardio"],
            intensity: "Light to Moderate",
            duration: "30 mins/day"
          },
          specialist: {
            name: "Preventive Cardiologist",
            priority: "Optional / Routine",
            reason: "Proactive maintenance of cardiovascular health."
          },
          bpFrequency: "Monthly"
        },
        Medium: {
          points: [
            "Reduce LDL cholesterol through diet",
            "Increase aerobic activity to 150 min/week",
            "Monitor BP weekly",
            "Significantly reduce sodium intake"
          ],
          diet: {
            name: "Heart Healthy Plan",
            foods: ["Salmon", "Whole grains", "Olive oil", "Green vegetables"],
            avoid: ["Red meat", "Processed foods"]
          },
          exercise: {
            plan: ["150 min/week moderate cardio", "Brisk walking", "Swimming"],
            intensity: "Moderate",
            duration: "150 mins/week"
          },
          specialist: {
            name: "Cardiologist",
            priority: "Recommended",
            reason: "Detailed evaluation of cardiovascular markers."
          },
          bpFrequency: "Weekly"
        },
        High: {
          points: [
            "Immediate cardiology consultation required",
            "Strict daily BP monitoring",
            "Weight reduction plan implementation",
            "Comprehensive medication review"
          ],
          diet: {
            name: "Cardiac Recovery Diet",
            foods: ["Lean proteins", "High fiber", "Plant sterols"],
            avoid: ["Trans fats", "High sodium", "Added sugars"]
          },
          exercise: {
            plan: ["Physician supervised activity only", "Light stretching"],
            intensity: "Low (Supervised)",
            duration: "As prescribed"
          },
          specialist: {
            name: "Cardiologist",
            priority: "Emergency / High",
            reason: "Immediate intervention to mitigate acute cardiovascular risk."
          },
          bpFrequency: "Daily"
        }
      },
      Diabetes: {
        Low: {
          points: [
            "Maintain healthy weight",
            "Continue healthy eating habits",
            "Annual glucose screening"
          ],
          diet: {
            name: "Low Glycemic Diet",
            foods: ["Brown rice", "Oats", "Vegetables", "Lean proteins"],
            avoid: ["Sugary drinks", "Processed sugar"]
          },
          exercise: {
            plan: ["Walking", "Cycling", "Swimming"],
            intensity: "Moderate",
            duration: "30 mins/day"
          },
          specialist: {
            name: "Primary Care Physician",
            priority: "Routine",
            reason: "Annual screening and metabolic tracking."
          },
          bpFrequency: "Monthly"
        },
        Medium: {
          points: [
            "Reduce refined sugar intake",
            "Active weight management program",
            "Monthly glucose monitoring"
          ],
          diet: {
            name: "Prediabetes Diet",
            foods: ["High fiber foods", "Protein-rich meals", "Complex carbs"],
            avoid: ["White bread", "Sugary foods"]
          },
          exercise: {
            plan: ["150 min/week moderate intensity", "Resistance training"],
            intensity: "Moderate",
            duration: "150 mins/week"
          },
          specialist: {
            name: "Endocrinologist",
            priority: "Recommended",
            reason: "Prevention of progression to Type 2 Diabetes."
          },
          bpFrequency: "Weekly"
        },
        High: {
          points: [
            "Immediate endocrinology consultation",
            "Daily glucose monitoring",
            "HbA1c testing within 48 hours"
          ],
          diet: {
            name: "Diabetic Diet Plan",
            foods: ["Low glycemic index foods", "Leafy greens", "Healthy fats"],
            avoid: ["Sugar", "Refined carbohydrates", "Fruit juices"]
          },
          exercise: {
            plan: ["Doctor-approved exercise only", "Light walking"],
            intensity: "Low to Moderate",
            duration: "20-30 mins/day"
          },
          specialist: {
            name: "Endocrinologist",
            priority: "High",
            reason: "Urgent glycemic control and complication prevention."
          },
          bpFrequency: "Daily"
        }
      },
      Kidney: {
        Low: {
          points: [
            "Maintain optimal hydration",
            "Annual kidney function screening",
            "Balanced sodium intake"
          ],
          diet: {
            name: "Kidney Friendly Diet",
            foods: ["Fruits", "Vegetables", "Water-rich foods"],
            avoid: ["Excess salt"]
          },
          exercise: {
            plan: ["Walking", "Yoga", "Tai Chi"],
            intensity: "Light",
            duration: "30 mins/day"
          },
          specialist: {
            name: "General Practitioner",
            priority: "Routine",
            reason: "Annual renal function monitoring."
          },
          bpFrequency: "Monthly"
        },
        Medium: {
          points: [
            "Reduce sodium intake significantly",
            "Quarterly kidney function monitoring",
            "Increase daily hydration (2-3L)"
          ],
          diet: {
            name: "Renal Prevention Diet",
            foods: ["Fresh vegetables", "Controlled protein", "Blueberries"],
            avoid: ["Packaged foods", "Excess sodium"]
          },
          exercise: {
            plan: ["Aerobic activity 3-4 times/week", "Light strength training"],
            intensity: "Moderate",
            duration: "30-45 mins"
          },
          specialist: {
            name: "Nephrologist",
            priority: "Recommended",
            reason: "Specialized assessment of glomerular filtration rates."
          },
          bpFrequency: "Weekly"
        },
        High: {
          points: [
            "Immediate nephrologist consultation",
            "Urgent kidney function testing (eGFR)",
            "Strict fluid management protocol"
          ],
          diet: {
            name: "Renal Protection Diet",
            foods: ["Low sodium foods", "Kidney-safe proteins", "Cauliflower"],
            avoid: ["Processed foods", "Excess potassium", "Dark colas"]
          },
          exercise: {
            plan: ["Light mobility work", "Short walks"],
            intensity: "Low",
            duration: "15-20 mins"
          },
          specialist: {
            name: "Nephrologist",
            priority: "Urgent",
            reason: "Prevention of acute renal failure and management of filtration."
          },
          bpFrequency: "Daily"
        }
      }
    };

    return data[diseaseType]?.[level] || data["Heart"]["Low"];
  };

  return (
    <RecommendationContext.Provider value={{ latestAssessment, updateAssessment, getRecommendations }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = () => useContext(RecommendationContext);
