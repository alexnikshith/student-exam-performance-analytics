import os
import matplotlib.pyplot as plt
import seaborn as sns
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_visualizations(df, insights, output_dir='assets'):
    """Generates and saves visualizations."""
    os.makedirs(output_dir, exist_ok=True)
    sns.set_theme(style="whitegrid")
    
    saved_files = {}
    
    # 1. Bar Chart -> Subject Averages
    plt.figure(figsize=(8, 5))
    subjects = list(insights['subject_averages'].keys())
    averages = list(insights['subject_averages'].values())
    
    sns.barplot(x=subjects, y=averages, palette='viridis')
    plt.title('Average Marks per Subject', fontsize=14)
    plt.ylabel('Average Marks')
    plt.ylim(0, 100)
    plt.tight_layout()
    bar_path = os.path.join(output_dir, 'subject_averages.png')
    plt.savefig(bar_path)
    plt.close()
    saved_files['subject_averages'] = bar_path
    
    # 2. Pie Chart -> Grade Distribution
    plt.figure(figsize=(6, 6))
    grade_counts = df['Grade'].value_counts()
    plt.pie(grade_counts, labels=grade_counts.index, autopct='%1.1f%%', startangle=140, colors=sns.color_palette('pastel'))
    plt.title('Grade Distribution', fontsize=14)
    plt.tight_layout()
    pie_path = os.path.join(output_dir, 'grade_distribution.png')
    plt.savefig(pie_path)
    plt.close()
    saved_files['grade_distribution'] = pie_path
    
    # 3. Scatter Plot -> Attendance vs Percentage
    plt.figure(figsize=(8, 5))
    sns.scatterplot(data=df, x='Attendance_Percentage', y='Percentage', hue='Status', palette={'Pass': 'green', 'Fail': 'red'}, s=100)
    plt.title('Attendance vs Overall Percentage', fontsize=14)
    plt.xlabel('Attendance (%)')
    plt.ylabel('Overall Percentage (%)')
    plt.tight_layout()
    scatter_path = os.path.join(output_dir, 'attendance_vs_performance.png')
    plt.savefig(scatter_path)
    plt.close()
    saved_files['attendance_vs_performance'] = scatter_path
    
    # 4. Histogram -> Total Marks Distribution
    plt.figure(figsize=(8, 5))
    sns.histplot(df['Percentage'], kde=True, bins=10, color='skyblue')
    plt.title('Overall Percentage Distribution', fontsize=14)
    plt.xlabel('Percentage (%)')
    plt.ylabel('Number of Students')
    plt.tight_layout()
    hist_path = os.path.join(output_dir, 'percentage_distribution.png')
    plt.savefig(hist_path)
    plt.close()
    saved_files['percentage_distribution'] = hist_path

    # 5. Donut Chart -> Pass/Fail Ratio
    plt.figure(figsize=(6, 6))
    status_counts = df['Status'].value_counts()
    plt.pie(status_counts, labels=status_counts.index, autopct='%1.1f%%', startangle=90, colors=['#4CAF50', '#F44336'], wedgeprops={'width': 0.4})
    plt.title('Pass vs Fail Ratio', fontsize=14)
    plt.tight_layout()
    donut_path = os.path.join(output_dir, 'pass_fail_ratio.png')
    plt.savefig(donut_path)
    plt.close()
    saved_files['pass_fail_ratio'] = donut_path

    # 6. Boxplot -> Section Performance
    if 'Section' in df.columns:
        plt.figure(figsize=(8, 5))
        sns.boxplot(x='Section', y='Percentage', data=df, palette='Set2')
        plt.title('Performance Distribution by Section', fontsize=14)
        plt.ylabel('Percentage (%)')
        plt.tight_layout()
        box_path = os.path.join(output_dir, 'section_performance.png')
        plt.savefig(box_path)
        plt.close()
        saved_files['section_performance'] = box_path

    return saved_files

def generate_pdf_report(df, insights, graphs, output_filepath='data/Class_Performance_Report.pdf'):
    """Generates a PDF report using ReportLab."""
    doc = SimpleDocTemplate(output_filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = styles['Title']
    heading_style = styles['Heading2']
    normal_style = styles['Normal']
    
    insight_style = ParagraphStyle(
        'InsightStyle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.darkblue,
        spaceAfter=10
    )
    
    story = []
    
    # Title
    story.append(Paragraph("Student Performance & Analysis Report", title_style))
    story.append(Spacer(1, 12))
    
    # Overview
    story.append(Paragraph("1. Executive Summary", heading_style))
    story.append(Paragraph(f"This report provides an analysis of student performance for a class of {insights['total_students']} students.", normal_style))
    story.append(Spacer(1, 12))
    
    # Insights
    story.append(Paragraph("2. Key Insights", heading_style))
    for statement in insights['statements']:
        story.append(Paragraph(f"• {statement}", insight_style))
    story.append(Spacer(1, 12))
    
    # Top Performers Table
    story.append(Paragraph("3. Top 5 Performers", heading_style))
    table_data = [['Rank', 'Student Name', 'Percentage']]
    for student in insights['top_5']:
        table_data.append([str(int(student['Rank'])), student['Student_Name'], f"{student['Percentage']:.2f}%"])
        
    t = Table(table_data, colWidths=[50, 150, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(t)
    story.append(Spacer(1, 20))
    
    # Visualizations
    story.append(Paragraph("4. Visual Analysis", heading_style))
    
    story.append(Paragraph("Subject Performance:", normal_style))
    story.append(Image(graphs['subject_averages'], width=400, height=250))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Grade Distribution:", normal_style))
    story.append(Image(graphs['grade_distribution'], width=300, height=300))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Pass/Fail Ratio:", normal_style))
    story.append(Image(graphs['pass_fail_ratio'], width=300, height=300))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Overall Percentage Distribution:", normal_style))
    story.append(Image(graphs['percentage_distribution'], width=400, height=250))
    story.append(Spacer(1, 12))
    
    if 'section_performance' in graphs:
        story.append(Paragraph("Section Performance:", normal_style))
        story.append(Image(graphs['section_performance'], width=400, height=250))
        story.append(Spacer(1, 12))
        
    story.append(Paragraph("Attendance Correlation:", normal_style))
    story.append(Image(graphs['attendance_vs_performance'], width=400, height=250))
    
    # Build PDF
    doc.build(story)
    print(f"PDF report generated successfully at {output_filepath}")
    return output_filepath
