# AI Recommendation System (Gemini API + React)

A full-stack recommendation app where users provide their goal, interests, budget, and constraints, and receive:
- personalized recommendations
- explanation summary
- a practical execution roadmap

## Tech stack
- Frontend: React + Vite
- Backend: Node.js + Express
- AI model: Gemini (`gemini-1.5-flash`) via Google Generative AI SDK

## Project structure

```
reccomendation_system/
  client/                 # React app
  server/                 # Express API + Gemini integration
  package.json            # workspace scripts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create server env file:
```bash
cp server/.env.example server/.env
```

3. Add your Gemini API key in `server/.env`:
```env
GEMINI_API_KEY=your_real_key
PORT=4000
```

4. Start both frontend + backend:
```bash
npm run dev
```

- Client: `http://localhost:5173`
- API: `http://localhost:4000`

## API contract

### `POST /api/recommend`
Request body:
```json
{
  "goal": "Become a data analyst in 6 months",
  "category": "career",
  "budget": "$300",
  "interests": ["Python", "dashboards"],
  "constraints": "2 hours per day"
}
```

Response shape:
```json
{
  "summary": "...",
  "recommendations": [
    {
      "title": "...",
      "description": "...",
      "reasonScore": 88,
      "nextStep": "..."
    }
  ],
  "roadmap": [
    {
      "phase": "Foundation",
      "timeline": "Weeks 1-4",
      "actions": ["...", "..."]
    }
  ]
}
```

## Product roadmap

### Phase 1 — MVP (Week 1)
- User form for profile inputs
- Backend endpoint to prompt Gemini
- Render recommendations + roadmap in UI
- Basic validation and error handling

### Phase 2 — Quality Improvements (Week 2)
- Prompt tuning for category-specific recommendations
- JSON schema validation (e.g., `zod`)
- Retry and fallback model logic
- Better UI states (skeletons, empty states)

### Phase 3 — Personalization (Week 3-4)
- User accounts and saved recommendation history
- Preference memory + editable profile
- Feedback loop (like/dislike recommendations)

### Phase 4 — Scale & Production (Month 2)
- Caching and rate limiting
- Analytics and observability
- Docker + CI/CD pipeline
- Deploy frontend/backend separately

## Next enhancements
- Add recommendation filters (price, location, difficulty)
- Add export to PDF/Notion
- Add multi-model support (Gemini + OpenAI)
