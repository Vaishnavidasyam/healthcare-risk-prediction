from datetime import datetime
from bson import ObjectId
from . import BaseModel

class MedicalReport(BaseModel):
    """Medical Report Model"""
    
    REPORT_TYPES = [
        'Blood Test',
        'CBC',
        'ECG',
        'Ultrasound',
        'X-Ray',
        'MRI',
        'CT Scan',
        'Diagnostic',
        'Health Screening',
        'Other'
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.report_type = kwargs.get('report_type')
        self.report_date = kwargs.get('report_date', datetime.utcnow())
        self.file_path = kwargs.get('file_path')
        self.file_name = kwargs.get('file_name')
        self.file_type = kwargs.get('file_type')  # pdf, jpg, png, etc.
        self.file_size = kwargs.get('file_size')
        
        # Extracted Content
        self.extracted_text = kwargs.get('extracted_text', '')
        self.parameters = kwargs.get('parameters', {})  # Extracted health parameters
        self.abnormal_values = kwargs.get('abnormal_values', [])
        
        # Analysis Results
        self.analysis_status = kwargs.get('analysis_status', 'pending')  # pending, processing, completed, failed
        self.analyzed_at = kwargs.get('analyzed_at')
        self.ai_summary = kwargs.get('ai_summary', '')
        self.detected_conditions = kwargs.get('detected_conditions', [])
        self.risk_assessments = kwargs.get('risk_assessments', {})
        
        # Metadata
        self.provider_name = kwargs.get('provider_name', '')
        self.provider_location = kwargs.get('provider_location', '')
        self.test_lab = kwargs.get('test_lab', '')
        self.clinician_name = kwargs.get('clinician_name', '')
        
        self.notes = kwargs.get('notes', '')
        self.is_flagged = kwargs.get('is_flagged', False)
        self.flag_reason = kwargs.get('flag_reason', '')
        
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'report_type': self.report_type,
            'report_date': self.report_date.isoformat(),
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'extracted_text': self.extracted_text,
            'parameters': self.parameters,
            'abnormal_values': self.abnormal_values,
            'analysis_status': self.analysis_status,
            'analyzed_at': self.analyzed_at.isoformat() if self.analyzed_at else None,
            'ai_summary': self.ai_summary,
            'detected_conditions': self.detected_conditions,
            'risk_assessments': self.risk_assessments,
            'provider_name': self.provider_name,
            'provider_location': self.provider_location,
            'test_lab': self.test_lab,
            'clinician_name': self.clinician_name,
            'notes': self.notes,
            'is_flagged': self.is_flagged,
            'flag_reason': self.flag_reason,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)


