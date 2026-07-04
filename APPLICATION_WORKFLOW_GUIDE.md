# SmartMed Analytics Application Workflow Guide

## 1. Application Purpose

SmartMed Analytics is a healthcare risk-analysis platform. A patient can:

- Create an account and sign in.
- Run heart, diabetes, and kidney risk predictions.
- Review explainable AI details for a heart prediction.
- Upload a medical report and receive extracted values with a readable summary.
- View health analytics, recommendations, diet plans, and specialist suggestions.
- Use the healthcare copilot when an OpenAI API key is configured.

An admin can open a separate dashboard for platform-level metrics.

## 2. Start-to-Finish User Journey

### Step 1: Open the Landing Page

Route: `/`

Frontend: `frontend/src/pages/Landing.jsx`

The landing page introduces the platform and shows:

- Healthcare AI capabilities.
- Report intelligence.
- Disease prediction.
- Clinical copilot.
- Explainable AI.
- Dark and light theme switching.

The main working navigation actions are:

- `Sign In` -> `/login`
- `Get Started`, `Launch Platform`, and `Start Free Trial` -> `/register`

Some landing-page buttons and footer links are currently visual placeholders:

- `Watch Demo`
- `Contact Sales`
- Footer links using `href="#"`

### Step 2: Register an Account

Route: `/register`

Frontend: `frontend/src/pages/Register.jsx`

Backend: `POST /api/auth/register`

The user submits a name, email, and password. The backend currently stores:

- Email
- Hashed password
- Role, defaulting to `patient`
- Creation date

Important: the submitted name is not currently stored by the backend.

After a successful registration, the user is redirected to `/login`.

### Step 3: Log In

Route: `/login`

Frontend: `frontend/src/pages/Login.jsx`

Backend: `POST /api/auth/login`

After valid credentials are submitted:

1. The backend returns an access token and user object.
2. The frontend saves both in `localStorage`.
3. A patient is redirected to `/dashboard`.
4. An admin is redirected to `/admin`.

`frontend/src/api/client.js` automatically attaches the saved token to later API
requests as a Bearer token.

### Step 4: Protected Route Check

Frontend: `frontend/src/components/ProtectedRoute.jsx`

Before loading `/dashboard` or `/admin`, the route guard checks:

- A token exists.
- Stored user data exists and is valid JSON.
- The user's role matches the requested page.

Unauthenticated users are redirected to `/login`. Users with the wrong role are
redirected to the correct dashboard.

## 3. Patient Dashboard

Route: `/dashboard`

Frontend: `frontend/src/pages/PatientDashboard.jsx`

The dashboard first loads:

- `GET /api/predictions/history`
- `GET /api/health/dashboard-summary`
- `GET /api/health/score/history?days=30`

The overview displays:

- Smart Health Score.
- Latest heart and diabetes risk level.
- Health-score trend chart.
- Recent timeline events.
- Top recommendations.
- A critical alert when the health score is below `50`.

The left sidebar controls the active dashboard view without changing the browser
route. It also supports collapse mode and theme switching.

Some overview items are currently display-only:

- Search field.
- Notification bell.
- `Vitals` chart tab.
- Hard-coded AI insight paragraph.
- Hard-coded insight count and comparison percentages.
- Critical-alert action buttons.

## 4. Prediction Features

### Heart Risk

Sidebar item: `Heart Risk`

Frontend: `frontend/src/components/PredictHeart.jsx`

Backend: `POST /api/predictions/heart`

The user enters heart-related values or fills a low-, medium-, or high-risk
sample. The backend:

1. Loads `models/heart_pipeline.pkl`.
2. Converts the submitted values into a data frame.
3. Runs `predict_proba`.
4. Calculates `Low`, `Medium`, or `High` risk.
5. Stores the prediction in MongoDB.
6. Returns a structured explainability object.

The result panel displays the risk percentage and an explainable AI section.

### Diabetes Risk

Sidebar item: `Diabetes Risk`

Frontend: `frontend/src/components/PredictDiabetes.jsx`

Backend: `POST /api/predictions/diabetes`

The flow is the same as heart prediction but uses
`models/diabetes_pipeline.pkl`.

### Kidney Risk

Sidebar item: `Kidney Risk`

Frontend: `frontend/src/components/PredictKidney.jsx`

Backend: `POST /api/predictions/kidney`

The flow is the same as heart prediction but uses
`models/kidney_pipeline.pkl`.

### Explainable AI

Frontend: `frontend/src/components/XAIExplanation.jsx`

The heart prediction page renders:

- Risk percentage.
- Human-readable explanation.
- Top contributing clinical factors.
- Contribution bars.
- Expandable factor details.
- General recommendations.

