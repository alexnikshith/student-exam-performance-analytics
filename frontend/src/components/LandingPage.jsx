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
  CheckCircle2, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Trophy, 
  Target, 
  ChevronDown, 
  Eye, 
  FileText,
  HeartHandshake,
  Sparkles,
  Award,
  BookOpen,
  Clock,
  Lock,
  Check
} from 'lucide-react';

export default function LandingPage({ onStartUpload, onUseSample, onLaunchPortal, fileInputRef, handleFileUpload, loading, error }) {
  const [activeTab, setActiveTab] = useState('class');
  const [openFaq, setOpenFaq] = useState(0);

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
      q: "Can I upload my existing marksheets without renaming columns?",
      a: "Yes! EduAnalytics automatically detects common column titles like Roll No, Student Name, Total Marks, Internal Marks, and Subject Names. You don't need to reformat your CSV file."
    },
    {
      q: "Is student data safe and private?",
      a: "Absolutely. All data processing and analytics run 100% inside your web browser. No student records, names, or scores are saved to external servers or sold."
    },
    {
      q: "How do I print individual student report cards?",
      a: "Once your data is loaded, navigate to the 'Student Profile' tab, select any student, and click 'Print Report Card'. It renders a clean, single-page PDF formatted for printing or parent meetings."
    },
    {
      q: "What if I just want to test how it works first?",
      a: "Click 'Try Sample Dataset' anywhere on this page! It immediately loads a pre-filled class dataset with 30 students, 4 subjects, attendance data, and generated remarks so you can test every feature."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#8C1D40] selection:text-white">
      
      {/* HUMAN & ELEGANT TOP BAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-[#8C1D40] flex items-center justify-center text-white shadow-md shadow-[#8C1D40]/15">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                EduAnalytics
                <span className="text-[11px] font-semibold bg-rose-100 text-[#8C1D40] px-2 py-0.5 rounded-full">Portal</span>
              </span>
              <p className="text-[11px] text-stone-500 font-normal leading-none hidden sm:block">Academic Performance Insights</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button onClick={() => scrollToSection('why-eduanalytics')} className="hover:text-[#8C1D40] transition-colors cursor-pointer">Why EduAnalytics</button>
            <button onClick={() => scrollToSection('live-preview')} className="hover:text-[#8C1D40] transition-colors cursor-pointer">Interactive Preview</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#8C1D40] transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-[#8C1D40] transition-colors cursor-pointer">FAQ</button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onUseSample}
              className="px-4 py-2 text-sm font-medium text-[#8C1D40] bg-rose-50 hover:bg-rose-100/80 rounded-lg border border-rose-200/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-[#8C1D40]" />
              <span className="hidden sm:inline">Try Demo Data</span>
            </button>
            <button 
              onClick={() => scrollToSection('upload-section')}
              className="px-5 py-2 text-sm font-medium text-white bg-[#8C1D40] hover:bg-[#731433] rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload CSV</span>
            </button>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        
        {/* Warm Background Flourish */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-100/40 via-amber-50/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Natural Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-medium text-stone-600 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Created for Teachers, Professors & Academic Department Heads</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-slate-900 tracking-tight leading-[1.18] font-bold">
            Stop wrestling with exam marksheets. <br />
            <span className="text-[#8C1D40] italic font-normal">Get instant class insights in seconds.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto font-normal leading-relaxed">
            EduAnalytics converts your raw CSV student marks into clear grade distributions, subject deep-dives, student radar profiles, and parent-ready PDF report cards.
          </p>

          {/* Main Hero Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => scrollToSection('upload-section')}
              className="w-full sm:w-auto px-8 py-4 bg-[#8C1D40] hover:bg-[#731433] text-white text-base font-semibold rounded-xl shadow-md transition-all hover:translate-y-[-1px] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Upload Class CSV</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onUseSample}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 text-slate-800 text-base font-semibold rounded-xl border border-stone-200 shadow-2xs transition-all hover:translate-y-[-1px] flex items-center justify-center gap-3 cursor-pointer text-[#8C1D40]"
            >
              <PlayCircle className="w-5 h-5 text-[#8C1D40]" />
              <span>Try Sample Dataset</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-stone-500">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>100% Private (Runs in Browser)</span>
            </div>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Zero Setup Needed</span>
            </div>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#8C1D40]" />
              <span>One-Click Printable PDF Cards</span>
            </div>
          </div>

        </div>

        {/* INTERACTIVE PREVIEW CONTAINER */}
        <div id="live-preview" className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
            
            {/* Top Interactive Tab Strip */}
            <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Interactive Preview:</span>
                <div className="flex bg-stone-200/60 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab('class')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${activeTab === 'class' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600 hover:text-slate-900'}`}
                  >
                    Class Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('subject')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${activeTab === 'subject' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600 hover:text-slate-900'}`}
                  >
                    Subject Deep-Dive
                  </button>
                  <button 
                    onClick={() => setActiveTab('student')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${activeTab === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600 hover:text-slate-900'}`}
                  >
                    Student Profile Card
                  </button>
                </div>
              </div>

              <button 
                onClick={onUseSample} 
                className="px-4 py-1.5 bg-[#8C1D40] hover:bg-[#731433] text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Open Full Interactive Portal
              </button>
            </div>

            {/* Tab Content Display */}
            <div className="p-6 sm:p-8">
              
              {activeTab === 'class' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                      <p className="text-xs text-stone-500 font-semibold uppercase">Total Students</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">30</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                      <p className="text-xs text-stone-500 font-semibold uppercase">Class Average</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">78.4%</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                      <p className="text-xs text-stone-500 font-semibold uppercase">Pass Percentage</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">93.3%</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 border-l-4 border-l-[#8C1D40]">
                      <p className="text-xs text-stone-500 font-semibold uppercase">Top Student</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">Alex Chen (94%)</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Class Insight Highlights</span>
                      <h4 className="text-lg font-bold mt-1">Strong correlations found between attendance & final percentage</h4>
                      <p className="text-stone-300 text-sm mt-2 max-w-xl">
                        Students with attendance above 85% scored an average of 14% higher overall across Mathematics and Physics.
                      </p>
                    </div>
                    <button onClick={onUseSample} className="px-5 py-2.5 bg-[#8C1D40] hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer">
                      Explore Full Dashboard →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'subject' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between bg-rose-50/60 p-4 rounded-xl border border-rose-100">
                    <div>
                      <h4 className="text-base font-bold text-[#8C1D40]">Mathematics (Term 2)</h4>
                      <p className="text-xs text-stone-600 mt-0.5">Subject Average: 82.1% • Pass Rate: 96.6% • Highest Score: 98%</p>
                    </div>
                    <span className="text-xs font-bold bg-[#8C1D40] text-white px-3 py-1 rounded-full">Top Performer: Alex Chen</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                      <h5 className="text-sm font-bold text-slate-800 mb-3">Score Distribution Breakdown</h5>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span>90% - 100% (Grade A+)</span>
                          <span className="font-bold text-[#8C1D40]">8 students</span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#8C1D40] h-full" style={{ width: '40%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span>80% - 89% (Grade A)</span>
                          <span className="font-bold text-slate-700">12 students</span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-rose-400 h-full" style={{ width: '60%' }}></div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span>70% - 79% (Grade B)</span>
                          <span className="font-bold text-slate-700">7 students</span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 flex flex-col justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-slate-800 mb-2">Subject Toppers Leaderboard</h5>
                        <ol className="text-xs space-y-2 mt-3 font-medium text-slate-700">
                          <li className="flex justify-between border-b border-stone-200 pb-1.5">
                            <span>1. Alex Chen</span>
                            <span className="font-bold text-[#8C1D40]">98/100</span>
                          </li>
                          <li className="flex justify-between border-b border-stone-200 pb-1.5">
                            <span>2. Priya Sharma</span>
                            <span className="font-bold">95/100</span>
                          </li>
                          <li className="flex justify-between border-b border-stone-200 pb-1.5">
                            <span>3. Rahul Verma</span>
                            <span className="font-bold">92/100</span>
                          </li>
                        </ol>
                      </div>
                      <button onClick={onUseSample} className="mt-4 text-xs font-semibold text-[#8C1D40] underline text-left cursor-pointer">
                        See all subject leaderboards →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'student' && (
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-stone-200 mb-4 gap-2">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Alex Chen (Roll No: 24089)</h4>
                      <p className="text-xs text-stone-500">Section A • Attendance: 96% • Overall Rank: #1</p>
                    </div>
                    <button onClick={onUseSample} className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
                      <Printer className="w-3.5 h-3.5" /> Print Single-Page Report Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div>
                      <h5 className="font-bold text-slate-800 mb-2">Subject Score Profile</h5>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-stone-300 text-stone-500">
                            <th className="py-1">Subject</th>
                            <th className="py-1">Score</th>
                            <th className="py-1">Class Avg</th>
                            <th className="py-1">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          <tr><td className="py-1.5 font-medium">Mathematics</td><td>98/100</td><td>82.1%</td><td className="font-bold text-emerald-600">A+</td></tr>
                          <tr><td className="py-1.5 font-medium">Physics</td><td>94/100</td><td>76.4%</td><td className="font-bold text-emerald-600">A+</td></tr>
                          <tr><td className="py-1.5 font-medium">Chemistry</td><td>89/100</td><td>72.0%</td><td className="font-bold text-emerald-600">A</td></tr>
                          <tr><td className="py-1.5 font-medium">English</td><td>92/100</td><td>81.5%</td><td className="font-bold text-emerald-600">A+</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-stone-200">
                      <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4 text-[#8C1D40]" /> Teacher Remarks & AI Feedback
                      </h5>
                      <p className="text-stone-600 text-xs italic leading-relaxed mt-2">
                        "Alex displays exemplary understanding in quantitative reasoning and analytical physics. Maintains consistent top-tier attendance and academic performance."
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </section>

      {/* WHY EDUANALYTICS - HUMAN VALUE PROPOSITION */}
      <section id="why-eduanalytics" className="py-20 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C1D40]">Designed for Educators</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              Everything you need after grading exams
            </h2>
            <p className="mt-3 text-stone-600 text-base">
              Created to save teachers hours of repetitive formatting and data entry work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Value 1 */}
            <div className="bg-[#FAFAF8] p-8 rounded-2xl border border-stone-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-[#8C1D40] flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart CSV Auto-Detection</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Import any standard class marks spreadsheet. EduAnalytics automatically recognizes Roll Numbers, Student Names, Internal, External, and Total marks without manual reformatting.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-[#FAFAF8] p-8 rounded-2xl border border-stone-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Radar Profiles</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Understand each student's holistic multi-subject strengths and growth areas visually compared against class averages for meaningful parent-teacher discussions.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-[#FAFAF8] p-8 rounded-2xl border border-stone-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Parent-Ready PDF Cards</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Generate single-page, professional PDF student performance report cards with 1-click ready to print or distribute immediately.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#FAFAF8] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C1D40]">Simple 3-Step Process</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-2">How teachers use EduAnalytics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 relative">
              <span className="text-4xl font-extrabold text-rose-200">01</span>
              <h4 className="text-lg font-bold text-slate-900 mt-2 mb-2">Upload Marksheet CSV</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Drag in your existing class spreadsheet or click 'Try Sample Dataset' to explore instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 relative">
              <span className="text-4xl font-extrabold text-rose-200">02</span>
              <h4 className="text-lg font-bold text-slate-900 mt-2 mb-2">Review Visual Analytics</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Inspect overall class pass rates, subject histograms, attendance scatter plots, and toppers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 relative">
              <span className="text-4xl font-extrabold text-rose-200">03</span>
              <h4 className="text-lg font-bold text-slate-900 mt-2 mb-2">Print & Export</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Export clean updated CSV datasets or print single-page PDF report cards for students and parents.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* UPLOAD WIDGET SECTION */}
      <section id="upload-section" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="bg-[#FAFAF8] p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-[#8C1D40] flex items-center justify-center mx-auto mb-6">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-3">Upload your class data</h3>
            <p className="text-stone-600 text-sm max-w-lg mx-auto mb-8">
              Select your class marks CSV file to instantly generate analytics and student report cards.
            </p>

            {/* Dropzone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white border-2 border-dashed border-stone-300 hover:border-[#8C1D40] hover:bg-rose-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group shadow-2xs"
            >
              <UploadCloud className="w-10 h-10 text-stone-400 group-hover:text-[#8C1D40] mb-3 transition-colors" />
              <p className="text-base font-semibold text-slate-800 mb-1">
                Click to choose your CSV file or drag & drop here
              </p>
              <p className="text-xs text-stone-400">Supports standard CSV spreadsheets containing student marks</p>
              <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </div>

            {loading && <p className="mt-4 text-[#8C1D40] font-semibold animate-pulse">Processing CSV data...</p>}
            {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px bg-stone-200 flex-1" />
              <span className="text-xs font-bold text-stone-400 uppercase">OR</span>
              <div className="h-px bg-stone-200 flex-1" />
            </div>

            <div className="mt-6">
              <button
                onClick={onUseSample}
                className="px-6 py-3 bg-[#8C1D40] hover:bg-[#731433] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Test with Demo Class Dataset</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-[#FAFAF8] border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C1D40]">Got Questions?</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-slate-800 text-base hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#8C1D40]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-stone-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8C1D40] flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">EduAnalytics Portal</span>
          </div>

          <p className="text-xs text-stone-400 text-center md:text-left">
            Built for educators to easily transform exam data into meaningful student report cards.
          </p>

          <div className="flex items-center gap-6 text-xs font-medium text-stone-300">
            <button onClick={onUseSample} className="hover:text-white transition-colors cursor-pointer">Sample Demo</button>
            <button onClick={() => scrollToSection('upload-section')} className="hover:text-white transition-colors cursor-pointer">Upload CSV</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">FAQ</button>
          </div>

        </div>
      </footer>

    </div>
  );
}