class HealthScore(BaseModel):
    """Health Score Model - aggregates all health metrics"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.score_date = kwargs.get('score_date', datetime.utcnow())
        
        # Overall Score
        self.overall_score = kwargs.get('overall_score', 0)  # 0-100
        self.overall_category = kwargs.get('overall_category', 'Unknown')  # Excellent, Good, Moderate, High Risk
        
        # Individual Risk Scores
        self.heart_risk_score = kwargs.get('heart_risk_score', 0)
        self.diabetes_risk_score = kwargs.get('diabetes_risk_score', 0)
        self.kidney_risk_score = kwargs.get('kidney_risk_score', 0)
        
        # Health Metrics Scores
        self.bmi_score = kwargs.get('bmi_score', 0)
        self.blood_pressure_score = kwargs.get('blood_pressure_score', 0)
        self.lifestyle_score = kwargs.get('lifestyle_score', 0)
        self.age_risk_score = kwargs.get('age_risk_score', 0)
        
        # Trend Data
        self.trend = kwargs.get('trend', 'stable')  # improving, stable, declining
        self.days_since_last_update = kwargs.get('days_since_last_update', 0)
        
        # Contributing Factors
        self.top_risk_factors = kwargs.get('top_risk_factors', [])  # Top 5 risk factors
        self.recommendations_count = kwargs.get('recommendations_count', 0)
        
        self.notes = kwargs.get('notes', '')
        
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'score_date': self.score_date.isoformat(),
            'overall_score': self.overall_score,
            'overall_category': self.overall_category,
            'heart_risk_score': self.heart_risk_score,
            'diabetes_risk_score': self.diabetes_risk_score,
            'kidney_risk_score': self.kidney_risk_score,
            'bmi_score': self.bmi_score,
            'blood_pressure_score': self.blood_pressure_score,
            'lifestyle_score': self.lifestyle_score,
            'age_risk_score': self.age_risk_score,
            'trend': self.trend,
            'days_since_last_update': self.days_since_last_update,
            'top_risk_factors': self.top_risk_factors,
            'recommendations_count': self.recommendations_count,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)


class Recommendation(BaseModel):
    """Health Recommendation Model"""
    
    CATEGORY_CHOICES = [
        'Diet',
        'Exercise',
        'Medication',
        'Lifestyle',
        'Monitoring',
        'Specialist Consultation',
        'Preventive Care',
        'Medical Test',
        'Stress Management',
        'Sleep Hygiene'
    ]
    
    PRIORITY_LEVELS = ['Critical', 'High', 'Medium', 'Low']
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.category = kwargs.get('category')
        self.priority = kwargs.get('priority', 'Medium')  # Critical, High, Medium, Low
        self.title = kwargs.get('title')
        self.description = kwargs.get('description')
        self.action_items = kwargs.get('action_items', [])
        self.reason = kwargs.get('reason')  # Why this recommendation
        
        # Related To
        self.related_condition = kwargs.get('related_condition')  # Heart, Diabetes, Kidney
        self.related_report_id = kwargs.get('related_report_id')
        self.related_prediction_id = kwargs.get('related_prediction_id')
        
        # Timeline
        self.start_date = kwargs.get('start_date', datetime.utcnow())
        self.target_date = kwargs.get('target_date')
        self.duration_days = kwargs.get('duration_days')
        
        # Status
        self.status = kwargs.get('status', 'Active')  # Active, Completed, Dismissed, Expired
        self.completion_percentage = kwargs.get('completion_percentage', 0)
        
        # Evidence & Resources
        self.resources = kwargs.get('resources', [])  # Links, documents, articles
        self.evidence_level = kwargs.get('evidence_level')  # Based on research
        
        # Impact
        self.expected_impact = kwargs.get('expected_impact')  # Description of expected improvement
        
        self.notes = kwargs.get('notes', '')
        
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'category': self.category,
            'priority': self.priority,
            'title': self.title,
            'description': self.description,
            'action_items': self.action_items,
            'reason': self.reason,
            'related_condition': self.related_condition,
            'related_report_id': str(self.related_report_id) if self.related_report_id else None,
            'related_prediction_id': str(self.related_prediction_id) if self.related_prediction_id else None,
            'start_date': self.start_date.isoformat(),
            'target_date': self.target_date.isoformat() if self.target_date else None,
            'duration_days': self.duration_days,
            'status': self.status,
            'completion_percentage': self.completion_percentage,
            'resources': self.resources,
            'evidence_level': self.evidence_level,
            'expected_impact': self.expected_impact,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)


class HealthTimeline(BaseModel):
    """Health Event Timeline Model"""
    
    EVENT_TYPES = [
        'Prediction',
        'Report Upload',
        'Score Change',
        'Risk Alert',
        'Recommendation',
        'Medical Appointment',
        'Lab Test',
        'Lifestyle Change',
        'Medication Change',
        'Milestone'
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.event_type = kwargs.get('event_type')
        self.event_date = kwargs.get('event_date', datetime.utcnow())
        self.title = kwargs.get('title')
        self.description = kwargs.get('description')
        self.severity = kwargs.get('severity', 'Info')  # Critical, High, Medium, Low, Info
        
        # Related Entities
        self.related_report_id = kwargs.get('related_report_id')
        self.related_prediction_id = kwargs.get('related_prediction_id')
        self.related_health_record_id = kwargs.get('related_health_record_id')
        
        # Impact
        self.health_score_change = kwargs.get('health_score_change', 0)
        self.metrics_affected = kwargs.get('metrics_affected', [])
        
        self.notes = kwargs.get('notes', '')
        
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'event_type': self.event_type,
            'event_date': self.event_date.isoformat(),
            'title': self.title,
            'description': self.description,
            'severity': self.severity,
            'related_report_id': str(self.related_report_id) if self.related_report_id else None,
            'related_prediction_id': str(self.related_prediction_id) if self.related_prediction_id else None,
            'related_health_record_id': str(self.related_health_record_id) if self.related_health_record_id else None,
            'health_score_change': self.health_score_change,
            'metrics_affected': self.metrics_affected,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)