The component safely converts the backend explanation object into readable
content before rendering.

## 5. Report Intelligence

Sidebar item: `Report Intelligence`

Frontend: `frontend/src/pages/ReportsPage.jsx`

Backend:

- `POST /api/reports/upload`
- `GET /api/reports/user-reports`
- `GET /api/reports/:reportId`
- `DELETE /api/reports/:reportId/delete`

The user can select or drag and drop a PDF or image report. The backend:

1. Saves the uploaded file.
2. Extracts text from PDFs with `pdfplumber`, falling back to `PyPDF2`.
3. Uses OCR for image files.
4. Extracts supported health parameters.
5. Checks values against configured normal ranges.
6. Generates a plain-language summary.
7. Saves the report analysis in MongoDB.

The summary always works even when OpenAI is not configured. It explains:

- Which values may need attention.
- Which values are within the expected range.
- Why flagged values may matter.
- What to discuss with a healthcare professional.
- That the result is informational and not a diagnosis.

The report archive lets users reopen saved analyses.

Currently display-only:

- `Export Case Study`

## 6. Analytics And Timeline

Sidebar items:

- `Analytics`
- `Health Timeline`

Frontend: `frontend/src/pages/AnalyticsPage.jsx`

Backend: `GET /api/analytics/user`

The analytics page displays:

- Health-score history.
- Prediction history.
- Cardiac, metabolic, and renal trend charts.
- Risk distribution chart.
- Recent clinical snapshots.

Current limitations:

- `Health Timeline` currently opens the same analytics page.
- `7D`, `30D`, and `90D` filters update the selected button but do not refetch
  filtered data.
- `Export Medical Data` and `View Full History` are display-only.
- Some KPI values are hard-coded.

## 7. Health Planner And Recommendations

Opened from the dashboard overview using `Full Health Plan`.

Frontend: `frontend/src/pages/RecommendationsPage.jsx`

Backend:

- `POST /api/premium/diet/plan`
- `POST /api/premium/doctors/recommendations`
- `POST /api/premium/report/generate`

The user can select a clinical focus:

- Cardiovascular health.
- Metabolic management.
- Renal protection.

The page loads:

- Weekly meal suggestions.
- Grocery list.
- Foods to avoid.
- Suggested specialists.
- Reason and urgency for each specialist.

`Export Health Report` downloads a generated PDF assessment.

Current limitations:

- `Lifestyle Protocol` has a tab but no rendered content yet.
- `Initialize Consultation` is display-only, although appointment API endpoints
  exist in the backend.

## 8. Healthcare Copilot

Sidebar item: `AI Assistant`

Frontend: `frontend/src/pages/CopilotPage.jsx`

Backend:

- `POST /api/copilot/chat/new`
- `POST /api/copilot/chat/:sessionId/message`
- `GET /api/copilot/chat/:sessionId/history`
- `GET /api/copilot/chat/sessions`
- `POST /api/copilot/chat/:sessionId/end`

The page supports:

- New chat sessions.
- Previous session history.
- Suggested questions.
- Sending health context with a message.
- Browser speech recognition for voice input where supported.

OpenAI configuration is required for generated copilot responses. Without a
valid `OPENAI_API_KEY`, chat requests cannot return AI-generated answers.

Current limitations:

- The speaker button is display-only.
- Backend voice transcription exists as a placeholder endpoint.

## 9. Settings

Sidebar footer item: `Settings`

Frontend: `frontend/src/pages/SettingsPage.jsx`

The page provides:

- Theme selection.
- Notification toggles.
- Health-alert toggle.
- Two-factor toggle.
- Security information.

Current limitation: only the theme is persisted in `localStorage`. Other options
are local UI state, and `Save Settings` currently shows an alert without saving
to the backend.

## 10. Admin Dashboard

Route: `/admin`

Frontend: `frontend/src/pages/AdminDashboard.jsx`

Backend:

- `GET /api/analytics/metrics`
- `GET /api/analytics/disease-distribution`
- `GET /api/analytics/report-analytics`
- `GET /api/analytics/top-risk-patients?limit=5`

The admin dashboard displays:

- Total users.
- Total predictions.
- Active users.
- Disease-risk distribution.
- High-risk patient list.
- Infrastructure status cards.

Current limitation: several infrastructure values are presentation-only.

## 11. Main Frontend Components

### Active Components

| Component | Purpose |
| --- | --- |
| `App.js` | Defines public and protected routes and toast notifications. |
| `ProtectedRoute.jsx` | Enforces authentication and role-based access. |
| `Sidebar.jsx` | Switches dashboard modules and manages theme/collapse state. |
| `PredictHeart.jsx` | Heart disease risk form and results. |
| `PredictDiabetes.jsx` | Diabetes risk form and results. |
| `PredictKidney.jsx` | Kidney disease risk form and results. |
| `XAIExplanation.jsx` | Displays readable explainability details for heart risk. |

