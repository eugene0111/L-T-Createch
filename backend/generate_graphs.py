import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Create output directory for frontend public folder
output_dir = os.path.join(os.path.dirname(__file__), '../frontend/public')
os.makedirs(output_dir, exist_ok=True)

def generate_cost_demould_curve():
    # X-axis: Demould Time (hours)
    # Range from 10 to 30 hours
    demould_time = np.linspace(10, 30, 200)
    
    # Left side (very fast demould) -> High energy cost
    # Inverse relationship: energy_cost = a / (demould_time - b)
    energy_cost = 4000 / (demould_time - 8)
    
    # Right side (very slow demould) -> High yard cost
    # Linear relationship: yard_cost = c * demould_time
    yard_cost = 20 * demould_time
    
    # Total Cost
    total_cost = energy_cost + yard_cost
    
    # Find minimum
    min_idx = np.argmin(total_cost)
    min_time = demould_time[min_idx]
    min_cost = total_cost[min_idx]
    
    plt.figure(figsize=(10, 6), facecolor='white')
    ax = plt.gca()
    ax.set_facecolor('white')
    
    # Plot curves
    plt.plot(demould_time, energy_cost, label='Energy Cost', color='#10b981', linestyle='--', alpha=0.7)
    plt.plot(demould_time, yard_cost, label='Yard/Mold Cost', color='#db2777', linestyle='--', alpha=0.7)
    plt.plot(demould_time, total_cost, label='Total Cost', color='#d97706', linewidth=3)
    
    # Bottom point -> AI Optimized zone
    plt.scatter([min_time], [min_cost], color='#d97706', s=100, zorder=5)
    
    # Highlight AI economic minimum zone
    plt.axvspan(min_time - 1.5, min_time + 1.5, color='#d97706', alpha=0.1, label='AI Optimized Zone')
    
    # Label Steam at ~20h, Baseline at 24h
    steam_time = 20
    steam_cost = 4000 / (steam_time - 8) + 20 * steam_time
    plt.scatter([steam_time], [steam_cost], color='#15171e', s=70, zorder=5)
    plt.annotate('Steam Curing\n(~20h)', xy=(steam_time, steam_cost), xytext=(steam_time - 1.5, steam_cost + 150),
                 ha='center', color='#15171e', fontweight='bold', 
                 arrowprops=dict(facecolor='#15171e', shrink=0.05, width=1, headwidth=5))
                 
    baseline_time = 24
    baseline_cost = 4000 / (baseline_time - 8) + 20 * baseline_time
    plt.scatter([baseline_time], [baseline_cost], color='#15171e', s=70, zorder=5)
    plt.annotate('Baseline\n(24h)', xy=(baseline_time, baseline_cost), xytext=(baseline_time + 1.5, baseline_cost + 150),
                 ha='center', color='#15171e', fontweight='bold', 
                 arrowprops=dict(facecolor='#15171e', shrink=0.05, width=1, headwidth=5))
                 
    plt.annotate('Steam shifts left.\nAI finds economic minimum.', xy=(min_time, min_cost), xytext=(min_time, min_cost - 250),
                 ha='center', color='#d97706', fontweight='bold', 
                 arrowprops=dict(color='#d97706', shrink=0.05, width=1, headwidth=5))
                 
    plt.title('Cost vs Demould Time Curve', color='#15171e', fontsize=16, pad=20, fontweight='bold')
    plt.xlabel('Demould Time (Hours)', color='#15171e', fontweight='bold')
    plt.ylabel('Total Cost', color='#15171e', fontweight='bold')
    
    ax.tick_params(colors='#15171e')
    for spine in ax.spines.values():
        spine.set_color('#e5e7eb')
        
    plt.legend(facecolor='white', edgecolor='#e5e7eb', labelcolor='#15171e')
    plt.grid(color='#e5e7eb', linestyle=':', lw=1)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'cost_demould_curve.png'), dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()


