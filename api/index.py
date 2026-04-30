from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_median(series):
    return series.median() if not series.empty else 0

def process_data_logic(df):
    # Handle missing values with median
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())

    # Ensure Student_Name
    if 'Student_Name' not in df.columns:
        if 'Name' in df.columns:
            df['Student_Name'] = df['Name']
        else:
            df['Student_Name'] = [f"Student_{i+1}" for i in range(len(df))]

    # Identify subjects
    internal_cols = [c for c in df.columns if str(c).endswith('_Internal')]
    subjects = []
    max_total = 0

    if internal_cols:
        subjects = [c.replace('_Internal', '') for c in internal_cols]
        for sub in subjects:
            int_col = f'{sub}_Internal'
            ext_col = f'{sub}_External'
            tot_col = f'{sub}_Total'
            if ext_col in df.columns:
                df[tot_col] = df[int_col].fillna(0) + df[ext_col].fillna(0)
            else:
                df[tot_col] = df[int_col].fillna(0)
        max_total = len(subjects) * 100
    else:
        exclude = ['Student_ID', 'ID', 'Total_Classes', 'Classes_Attended', 'Class', 'Section', 'Student_Name', 'Name']
        potential_subs = [c for c in numeric_cols if c not in exclude and not str(c).endswith('_Total')]
        if not potential_subs:
            raise ValueError("No numerical columns found to analyze.")
        subjects = potential_subs
        for sub in subjects:
            df[f'{sub}_Total'] = df[sub].fillna(0)
        max_total = len(subjects) * 100

    max_total = max(max_total, 1)

    # Compute Metrics
    sub_total_cols = [f'{sub}_Total' for sub in subjects]
    df['Total_Marks'] = df[sub_total_cols].sum(axis=1)
    df['Percentage'] = (df['Total_Marks'] / max_total) * 100
    df['Average_Marks'] = df['Total_Marks'] / len(subjects)

    if 'Classes_Attended' in df.columns and 'Total_Classes' in df.columns:
        df['Attendance_Percentage'] = (df['Classes_Attended'] / df['Total_Classes']) * 100
    else:
        df['Attendance_Percentage'] = 100.0

    def get_grade(p):
        if p >= 93: return 'O'
        elif p >= 87: return 'A+'
        elif p >= 79: return 'A'
        elif p >= 70: return 'B+'
        elif p >= 61: return 'B'
        elif p >= 51: return 'C'
        elif p >= 40: return 'P'
        else: return 'F'

    df['Grade'] = df['Percentage'].apply(get_grade)
    df['Status'] = df.apply(lambda row: 'Fail' if any(row[f'{sub}_Total'] < 40 for sub in subjects) else 'Pass', axis=1)

    # Ranking
    df = df.sort_values(by='Total_Marks', ascending=False)
    df['Rank'] = df['Total_Marks'].rank(ascending=False, method='min').astype(int)

    # Remarks
    def get_remarks(row):
        if row['Status'] == 'Fail': return 'Needs significant improvement'
        elif row['Grade'] == 'O': return 'Outstanding performance'
        elif row['Grade'] == 'A+': return 'Excellent performance'
        elif row['Grade'] == 'A': return 'Very Good'
        elif row['Attendance_Percentage'] < 75: return 'Improve attendance'
        else: return 'Good - keep it up'

    df['Remarks'] = df.apply(get_remarks, axis=1)

    # Insights
    insights = {}
    subject_avgs = {}
    for sub in subjects:
        col = f'{sub}_Total'
        # Safely convert to numeric and drop NaNs for max/mean calculation
        numeric_series = pd.to_numeric(df[col], errors='coerce').dropna()
        if numeric_series.empty:
            subject_avgs[sub] = 0
            continue
            
        max_score_in_col = numeric_series.max()
        max_basis = float(max_score_in_col) if max_score_in_col > 100 else 100.0
        normalized_avg = (numeric_series.mean() / max_basis) * 100
        subject_avgs[sub] = float(normalized_avg)

    insights['subject_averages'] = subject_avgs
    if subject_avgs:
        insights['strongest_subject'] = max(subject_avgs, key=subject_avgs.get)
        insights['weakest_subject'] = min(subject_avgs, key=subject_avgs.get)
    else:
        insights['strongest_subject'] = "N/A"
        insights['weakest_subject'] = "N/A"

    insights['overall_average'] = float(df['Percentage'].mean()) if not df.empty else 0
    insights['total_students'] = len(df)
    
    pass_count = len(df[df['Status'] == 'Pass'])
    insights['pass_percentage'] = float((pass_count / len(df)) * 100) if len(df) > 0 else 0
    
    if not df.empty:
        top_row = df.iloc[0]
        insights['top_student'] = str(top_row['Student_Name'])
        insights['top_marks'] = float(top_row['Total_Marks'])
        insights['top_5'] = df.head(5)[['Student_Name', 'Percentage', 'Rank']].to_dict('records')
    else:
        insights['top_student'] = "N/A"
        insights['top_marks'] = 0
        insights['top_5'] = []
    
    insights['at_risk_students'] = df[df['Status'] == 'Fail'][['Student_Name', 'Percentage', 'Attendance_Percentage']].to_dict('records')
    insights['low_attendance'] = df[df['Attendance_Percentage'] < 75][['Student_Name', 'Attendance_Percentage']].to_dict('records')
    
    high_att_avg = df[df['Attendance_Percentage'] >= 85]['Percentage'].mean()
    low_att_avg = df[df['Attendance_Percentage'] < 85]['Percentage'].mean()
    insights['attendance_correlation'] = {
        'high_att_avg': float(high_att_avg) if pd.notna(high_att_avg) else 0,
        'low_att_avg': float(low_att_avg) if pd.notna(low_att_avg) else 0
    }

    statements = []
    if subject_avgs:
        statements.append(f"🏆 The strongest subject overall is **{insights['strongest_subject']}** with an average of **{subject_avgs[insights['strongest_subject']]:.1f} marks**.")
        statements.append(f"⚠️ Students are struggling the most in **{insights['weakest_subject']}** (Average: {subject_avgs[insights['weakest_subject']]:.1f} marks).")
    
    statements.append(f"📊 The overall class average percentage is **{insights['overall_average']:.1f}%**.")
    statements.append(f"✅ The overall pass rate is **{insights['pass_percentage']:.1f}%**.")

    att_diff = (high_att_avg or 0) - (low_att_avg or 0)
    if att_diff > 0 and pd.notna(high_att_avg) and pd.notna(low_att_avg):
        statements.append(f"📈 Students with >85% attendance score on average **{att_diff:.1f}% higher** than those below 85%.")

    statements.append(f"🚨 **{len(insights['at_risk_students'])} students** are currently at risk.")
    statements.append(f"📅 **{len(insights['low_attendance'])} students** have attendance below 75%.")

    dist_count = len(df[df['Percentage'] >= 80])
    if dist_count > 0:
        statements.append(f"🌟 **{dist_count} students** ({dist_count/len(df)*100:.1f}%) achieved a distinction (80% or above).")

    insights['statements'] = statements
    insights['grade_counts'] = df['Grade'].value_counts().to_dict()
    insights['status_counts'] = {'Pass': pass_count, 'Fail': len(df) - pass_count}

    return {
        "df": df.to_dict('records'),
        "insights": insights,
        "subjects": subjects
    }

@app.post("/api/analyze")
async def analyze_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        result = process_data_logic(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-sample")
async def analyze_sample():
    try:
        # Try a few common paths for Vercel's execution environment
        paths = [
            "data/student_marks.csv",
            "../data/student_marks.csv",
            "/var/task/data/student_marks.csv"
        ]
        path = None
        for p in paths:
            if os.path.exists(p):
                path = p
                break
        
        if not path:
            raise HTTPException(status_code=404, detail="Sample dataset not found on Vercel disk.")
            
        df = pd.read_csv(path)
        result = process_data_logic(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sample error: {str(e)}")

@app.get("/api/health")
async def health():
    return {"status": "ok"}
