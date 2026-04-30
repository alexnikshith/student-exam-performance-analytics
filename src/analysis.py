import pandas as pd
import numpy as np

def load_and_clean_data(filepath):
    """Loads CSV data and handles missing values, including unquoted commas."""
    
    # Safely get expected column count
    is_file_like = hasattr(filepath, 'seek')
    if is_file_like:
        filepath.seek(0)
        first_line = filepath.readline()
        if isinstance(first_line, bytes):
            first_line = first_line.decode('utf-8')
        filepath.seek(0)
    else:
        with open(filepath, 'r', encoding='utf-8') as f:
            first_line = f.readline()
            
    expected_cols = len(first_line.split(','))
    
    def fix_bad_line(bad_line):
        if len(bad_line) > expected_cols:
            # Merge all extra fields into the last column (e.g., Remarks with commas)
            fixed_last_col = ",".join(bad_line[expected_cols-1:])
            return bad_line[:expected_cols-1] + [fixed_last_col]
        return bad_line

    df = pd.read_csv(filepath, engine='python', on_bad_lines=fix_bad_line)
    
    # Fill missing internal marks with median of that column
    internal_cols = [c for c in df.columns if 'Internal' in c]
    for col in internal_cols:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())
            
    # Fill missing external marks with median of that column
    external_cols = [c for c in df.columns if 'External' in c]
    for col in external_cols:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())
            
    return df

def calculate_student_metrics(df):
    """Calculates all computed fields for each student."""
    
    # Ensure Student_Name exists for insights
    if 'Student_Name' not in df.columns:
        if 'Name' in df.columns:
            df['Student_Name'] = df['Name']
        else:
            df['Student_Name'] = [f"Student {i+1}" for i in range(len(df))]
            
    # Dynamically find subjects
    internal_cols = [c for c in df.columns if str(c).endswith('_Internal')]
    
    if internal_cols:
        subjects = [c.replace('_Internal', '') for c in internal_cols]
        for sub in subjects:
            if f'{sub}_External' not in df.columns:
                df[f'{sub}_Total'] = df[f'{sub}_Internal']
            else:
                df[f'{sub}_Total'] = df[f'{sub}_Internal'] + df[f'{sub}_External']
        max_total = len(subjects) * 100
    else:
        # Fallback to generic numerical columns
        exclude_cols = ['Student_ID', 'ID', 'Total_Classes', 'Classes_Attended', 'Class', 'Section', 'Student_Name', 'Name']
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        subjects = [c for c in numeric_cols if c not in exclude_cols and not str(c).endswith('_Total')]
        
        if not subjects:
            raise ValueError("No numerical columns found to analyze as metrics.")
            
        for sub in subjects:
            df[f'{sub}_Total'] = df[sub]
            
        max_total = len(subjects) * 100  # Assume 100 per metric for simplicity
        
    # Calculate total marks and percentage
    total_cols = [f'{sub}_Total' for sub in subjects]
    df['Total_Marks'] = df[total_cols].sum(axis=1)
    
    # Avoid division by zero
    max_total = max(max_total, 1)
    df['Percentage'] = (df['Total_Marks'] / max_total) * 100
    df['Average_Marks'] = df['Total_Marks'] / len(subjects)
    
    # Calculate Attendance Percentage if fields exist
    if 'Classes_Attended' in df.columns and 'Total_Classes' in df.columns:
        df['Attendance_Percentage'] = (df['Classes_Attended'] / df['Total_Classes']) * 100
    else:
        df['Attendance_Percentage'] = 100 # Default if not provided
    
    # Calculate Grade
    def get_grade(percentage):
        if percentage >= 90: return 'A+'
        elif percentage >= 80: return 'A'
        elif percentage >= 70: return 'B'
        elif percentage >= 60: return 'C'
        elif percentage >= 50: return 'D'
        else: return 'F'
        
    df['Grade'] = df['Percentage'].apply(get_grade)
    
    # Pass/Fail
    df['Status'] = df.apply(lambda row: 'Fail' if any(row[f'{sub}_Total'] < 40 for sub in subjects) else 'Pass', axis=1)
    
    # Rank
    if 'Class' in df.columns and 'Section' in df.columns:
        df['Rank'] = df.groupby(['Class', 'Section'])['Total_Marks'].rank(ascending=False, method='min')
    else:
        df['Rank'] = df['Total_Marks'].rank(ascending=False, method='min')
    
    # Remarks
    def get_remarks(row):
        if row['Status'] == 'Fail': return 'Needs significant improvement'
        elif row['Grade'] == 'A+': return 'Excellent performance'
        elif row['Grade'] == 'A': return 'Very Good'
        elif row['Attendance_Percentage'] < 75: return 'Improve attendance'
        else: return 'Good - keep it up'
        
    df['Remarks'] = df.apply(get_remarks, axis=1)
    
    return df

