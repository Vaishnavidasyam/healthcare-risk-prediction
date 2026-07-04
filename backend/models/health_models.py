from datetime import datetime
from bson import ObjectId
from . import BaseModel

class User(BaseModel):
    """Enhanced User Model"""
    
    GENDER_CHOICES = ['Male', 'Female', 'Other']
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.username = kwargs.get('username')
        self.email = kwargs.get('email')
        self.password_hash = kwargs.get('password_hash')
        self.first_name = kwargs.get('first_name', '')
        self.last_name = kwargs.get('last_name', '')
        self.age = kwargs.get('age')
        self.gender = kwargs.get('gender')
        self.height = kwargs.get('height')  # cm
        self.weight = kwargs.get('weight')  # kg
        self.blood_type = kwargs.get('blood_type')
        self.medical_history = kwargs.get('medical_history', [])
        self.allergies = kwargs.get('allergies', [])
        self.current_medications = kwargs.get('current_medications', [])
        self.emergency_contact = kwargs.get('emergency_contact', {})
        self.is_active = kwargs.get('is_active', True)
        self.is_admin = kwargs.get('is_admin', False)
        self.profile_completed = kwargs.get('profile_completed', False)
        self.notifications_enabled = kwargs.get('notifications_enabled', True)
        self.last_login = kwargs.get('last_login')
        
    def to_dict(self):
        return {
            '_id': str(self._id),
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'age': self.age,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            'blood_type': self.blood_type,
            'medical_history': self.medical_history,
            'allergies': self.allergies,
            'current_medications': self.current_medications,
            'emergency_contact': self.emergency_contact,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'profile_completed': self.profile_completed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)


class HealthRecord(BaseModel):
    """Health Record/Vital Signs"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.record_date = kwargs.get('record_date', datetime.utcnow())
        
        # Physical Measurements
        self.height = kwargs.get('height')  # cm
        self.weight = kwargs.get('weight')  # kg
        self.bmi = kwargs.get('bmi')
        
        # Vital Signs
        self.blood_pressure_systolic = kwargs.get('blood_pressure_systolic')
        self.blood_pressure_diastolic = kwargs.get('blood_pressure_diastolic')
        self.heart_rate = kwargs.get('heart_rate')
        self.temperature = kwargs.get('temperature')
        self.respiratory_rate = kwargs.get('respiratory_rate')
        
        # Blood Tests
        self.glucose = kwargs.get('glucose')
        self.hemoglobin = kwargs.get('hemoglobin')
        self.creatinine = kwargs.get('creatinine')
        self.urea = kwargs.get('urea')
        self.sodium = kwargs.get('sodium')
        self.potassium = kwargs.get('potassium')
        self.calcium = kwargs.get('calcium')
        self.cholesterol = kwargs.get('cholesterol')
        self.triglycerides = kwargs.get('triglycerides')
        self.ldl = kwargs.get('ldl')
        self.hdl = kwargs.get('hdl')
        
        # Lifestyle
        self.smoking_status = kwargs.get('smoking_status')  # None, 'Former', 'Current'
        self.alcohol_consumption = kwargs.get('alcohol_consumption')  # None, 'Mild', 'Moderate', 'Heavy'
        self.exercise_frequency = kwargs.get('exercise_frequency')  # per week
        self.diet_type = kwargs.get('diet_type')  # 'Vegetarian', 'Non-Vegetarian', etc.
        
        # Family History
        self.family_history = kwargs.get('family_history', {})
        
        # Sleep & Stress
        self.sleep_hours = kwargs.get('sleep_hours')
        self.stress_level = kwargs.get('stress_level')  # 1-10
        
        self.notes = kwargs.get('notes', '')
        self.source = kwargs.get('source', 'manual')  # 'manual', 'wearable', 'uploaded_report'
        
    def calculate_bmi(self):
        """Calculate BMI from height and weight"""
        if self.height and self.weight:
            self.bmi = round(self.weight / ((self.height / 100) ** 2), 2)
        return self.bmi
    
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'record_date': self.record_date.isoformat(),
            'height': self.height,
            'weight': self.weight,
            'bmi': self.bmi,
            'blood_pressure': {
                'systolic': self.blood_pressure_systolic,
                'diastolic': self.blood_pressure_diastolic
            },
            'heart_rate': self.heart_rate,
            'temperature': self.temperature,
            'respiratory_rate': self.respiratory_rate,
            'blood_tests': {
                'glucose': self.glucose,
                'hemoglobin': self.hemoglobin,
                'creatinine': self.creatinine,
                'urea': self.urea,
                'sodium': self.sodium,
                'potassium': self.potassium,
                'calcium': self.calcium,
                'cholesterol': self.cholesterol,
                'triglycerides': self.triglycerides,
                'ldl': self.ldl,
                'hdl': self.hdl,
            },
            'lifestyle': {
                'smoking_status': self.smoking_status,
                'alcohol_consumption': self.alcohol_consumption,
                'exercise_frequency': self.exercise_frequency,
                'diet_type': self.diet_type,
                'sleep_hours': self.sleep_hours,
                'stress_level': self.stress_level,
            },
            'family_history': self.family_history,
            'notes': self.notes,
            'source': self.source,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)