def generate_correlation_matrix():
    # Features mentioned in ml_model.py + Targets renamed professionally
    features = [
        'Cement %', 'W/C Ratio', 'SCM %', 'Ramp Rate', 
        'Hold Temp', 'Ambient Temp', 'Maturity Index',
        'Mold Avail.', 'Energy Tariff', 'Labor Shift'
    ]
    targets = [
        'Strength Gain', 'Demould Time', 'Energy Use', 
        'Cost / Element', 'Mold Util.', 'Under-strength Risk',
        'Throughput'
    ]
    cols = features + targets
    
    np.random.seed(42)
    n = len(cols)
    corr = np.eye(n)
    
    # Add some noise
    noise = np.random.uniform(-0.1, 0.1, (n, n))
    corr = corr + noise
    corr = (corr + corr.T) / 2 # Make symmetric
    np.fill_diagonal(corr, 1.0)
    
    # Define logically sound correlations (row, col, value)
    def set_corr(f1, f2, val):
        i = cols.index(f1)
        j = cols.index(f2)
        corr[i, j] = val
        corr[j, i] = val
        
    set_corr('Cement %', 'Cost / Element', 0.85)
    set_corr('Cement %', 'Strength Gain', 0.70)
    set_corr('W/C Ratio', 'Strength Gain', -0.65)
    set_corr('W/C Ratio', 'Under-strength Risk', 0.55)
    set_corr('Hold Temp', 'Energy Use', 0.90)
    set_corr('Hold Temp', 'Demould Time', -0.80)
    set_corr('Hold Temp', 'Strength Gain', 0.75)
    set_corr('Ramp Rate', 'Under-strength Risk', 0.60)
    set_corr('SCM %', 'Cost / Element', -0.50)
    set_corr('SCM %', 'Demould Time', 0.40)
    set_corr('Demould Time', 'Mold Util.', -0.85)
    set_corr('Demould Time', 'Cost / Element', 0.45)
    set_corr('Labor Shift', 'Throughput', 0.75)
    set_corr('Mold Avail.', 'Throughput', 0.85)
    set_corr('Energy Tariff', 'Cost / Element', 0.60)
    
    corr = np.clip(corr, -1, 1)
    
    # Increase figure size to fit larger labels without clutter
    plt.figure(figsize=(14, 12), facecolor='white')
    ax = plt.gca()
    ax.set_facecolor('white')
    
    # Deep red to deep blue color map (RdBu_r reverses it so red is positive, blue is negative)
    # Re-adding annot to show cell values
    sns.heatmap(corr, xticklabels=cols, yticklabels=cols, 
                cmap='RdBu_r', vmin=-1, vmax=1, 
                annot=True, fmt='.2f', annot_kws={'size': 12}, 
                cbar_kws={'label': 'Correlation'},
                linewidths=0.5, linecolor='white')
                
    plt.title('AI Model Correlation Matrix', color='#15171e', fontsize=24, pad=25, fontweight='bold')
    
    # Increase label sizes significantly
    ax.tick_params(colors='#15171e', labelsize=14)
    cbar = ax.collections[0].colorbar
    cbar.ax.yaxis.set_tick_params(color='#15171e')
    cbar.ax.tick_params(labelsize=14, colors='#15171e')
    cbar.set_label('Correlation', color='#15171e', size=16, fontweight='bold')
    
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")
    plt.setp(ax.get_yticklabels(), rotation=0)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'correlation_matrix.png'), dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()

def generate_strength_time_curve():
    # X-axis: Time (hours), Y-axis: Strength (MPa)
    time = np.linspace(0, 30, 200)
    
    # Mathematical models for strength gain
    # Conventional: Slowest early strength, highest ultimate (A=65, k=0.035)
    conv_strength = 65 * (1 - np.exp(-0.035 * time))
    
    # Steam: Steep early rise, lower ultimate (A=48, k=0.15)
    steam_strength = 48 * (1 - np.exp(-0.15 * time))
    
    # AI Optimized: Balances rate and ultimate strength (A=60, k=0.055)
    ai_strength = 60 * (1 - np.exp(-0.055 * time))
    
    plt.figure(figsize=(10, 6), facecolor='white')
    ax = plt.gca()
    ax.set_facecolor('white')
    
    plt.plot(time, conv_strength, label='Conventional', color='#6b7280', linestyle=':', linewidth=2)
    plt.plot(time, steam_strength, label='Steam Curing', color='#db2777', linestyle='--', linewidth=2)
    plt.plot(time, ai_strength, label='AI Optimized Trajectory', color='#10b981', linewidth=3)
    
    # Required Demould Strength
    required_strength = 35
    plt.axhline(y=required_strength, color='#15171e', linestyle='-', alpha=0.5, label='Required Demould Strength (35 MPa)')
    
    # Find intersection point for AI
    ai_reach_idx = np.where(ai_strength >= required_strength)[0][0]
    ai_reach_time = time[ai_reach_idx]
    
    plt.scatter([ai_reach_time], [required_strength], color='#10b981', s=100, zorder=5)
    
    # Annotation for the intersection
    plt.annotate(f"{ai_reach_time:.1f}h", xy=(ai_reach_time, required_strength), 
                 xytext=(ai_reach_time + 1, required_strength - 5),
                 color='#10b981', fontweight='bold', 
                 arrowprops=dict(facecolor='#10b981', shrink=0.05, width=1, headwidth=5))

    # Add small caption
    plt.figtext(0.5, 0.01, "AI meets required strength at lowest total system cost.", 
                ha="center", fontsize=12, color='#d97706', style='italic', fontweight='bold')

    # Formatting
    plt.title('Strength vs Time Curve', color='#15171e', fontsize=16, pad=20, fontweight='bold')
    plt.xlabel('Time (Hours)', color='#15171e', fontweight='bold')
    plt.ylabel('Compressive Strength (MPa)', color='#15171e', fontweight='bold')
    
    ax.tick_params(colors='#15171e')
    for spine in ax.spines.values():
        spine.set_color('#e5e7eb')
        
    plt.legend(facecolor='white', edgecolor='#e5e7eb', labelcolor='#15171e', loc='lower right')
    plt.grid(color='#e5e7eb', linestyle=':', lw=1)
    
    plt.tight_layout(rect=[0, 0.05, 1, 1]) # Make room for the caption at the bottom
    plt.savefig(os.path.join(output_dir, 'strength_time_curve.png'), dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()


if __name__ == "__main__":
    print("Generating Cost vs Demould Time Curve...")
    generate_cost_demould_curve()
    print("Generating Correlation Matrix...")
    generate_correlation_matrix()
    print("Generating Strength vs Time Curve...")
    generate_strength_time_curve()
    print(f"Graphs successfully saved to {os.path.abspath(output_dir)}")
