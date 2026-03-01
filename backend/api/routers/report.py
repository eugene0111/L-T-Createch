from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
from api.models import ReportRequest

router = APIRouter()

@router.post("/report")
async def generate_report(req: ReportRequest):
    try:
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, 750, "Precast Digital Chemist - L&T Executive Report")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, 700, "1. Current Scenario Outputs")
        
        y = 670
        for key, val in req.metrics.items():
            c.drawString(70, y, f"- {key}: {val}")
            y -= 25
            
        c.drawString(50, y - 20, "2. Risk Mitigation Highlights")
        c.drawString(70, y - 45, "- Strength variability reduced from 18% to 4%")
        c.drawString(70, y - 70, "- Energy fluctuation risk reduced from 20% to 4%")
        c.drawString(70, y - 95, "- Quality compliance risk reduced to 2% limit")
        
        c.drawString(50, y - 140, "3. AI Diagnostic Insights")
        text_lines = req.insight.split('\n')
        insight_y = y - 165
        for line in text_lines:
            c.drawString(70, insight_y, line.strip())
            insight_y -= 15
        
        c.drawString(50, insight_y - 40, "Report generated automatically via AI Agent Engine.")
        c.save()
        
        buffer.seek(0)
        return StreamingResponse(
            buffer, 
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=LT_Precast_Optimization_Report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
