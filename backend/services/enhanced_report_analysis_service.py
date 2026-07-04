"""
Enhanced Report Analysis Service with ChatGPT AI Summaries
"""

import os
import re
import json
from datetime import datetime
from bson import ObjectId
from .base_service import BaseService
from models.report_models import MedicalReport
import PyPDF2
import pdfplumber
from PIL import Image
import pytesseract
from openai import OpenAI

class EnhancedReportAnalysisService(BaseService):
    """
    Advanced report analysis with AI-powered summaries
    """
    
    # Common health parameters and their normal ranges
    HEALTH_PARAMETERS = {
        'glucose': {'normal_range': (70, 100), 'unit': 'mg/dL'},
        'hemoglobin': {'normal_range': (12.0, 17.5), 'unit': 'g/dL'},
        'creatinine': {'normal_range': (0.7, 1.3), 'unit': 'mg/dL'},
        'cholesterol': {'normal_range': (0, 200), 'unit': 'mg/dL'},
        'ldl': {'normal_range': (0, 100), 'unit': 'mg/dL'},
        'hdl': {'normal_range': (40, 300), 'unit': 'mg/dL'},
        'triglycerides': {'normal_range': (0, 150), 'unit': 'mg/dL'},
        'platelets': {'normal_range': (150, 400), 'unit': 'K/uL'},
        'wbc': {'normal_range': (4.5, 11.0), 'unit': 'K/uL'},
        'rbc': {'normal_range': (4.5, 5.9), 'unit': 'M/uL'},
    }
    
    RISK_CONDITION_KEYWORDS = {
        'diabetes': ['hyperglycemia', 'high glucose', 'elevated blood sugar'],
        'hypertension': ['high blood pressure', 'hypertensive'],
        'anemia': ['low hemoglobin', 'low hb'],
        'kidney_disease': ['high creatinine', 'elevated bun'],
        'hyperlipidemia': ['high cholesterol', 'high triglycerides'],
    }

    PARAMETER_GUIDANCE = {
        'glucose': 'This can be related to blood sugar control. Discuss whether a fasting glucose or HbA1c test is appropriate.',
        'hemoglobin': 'This can affect how oxygen is carried in the blood. Discuss possible causes with your doctor.',
        'creatinine': 'This is one marker used when reviewing kidney function.',
        'cholesterol': 'This can contribute to cardiovascular risk over time. Ask your doctor about heart-healthy changes.',
        'ldl': 'LDL is sometimes called bad cholesterol because higher levels can contribute to cardiovascular risk.',
        'hdl': 'HDL is sometimes called good cholesterol. Your doctor can explain what your level means in context.',
        'triglycerides': 'Higher triglycerides can be influenced by diet, alcohol, weight, and blood sugar control.',
        'platelets': 'Platelets help with blood clotting. Your doctor can decide whether follow-up testing is needed.',
        'wbc': 'White blood cells are part of the immune system. Changes can have several possible causes.',
        'rbc': 'Red blood cells carry oxygen around the body. Your doctor can review this alongside hemoglobin.',
    }
    
    def __init__(self, db):
        super().__init__(db)
        self.client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            base_url=os.getenv('OPENAI_BASE_URL', 'https://api.openai.com/v1')
        )
        self.model = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')
    
    def extract_text_from_pdf(self, file_path):
        """Extract text from PDF"""
        try:
            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() or ""
            return text
        except Exception:
            try:
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text()
                return text
            except Exception as e:
                self.log_error(e, "extract_text_from_pdf")
                return ""
    
    def extract_text_from_image(self, file_path):
        """Extract text from image using OCR"""
        try:
            if not os.getenv('OCR_ENABLED', True):
                return ""
            
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            self.log_error(e, "extract_text_from_image")
            return ""
    
    def extract_parameters_from_text(self, text):
        """Extract health parameters from text"""
        parameters = {}
        abnormal_values = []
        
        for param, info in self.HEALTH_PARAMETERS.items():
            pattern = rf"{param}\s*:?\s*([\d.]+)"
            matches = re.findall(pattern, text, re.IGNORECASE)
            
            if matches:
                value = float(matches[0])
                parameters[param] = {
                    'value': value,
                    'unit': info['unit']
                }
                
                # Check if abnormal
                min_val, max_val = info['normal_range']
                if value < min_val or value > max_val:
                    abnormal_values.append({
                        'parameter': param,
                        'value': value,
                        'normal_range': f"{min_val}-{max_val}",
                        'status': 'Low' if value < min_val else 'High'
                    })
        
        return parameters, abnormal_values
    
    def generate_ai_summary(self, extracted_text, parameters, report_type):
        """Generate a plain-language summary using ChatGPT when available."""
        fallback_summary = self.generate_basic_summary(parameters, report_type)

        if not os.getenv('OPENAI_API_KEY'):
            return fallback_summary

        try:
            prompt = f"""Explain this medical report in simple language for a general user.

Report Type: {report_type}

Extracted Data:
{json.dumps(parameters, indent=2)}

Full Report Text:
{extracted_text[:2000]}

Use short sections and plain language. Clearly separate values that are within
range from values that need attention. Explain that the report is informational,
not a diagnosis. Recommend discussing abnormal values with a healthcare
professional. Do not make a definitive diagnosis or prescribe treatment."""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You explain medical reports clearly for general users. Be cautious, concise, and avoid diagnosis."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            self.log_error(e, "generate_ai_summary")
            return fallback_summary

    def generate_basic_summary(self, parameters, report_type):
        """Create an understandable summary when the external AI is unavailable."""
        if not parameters:
            return (
                f"{report_type} Summary\n"
                "No supported health values could be read from this report. "
                "Please review the original document with a healthcare professional."
            )

        normal_values = []
        values_to_review = []

        for name, data in parameters.items():
            value = data.get('value')
            unit = data.get('unit', '')
            info = self.HEALTH_PARAMETERS.get(name)

            if not info:
                continue

            min_val, max_val = info['normal_range']
            label = name.replace('_', ' ').title()
            value_text = f"{label}: {value} {unit}".strip()

            if min_val <= value <= max_val:
                normal_values.append(f"- {value_text} is within the expected range.")
                continue

            status = "higher" if value > max_val else "lower"
            guidance = self.PARAMETER_GUIDANCE.get(
                name,
                "Discuss this result with your healthcare professional.",
            )
            values_to_review.append(
                f"- {value_text} is {status} than the expected range "
                f"({min_val}-{max_val} {unit}). {guidance}"
            )

        overview = (
            f"{len(values_to_review)} value(s) may need attention."
            if values_to_review
            else "The extracted values are within the expected ranges."
        )

        sections = [
            f"{report_type} Summary",
            f"We reviewed {len(parameters)} extracted health value(s). {overview}",
        ]

        if values_to_review:
            sections.extend(["", "Values to discuss with your doctor", *values_to_review])

        if normal_values:
            sections.extend(["", "Values within the expected range", *normal_values])

        sections.extend([
            "",
            "Next step",
            "This summary is informational and is not a diagnosis. Share the "
            "original report with a qualified healthcare professional, especially "
            "if you have symptoms or concerns.",
        ])

        return "\n".join(sections)
    
    def analyze_report(self, file_path, file_type, report_type):
        """Complete report analysis pipeline"""
        try:
            # Extract text
            if file_type.lower() in ['pdf']:
                text = self.extract_text_from_pdf(file_path)
            else:
                text = self.extract_text_from_image(file_path)
            
            # Extract parameters
            parameters, abnormal_values = self.extract_parameters_from_text(text)
            
            # Generate AI summary
            ai_summary = self.generate_ai_summary(text, parameters, report_type)
            
            # Detect risk conditions
            detected_conditions = self._detect_risk_conditions(text, parameters)
            
            return {
                'extracted_text': text[:1000],
                'parameters': parameters,
                'abnormal_values': abnormal_values,
                'detected_conditions': detected_conditions,
                'ai_summary': ai_summary,
                'analysis_status': 'completed'
            }
        except Exception as e:
            self.log_error(e, "analyze_report")
            raise
    
    def _detect_risk_conditions(self, text, parameters):
        """Detect risk conditions from text and parameters"""
        conditions = []
        text_lower = text.lower()
        
        for condition, keywords in self.RISK_CONDITION_KEYWORDS.items():
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    conditions.append(condition)
                    break
        
        return list(set(conditions))
    
    def save_report(self, user_id, file_path, original_filename, file_type, analysis_result, report_type="Other"):
        """Save report to database"""
        try:
            collection = self.get_collection('medical_reports')
            
            report = {
                'user_id': ObjectId(user_id) if isinstance(user_id, str) else user_id,
                'report_type': report_type,
                'report_date': datetime.utcnow(),
                'file_path': file_path,
                'original_filename': original_filename,
                'file_type': file_type,
                'extracted_text': analysis_result.get('extracted_text'),
                'parameters': analysis_result.get('parameters', {}),
                'abnormal_values': analysis_result.get('abnormal_values', []),
                'detected_conditions': analysis_result.get('detected_conditions', []),
                'ai_summary': analysis_result.get('ai_summary'),
                'analysis_status': analysis_result.get('analysis_status', 'completed'),
                'analyzed_at': datetime.utcnow(),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            result = collection.insert_one(report)
            return str(result.inserted_id)
        except Exception as e:
            self.log_error(e, "save_report")
            raise
    
    def regenerate_report_summary(self, report_id):
        """Regenerate AI summary for an existing report based on its stored data"""
        try:
            collection = self.get_collection('medical_reports')
            report = collection.find_one({'_id': ObjectId(report_id)})
            
            if not report:
                raise ValueError("Report not found")
                
            parameters = report.get('parameters', {})
            extracted_text = report.get('extracted_text', '')
            report_type = report.get('report_type', 'Other')
            
            new_summary = self.generate_ai_summary(extracted_text, parameters, report_type)
            
            collection.update_one(
                {'_id': ObjectId(report_id)},
                {'$set': {
                    'ai_summary': new_summary,
                    'ai_analysis.summary': new_summary,
                    'updated_at': datetime.utcnow()
                }}
            )
            return new_summary
        except Exception as e:
            self.log_error(e, "regenerate_report_summary")
            raise

    def get_user_reports(self, user_id, limit=20):
        """Get user's reports"""
        try:
            collection = self.get_collection('medical_reports')
            
            # Robustly query for user_id
            query = {'user_id': user_id}
            if isinstance(user_id, str) and len(user_id) == 24:
                try:
                    query = {'$or': [{'user_id': user_id}, {'user_id': ObjectId(user_id)}]}
                except:
                    pass
            
            reports = list(collection.find(query).sort('analyzed_at', -1).limit(limit))
            
            result = []
            for report in reports:
                report['_id'] = str(report['_id'])
                report['user_id'] = str(report['user_id'])
                result.append(report)
            
            return result
        except Exception as e:
            self.log_error(e, "get_user_reports")
            return []

