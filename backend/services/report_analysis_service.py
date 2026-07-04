"""
Report Analysis Service - Extracts and analyzes medical reports
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

class ReportAnalysisService(BaseService):
    """
    Service for analyzing medical reports
    Supports: PDF, Images (JPG, PNG), Text extraction, Parameter detection
    """
    
    # Common health parameters and their normal ranges
    HEALTH_PARAMETERS = {
        'glucose': {'normal_range': (70, 100), 'unit': 'mg/dL', 'aliases': ['blood sugar', 'glucose level']},
        'hemoglobin': {'normal_range': (12.0, 17.5), 'unit': 'g/dL', 'aliases': ['hb', 'hemoglobin']},
        'creatinine': {'normal_range': (0.7, 1.3), 'unit': 'mg/dL', 'aliases': ['serum creatinine']},
        'cholesterol': {'normal_range': (0, 200), 'unit': 'mg/dL', 'aliases': ['total cholesterol']},
        'ldl': {'normal_range': (0, 100), 'unit': 'mg/dL', 'aliases': ['bad cholesterol']},
        'hdl': {'normal_range': (40, 300), 'unit': 'mg/dL', 'aliases': ['good cholesterol']},
        'triglycerides': {'normal_range': (0, 150), 'unit': 'mg/dL', 'aliases': ['triglyceride']},
        'platelets': {'normal_range': (150, 400), 'unit': 'K/uL', 'aliases': ['plt', 'platelet']},
        'wbc': {'normal_range': (4.5, 11.0), 'unit': 'K/uL', 'aliases': ['white blood cells', 'white blood cell count']},
        'rbc': {'normal_range': (4.5, 5.9), 'unit': 'M/uL', 'aliases': ['red blood cells', 'red blood cell count']},
        'sodium': {'normal_range': (136, 145), 'unit': 'mEq/L', 'aliases': ['na', 'sodium']},
        'potassium': {'normal_range': (3.5, 5.0), 'unit': 'mEq/L', 'aliases': ['k', 'potassium']},
        'calcium': {'normal_range': (8.5, 10.2), 'unit': 'mg/dL', 'aliases': ['ca', 'calcium']},
        'urea': {'normal_range': (7, 20), 'unit': 'mg/dL', 'aliases': ['bun', 'blood urea nitrogen']},
    }
    
    RISK_CONDITION_KEYWORDS = {
        'diabetes': ['hyperglycemia', 'high glucose', 'elevated blood sugar', 'insulin resistance'],
        'hypertension': ['high blood pressure', 'hypertensive', 'elevated bp'],
        'anemia': ['low hemoglobin', 'low hb', 'microcytic', 'macrocytic'],
        'kidney_disease': ['high creatinine', 'elevated bun', 'kidney dysfunction', 'renal failure'],
        'hyperlipidemia': ['high cholesterol', 'elevated cholesterol', 'high triglycerides'],
        'infection': ['high wbc', 'elevated white blood cells', 'leukocytosis'],
    }
    
    def extract_text_from_pdf(self, file_path):
        """Extract text from PDF file"""
        try:
            text = ""
            
            # Try pdfplumber first (better for modern PDFs)
            try:
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        text += page.extract_text() or ""
            except:
                # Fallback to PyPDF2
                with open(file_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    for page in reader.pages:
                        text += page.extract_text()
            
            return text
        except Exception as e:
            self.log_error(e, "extract_text_from_pdf")
            raise
    
    def extract_text_from_image(self, file_path):
        """Extract text from image using OCR (Tesseract)"""
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            self.log_error(e, "extract_text_from_image")
            raise
    
    def extract_parameters_from_text(self, text):
        """
        Extract health parameters from text
        Returns dict with detected parameters and their values
        """
        parameters = {}
        abnormal_values = []
        
        text_lower = text.lower()
        
        for param_name, param_info in self.HEALTH_PARAMETERS.items():
            # Look for parameter name or aliases
            for alias in param_info['aliases']:
                pattern = rf'{alias}[:\s]*(\d+\.?\d*)'
                match = re.search(pattern, text_lower)
                
                if match:
                    try:
                        value = float(match.group(1))
                        parameters[param_name] = {
                            'value': value,
                            'unit': param_info['unit'],
                            'normal_range': param_info['normal_range']
                        }
                        
                        # Check if abnormal
                        low, high = param_info['normal_range']
                        if value < low or value > high:
                            abnormal_values.append({
                                'parameter': param_name,
                                'value': value,
                                'unit': param_info['unit'],
                                'normal_range': f"{low}-{high}",
                                'status': 'Low' if value < low else 'High'
                            })
                        
                        break
                    except:
                        continue
        
        return parameters, abnormal_values
    
    def detect_risk_conditions(self, text, parameters):
        """
        Detect risk conditions from extracted text and parameters
        """
        detected_conditions = []
        text_lower = text.lower()
        
        # Check for keywords
        for condition, keywords in self.RISK_CONDITION_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    detected_conditions.append(condition)
                    break
        
        # Check parameters for risk indicators
        if 'glucose' in parameters and parameters['glucose']['value'] > 125:
            if 'diabetes' not in detected_conditions:
                detected_conditions.append('diabetes')
        
        if 'hemoglobin' in parameters and parameters['hemoglobin']['value'] < 12:
            if 'anemia' not in detected_conditions:
                detected_conditions.append('anemia')
        
        if 'creatinine' in parameters and parameters['creatinine']['value'] > 1.5:
            if 'kidney_disease' not in detected_conditions:
                detected_conditions.append('kidney_disease')
        
        if 'cholesterol' in parameters and parameters['cholesterol']['value'] > 200:
            if 'hyperlipidemia' not in detected_conditions:
                detected_conditions.append('hyperlipidemia')
        
        return list(set(detected_conditions))
    
    def generate_summary(self, parameters, detected_conditions, abnormal_values):
        """Generate a user-friendly summary based on report results"""
        if not parameters and not detected_conditions:
            return "Your medical report analysis is complete. No significant clinical markers were automatically identified. Please consult your physician for a full clinical review."
        
        summary = "Your medical report analysis is complete. "
        
        if detected_conditions:
            formatted_conditions = ", ".join(detected_conditions).replace('_', ' ')
            summary += f"Our analysis identified some markers that may be related to: {formatted_conditions}. "
        
        if abnormal_values:
            params_list = ", ".join([av['parameter'].replace('_', ' ') for av in abnormal_values])
            summary += f"We identified {len(abnormal_values)} test result(s) that are outside the normal range: {params_list}. "
        else:
            summary += "All detected test parameters are within normal ranges. "
            
        summary += "This summary is for informational purposes. Please share these findings with your healthcare provider for an accurate medical interpretation."
        return summary

    def analyze_report(self, file_path, file_type, report_type="Other"):
        """
        Complete report analysis workflow
        """
        try:
            # Extract text
            if file_type.lower() in ['pdf']:
                extracted_text = self.extract_text_from_pdf(file_path)
            elif file_type.lower() in ['jpg', 'jpeg', 'png', 'tiff']:
                extracted_text = self.extract_text_from_image(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
            
            # Extract parameters
            parameters, abnormal_values = self.extract_parameters_from_text(extracted_text)
            
            # Detect conditions
            detected_conditions = self.detect_risk_conditions(extracted_text, parameters)
            
            # Generate AI Narrative
            summary = self.generate_summary(parameters, detected_conditions, abnormal_values)
            
            return {
                'extracted_text': extracted_text,
                'parameters': parameters,
                'abnormal_values': abnormal_values,
                'detected_conditions': detected_conditions,
                'summary': summary
            }
            
        except Exception as e:
            self.log_error(e, "analyze_report")
            raise
    
    def save_report(self, user_id, file_path, file_name, file_type, analysis_result, report_type="Other"):
        """Save analyzed report to database"""
        try:
            collection = self.get_collection('medical_reports')
            
            report_doc = {
                'user_id': ObjectId(user_id) if isinstance(user_id, str) else user_id,
                'report_type': report_type,
                'report_date': datetime.utcnow(),
                'file_path': file_path,
                'file_name': file_name,
                'file_type': file_type,
                'file_size': os.path.getsize(file_path) if os.path.exists(file_path) else 0,
                'extracted_text': analysis_result.get('extracted_text', ''),
                'parameters': analysis_result.get('parameters', {}),
                'abnormal_values': analysis_result.get('abnormal_values', []),
                'ai_analysis': {
                    'summary': analysis_result.get('summary', ''),
                    'risk_factors': analysis_result.get('detected_conditions', [])
                },
                'analysis_status': 'completed',
                'analyzed_at': datetime.utcnow(),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            result = collection.insert_one(report_doc)
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
            # Handle both old 'detected_conditions' and new 'ai_analysis.risk_factors'
            risk_factors = report.get('ai_analysis', {}).get('risk_factors', [])
            if not risk_factors:
                risk_factors = report.get('detected_conditions', [])
            
            abnormal_values = report.get('abnormal_values', [])
            
            new_summary = self.generate_summary(parameters, risk_factors, abnormal_values)
            
            collection.update_one(
                {'_id': ObjectId(report_id)},
                {'$set': {
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

