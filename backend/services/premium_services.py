"""
Premium Features Services - Phase 4
"""

from datetime import datetime
from bson import ObjectId
from .base_service import BaseService
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import io
import json

class PDFReportGeneratorService(BaseService):
    """
    Service for generating PDF health reports
    """
    
    def generate_health_report(self, user_id, health_score, predictions, recommendations):
        """Generate comprehensive PDF health report"""
        try:
            pdf_buffer = io.BytesIO()
            doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []
            
            # Title
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                textColor=colors.HexColor('#1976D2'),
                spaceAfter=30,
                alignment=1
            )
            story.append(Paragraph("Personal Health Report", title_style))
            story.append(Spacer(1, 0.3*inch))
            
            # User Info
            story.append(Paragraph(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
            story.append(Spacer(1, 0.5*inch))
            
            # Health Score Section
            story.append(Paragraph("Health Score Summary", styles['Heading2']))
            score_data = [
                ['Overall Score', f"{health_score.get('overall_score', 0)}/100"],
                ['Category', health_score.get('overall_category', 'Unknown')],
                ['Status', 'Requires Attention' if health_score.get('overall_score', 100) < 60 else 'Stable']
            ]
            score_table = Table(score_data)
            score_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.lightblue),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(score_table)
            story.append(Spacer(1, 0.5*inch))
            
            # Risk Factors
            story.append(Paragraph("Top Risk Factors", styles['Heading2']))
            story.append(Paragraph(
                ", ".join([rf.get('name', 'Unknown') for rf in health_score.get('top_risk_factors', [])[:5]]),
                styles['Normal']
            ))
            story.append(Spacer(1, 0.5*inch))
            
            # Disease Predictions
            story.append(Paragraph("Disease Risk Assessment", styles['Heading2']))
            pred_data = [['Disease', 'Risk Level']]
            for disease, risk in predictions.items():
                risk_level = "High Risk" if risk > 0.7 else "Moderate Risk" if risk > 0.4 else "Low Risk"
                pred_data.append([disease.replace('_', ' ').title(), f"{risk*100:.1f}% ({risk_level})"])
            
            pred_table = Table(pred_data)
            pred_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(pred_table)
            story.append(Spacer(1, 0.5*inch))
            
            # Recommendations
            story.append(Paragraph("Personalized Recommendations", styles['Heading2']))
            for i, rec in enumerate(recommendations[:5], 1):
                story.append(Paragraph(f"{i}. {rec.get('title', 'Recommendation')}", styles['Heading3']))
                story.append(Paragraph(rec.get('description', ''), styles['Normal']))
                story.append(Spacer(1, 0.2*inch))
            
            story.append(PageBreak())
            
            # Disclaimer
            story.append(Paragraph("Medical Disclaimer", styles['Heading2']))
            disclaimer = (
                "This report is generated for informational purposes only and should not be considered medical advice. "
                "Always consult with healthcare professionals before making any health-related decisions. "
                "This AI-generated analysis is not a substitute for professional medical diagnosis or treatment."
            )
            story.append(Paragraph(disclaimer, styles['Normal']))
            
            # Build PDF
            doc.build(story)
            pdf_buffer.seek(0)
            return pdf_buffer.getvalue()
            
        except Exception as e:
            self.log_error(e, "generate_health_report")
            raise


class DietPlannerService(BaseService):
    """
    Service for generating personalized diet plans
    """
    
    DIET_TEMPLATES = {
        'heart': {
            'High': {
                'name': 'Cardiac Recovery Diet',
                'foods_to_eat': ['Lean proteins', 'High fiber', 'Plant sterols'],
                'foods_to_avoid': ['Trans fats', 'High sodium', 'Added sugars'],
                'daily_tips': ['Strict daily BP monitoring', 'Comprehensive medication review']
            },
            'Medium': {
                'name': 'Heart Healthy Plan',
                'foods_to_eat': ['Salmon', 'Whole grains', 'Olive oil', 'Green vegetables'],
                'foods_to_avoid': ['Red meat', 'Processed foods'],
                'daily_tips': ['Reduce LDL cholesterol', '150 min aerobic activity/week']
            },
            'Low': {
                'name': 'Mediterranean Diet',
                'foods_to_eat': ['Fruits', 'Vegetables', 'Oats', 'Fish', 'Nuts'],
                'foods_to_avoid': ['Excess fried foods', 'Excess salt'],
                'daily_tips': ['Maintain healthy cholesterol', 'Continue regular activity']
            }
        },
        'diabetes': {
            'High': {
                'name': 'Diabetic Diet Plan',
                'foods_to_eat': ['Low glycemic index foods', 'Leafy greens', 'Healthy fats'],
                'foods_to_avoid': ['Sugar', 'Refined carbohydrates', 'Fruit juices'],
                'daily_tips': ['Daily glucose monitoring', 'Immediate consultation']
            },
            'Medium': {
                'name': 'Prediabetes Diet',
                'foods_to_eat': ['High fiber foods', 'Protein-rich meals', 'Complex carbs'],
                'foods_to_avoid': ['White bread', 'Sugary foods'],
                'daily_tips': ['Reduce refined sugar', 'Active weight management']
            },
            'Low': {
                'name': 'Low Glycemic Diet',
                'foods_to_eat': ['Brown rice', 'Oats', 'Vegetables', 'Lean proteins'],
                'foods_to_avoid': ['Sugary drinks', 'Processed sugar'],
                'daily_tips': ['Maintain healthy weight', 'Healthy eating habits']
            }
        },
        'kidney': {
            'High': {
                'name': 'Renal Protection Diet',
                'foods_to_eat': ['Low sodium foods', 'Kidney-safe proteins', 'Cauliflower'],
                'foods_to_avoid': ['Processed foods', 'Excess potassium', 'Dark colas'],
                'daily_tips': ['Strict fluid management', 'Urgent kidney function testing']
            },
            'Medium': {
                'name': 'Renal Prevention Diet',
                'foods_to_eat': ['Fresh vegetables', 'Controlled protein', 'Blueberries'],
                'foods_to_avoid': ['Packaged foods', 'Excess sodium'],
                'daily_tips': ['Reduce sodium intake', 'Quarterly monitoring']
            },
            'Low': {
                'name': 'Kidney Friendly Diet',
                'foods_to_eat': ['Fruits', 'Vegetables', 'Water-rich foods'],
                'foods_to_avoid': ['Excess salt'],
                'daily_tips': ['Maintain optimal hydration', 'Annual screening']
            }
        }
    }
    
    def generate_weekly_meal_plan(self, disease_type, risk_level, dietary_preferences=None):
        """Generate a weekly meal plan"""
        try:
            if disease_type not in self.DIET_TEMPLATES:
                raise ValueError(f"Unknown disease type: {disease_type}")
            
            risk_level = risk_level.capitalize()
            if risk_level not in self.DIET_TEMPLATES[disease_type]:
                risk_level = 'Low'

            diet_template = self.DIET_TEMPLATES[disease_type][risk_level]
            
            meal_plan = {
                'diet_name': diet_template['name'],
                'disease_type': disease_type,
                'risk_level': risk_level,
                'created_date': datetime.utcnow(),
                'weekly_meals': self._generate_meals(disease_type, risk_level, diet_template),
                'shopping_list': self._generate_shopping_list(diet_template),
                'nutrition_tips': diet_template['daily_tips'],
                'foods_to_include': diet_template['foods_to_eat'],
                'foods_to_avoid': diet_template['foods_to_avoid']
            }
            
            return meal_plan
        except Exception as e:
            self.log_error(e, "generate_weekly_meal_plan")
            raise
    
    def _generate_meals(self, disease_type, risk_level, template):
        """Generate meal suggestions"""
        # Simplified for demonstration - real app would have more complex mapping
        return {
            'Breakfast': ['Meal A', 'Meal B'],
            'Lunch': ['Meal C', 'Meal D'],
            'Dinner': ['Meal E', 'Meal F'],
            'Snacks': ['Snack A', 'Snack B']
        }
    
    def _generate_shopping_list(self, template):
        """Generate shopping list from diet template"""
        return {
            'items': template['foods_to_eat']
        }



class DoctorRecommendationService(BaseService):
    """
    Service for recommending healthcare providers
    """
    
    SPECIALIST_MAPPING = {
        'heart': {
            'specialist': 'Cardiologist',
            'description': 'Heart and cardiovascular disease specialist',
            'reason': 'Your heart disease risk assessment requires expert evaluation'
        },
        'diabetes': {
            'specialist': 'Endocrinologist',
            'description': 'Diabetes and metabolic disorder specialist',
            'reason': 'Your diabetes risk requires specialized diabetes management'
        },
        'kidney': {
            'specialist': 'Nephrologist',
            'description': 'Kidney disease specialist',
            'reason': 'Your kidney function requires specialist assessment'
        },
        'general': {
            'specialist': 'Internal Medicine Doctor',
            'description': 'General health and preventive care specialist',
            'reason': 'Regular health checkups and preventive care'
        }
    }
    
    def get_specialist_recommendations(self, conditions, health_score=None):
        """Get specialist recommendations based on conditions"""
        try:
            recommendations = []
            
            for condition in conditions:
                if condition in self.SPECIALIST_MAPPING:
                    spec = self.SPECIALIST_MAPPING[condition]
                    recommendations.append({
                        'specialist': spec['specialist'],
                        'description': spec['description'],
                        'condition': condition,
                        'reason': spec['reason'],
                        'urgency': 'High' if health_score and health_score < 50 else 'Medium'
                    })
            
            if not recommendations:
                recommendations.append(self.SPECIALIST_MAPPING['general'])
            
            return recommendations
        except Exception as e:
            self.log_error(e, "get_specialist_recommendations")
            return []
    
    def save_specialist_appointment(self, user_id, specialist, appointment_date, notes=None):
        """Save specialist appointment"""
        try:
            appointments_coll = self.get_collection('specialist_appointments')
            
            appointment = {
                'user_id': ObjectId(user_id),
                'specialist': specialist,
                'appointment_date': appointment_date,
                'notes': notes,
                'status': 'scheduled',
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            result = appointments_coll.insert_one(appointment)
            return str(result.inserted_id)
        except Exception as e:
            self.log_error(e, "save_specialist_appointment")
            raise
