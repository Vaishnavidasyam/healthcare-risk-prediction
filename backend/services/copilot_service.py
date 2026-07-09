# backend/services/copilot_service.py

from datetime import datetime
from bson import ObjectId
from .base_service import BaseService
import os
from openai import OpenAI

class HealthcareCopilotService(BaseService):
    """
    AI Healthcare Assistant using OpenAI API.
    """

    def __init__(self, db):
        super().__init__(db)
        api_key = os.getenv("OPENAI_API_KEY")
        self.base_url = os.getenv("OPENAI_BASE_URL") or self._detect_base_url(api_key)
        self.preferred_model = os.getenv("OPENAI_MODEL") or self._default_model(self.base_url)
        self.current_model = self.preferred_model
        self.fallback_models = self._fallback_models(self.base_url)

        if not api_key:
            print("Warning: OPENAI_API_KEY is not set. Copilot will use offline fallback.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key, base_url=self.base_url)

        self.system_prompt = (
            "You are SmartMed AI, an advanced Healthcare Intelligence Copilot. "
            "Your goal is to provide highly accurate, empathetic, and data-driven health insights.\n\n"
            "Capabilities:\n"
            "1. Analyze and explain disease risk predictions (Heart, Diabetes, Kidney).\n"
            "2. Interpret medical reports, blood tests, and clinical parameters.\n"
            "3. Answer general health, wellness, nutrition, and fitness questions.\n"
            "4. Explain complex medical terminology and procedures.\n"
            "5. Provide actionable lifestyle recommendations based on user context.\n\n"
            "Operational Guidelines:\n"
            "- You HAVE access to the user's real-time health data (context provided in system messages).\n"
            "- ALWAYS prioritize safety. If a user describes emergency symptoms (chest pain, stroke signs, etc.), "
            "instruct them to call emergency services IMMEDIATELY.\n"
            "- Remind users you are an AI assistant, not a substitute for professional medical advice.\n"
            "- Be conversational but professional. Use 'we' to refer to the SmartMed platform.\n"
            "- If context is missing, ask clarifying questions to provide better insights.\n"
            "- Maintain strict clinical reasoning. Do not speculate beyond established medical knowledge."
        )

    def _detect_base_url(self, api_key):
        if api_key and api_key.startswith("gsk_"):
            print("Detected Groq API key, using Groq endpoint")
            return "https://api.groq.com/openai/v1"
        return "https://api.openai.com/v1"

    def _default_model(self, base_url):
        if "groq" in base_url:
            return "llama-3.3-70b-versatile"
        return "gpt-4o-mini"

    def _fallback_models(self, base_url):
        if "groq" in base_url:
            return ["llama-3.3-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"]
        return ["gpt-4o", "gpt-4", "gpt-3.5-turbo"]

    def start_chat_session(self, user_id):
        """Create a new chat session for a user."""
        try:
            collection = self.get_collection('copilot_chats')
            
            # Professional clinical greeting
            initial_msg = {
                "role": "assistant",
                "content": "Hello! I am your SmartMed AI Healthcare Assistant. I have access to your clinical history and risk profile. How can I assist with your health intelligence today?",
                "timestamp": datetime.utcnow()
            }
            
            session = {
                'user_id': ObjectId(user_id) if isinstance(user_id, str) else user_id,
                'messages': [initial_msg],
                'is_active': True,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            result = collection.insert_one(session)
            return str(result.inserted_id)
        except Exception as e:
            self.log_error(e, "start_chat_session")
            raise

    def add_message_to_session(self, session_id, role, content):
        """Add message to chat session."""
        try:
            collection = self.get_collection("copilot_chats")
            message = {
                "role": role,
                "content": content,
                "timestamp": datetime.utcnow(),
            }
            collection.update_one(
                {"_id": ObjectId(session_id) if isinstance(session_id, str) else session_id},
                {"$push": {"messages": message}, "$set": {"updated_at": datetime.utcnow()}},
            )
        except Exception as e:
            self.log_error(e, "add_message_to_session")
            raise

    def get_chat_history(self, session_id, limit=50):
        """Retrieve chat history for a session."""
        try:
            collection = self.get_collection('copilot_chats')
            session = collection.find_one({'_id': ObjectId(session_id)})
            if session:
                messages = session.get('messages', [])[-limit:]
                for msg in messages:
                    if "timestamp" in msg and isinstance(msg["timestamp"], datetime):
                        msg["timestamp"] = msg["timestamp"].isoformat()
                return messages
            return []
        except Exception as e:
            self.log_error(e, "get_chat_history")
            return []

    def get_user_chat_sessions(self, user_id, limit=10):
        """Get all chat sessions for current user."""
        try:
            collection = self.get_collection("copilot_chats")
            sessions = list(collection.find({"user_id": ObjectId(user_id) if isinstance(user_id, str) else user_id})
                           .sort("updated_at", -1).limit(limit))
            result = []
            for session in sessions:
                messages = session.get("messages", [])
                first_message = messages[0].get("content", "") if messages else ""
                result.append({
                    "_id": str(session["_id"]),
                    "user_id": str(session["user_id"]),
                    "message_count": len(messages),
                    "created_at": session["created_at"].isoformat(),
                    "updated_at": session["updated_at"].isoformat(),
                    "is_active": session.get("is_active", True),
                    "first_message": first_message[:100] if first_message else "No messages",
                })
            return result
        except Exception as e:
            self.log_error(e, "get_user_chat_sessions")
            return []

    def _get_clinical_fallback(self, query):
        """Provide high-quality static clinical explanations for common queries."""
        query_lower = query.lower()
        
        knowledge_base = {
            "cardiovascular": (
                "Cardiovascular risk markers typically include your Blood Pressure (Systolic/Diastolic), "
                "Cholesterol levels (LDL/HDL), and lifestyle factors like smoking or exercise frequency. "
                "In our system, a 'Heart Risk' score analyzes these variables against clinical models to predict "
                "the likelihood of cardiac events. Key areas to monitor are maintaining blood pressure below 120/80 "
                "and keeping LDL cholesterol within your doctor's recommended range."
            ),
            "metabolic": (
                "Your metabolic score is primarily influenced by blood glucose levels, BMI (Body Mass Index), "
                "and physical activity. Factors like 'Insulin Resistance' or 'Hyperglycemia' are critical markers. "
                "Maintaining a balanced diet low in processed sugars and achieving at least 150 minutes of moderate "
                "exercise per week are the most effective ways to optimize your metabolic health."
            ),
            "diabetes": (
                "Diabetes risk is assessed using markers like fasting glucose, HbA1c, and family history. "
                "Our AI analyzes these along with your BMI and age. Early warning signs often include frequent "
                "thirst or fatigue. We recommend regular screening if your risk score is above 40%."
            ),
            "kidney": (
                "Kidney (Renal) health is measured via Serum Creatinine and Blood Urea Nitrogen (BUN) levels. "
                "These help calculate your eGFR (Estimated Glomerular Filtration Rate). High blood pressure and "
                "prolonged high blood sugar are the leading causes of kidney stress."
            )
        }

        for key, response in knowledge_base.items():
            if key in query_lower:
                return f"[Clinical Fallback Mode] {response}"
        
        return (
            "I'm currently operating in offline mode due to an AI service interruption (Quota Exceeded). "
            "I can provide general clinical insights on: Cardiovascular Risk, Metabolic Scores, Diabetes, and Kidney Health. "
            "Please ask specifically about these topics or check your OpenAI billing status."
        )

    def send_message(self, session_id, user_message, user_health_context=None):
        """Send message and get AI response with auto-fallback."""
        try:
            if not self.client:
                return {"status": "success", "message": self._get_clinical_fallback(user_message), "session_id": str(session_id)}

            history = self.get_chat_history(session_id)
            context_message = ""
            if user_health_context:
                context_message = self._build_health_context_message(user_health_context)

            messages = [{"role": "system", "content": self.system_prompt}]
            if context_message:
                messages.append({"role": "system", "content": f"User health context:\n{context_message}"})

            # Add history (limit to last 10 messages for context efficiency)
            for msg in history[-10:]:
                if msg.get("role") in ("user", "assistant"):
                    messages.append({"role": msg["role"], "content": msg["content"]})

            messages.append({"role": "user", "content": user_message})

            response = None
            try:
                response = self.client.chat.completions.create(
                    model=self.current_model,
                    messages=messages,
                    max_tokens=1024,
                )
            except Exception as e:
                error_str = str(e).lower()
                # Check for quota errors
                if "insufficient_quota" in error_str or "429" in error_str:
                    fallback_msg = self._get_clinical_fallback(user_message)
                    self.add_message_to_session(session_id, "user", user_message)
                    self.add_message_to_session(session_id, "assistant", fallback_msg)
                    return {
                        "status": "success",
                        "message": fallback_msg,
                        "session_id": str(session_id),
                        "timestamp": datetime.utcnow().isoformat(),
                    }

                # If 404 or model not found, try fallbacks
                if "404" in error_str or "model_not_found" in error_str:
                    for model in self.fallback_models:
                        try:
                            response = self.client.chat.completions.create(
                                model=model,
                                messages=messages,
                                max_tokens=1024,
                            )
                            self.current_model = model # Switch for session
                            break
                        except:
                            continue
                if not response:
                    raise e

            assistant_message = response.choices[0].message.content if response else "Error generating response."
            
            # Save to DB
            self.add_message_to_session(session_id, "user", user_message)
            self.add_message_to_session(session_id, "assistant", assistant_message)

            return {
                "status": "success",
                "message": assistant_message,
                "session_id": str(session_id),
                "timestamp": datetime.utcnow().isoformat(),
            }
        except Exception as e:
            self.log_error(e, "send_message")
            return {"status": "error", "message": str(e), "session_id": str(session_id)}

    def _build_health_context_message(self, user_health_context):
        """Build formatted health context message."""
        if not user_health_context or not isinstance(user_health_context, dict):
            return "No specific health context provided."
        parts = []
        if "latest_health_score" in user_health_context:
            s = user_health_context["latest_health_score"]
            if s: parts.append(f"- Health Score: {s.get('overall_score', 'N/A')}/100 ({s.get('overall_category', 'N/A')})")
        return "\n".join(parts) if parts else "No health data."

    def end_chat_session(self, session_id):
        """End a chat session."""
        try:
            collection = self.get_collection("copilot_chats")
            collection.update_one(
                {"_id": ObjectId(session_id) if isinstance(session_id, str) else session_id},
                {"$set": {"is_active": False, "ended_at": datetime.utcnow(), "updated_at": datetime.utcnow()}}
            )
        except Exception as e:
            self.log_error(e, "end_chat_session")
            raise

    def delete_chat_session(self, session_id, user_id):
        """Delete a chat session."""
        try:
            collection = self.get_collection("copilot_chats")
            result = collection.delete_one({
                "_id": ObjectId(session_id) if isinstance(session_id, str) else session_id,
                "user_id": ObjectId(user_id) if isinstance(user_id, str) else user_id
            })
            return result.deleted_count > 0
        except Exception as e:
            self.log_error(e, "delete_chat_session")
            raise
