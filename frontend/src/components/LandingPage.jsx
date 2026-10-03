import React, { useState } from 'react';
import { 
  GraduationCap, 
  UploadCloud, 
  PlayCircle, 
  BarChart2, 
  BrainCircuit, 
  FileSpreadsheet, 
  Printer, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Trophy, 
  Sparkles, 
  Target, 
  ChevronDown, 
  HelpCircle,
  Eye,
  FileText
} from 'lucide-react';

export default function LandingPage({ onStartUpload, onUseSample, onLaunchPortal, fileInputRef, handleFileUpload, loading, error }) {
  const [activePreviewTab, setActivePreviewTab] = useState('class');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: "Do I need to format or clean my CSV file before uploading?",
      a: "No! EduAnalytics includes an intelligent column detection engine that automatically recognizes student identifiers (Student ID, Roll No, Name) and subject marks (Internal, External, Total) regardless of slight naming variations."
    },
    {
      q: "Is my student data uploaded or stored on remote servers?",
      a: "Data privacy is our top priority. All core statistical calculations and data parsing take place directly inside your browser. No sensitive student identity records are permanently stored."
    },
    {
      q: "How does the AI Student Remarks feature work?",
      a: "Our system analyzes each student's multi-subject score profile, overall percentage, and attendance record, passing anonymously calculated metrics to Groq LPU for fast, constructive feedback."
    },
    {
      q: "Can I export data or print individual student report cards?",
      a: "Yes! You can export augmented CSV files containing overall ranks, percentages, and statuses, or print polished, single-page PDF report cards with 1-click."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans selection:bg-[#9b1c31] selection:text-white">
      
      {/* ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-[#7a1526] via-[#9b1c31] to-[#b8233d] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
        <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> New Release
        </span>
        <span>EduAnalytics v2.0: AI-Powered Academic Performance Engine</span>
        <button 
          onClick={onUseSample}
          className="underline hover:text-rose-200 font-semibold ml-2 inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          Try Demo Dataset <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9b1c31] to-[#7a1526] flex items-center justify-center text-white shadow-md shadow-[#9b1c31]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-1">
                EduAnalytics <span className="text-xs bg-rose-100 text-[#9b1c31] font-semibold px-2 py-0.5 rounded-full">Pro</span>
              </span>
              <p className="text-[11px] text-gray-400 font-medium leading-none hidden sm:block">Institutional Performance Portal</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#9b1c31] transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('preview')} className="hover:text-[#9b1c31] transition-colors cursor-pointer">Interactive Suite</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#9b1c31] transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('upload-section')} className="hover:text-[#9b1c31] transition-colors cursor-pointer">Upload CSV</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-[#9b1c31] transition-colors cursor-pointer">FAQ</button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onUseSample}
              className="px-4 py-2 text-sm font-medium text-[#9b1c31] bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <PlayCircle className="w-4 h-4 text-[#9b1c31]" />
              <span className="hidden sm:inline">Try Demo</span>
            </button>
            <button 
              onClick={() => scrollToSection('upload-section')}
              className="px-5 py-2 text-sm font-medium text-white bg-[#9b1c31] hover:bg-[#801426] rounded-lg shadow-md shadow-[#9b1c31]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Data</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-100/60 via-rose-50/30 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-100/40 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-xs text-xs font-semibold text-gray-700 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
            <span className="text-[#9b1c31] font-bold">Academic Data Intelligence</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">For Educators & Institution Deans</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Transform Raw Marks into <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#9b1c31] via-[#c02643] to-[#7a1526] bg-clip-text text-transparent">
              Actionable Academic Insights
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed">
            EduAnalytics elevates student performance tracking with macroscopic class analytics, subject deep-dives, 360° radar skill profiles, and real-time AI remarks.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => scrollToSection('upload-section')}
              className="w-full sm:w-auto px-8 py-4 bg-[#9b1c31] hover:bg-[#801426] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#9b1c31]/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <UploadCloud className="w-5 h-5 group-hover:bounce" />
              <span>Upload CSV Dataset</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onUseSample}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 text-base font-semibold rounded-xl border border-gray-200 shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer text-[#9b1c31]"
            >
              <PlayCircle className="w-5 h-5 text-[#9b1c31]" />
              <span>Explore Demo Data</span>
            </button>
          </div>

          {/* Key Trust Pill Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-100 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side Privacy</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-100 shadow-2xs">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>6+ Dynamic Visualizers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-100 shadow-2xs">
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              <span>Groq LPU Instant Remarks</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-100 shadow-2xs">
              <Printer className="w-4 h-4 text-rose-600" />
              <span>1-Click PDF Report Cards</span>
            </div>
          </div>
        </div>

        {/* HERO DASHBOARD MOCKUP PREVIEW */}
        <div id="preview" className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-gray-900 via-gray-900 to-slate-900 shadow-2xl border border-gray-800 overflow-hidden group">
            
            {/* Top Bar Mockup Control Buttons */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/90">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-gray-400">eduanalytics.app / dashboard-preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onUseSample} 
                  className="px-3 py-1 bg-[#9b1c31] hover:bg-rose-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> Launch Interactive View
                </button>
              </div>
            </div>

            {/* Mockup Display */}
            <div className="relative overflow-hidden rounded-xl bg-gray-950">
              <img 
                src="/dashboard_preview.jpg" 
                alt="EduAnalytics Dashboard Preview" 
                className="w-full h-auto object-cover rounded-xl transform transition-transform duration-700 group-hover:scale-[1.01]"
              />

              {/* Floating Overlay Badge 1 */}
              <div className="absolute top-6 left-6 hidden sm:flex items-center gap-3 bg-gray-900/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-lg text-white animate-pulse">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Class Pass Rate</p>
                  <p className="text-lg font-bold text-emerald-400">92.4% <span className="text-xs text-gray-400 font-normal">(+4.8%)</span></p>
                </div>
              </div>

              {/* Floating Overlay Badge 2 */}
              <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-3 bg-gray-900/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-lg text-white">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Groq AI Feedback</p>
                  <p className="text-xs font-medium text-gray-200">"Exemplary math & physics correlation"</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* STATS TICKER STRIP */}
      <section className="bg-white border-y border-gray-100 py-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#9b1c31]">100%</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Automated CSV Column Detection</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#9b1c31]">&lt; 0.2s</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Instant Visual Analytics Render</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#9b1c31]">6 Modules</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Interactive Visual Charts</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#9b1c31]">1-Click</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Parent-Ready PDF Report Printing</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID FEATURES SECTION */}
      <section id="features" className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#9b1c31] mb-2">Comprehensive SaaS Analytics Engine</h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Designed for Educators, Built for Impact</p>
            <p className="mt-4 text-base text-gray-600">Everything you need to analyze, visualize, and report student marks in one unified platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Class Analytics */}
            <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#9b1c31] flex items-center justify-center mb-6">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Macroscopic Class Analytics</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Gain instant clarity over overall class performance with pass/fail distributions, attendance correlation scatter plots, grade histogram binning, and section-by-section averages.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-wrap gap-4 text-xs font-semibold text-gray-700">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#9b1c31]" /> Grade Distribution Bins</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#9b1c31]" /> Attendance vs Score Scatter</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#9b1c31]" /> Section Comparison</span>
              </div>
            </div>

            {/* Feature 2: 360 Radar Profiles */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">360° Student Radar Reports</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Map individual student strengths and weaknesses against the class median across all academic subjects visually.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-medium text-purple-600">
                <span>Multi-Axis Competency Mapping</span>
              </div>
            </div>

            {/* Feature 3: Groq LPU AI Remarks */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Personal Feedback</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Groq LPU integration generates nuanced, personalized remarks for every student highlighting strengths and growth opportunities.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-medium text-amber-600">
                <span>Sub-Second Inference Speed</span>
              </div>
            </div>

            {/* Feature 4: Subject Deep-Dive */}
            <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Subject Deep-Dive & Leaderboards</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Isolate specific subjects to evaluate pass rates, difficulty index, score frequency histograms, and top-performing student leaderboards for subject teachers.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-wrap gap-4 text-xs font-semibold text-gray-700">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Subject-wise Pass Rates</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Top 5 Leaderboard</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Score Bins (0-100%)</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#9b1c31] mb-2">Streamlined Workflow</h2>
            <p className="text-3xl font-bold text-gray-900">4 Simple Steps from Raw Data to Insights</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-100 relative">
              <div className="w-10 h-10 rounded-full bg-[#9b1c31] text-white font-extrabold flex items-center justify-center mb-4 text-lg">
                1
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Import CSV</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Drag and drop your class marks spreadsheet or load our ready-to-use sample dataset.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-100 relative">
              <div className="w-10 h-10 rounded-full bg-[#9b1c31] text-white font-extrabold flex items-center justify-center mb-4 text-lg">
                2
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Auto-Parse</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dynamic detection automatically maps student IDs, names, attendance, and total/internal marks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-100 relative">
              <div className="w-10 h-10 rounded-full bg-[#9b1c31] text-white font-extrabold flex items-center justify-center mb-4 text-lg">
                3
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Explore Charts</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Analyze class-wide pass rates, subject histograms, section averages, and student radar charts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-100 relative">
              <div className="w-10 h-10 rounded-full bg-[#9b1c31] text-white font-extrabold flex items-center justify-center mb-4 text-lg">
                4
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Print & Export</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Generate single-page student PDF report cards with 1-click or export updated CSV datasets.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* UPLOAD & DEMO INTERACTIVE WIDGET SECTION */}
      <section id="upload-section" className="py-20 bg-gradient-to-b from-[#f8fafc] via-rose-50/40 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-200/80">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#9b1c31] flex items-center justify-center mx-auto mb-6">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Ready to Analyze Your Data?</h2>
            <p className="text-gray-600 text-sm max-w-lg mx-auto mb-8">
              Upload your student CSV file below to instantly generate full analytics and individual report cards.
            </p>

            {/* Dropzone Container */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-50 border-2 border-dashed border-gray-300 hover:border-[#9b1c31] hover:bg-rose-50/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group shadow-inner"
            >
              <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-[#9b1c31] mb-3 transition-colors group-hover:scale-110" />
              <p className="text-base font-semibold text-gray-800 mb-1">
                Click to browse or drag & drop CSV file here
              </p>
              <p className="text-xs text-gray-400">Supports standard CSV format with student marks & attendance</p>
              <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </div>

            {loading && <p className="mt-4 text-[#9b1c31] font-semibold animate-pulse">Processing CSV & Calculating Analytics...</p>}
            {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onUseSample}
                className="w-full sm:w-auto px-6 py-3 bg-[#9b1c31] hover:bg-[#801426] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Load Pre-Loaded Sample Data</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#9b1c31] mb-2">Frequently Asked Questions</h2>
            <p className="text-3xl font-bold text-gray-900">Got Questions? We've Got Answers</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-gray-800 text-sm sm:text-base hover:bg-slate-100/60 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#9b1c31]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#9b1c31] flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">EduAnalytics Pro</span>
          </div>

          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} EduAnalytics. Institutional Performance Portal. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs font-medium">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">Features</button>
            <button onClick={onUseSample} className="hover:text-white transition-colors cursor-pointer">Sample Demo</button>
            <button onClick={() => scrollToSection('upload-section')} className="hover:text-white transition-colors cursor-pointer">Upload CSV</button>
          </div>

        </div>
      </footer>

    </div>
  );
}
