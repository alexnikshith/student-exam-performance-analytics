import streamlit as st
import pandas as pd
import os
import base64

from src.analysis import load_and_clean_data, calculate_student_metrics, get_class_insights
from src.report import generate_visualizations, generate_pdf_report

# Configure Streamlit page
st.set_page_config(
    page_title="EduAnalytics Pro",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- CSS Styling for Advanced UI ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    .main {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .metric-card {
        background-color: rgba(255, 255, 255, 0.9);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        text-align: center;
        transition: transform 0.3s ease;
        border-top: 4px solid #4facfe;
    }
    .metric-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 25px rgba(0,0,0,0.1);
    }
    .metric-val {
        font-size: 2.5rem;
        font-weight: 800;
        background: -webkit-linear-gradient(#4facfe, #00f2fe);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .metric-title {
        font-size: 1.1rem;
        color: #555;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .insight-box {
        background-color: white;
        padding: 20px;
        border-left: 6px solid #4facfe;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        font-size: 1.1rem;
        color: #333;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 24px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        white-space: pre-wrap;
        background-color: transparent;
        border-radius: 4px 4px 0 0;
        gap: 1px;
        padding-top: 10px;
        padding-bottom: 10px;
        font-weight: 600;
        font-size: 1.2rem;
    }
    </style>
""", unsafe_allow_html=True)

def load_raw_data(data_source):
    if hasattr(data_source, "seek"):
        data_source.seek(0)
    return load_and_clean_data(data_source)

@st.cache_data
def process_data(df):
    df = calculate_student_metrics(df.copy())
    insights = get_class_insights(df)
    return df, insights

def main():
    # Sidebar
    with st.sidebar:
        st.image("https://cdn-icons-png.flaticon.com/512/3135/3135810.png", width=80)
        st.title("EduAnalytics Pro")
        st.markdown("Upload your class data to instantly generate AI-driven insights, beautiful visual reports, and professional PDF exports.")
        
        st.markdown("---")
        st.subheader("📁 Data Source")
        uploaded_file = st.file_uploader("Upload CSV File", type=['csv'])
        
        use_sample = False
        if not uploaded_file:
            st.info("No file uploaded. You can use the sample dataset to explore features.")
            if st.button("Use Sample Dataset", type="primary"):
                use_sample = True

    # Main Title
    st.markdown("<h1 style='text-align: center; color: #333; margin-bottom: 30px;'>🎓 Student Marks Analytics Dashboard</h1>", unsafe_allow_html=True)

    data_source = None
    if uploaded_file is not None:
        data_source = uploaded_file
    elif use_sample:
        data_source = 'data/student_marks.csv'
        if not os.path.exists(data_source):
            st.error("Sample dataset not found. Please run `generate_data.py` first.")
            return

    if data_source is None:
        st.markdown("<div style='text-align:center; margin-top: 100px; color: #666;'><h3>👈 Please upload a CSV file or select 'Use Sample Dataset' from the sidebar to begin.</h3></div>", unsafe_allow_html=True)
        return

    # Process Data
    with st.spinner("Crunching numbers and generating insights..."):
        try:
            raw_df = load_raw_data(data_source)
            df, insights = process_data(raw_df)
            # Regenerate graphs each time to avoid state issues with matplotlib
            graphs = generate_visualizations(df, insights)
            st.success("Data processed successfully! ✨")
        except Exception as e:
            st.error(f"Error processing data: {str(e)}")
            st.info("Please upload a CSV containing numerical columns for analysis.")
            return
    
    # --- Top KPIs ---
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f'<div class="metric-card"><div class="metric-title">Total Students</div><div class="metric-val">{insights["total_students"]}</div></div>', unsafe_allow_html=True)
    with col2:
        st.markdown(f'<div class="metric-card"><div class="metric-title">Class Average</div><div class="metric-val">{insights["overall_average"]:.1f}%</div></div>', unsafe_allow_html=True)
    with col3:
        st.markdown(f'<div class="metric-card"><div class="metric-title">Pass Rate</div><div class="metric-val">{insights["pass_percentage"]:.1f}%</div></div>', unsafe_allow_html=True)
    with col4:
        st.markdown(f'<div class="metric-card"><div class="metric-title">Top Performer</div><div class="metric-val" style="font-size: 1.8rem; padding-top:10px;">{insights["top_student"]}</div></div>', unsafe_allow_html=True)
        
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    # --- Layout into tabs ---
    tab1, tab2, tab3 = st.tabs(["💡 AI Insights & Analytics", "📈 Advanced Visualizations", "📁 Data Explorer"])
    
    with tab1:
        col_ins1, col_ins2 = st.columns([1.5, 1])
        
        with col_ins1:
            st.subheader("🧠 Automated Insights")
            for statement in insights['statements']:
                st.markdown(f'<div class="insight-box">{statement}</div>', unsafe_allow_html=True)
                
        with col_ins2:
            st.subheader("🏆 Top 5 Students")
            top5_df = pd.DataFrame(insights['top_5'])
            st.dataframe(top5_df, use_container_width=True, hide_index=True)
            
            st.subheader("⚠️ Action Required")
            at_risk_df = pd.DataFrame(insights['at_risk_students'])
            if not at_risk_df.empty:
                st.error(f"{len(at_risk_df)} students are at risk.")
                st.dataframe(at_risk_df, use_container_width=True, hide_index=True)
            else:
                st.success("No students are currently at risk!")

    with tab2:
        st.subheader("Performance Distributions")
        col_c1, col_c2 = st.columns(2)
        
        with col_c1:
            st.image(graphs['percentage_distribution'], use_container_width=True, caption="Overall Mark Distribution")
            st.image(graphs['subject_averages'], use_container_width=True, caption="Average Marks per Subject")
            if 'section_performance' in graphs:
                st.image(graphs['section_performance'], use_container_width=True, caption="Performance by Section")
            
        with col_c2:
            col_c2_1, col_c2_2 = st.columns(2)
            with col_c2_1:
                st.image(graphs['pass_fail_ratio'], use_container_width=True, caption="Pass/Fail Ratio")
            with col_c2_2:
                st.image(graphs['grade_distribution'], use_container_width=True, caption="Grade Breakdown")
            
            st.image(graphs['attendance_vs_performance'], use_container_width=True, caption="Correlation: Attendance vs Performance")

    with tab3:
        st.subheader("Processed Dataset")
        
        # Add some filtering capabilities
        col_f1, col_f2 = st.columns(2)
        with col_f1:
            status_filter = st.multiselect("Filter by Status", options=["Pass", "Fail"], default=["Pass", "Fail"])
        with col_f2:
            grade_filter = st.multiselect("Filter by Grade", options=df['Grade'].unique(), default=df['Grade'].unique())
            
        filtered_df = df[(df['Status'].isin(status_filter)) & (df['Grade'].isin(grade_filter))]
        
        st.dataframe(filtered_df, use_container_width=True)
        
        csv = filtered_df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="Download Filtered Data as CSV",
            data=csv,
            file_name='filtered_student_marks.csv',
            mime='text/csv',
        )

    st.markdown("---")
    
    # --- PDF Report Generation ---
    st.subheader("📄 Generate Professional Report")
    st.markdown("Export all insights, metrics, and visual analytics into a clean, print-ready PDF document.")
    
    if st.button("🚀 Generate PDF Report", type="primary", use_container_width=True):
        with st.spinner("Compiling report..."):
            pdf_path = generate_pdf_report(df, insights, graphs)
            
            with open(pdf_path, "rb") as pdf_file:
                PDFbyte = pdf_file.read()

            st.download_button(
                label="📥 Download Your PDF Report Now",
                data=PDFbyte,
                file_name="EduAnalytics_Performance_Report.pdf",
                mime='application/octet-stream',
                use_container_width=True
            )

if __name__ == "__main__":
    main()
