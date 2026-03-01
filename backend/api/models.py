from pydantic import BaseModel
from typing import List, Dict

class PredictionRequest(BaseModel):
    cement_content: float = 400.0
    wc_ratio: float = 0.42
    scm_pct: float = 25.0
    ramp_rate: float = 20.0
    hold_temperature: float = 65.0
    ambient_temperature: float = 32.0
    maturity_index: float = 550.0
    mold_availability: float = 85.0
    energy_tariff: float = 7.0

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ReportRequest(BaseModel):
    metrics: dict
    insight: str
