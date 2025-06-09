import os
import json
import pandas as pd
from datetime import datetime, timedelta
from utils.utils import DatabaseInteractor


def analyze_telemetry():
    # Setup DB connection from environment variables
    db = DatabaseInteractor(
        host=os.getenv('POSTGRES_HOST', 'localhost'),
        port=int(os.getenv('POSTGRES_PORT', 5432)),
        db_name=os.getenv('POSTGRES_DB', 'sis'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD')
    )
    
    # Read telemetry data from the last 30 days for flexibility
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    query = f"""
        SELECT timestamp, light, humidity, temperature, soil_moisture
        FROM telemetry
        WHERE timestamp >= '{start_date.strftime('%Y-%m-%d')}'
    """
    df = db.read_table(table_name='telemetry', query=query)
    if df is None or df.empty:
        return json.dumps({'error': 'No data found'})
    
    # Ensure timestamp is datetime
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    
    # Filter for last 7 days
    last_7d = end_date - timedelta(days=7)
    df_7d = df[df['timestamp'] >= last_7d]
    
    # Get latest record
    latest = df.iloc[-1]
    
    # Calculate stats for last 7 days
    stats = {}
    for col in ['light', 'humidity', 'temperature', 'soil_moisture']:
        stats[col] = {
            'avg': df_7d[col].mean(),
            'max': df_7d[col].max(),
            'min': df_7d[col].min(),
            'median': df_7d[col].median(),
            'current': latest[col],
            'current_vs_avg': latest[col] - df_7d[col].mean() if not pd.isna(df_7d[col].mean()) else None
        }
    
    # Compare avg of last 3 same weekdays (e.g., last 3 Tuesdays)
    weekday = latest['timestamp'].weekday()
    same_weekday = df[df['timestamp'].dt.weekday == weekday]
    last_3_same_weekday = same_weekday.tail(3)
    weekday_avg = last_3_same_weekday[['light', 'humidity', 'temperature', 'soil_moisture']].mean().to_dict()
    for col in ['light', 'humidity', 'temperature', 'soil_moisture']:
        stats[col]['weekday_avg'] = weekday_avg[col]
        stats[col]['current_vs_weekday_avg'] = latest[col] - weekday_avg[col] if not pd.isna(weekday_avg[col]) else None
    
    # Output JSON
    return json.dumps({'telemetry_stats': stats}, default=str)

# Example usage
if __name__ == "__main__":
    print(analyze_telemetry())