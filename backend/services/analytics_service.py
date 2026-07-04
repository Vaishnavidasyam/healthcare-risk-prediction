"""
Analytics Service - Platform analytics and business intelligence
"""

from datetime import datetime, timedelta
from bson import ObjectId
from .base_service import BaseService

class AnalyticsService(BaseService):
    """
    Service for generating analytics and KPIs
    """
    
    def get_platform_metrics(self):
        """Get overall platform metrics"""
        try:
            users_coll = self.get_collection('users')
            predictions_coll = self.get_collection('predictions')
            reports_coll = self.get_collection('medical_reports')
            scores_coll = self.get_collection('health_scores')
            
            total_users = users_coll.count_documents({})
            total_predictions = predictions_coll.count_documents({})
            total_reports = reports_coll.count_documents({})
            total_scores = scores_coll.count_documents({})
            
            # Active users (last 7 days)
            seven_days_ago = datetime.utcnow() - timedelta(days=7)
            active_users = users_coll.count_documents({'last_login': {'$gte': seven_days_ago}})
            
            return {
                'total_users': total_users,
                'active_users': active_users,
                'total_predictions': total_predictions,
                'total_reports': total_reports,
                'total_health_scores': total_scores,
                'user_engagement': (active_users / max(total_users, 1)) * 100
            }
        except Exception as e:
            self.log_error(e, "get_platform_metrics")
            return {}
    
    def get_disease_distribution(self):
        """Get disease distribution across users"""
        try:
            predictions_coll = self.get_collection('predictions')
            
            pipeline = [
                {
                    "$group": {
                        "_id": None,
                        "heart_high_risk": {
                            "$sum": {"$cond": [{"$gt": ["$heart_risk", 0.6]}, 1, 0]}
                        },
                        "diabetes_high_risk": {
                            "$sum": {"$cond": [{"$gt": ["$diabetes_risk", 0.6]}, 1, 0]}
                        },
                        "kidney_high_risk": {
                            "$sum": {"$cond": [{"$gt": ["$kidney_risk", 0.6]}, 1, 0]}
                        }
                    }
                }
            ]
            
            result = list(predictions_coll.aggregate(pipeline))
            if result:
                return result[0]
            return {}
        except Exception as e:
            self.log_error(e, "get_disease_distribution")
            return {}
    
    def get_health_score_distribution(self):
        """Get health score distribution"""
        try:
            scores_coll = self.get_collection('health_scores')
            
            pipeline = [
                {
                    "$group": {
                        "_id": "$overall_category",
                        "count": {"$sum": 1},
                        "avg_score": {"$avg": "$overall_score"}
                    }
                }
            ]
            
            results = list(scores_coll.aggregate(pipeline))
            return results
        except Exception as e:
            self.log_error(e, "get_health_score_distribution")
            return []
    
    def get_prediction_trends(self, days=30):
        """Get prediction trends over time"""
        try:
            predictions_coll = self.get_collection('predictions')
            start_date = datetime.utcnow() - timedelta(days=days)
            
            pipeline = [
                {
                    "$match": {"created_at": {"$gte": start_date}}
                },
                {
                    "$group": {
                        "_id": {
                            "$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}
                        },
                        "count": {"$sum": 1},
                        "avg_heart_risk": {"$avg": "$heart_risk"},
                        "avg_diabetes_risk": {"$avg": "$diabetes_risk"},
                        "avg_kidney_risk": {"$avg": "$kidney_risk"}
                    }
                },
                {"$sort": {"_id": 1}}
            ]
            
            results = list(predictions_coll.aggregate(pipeline))
            return results
        except Exception as e:
            self.log_error(e, "get_prediction_trends")
            return []
    
    def get_top_risk_patients(self, limit=10):
        """Get patients with highest health risks"""
        try:
            scores_coll = self.get_collection('health_scores')
            users_coll = self.get_collection('users')
            
            high_risk = list(
                scores_coll.find()
                .sort('overall_score', 1)
                .limit(limit)
            )
            
            result = []
            for score in high_risk:
                user = users_coll.find_one({'_id': score['user_id']})
                result.append({
                    'user_name': user.get('username', 'Unknown') if user else 'Unknown',
                    'health_score': score.get('overall_score'),
                    'risk_factors': score.get('top_risk_factors', []),
                    'last_updated': score.get('updated_at')
                })
            
            return result
        except Exception as e:
            self.log_error(e, "get_top_risk_patients")
            return []
    
    def get_report_analytics(self):
        """Get report upload and analysis metrics"""
        try:
            reports_coll = self.get_collection('medical_reports')
            
            total_reports = reports_coll.count_documents({})
            completed = reports_coll.count_documents({'analysis_status': 'completed'})
            
            # Most common report types
            pipeline = [
                {
                    "$group": {
                        "_id": "$report_type",
                        "count": {"$sum": 1}
                    }
                },
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ]
            
            report_types = list(reports_coll.aggregate(pipeline))
            
            return {
                'total_reports': total_reports,
                'completed_analysis': completed,
                'completion_rate': (completed / max(total_reports, 1)) * 100,
                'top_report_types': report_types
            }
        except Exception as e:
            self.log_error(e, "get_report_analytics")
            return {}
    
    def get_user_analytics(self, user_id):
        """Get user-specific analytics data"""
        try:
            user_id_obj = ObjectId(user_id) if isinstance(user_id, str) else user_id
            predictions_coll = self.get_collection('predictions')
            scores_coll = self.get_collection('health_scores')
            reports_coll = self.get_collection('medical_reports')
            
            query = {'user_id': {'$in': [user_id_obj, str(user_id_obj)]}}
            
            # Prediction trends
            prediction_history = list(predictions_coll.find(query).sort('created_at', 1))
            
            # Health score trends
            score_history = list(scores_coll.find(query).sort('score_date', 1))
            
            # Metabolic tracking (from parameters in reports)
            reports = list(reports_coll.find(query).sort('report_date', 1))
            metabolic_data = []
            for r in reports:
                if 'parameters' in r:
                    metabolic_data.append({
                        'date': r['report_date'],
                        'parameters': r['parameters']
                    })
            
            return {
                'prediction_history': prediction_history,
                'score_history': score_history,
                'metabolic_data': metabolic_data,
                'total_predictions': len(prediction_history),
                'total_reports': len(reports)
            }
        except Exception as e:
            self.log_error(e, "get_user_analytics")
            return {}
