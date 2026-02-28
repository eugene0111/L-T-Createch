import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import os

print("\n=== L&T CREATECH: PRECAST DIGITAL CHEMIST (WORKING DEMO) ===\n")

# 1. Load the Historical Dataset for Training
# We will use the concrete dataset you downloaded
data_path = os.path.join(os.path.dirname(__file__), "datasets", "concrete.csv")
if not os.path.exists(data_path):
    print(f"Error: Could not find dataset at {data_path}. Please adjust the path.")
    exit()

print("1. Loading historical concrete mixture data...")
df = pd.read_csv(data_path)

# 2. Train the AI Strength Predictor
print("2. Training AI Machine Learning Model (Random Forest)...")
X = df.drop(columns=['strength'])
y = df['strength']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# We use RandomForest for robust, out-of-the-box predictions on non-linear mix relations
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Quick validation check on test data
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
print(f"   -> Model successfully trained! (Margin of Error approx: ±{mae:.2f} MPa)")


# 3. Simulate the Yard Opitmizer (The "Copilot" logic)
print("\n3. Launching Cycle-Time Optimization Simulation...")

# Requirement: We need the concrete to hit 20 MPa to safely lift it out of the mould
TARGET_DEMOULD_STRENGTH = 20.0 

# The AI evaluates different "Recipes" the Yard Manager could use for today's casting
candidates = pd.DataFrame([
    # Scenario A: Standard Mix + Standard Curing (36 hr cycle)
    {'cement': 320, 'slag': 0, 'ash': 0, 'water': 190, 'superplastic': 0, 
     'coarseagg': 1000, 'fineagg': 800, 'age': 1.5, 'name': 'A: Baseline (Standard Mix, 36h Demould)'},
    
    # Scenario B: Richer Mix (more cement/superplasticizer) to hit strength faster (24 hr cycle)
    {'cement': 450, 'slag': 0, 'ash': 0, 'water': 160, 'superplastic': 4, 
     'coarseagg': 1000, 'fineagg': 800, 'age': 1.0, 'name': 'B: High Early Strength (Richer Mix, 24h Demould)'},
    
    # Scenario C: Super Accelerated with Steam Curing proxy (18 hr cycle) 
    # (Represented by a high maturity equivalent age proxy of 3.0 days)
    {'cement': 380, 'slag': 0, 'ash': 0, 'water': 170, 'superplastic': 2, 
     'coarseagg': 1000, 'fineagg': 800, 'age': 3.0, 'name': 'C: Steam Cured (18h Demould Equivalent)'}
])

# The Cost Engine calculates tradeoffs between material expenses vs yard overhead
def calculate_cost(row):
    # Base costs: Cement = ~₹7/kg | Superplasticizer = ~₹150/kg
    material_cost = (row['cement'] * 7) + (row['superplastic'] * 150)
    
    # Overhead costs (Crane, Mould leasing, Space): ~₹100 per hour
    # We multiply age by 24 to get hours
    actual_hours_in_mould = 18 if 'Steam' in row['name'] else (row['age'] * 24)
    overhead_cost = actual_hours_in_mould * 100 
    
    # Energy cost penalty for steam curing
    steam_energy_cost = 1000 if 'Steam' in row['name'] else 0
    
    return material_cost + overhead_cost + steam_energy_cost

results = []
print(f"\nEvaluating Scenarios to reach Target Strength: >= {TARGET_DEMOULD_STRENGTH} MPa\n")

for idx, row in candidates.iterrows():
    # Format input for model
    X_pred = row[['cement', 'slag', 'ash', 'water', 'superplastic', 'coarseagg', 'fineagg', 'age']].to_frame().T
    
    # Predict Strength
    pred_strength = model.predict(X_pred)[0]
    
    # Predict Cost
    cost = calculate_cost(row)
    
    # Does it pass the safety check?
    status = "✅ PASS" if pred_strength >= TARGET_DEMOULD_STRENGTH else "❌ FAIL"
    
    results.append({
        'Scenario': row['name'],
        'Cost(₹)': f"₹{cost:,.2f}",
        'Strength(MPa)': f"{pred_strength:.2f}",
        'Status': status,
        '_raw_cost': cost,
        '_pass': pred_strength >= TARGET_DEMOULD_STRENGTH
    })

# Format terminal output table
res_df = pd.DataFrame(results)
print(res_df[['Scenario', 'Strength(MPa)', 'Status', 'Cost(₹)']].to_string(index=False))

# 4. Final Verdict
print("\n=== AI COPILOT RECOMMENDATION ===")
passing = [r for r in results if r['_pass']]

if passing:
    # Sort by cheapest cost
    best = min(passing, key=lambda x: x['_raw_cost'])
    print(f"🏆 The Optimizer selects: {best['Scenario']}")
    print(f"💡 Reason: It safely meets target strength ({best['Strength(MPa)']} MPa) at the lowest total cost ({best['Cost(₹)']}).")
else:
    print("❌ No scenarios meet the target strength. Recalibrate mix inputs.")
print("\n")