def get_class_insights(df):
    """Computes class-level aggregations and insights."""
    internal_cols = [c for c in df.columns if str(c).endswith('_Internal')]
    if internal_cols:
        subjects = [c.replace('_Internal', '') for c in internal_cols]
    else:
        exclude_cols = ['Student_ID', 'ID', 'Total_Classes', 'Classes_Attended', 'Class', 'Section', 'Student_Name', 'Name', 'Total_Marks', 'Percentage', 'Average_Marks', 'Attendance_Percentage']
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        subjects = [c for c in numeric_cols if c not in exclude_cols and not str(c).endswith('_Total')]
    
    insights = {}
    
    # Subject Level
    subject_avgs = {sub: df[f'{sub}_Total'].mean() for sub in subjects}
    insights['subject_averages'] = subject_avgs
    
    strongest_sub = max(subject_avgs, key=subject_avgs.get)
    weakest_sub = min(subject_avgs, key=subject_avgs.get)
    insights['strongest_subject'] = strongest_sub
    insights['weakest_subject'] = weakest_sub
    
    # Class Level
    insights['overall_average'] = df['Percentage'].mean()
    insights['total_students'] = len(df)
    
    # Grade & Status Counts
    insights['grade_counts'] = df['Grade'].value_counts().to_dict()
    insights['status_counts'] = df['Status'].value_counts().to_dict()
    pass_count = insights['status_counts'].get('Pass', 0)
    insights['pass_percentage'] = (pass_count / len(df)) * 100
    
    # Section Performance
    if 'Section' in df.columns:
        section_avgs = df.groupby('Section')['Percentage'].mean().to_dict()
        insights['section_averages'] = section_avgs
        best_section = max(section_avgs, key=section_avgs.get)
        insights['best_section'] = best_section
    
    top_student_idx = df['Total_Marks'].idxmax()
    insights['top_student'] = df.loc[top_student_idx, 'Student_Name']
    insights['top_marks'] = df.loc[top_student_idx, 'Total_Marks']
    
    # Top 5 students
    top_5 = df.nlargest(5, 'Total_Marks')[['Student_Name', 'Percentage', 'Rank', 'Section']].to_dict('records')
    insights['top_5'] = top_5
    
    # At risk students (below 40% or Failed)
    at_risk = df[df['Status'] == 'Fail'][['Student_Name', 'Percentage', 'Attendance_Percentage']].to_dict('records')
    insights['at_risk_students'] = at_risk
    
    # Low attendance
    low_attendance = df[df['Attendance_Percentage'] < 75][['Student_Name', 'Attendance_Percentage']].to_dict('records')
    insights['low_attendance'] = low_attendance
    
    # Attendance Correlation Insight
    high_att_avg = df[df['Attendance_Percentage'] >= 85]['Percentage'].mean()
    low_att_avg = df[df['Attendance_Percentage'] < 85]['Percentage'].mean()
    insights['attendance_correlation'] = {
        'high_att_avg': high_att_avg if pd.notna(high_att_avg) else 0,
        'low_att_avg': low_att_avg if pd.notna(low_att_avg) else 0
    }
    
    # Insights sentences
    insight_statements = [
        f"🏆 The strongest subject overall is **{strongest_sub}** with an average of **{subject_avgs[strongest_sub]:.1f} marks**.",
        f"⚠️ Students are struggling the most in **{weakest_sub}** (Average: {subject_avgs[weakest_sub]:.1f} marks).",
        f"📊 The overall class average percentage is **{insights['overall_average']:.1f}%**.",
        f"✅ The overall pass rate is **{insights['pass_percentage']:.1f}%**.",
    ]
    
    if 'Section' in df.columns:
        insight_statements.append(f"🏫 **Section {best_section}** is the best performing section with an average of {section_avgs[best_section]:.1f}%.")
        
    att_diff = high_att_avg - low_att_avg
    if att_diff > 0 and pd.notna(high_att_avg) and pd.notna(low_att_avg):
        insight_statements.append(f"📈 Students with >85% attendance score on average **{att_diff:.1f}% higher** than those below 85%.")
        
    insight_statements.append(f"🚨 **{len(at_risk)} students** are currently at risk (failing in one or more subjects).")
    insight_statements.append(f"📅 **{len(low_attendance)} students** have attendance below 75%.")
    
    # New Insights
    distinction_count = len(df[df['Percentage'] >= 80])
    if distinction_count > 0:
        insight_statements.append(f"🌟 **{distinction_count} students** ({distinction_count/len(df)*100:.1f}%) achieved a distinction (80% or above).")
        
    top_10_percentile = df['Percentage'].quantile(0.9)
    bottom_10_percentile = df['Percentage'].quantile(0.1)
    insight_statements.append(f"📉 The top 10% of the class scored above **{top_10_percentile:.1f}%**, while the bottom 10% scored below **{bottom_10_percentile:.1f}%**.")
    
    insights['statements'] = insight_statements
    
    return insights