### Available But Not Currently Mounted In The Main Flow

| Component | Intended Purpose |
| --- | --- |
| `HealthScore.jsx` | Reusable health score visualization. |
| `HealthCard.jsx` | Reusable health metric card. |
| `EmergencyAlert.jsx` | Reusable alert component. |
| `DoctorCard.jsx` | Reusable doctor recommendation card. |
| `ReportUpload.jsx` | Reusable upload component; `ReportsPage.jsx` currently implements its own uploader. |
| `HealthcareCopilot.jsx` | Reusable chat interface; `CopilotPage.jsx` currently implements its own interface. |
| `RecommendationCard.jsx` | Reusable recommendation card. |
| `StatsCard.jsx` | Reusable statistics card. |
| `ChartCard.jsx` | Reusable chart wrapper. |
| `RiskChart.jsx` | Reusable risk chart. |
| `Navbar.jsx` | Older reusable navigation bar; the dashboard currently renders its own header. |

## 12. Backend Architecture

`backend/app.py` creates the Flask application and connects:

- JWT authentication.
- MongoDB.
- CORS.
- Prediction models.
- Report analysis services.
- Health-score services.
- Recommendations.
- Analytics.
- Premium features.
- Copilot services.

Main backend modules:

| Module | Responsibility |
| --- | --- |
| `backend/auth/routes.py` | Registration and login. |
| `backend/prediction/routes.py` | Disease prediction and prediction history. |
| `backend/reports/routes.py` | Report upload, analysis, archive, and deletion. |
| `backend/health/routes.py` | Health scores, timeline, and dashboard summary. |
| `backend/analytics/routes.py` | Patient and platform analytics. |
| `backend/premium/routes.py` | PDF generation, diet plans, specialist suggestions, appointments, and alerts. |
| `backend/copilot/routes.py` | Healthcare copilot chat sessions. |

## 13. Detailed Dashboard Feature Working

### Voice Input

Frontend: `frontend/src/pages/CopilotPage.jsx`

Backend placeholder: `POST /api/premium/voice/transcribe`

Current frontend flow:

1. The user opens `AI Assistant`.
2. The user clicks the microphone button beside the chat input.
3. The page checks whether the browser provides `webkitSpeechRecognition`.
4. If supported, the browser listens to the user's speech.
5. The recognized transcript is placed into the text input.
6. The user presses send to submit the transcript to the copilot.

Current status: partially working.

- Browser speech-to-text works only in browsers that support
  `webkitSpeechRecognition`, commonly Chromium-based browsers.
- The backend voice transcription route is a placeholder and does not yet call
  Whisper or another speech-to-text service.
- The speaker icon shown on assistant messages is display-only. It does not
  currently read responses aloud.

### Smart Health Score

Frontend: `frontend/src/pages/PatientDashboard.jsx`

Backend:

- `GET /api/health/dashboard-summary`
- `GET /api/health/score/latest`
- `GET /api/health/score/history?days=30`
- `backend/services/health_score_service.py`

The dashboard reads the latest stored health score from MongoDB and displays it
inside a circular progress ring. The score category is:

| Score | Category |
| --- | --- |
| `85-100` | Excellent |
| `70-84` | Good |
| `50-69` | Moderate |
| `0-49` | High Risk |

The health-score service is designed to calculate a weighted score:

| Component | Weight |
| --- | --- |
| Heart risk | `25%` |
| Diabetes risk | `25%` |
| Kidney risk | `20%` |
| BMI | `10%` |
| Blood pressure | `10%` |
| Age | `5%` |
| Lifestyle | `5%` |

Disease-risk probabilities are converted into health scores using:

```text
health component score = (1 - disease risk probability) * 100
```

This means a lower disease risk produces a better health score.

Current status: display and read APIs are connected, but automatic score
generation is incomplete.

- The service contains methods to calculate and save scores.
- The current prediction and report-upload routes do not call those methods.
- A new prediction does not automatically create a new health-score record.
- Some dashboard comparison text, such as `+4%` and `8.2% better`, is currently
  hard-coded.

### Health Evolution Trend

Location: patient dashboard overview.

Frontend: `frontend/src/pages/PatientDashboard.jsx`

Backend: `GET /api/health/score/history?days=30`

Flow:

1. The dashboard requests health-score records from the previous 30 days.
2. The backend queries the `health_scores` MongoDB collection.
3. Results are sorted by `score_date` from oldest to newest.
4. The frontend maps each result to `{ date, score }`.
5. Recharts renders the values as an area chart.

