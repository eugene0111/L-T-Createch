from fastapi import APIRouter, HTTPException
from api.models import PredictionRequest
from api.services.ai_service import generate_ai_context

router = APIRouter()

@router.post("/predict")
async def predict_ml(req: PredictionRequest):
    try:
        from ml_model import get_prediction
        input_data = {
            "Cement content": req.cement_content,
            "W/C ratio": req.wc_ratio,
            "SCM %": req.scm_pct,
            "Ramp rate": req.ramp_rate,
            "Hold temperature": req.hold_temperature,
            "Ambient temperature": req.ambient_temperature,
            "Maturity index": req.maturity_index,
            "Mold availability": req.mold_availability,
            "Energy tariff": req.energy_tariff
        }
        res = get_prediction(input_data)
        metrics = {k: float(v) for k, v in res.items()}
        
        insight_text = generate_ai_context(metrics, input_data)
        
        return {
            "metrics": metrics,
            "insight": insight_text,
            "tracker_data": {
                'categories': ['Strength variability', 'Climate dependency', 'Cost volatility', 'Mold idle risk', 'Schedule delay risk', 'Energy fluctuation risk', 'Quality compliance risk'],
                'before': [18, 28, 15, 32, 25, 20, 16],
                'after': [4, 7, 3, 10, 6, 4, 2]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
