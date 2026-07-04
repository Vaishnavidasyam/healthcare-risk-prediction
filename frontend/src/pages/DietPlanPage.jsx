import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRecommendations } from "../context/RecommendationContext";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { 
  FaUtensils, FaLeaf, FaBan, FaInfoCircle, 
  FaWater, FaDrumstickBite, FaBreadSlice, 
  FaCalendarAlt, FaCheckCircle
} from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import "./PremiumContent.css";
import "./DietPlanPage.css";
import { PremiumHeroBanner, PremiumCard } from "../components/PremiumUI";

const DietPlanPage = () => {
  const { latestAssessment } = useRecommendations();
  const navigate = useNavigate();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!latestAssessment) {
      setLoading(false);
      return;
    }

    const fetchDietPlan = async () => {
      try {
        const { diseaseType, risk_level } = latestAssessment;
        const response = await api.post("/premium/diet/plan", {
          disease_type: diseaseType.toLowerCase(),
          risk_level: risk_level || "Low"
        });
        setDietPlan(response.data.data.plan);
      } catch (error) {
        console.error("Failed to fetch diet plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlan();
  }, [latestAssessment]);

  if (!latestAssessment) {
    return (
      <div className="premium-page-container">
        <div className="empty-state glass-card">
          <FaInfoCircle />
          <h2>No Active Assessment Found</h2>
          <p>Complete a health assessment to generate your personalized nutrition strategy.</p>
          <button className="btn-premium btn-primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="premium-page-container">Loading your personalized plan...</div>;
  }

  if (!dietPlan) {
    return <div className="premium-page-container">Failed to load diet plan.</div>;
  }

  const { diet_name, nutrition_tips, foods_to_include, foods_to_avoid, weekly_meals } = dietPlan;
  const { diseaseType, risk_level } = latestAssessment;

  const nutritionStats = [
    { label: "Calories", value: "1800 kcal", icon: <FaUtensils /> },
    { label: "Protein", value: "90 g", icon: <FaDrumstickBite /> },
    { label: "Carbs", value: "200 g", icon: <FaBreadSlice /> },
    { label: "Water", value: "2.5 L", icon: <FaWater /> },
  ];

  return (
    <div className="premium-page-container">
      <PremiumHeroBanner 
        eyebrow="Personalized Nutrition Intelligence"
        title={diet_name}
        description={`Tailored for ${diseaseType} risk management (${risk_level} Risk).`}
        icon={<FaUtensils />}
      />

      <div className="premium-grid-layout">
        <PremiumCard title="Your Nutrition Strategy" icon={<FaInfoCircle />} className="full-width-card">
          <p className="strategy-text">{nutrition_tips.join(", ")}.</p>
        </PremiumCard>

        {nutritionStats.map((stat, i) => (
            <motion.div key={i} className="glass-card stat-card" whileHover={{ scale: 1.02 }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                </div>
            </motion.div>
        ))}

        <PremiumCard title="Foods to Eat" icon={<FaLeaf />}>
          <div className="diet-list positive">
            {foods_to_include.map((food, i) => (
              <div key={i} className="diet-item">
                <FaCheckCircle className="text-green" />
                <span>{food}</span>
              </div>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard title="Foods to Limit" icon={<FaBan />}>
          <div className="diet-list negative">
            {foods_to_avoid.map((food, i) => (
              <div key={i} className="diet-item">
                <FaBan className="text-red" />
                <span>{food}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>

      <PremiumCard title="Weekly Meal Plan" icon={<FaCalendarAlt />} className="full-width-card">
        <div className="meal-plan-table">
          {Object.entries(weekly_meals).map(([mealType, meals]) => (
            <div key={mealType} className="meal-row">
              <strong>{mealType}</strong>
              {meals.map((meal, i) => <span key={i}>{meal}</span>)}
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
};

export default DietPlanPage;