The chart answers: "How has my overall health score changed over time?"

Current status: chart rendering works when stored score-history records exist.

- The `Score` view is connected.
- The `Vitals` tab is currently display-only.
- Automatic creation of score-history records still needs wiring.

### Clinical Timeline

Location: patient dashboard overview.

Frontend: `frontend/src/pages/PatientDashboard.jsx`

Backend:

- `GET /api/health/dashboard-summary`
- `GET /api/health/timeline`

Flow:

1. The dashboard summary queries the `health_timeline` MongoDB collection.
2. Events are sorted by `event_date`, newest first.
3. The overview receives up to five recent events.
4. Each event displays its date, title, description, and event type.

The backend model supports links to related reports, predictions, and health
records.

Current status: reading and display are implemented, but event generation is
incomplete.

- No active prediction or report-upload flow currently inserts timeline events.
- The sidebar `Health Timeline` item currently opens `AnalyticsPage` rather
  than a dedicated timeline page.

### Chatbot Or Healthcare Copilot

Frontend: `frontend/src/pages/CopilotPage.jsx`

Backend:

- `POST /api/copilot/chat/new`
- `POST /api/copilot/chat/:sessionId/message`
- `GET /api/copilot/chat/:sessionId/history`
- `GET /api/copilot/chat/sessions`
- `POST /api/copilot/chat/:sessionId/end`

Flow:

1. The copilot page loads the user's previous chat sessions.
2. If no chat exists, it creates a new session.
3. The user enters a message manually or with browser voice input.
4. Before sending the question, the frontend loads
   `GET /api/health/dashboard-summary`.
5. The frontend sends the question with the latest health score and top
   recommendations as context.
6. The backend asks OpenAI for a cautious healthcare-oriented response.
7. The backend saves messages so the conversation can be reopened later.

Current status: session storage and UI flow are implemented. Generated answers
require a valid `OPENAI_API_KEY`. Without it, AI responses cannot be produced.

### Holistic Health Evolution

Location: `Analytics` page.

Frontend: `frontend/src/pages/AnalyticsPage.jsx`

Backend: `GET /api/analytics/user`

Flow:

1. The analytics endpoint returns all stored `score_history` records for the
   logged-in user.
2. The frontend maps each record to date and overall score.
3. Recharts renders an area chart from `0` to `100`.

This is the expanded analytics version of the overview's `Health Evolution
Trend`.

Current status: works when stored score records exist. The text claiming
`100+ data points` is presentation copy; the actual number depends on records in
MongoDB.

### Risk Distribution

Location: `Analytics` page.

Frontend: `frontend/src/pages/AnalyticsPage.jsx`

The pie chart uses the most recent stored component health scores:

```text
cardiovascular burden = 100 - latest heart health score
metabolic burden      = 100 - latest diabetes health score
renal burden          = 100 - latest kidney health score
```

Because component health scores are better when higher, subtracting from `100`
turns them into an estimated risk burden for the pie chart.

Current status: chart logic works when at least one score-history record exists.
The message `Metabolic metrics require attention` is currently hard-coded and is
not selected dynamically from the largest risk sector.

### Comparative Risk Trends

Location: `Analytics` page.

Frontend: `frontend/src/pages/AnalyticsPage.jsx`

The line chart displays three values over time:

- `heart_risk_score`
- `diabetes_risk_score`
- `kidney_risk_score`

These stored fields are health component scores, where a higher value means a
healthier result and a lower disease risk.

Current status: chart logic works with score-history data. The heading says
`Risk Trends`, but the plotted numbers are inverted health scores rather than
raw disease-risk probabilities.

### Recent Clinical Snapshots

Location: `Analytics` page.

Frontend: `frontend/src/pages/AnalyticsPage.jsx`

Backend: `GET /api/analytics/user`

Flow:

1. The backend reads prediction records for the current user.
2. Each prediction contains a disease name, probability, risk level, and date.
3. The frontend renders date, module, probability percentage, and risk status.

Current status: connected to real prediction records.

Current limitation: the backend sorts prediction history from oldest to newest,
and the frontend displays the first six records. Despite the heading `Recent
Clinical Snapshots`, this currently shows the earliest six records when more
than six predictions exist.

## 14. Current End State

The primary patient journey works as follows:

1. Open landing page.
2. Register or log in.
3. Enter the protected dashboard.
4. Run disease predictions.
5. Review risk percentages and heart XAI details.
6. Upload a medical report.
7. Read extracted values and a basic-user-friendly summary.
8. Open analytics and recommendations.
9. Use the copilot after configuring OpenAI.

The platform is functional for the core journey. Features explicitly identified
as display-only or placeholders still need backend or frontend wiring before
they should be presented as complete production features.
