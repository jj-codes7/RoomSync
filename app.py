from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="RoomSync MVP")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

class AnalyzeInput(BaseModel):
    quiet_start: int = 22 * 60 + 30
    quiet_end: int = 7 * 60
    calls: list[dict] = [
        {"day": "Monday", "start": 22 * 60, "end": 24 * 60},
        {"day": "Wednesday", "start": 22 * 60, "end": 24 * 60},
        {"day": "Friday", "start": 22 * 60, "end": 24 * 60},
    ]

@app.get("/")
def home():
    return {"app": "RoomSync", "status": "MVP running"}

@app.post("/analyze")
def analyze(data: AnalyzeInput):
    conflicts = []
    for call in data.calls:
        # This MVP example checks late-evening calls against quiet time.
        overlap = max(0, min(call["end"], 24 * 60) - max(call["start"], data.quiet_start))
        conflicts.append({"day": call["day"], "conflict_minutes": overlap})

    total = sum(item["conflict_minutes"] for item in conflicts)
    return {
        "weekly_conflict_minutes": total,
        "weekly_conflict_hours": total / 60,
        "conflicts": conflicts,
        "suggestion": "Try taking late calls in the common room, if both roommates agree."
    }
