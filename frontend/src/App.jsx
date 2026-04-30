import React, { useState, useRef, useMemo, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Database, BarChart2, BrainCircuit, PlayCircle, GraduationCap, Trophy, Users, TrendingUp, CheckCircle, Home, Search, Download, User, ChevronLeft, ChevronRight, BookOpen, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const PrintSafeChart = ({ children, isPrinting }) => {
  if (isPrinting) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        {React.cloneElement(children, { width: 320, height: 220 })}
      </div>
    );
  }
  return <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>;
};

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('data');
  const [hasStarted, setHasStarted] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintingStudent, setIsPrintingStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const ITEMS_PER_PAGE = 25;
  const fileInputRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await processRequest(`${API_BASE}/api/analyze`, formData);
  };

  const handleUseSample = async () => {
    await processRequest(`${API_BASE}/api/analyze-sample`);
  };

  const processRequest = async (url, payload = null) => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = payload ? await axios.post(url, payload) : await axios.post(url);
      setData(res.data);
      if (res.data.df.length > 0) {
        setSelectedStudent(res.data.df[0].Student_Name);
      }
      if (res.data.insights?.subject_averages) {
        setSelectedSubject(Object.keys(res.data.insights.subject_averages)[0]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data || !data.df) return;
    const headers = Object.keys(data.df[0]);
    const csvContent = [
      headers.join(','),
      ...data.df.map(row => headers.map(h => `"${row[h] !== undefined ? row[h] : ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `EduAnalytics_Export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    let filtered = data.df;
    if (filterSection !== 'All') {
      filtered = filtered.filter(r => String(r.Section) === filterSection);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        String(r.Student_Name || '').toLowerCase().includes(lowerSearch) || 
        String(r.Roll_Number || '').toLowerCase().includes(lowerSearch) ||
        String(r.Student_ID || '').toLowerCase().includes(lowerSearch) ||
        String(r.ID || '').toLowerCase().includes(lowerSearch)
      );
    }
    return filtered;
  }, [data, searchTerm, filterSection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const uniqueSections = useMemo(() => {
    if (!data) return [];
    const secs = new Set(data.df.map(r => String(r.Section)).filter(s => s !== 'undefined' && s !== ''));
    return Array.from(secs).sort();
  }, [data]);

  const subjectData = useMemo(() => {
    if (!data || !selectedSubject) return null;
    const colName = `${selectedSubject}_Total`;
    const validRows = data.df.filter(r => r[colName] !== undefined);
    if(validRows.length === 0) return null;

    const maxScore = Math.max(...validRows.map(r => r[colName]));
    const topStudents = validRows.filter(r => r[colName] === maxScore).map(r => r.Student_Name);
    const passThreshold = 40;
    const passed = validRows.filter(r => r[colName] >= passThreshold).length;
    const passRate = (passed / validRows.length) * 100;
    
    const bins = Array(10).fill(0).map((_, i) => ({ range: `${i*10}-${(i+1)*10}%`, count: 0 }));
    validRows.forEach(r => {
        let score = r[colName];
        if (score > 100) score = 100;
        const binIdx = Math.min(Math.floor(score / 10), 9);
        bins[binIdx].count += 1;
    });

    const sorted = [...validRows].sort((a,b) => b[colName] - a[colName]);
    const top5 = sorted.slice(0, 5);

    return { maxScore, topStudents, passRate, avgScore: data.insights.subject_averages[selectedSubject], bins: bins.filter(b => b.count > 0), top5 };
  }, [data, selectedSubject]);

  useEffect(() => {
    const saved = localStorage.getItem('eduAnalytics_state');
    if (saved) {
      try {
        const { data: savedData, hasStarted: savedStarted } = JSON.parse(saved);
        if (savedData) {
          setData(savedData);
          setHasStarted(savedStarted);
          if (savedData.df?.length > 0) {
            setSelectedStudent(savedData.df[0].Student_Name);
          }
          if (savedData.insights?.subject_averages) {
            setSelectedSubject(Object.keys(savedData.insights.subject_averages)[0]);
          }
        }
      } catch (e) {
        console.error("Failed to restore state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('eduAnalytics_state', JSON.stringify({ data, hasStarted }));
    }
  }, [data, hasStarted]);

  useEffect(() => {
    if (isPrinting || isPrintingStudent) {
      const timer = setTimeout(() => {
        window.print();
        setIsPrinting(false);
        setIsPrintingStudent(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPrinting, isPrintingStudent]);

  const chartData = useMemo(() => {
    if (!data) return {};

    const passFailData = [
      { name: 'Pass', value: data.insights.status_counts['Pass'] || 0 },
      { name: 'Fail', value: data.insights.status_counts['Fail'] || 0 },
    ].filter(item => item.value > 0);

    const scatterDataPass = data.df.filter(r => r.Status === 'Pass').map(r => ({ x: r.Attendance_Percentage, y: r.Percentage, name: r.Student_Name }));
    const scatterDataFail = data.df.filter(r => r.Status === 'Fail').map(r => ({ x: r.Attendance_Percentage, y: r.Percentage, name: r.Student_Name }));

    const bins = Array(10).fill(0).map((_, i) => ({ range: `${i*10}-${(i+1)*10}%`, count: 0 }));
    data.df.forEach(row => {
      const p = row.Percentage;
      const binIdx = Math.min(Math.floor(p / 10), 9);
      bins[binIdx].count += 1;
    });

    const sectionData = {};
    data.df.forEach(row => {
      if(row.Section) {
        if(!sectionData[row.Section]) sectionData[row.Section] = { sum: 0, count: 0 };
        sectionData[row.Section].sum += row.Percentage;
        sectionData[row.Section].count += 1;
      }
    });
    const sectionAverages = Object.keys(sectionData).map(sec => ({ name: `Sec ${sec}`, avg: sectionData[sec].sum / sectionData[sec].count }));

    return { passFailData, scatterDataPass, scatterDataFail, bins: bins.filter(b => b.count > 0), sectionAverages };
  }, [data]);

  const COLORS = ['#9b1c31', '#d94b58', '#4285f4', '#fbbc05', '#34a853', '#8e44ad'];
  const STATUS_COLORS = ['#34a853', '#d93025']; 

  return (
    <div className={`min-h-screen bg-[#f4f6f9] font-sans ${isPrinting ? 'print:bg-white print:p-0' : ''}`}>
      
      {/* HEADER - AMRITA STYLE */}
      <header className="bg-[#9b1c31] text-white py-4 px-6 shadow-md print:hidden flex justify-between items-center">
        <h1 className="text-xl font-normal tracking-wide flex items-center">
          <GraduationCap className="mr-3" />
          EduAnalytics
        </h1>
        {data && (
          <button 
            onClick={() => { 
              localStorage.removeItem('eduAnalytics_state');
              setData(null); 
              setHasStarted(true); 
              setActiveTab('data'); 
            }} 
            className="flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4 mr-2" /> Reset & New Analysis
          </button>
        )}
      </header>

      <div className={`p-6 md:p-8 max-w-7xl mx-auto ${isPrinting ? 'print:p-0 print:max-w-none print:w-full' : ''}`}>
        
        {/* LANDING PAGE */}
        {!hasStarted && !data && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 max-w-2xl w-full text-center">
              <GraduationCap className="w-16 h-16 text-[#9b1c31] mx-auto mb-6" />
              <h2 className="text-3xl font-light text-gray-800 mb-4">Welcome to the Analytics Portal</h2>
              <p className="text-gray-500 mb-10">Upload student records to generate detailed performance reports and visualizations.</p>
              
              <button onClick={() => setHasStarted(true)} className="px-8 py-3 bg-[#9b1c31] hover:bg-[#7a1526] text-white rounded font-medium shadow-md transition-colors">
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* UPLOAD SECTION */}
        {hasStarted && !data && (
          <div className="flex flex-col items-center justify-center py-10 animate-fade-in-up max-w-2xl mx-auto">
            <div onClick={() => fileInputRef.current?.click()} className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#9b1c31] hover:bg-gray-50 transition-colors shadow-sm">
              <UploadCloud className="w-12 h-12 text-[#9b1c31] mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">Upload Student Data</h2>
              <p className="text-gray-500 text-sm">Select a CSV file to begin analysis</p>
              <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </div>
            
            <div className="mt-8 flex items-center w-full">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-400 font-medium px-4 text-sm">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <button onClick={handleUseSample} className="mt-8 flex items-center px-6 py-2 bg-white text-[#9b1c31] border border-[#9b1c31] rounded font-medium hover:bg-gray-50 transition-colors">
              <PlayCircle className="mr-2 w-5 h-5" /> Use Demo Data
            </button>
            
            {loading && <p className="mt-6 text-[#9b1c31] font-medium animate-pulse">Processing file...</p>}
            {error && <p className="mt-6 text-red-500 font-medium">{error}</p>}
          </div>
        )}

        {/* DASHBOARD */}
        {data && (
          <div className={`animate-fade-in-up ${isPrinting ? 'print:block' : 'space-y-6'}`}>
            
            {/* HIGHLIGHTS SECTION (Permanently Visible) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-center">
                <div className="p-3 bg-blue-100 text-blue-600 rounded mr-4"><Users size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">{data.insights.total_students}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-center">
                <div className="p-3 bg-purple-100 text-purple-600 rounded mr-4"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Class Average</p>
                  <p className="text-2xl font-bold text-gray-800">{data.insights.overall_average.toFixed(1)}%</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-center">
                <div className="p-3 bg-green-100 text-green-600 rounded mr-4"><CheckCircle size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-800">{data.insights.pass_percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-center border-l-4 border-l-[#9b1c31]">
                <div className="p-3 bg-rose-100 text-[#9b1c31] rounded mr-4"><Trophy size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Top Performer</p>
                  <p className="text-xl font-bold text-gray-800 truncate max-w-[120px]">{data.insights.top_student}</p>
                </div>
              </div>
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex bg-white shadow-sm border-b border-gray-200 print:hidden overflow-x-auto items-center">
              <button onClick={() => setActiveTab('data')} className={`py-4 px-6 font-medium text-sm transition-all border-b-2 flex items-center whitespace-nowrap ${activeTab === 'data' ? 'border-[#9b1c31] text-[#9b1c31]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Database className="mr-2 w-4 h-4" /> Academic Marks
              </button>
              <button onClick={() => setActiveTab('student')} className={`py-4 px-6 font-medium text-sm transition-all border-b-2 flex items-center whitespace-nowrap ${activeTab === 'student' ? 'border-[#9b1c31] text-[#9b1c31]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <User className="mr-2 w-4 h-4" /> Student Profile
              </button>
              <button onClick={() => setActiveTab('subject')} className={`py-4 px-6 font-medium text-sm transition-all border-b-2 flex items-center whitespace-nowrap ${activeTab === 'subject' ? 'border-[#9b1c31] text-[#9b1c31]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <BookOpen className="mr-2 w-4 h-4" /> Subject Analysis
              </button>
              <button onClick={() => setActiveTab('insights')} className={`py-4 px-6 font-medium text-sm transition-all border-b-2 flex items-center whitespace-nowrap ${activeTab === 'insights' ? 'border-[#9b1c31] text-[#9b1c31]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <BrainCircuit className="mr-2 w-4 h-4" /> AI Insights
              </button>
              <button onClick={() => setActiveTab('visuals')} className={`py-4 px-6 font-medium text-sm transition-all border-b-2 flex items-center whitespace-nowrap ${activeTab === 'visuals' ? 'border-[#9b1c31] text-[#9b1c31]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <BarChart2 className="mr-2 w-4 h-4" /> Analytics
              </button>
              <div className="ml-auto py-3 px-4 flex space-x-3">
                <button onClick={handleExportCSV} className="px-4 py-1.5 bg-white border border-[#9b1c31] text-[#9b1c31] rounded text-sm shadow-sm hover:bg-gray-50 transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </button>
                <button onClick={() => setIsPrinting(true)} className="px-4 py-1.5 bg-[#9b1c31] text-white rounded text-sm shadow-sm hover:bg-[#7a1526] transition-colors">
                  Print Class Report
                </button>
              </div>
            </div>

            {/* PRINT HEADER: FORMAL LETTERHEAD (Class Report) */}
            {isPrinting && !isPrintingStudent && (
              <div className="hidden print:block w-full border border-black p-8 mb-8" style={{ boxSizing: 'border-box' }}>
                <div className="text-center border-b border-black pb-4 mb-6">
                  <h1 className="text-3xl font-serif text-[#9b1c31] tracking-wide mb-2" style={{ fontFamily: 'Georgia, serif' }}>ANALYTICS PORTAL</h1>
                  <p className="text-sm font-bold text-gray-800 mb-2">OFFICIAL STUDENT PERFORMANCE REPORT</p>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <p><strong>Report ID : </strong> REP-{new Date().getFullYear()}-{(Math.random()*10000).toFixed(0).padStart(4, '0')}</p>
                  <p><strong>Date : </strong> {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-sm mb-8 border border-black p-4">
                  <p className="mb-2"><strong>Total Students Evaluated:</strong> {data.insights.total_students}</p>
                  <p className="mb-2"><strong>Overall Class Average:</strong> {data.insights.overall_average.toFixed(1)}%</p>
                  <p><strong>Overall Pass Rate:</strong> {data.insights.pass_percentage.toFixed(1)}%</p>
                </div>
              </div>
            )}

            {/* TAB: DATA (MARKS TABLE) */}
            {activeTab === 'data' && !isPrinting && !isPrintingStudent && (
              <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden print:hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg text-gray-700 font-medium">Student Marks Evaluation</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search student..." 
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#9b1c31]"
                      />
                    </div>
                    {uniqueSections.length > 0 && (
                      <select 
                        value={filterSection} 
                        onChange={(e) => { setFilterSection(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#9b1c31] bg-white"
                      >
                        <option value="All">All Sections</option>
                        {uniqueSections.map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#4285f4] text-white font-normal">
                        {data.df.length > 0 && Object.keys(data.df[0]).filter(k => !['Status'].includes(k)).map((col) => (
                          <th key={col} className="py-3 px-4 font-normal tracking-wide whitespace-nowrap">
                            {col.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 text-gray-600">
                          {Object.keys(row).filter(k => !['Status'].includes(k)).map((col) => (
                            <td key={col} className="py-3 px-4 whitespace-nowrap max-w-[200px] truncate">
                              {typeof row[col] === 'number' && !Number.isInteger(row[col]) ? row[col].toFixed(1) : row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {paginatedData.length === 0 && (
                        <tr>
                          <td colSpan="100%" className="py-8 text-center text-gray-500">No matching students found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* PAGINATION CONTROLS */}
                {filteredData.length > 0 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600 bg-gray-50">
                    <div>
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} students
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-white"
                      ><ChevronLeft className="w-5 h-5" /></button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / ITEMS_PER_PAGE), p + 1))}
                        disabled={currentPage >= Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
                        className="p-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-white"
                      ><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: STUDENT PROFILE */}
            {((activeTab === 'student' && !isPrinting) || isPrintingStudent) && (() => {
              const studentRow = data.df.find(r => r.Student_Name === selectedStudent) || data.df[0];
              if (!studentRow) return null;
              
              const radarData = Object.keys(data.insights.subject_averages).map(sub => ({
                subject: sub,
                classAvg: parseFloat(data.insights.subject_averages[sub].toFixed(1)),
                studentScore: studentRow[`${sub}_Total`] || 0,
                fullMark: 100
              }));

              return (
                <div className="space-y-6 print:space-y-2 print:block" style={isPrintingStudent ? { width: '100%', maxWidth: '800px', margin: '0 auto' } : {}}>
                  {isPrintingStudent && (
                    <div className="hidden print:block text-center border-b border-black pb-2 mb-2 mt-2">
                      <h1 className="text-2xl font-serif text-[#9b1c31] tracking-wide mb-1" style={{ fontFamily: 'Georgia, serif' }}>STUDENT REPORT CARD</h1>
                      <p className="text-xs font-bold text-gray-800">Academic Year: {new Date().getFullYear()}</p>
                    </div>
                  )}

                  <div className="bg-white rounded shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center print:shadow-none print:border-none print:p-0">
                    <div className="print:hidden">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">Individual Report Card</h2>
                      <p className="text-gray-500 text-sm">Select a student to generate their detailed profile and performance chart.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3 w-full md:w-auto">
                      <select 
                        value={selectedStudent} 
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#9b1c31] bg-white shadow-sm print:hidden"
                      >
                        {data.df.map(r => <option key={r.Student_Name} value={r.Student_Name}>{r.Student_Name}</option>)}
                      </select>
                      <button onClick={() => setIsPrintingStudent(true)} className="px-4 py-2 bg-[#9b1c31] text-white rounded text-sm shadow-sm hover:bg-[#7a1526] transition-colors flex items-center whitespace-nowrap print:hidden">
                        <Printer className="w-4 h-4 mr-2" /> Print Student
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-[#9b1c31]">
                          <User className="w-10 h-10 text-[#9b1c31]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{studentRow.Student_Name}</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Roll No</span><span className="font-medium text-gray-800">{studentRow.Roll_Number || studentRow.Student_ID || studentRow.ID || 'N/A'}</span></div>
                          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Class Rank</span><span className="font-medium text-gray-800">#{studentRow.Rank} out of {data.df.length}</span></div>
                          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Total Marks</span><span className="font-medium text-gray-800">{studentRow.Total_Marks}</span></div>
                          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Percentage</span><span className="font-medium text-gray-800">{studentRow.Percentage.toFixed(1)}%</span></div>
                          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Attendance</span><span className="font-medium text-gray-800">{studentRow.Attendance_Percentage.toFixed(1)}%</span></div>
                          <div className="flex justify-between pb-2"><span className="text-gray-500">Grade</span>
                            <span className={`font-bold px-2 py-0.5 rounded text-xs ${studentRow.Grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {studentRow.Grade}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#f8f9fa] rounded shadow-sm border border-gray-200 p-6 border-l-4 border-l-[#4285f4]">
                        <h4 className="text-gray-700 font-medium mb-2 flex items-center"><BrainCircuit className="w-4 h-4 mr-2 text-[#4285f4]"/> AI Feedback</h4>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">"{studentRow.Remarks}"</p>
                      </div>
                    </div>

                    <div className={`lg:col-span-2 bg-white rounded shadow-sm border border-gray-200 p-6 flex flex-col items-center ${isPrintingStudent ? 'print:p-2 print:border-none' : ''}`}>
                      <h4 className="text-gray-700 font-medium mb-6 print:mb-2 print:text-sm">Subject Performance vs Class Average</h4>
                      <div className={`${isPrintingStudent ? 'w-full h-64' : 'w-full h-80'} max-w-lg`}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius={isPrintingStudent ? "60%" : "70%"} data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: isPrintingStudent ? 10 : 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 8 }} />
                            <Radar name="Student Score" dataKey="studentScore" stroke="#9b1c31" fill="#9b1c31" fillOpacity={0.5} />
                            <Radar name="Class Average" dataKey="classAvg" stroke="#4285f4" fill="#4285f4" fillOpacity={0.3} />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TAB: SUBJECT DEEP DIVE */}
            {activeTab === 'subject' && !isPrinting && !isPrintingStudent && subjectData && (
              <div className="space-y-6">
                <div className="bg-white rounded shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Subject Performance Analysis</h2>
                    <p className="text-gray-500 text-sm">Deep dive into specific subject metrics, top performers, and score distributions.</p>
                  </div>
                  <div className="mt-4 md:mt-0 w-full md:w-64">
                    <select 
                      value={selectedSubject} 
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#9b1c31] bg-white shadow-sm"
                    >
                      {Object.keys(data.insights.subject_averages).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Class Average</p>
                    <p className="text-2xl font-bold text-gray-800">{subjectData.avgScore.toFixed(1)}</p>
                  </div>
                  <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-800">{subjectData.passRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Highest Score</p>
                    <p className="text-2xl font-bold text-gray-800">{subjectData.maxScore}</p>
                  </div>
                  <div className="bg-white p-5 rounded border border-gray-200 shadow-sm border-l-4 border-l-[#9b1c31]">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Top Student(s)</p>
                    <p className="text-lg font-bold text-gray-800 truncate">{subjectData.topStudents.join(', ')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Distribution Chart */}
                  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm">
                    <h4 className="text-gray-700 font-medium mb-4 text-center">Score Distribution in {selectedSubject}</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectData.bins} margin={{ top: 10, right: 10, bottom: 25, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="range" tick={{fill: '#4b5563', fontSize: 12}} axisLine={{stroke: '#9ca3af'}} tickLine={false} dy={5} label={{ value: 'Score Range', position: 'insideBottom', offset: -15, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <YAxis tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} label={{ value: 'Students', angle: -90, position: 'insideLeft', offset: -5, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <Tooltip cursor={{fill: '#f3f4f6'}} />
                          <Bar dataKey="count" fill="#4285f4" radius={[2, 2, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top 5 Table */}
                  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm flex flex-col">
                    <h4 className="text-gray-700 font-medium mb-4">Top 5 Performers in {selectedSubject}</h4>
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <th className="py-2 px-3">Rank</th>
                            <th className="py-2 px-3">Student Name</th>
                            <th className="py-2 px-3">Roll No</th>
                            <th className="py-2 px-3 text-right">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {subjectData.top5.map((r, i) => (
                            <tr key={r.Student_Name} className="hover:bg-gray-50">
                              <td className="py-3 px-3 font-medium text-gray-500">#{i+1}</td>
                              <td className="py-3 px-3 font-medium text-[#9b1c31]">{r.Student_Name}</td>
                              <td className="py-3 px-3 text-gray-500">{r.Roll_Number || r.Student_ID || r.ID || 'N/A'}</td>
                              <td className="py-3 px-3 font-bold text-right text-gray-800">{r[`${selectedSubject}_Total`]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: INSIGHTS (Page 1 in Print) */}
            {((activeTab === 'insights' || isPrinting) && !isPrintingStudent) && (
              <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0" style={isPrinting ? { pageBreakAfter: 'always' } : {}}>
                <h3 className="text-xl font-medium text-[#9b1c31] mb-6 print:text-black print:text-lg print:border-b print:border-black print:pb-2 print:mb-4">
                  {isPrinting ? '1. EXECUTIVE INSIGHTS' : 'AI Executive Insights'}
                </h3>
                
                <div className="space-y-4 print:space-y-3">
                  {data.insights.statements.map((stmt, idx) => (
                    <div key={idx} className="bg-[#f8f9fa] p-4 border border-gray-200 rounded print:bg-transparent print:border-none print:p-0 print:flex print:items-start">
                      <span className="hidden print:inline font-bold mr-2">{idx + 1}.</span>
                      <p className="text-gray-700 print:text-black print:text-sm" dangerouslySetInnerHTML={{ __html: stmt.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-black">$1</span>').replace(/🏆|⚠️|📊|✅|🏫|📈|🚨|📅|🌟|📉/g, '') }}></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: VISUALS (Page 2 in Print) */}
            {((activeTab === 'visuals' || isPrinting) && !isPrintingStudent) && (
              <div className="space-y-6 print:space-y-0 print:block" style={isPrinting ? { pageBreakBefore: 'always' } : {}}>
                {isPrinting && <h3 className="hidden print:block text-lg font-medium text-black mb-6 border-b border-black pb-2">2. GRAPHICAL ANALYSIS</h3>}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-8">
                  
                  {/* Chart 1: Average Marks */}
                  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm print:shadow-none print:p-0 print:border-none">
                    <h4 className="text-gray-700 font-medium mb-4 text-center print:text-sm">Average Marks</h4>
                    <div className="h-64 print:h-[220px]">
                      <PrintSafeChart isPrinting={isPrinting}>
                        <BarChart data={Object.entries(data.insights.subject_averages).map(([k,v]) => ({ name: k, avg: parseFloat(v.toFixed(1)) }))} margin={{ top: 10, right: 10, bottom: 25, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{fill: '#4b5563', fontSize: 12}} axisLine={{stroke: '#9ca3af'}} tickLine={false} dy={5} label={{ value: 'Subjects', position: 'insideBottom', offset: -15, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <YAxis tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} dx={-5} domain={[0, 100]} label={{ value: 'Average Marks', angle: -90, position: 'insideLeft', offset: -5, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <Tooltip cursor={{fill: '#f3f4f6'}} />
                          <Bar dataKey="avg" fill="#4285f4" radius={[2, 2, 0, 0]} barSize={40} isAnimationActive={!isPrinting} />
                        </BarChart>
                      </PrintSafeChart>
                    </div>
                  </div>

                  {/* Chart 2: Grade Distribution */}
                  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm print:shadow-none print:p-0 print:border-none">
                    <h4 className="text-gray-700 font-medium mb-4 text-center print:text-sm">Grade Distribution</h4>
                    <div className="h-64 print:h-[220px]">
                      <PrintSafeChart isPrinting={isPrinting}>
                        <PieChart>
                          <Pie data={Object.entries(data.insights.grade_counts).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} stroke="#fff" strokeWidth={2} isAnimationActive={!isPrinting} labelStyle={{fontSize: '12px'}}>
                            {Object.keys(data.insights.grade_counts).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </PrintSafeChart>
                    </div>
                  </div>

                  {/* Chart 3: Pass vs Fail */}
                  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm print:shadow-none print:p-0 print:border-none">
                    <h4 className="text-gray-700 font-medium mb-4 text-center print:text-sm">Pass vs Fail</h4>
                    <div className="h-64 print:h-[220px]">
                      <PrintSafeChart isPrinting={isPrinting}>
                        <PieChart>
                          <Pie data={chartData.passFailData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} stroke="none" isAnimationActive={!isPrinting} labelStyle={{fontSize: '12px'}}>
                            {chartData.passFailData.map((entry, index) => <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </PrintSafeChart>
                    </div>
                  </div>

                  {/* Chart 4: Attendance vs Perf */}
                  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm print:shadow-none print:p-0 print:border-none">
                    <h4 className="text-gray-700 font-medium mb-4 text-center print:text-sm">Attendance vs Performance</h4>
                    <div className="h-64 print:h-[220px]">
                      <PrintSafeChart isPrinting={isPrinting}>
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 25, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis type="number" dataKey="x" name="Attendance" unit="%" tick={{fill: '#4b5563', fontSize: 12}} axisLine={{stroke: '#9ca3af'}} tickLine={false} domain={[0, 100]} label={{ value: 'Attendance (%)', position: 'insideBottom', offset: -15, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <YAxis type="number" dataKey="y" name="Marks" unit="%" tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} label={{ value: 'Marks (%)', angle: -90, position: 'insideLeft', offset: -5, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <ZAxis range={[40, 40]} />
                          <Tooltip cursor={{strokeDasharray: '3 3'}} />
                          {!isPrinting && <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} iconSize={10} />}
                          <Scatter name="Pass" data={chartData.scatterDataPass} fill="#34a853" shape="circle" isAnimationActive={!isPrinting} />
                          <Scatter name="Fail" data={chartData.scatterDataFail} fill="#d93025" shape="circle" isAnimationActive={!isPrinting} />
                        </ScatterChart>
                      </PrintSafeChart>
                    </div>
                  </div>

                  {/* Chart 5: Percentage Dist */}
                  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm print:shadow-none print:p-0 print:border-none">
                    <h4 className="text-gray-700 font-medium mb-4 text-center print:text-sm">Percentage Distribution</h4>
                    <div className="h-64 print:h-[220px]">
                      <PrintSafeChart isPrinting={isPrinting}>
                        <BarChart data={chartData.bins} margin={{ top: 10, right: 10, bottom: 25, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="range" tick={{fill: '#4b5563', fontSize: 12}} axisLine={{stroke: '#9ca3af'}} tickLine={false} dy={5} label={{ value: 'Percentage Range', position: 'insideBottom', offset: -15, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <YAxis tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} label={{ value: 'Students', angle: -90, position: 'insideLeft', offset: -5, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                          <Tooltip cursor={{fill: '#f3f4f6'}} />
                          <Bar dataKey="count" name="Students" fill="#fbbc05" barSize={30} radius={[2,2,0,0]} isAnimationActive={!isPrinting} />
                        </BarChart>
                      </PrintSafeChart>
                    </div>
                  </div>

                  {/* Chart 6: Section Averages */}
                  {chartData.sectionAverages.length > 0 && (
                    <div className="bg-white border border-gray-200 p-6 rounded shadow-sm print:shadow-none print:p-0 print:border-none">
                      <h4 className="text-gray-700 font-medium mb-4 text-center print:text-sm">Section Averages</h4>
                      <div className="h-64 print:h-[220px]">
                        <PrintSafeChart isPrinting={isPrinting}>
                          <BarChart data={chartData.sectionAverages} layout="vertical" margin={{ top: 10, right: 20, bottom: 25, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                            <XAxis type="number" domain={[0, 100]} tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} label={{ value: 'Average Marks (%)', position: 'insideBottom', offset: -15, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                            <YAxis dataKey="name" type="category" tick={{fill: '#4b5563', fontSize: 12}} axisLine={{stroke: '#9ca3af'}} tickLine={false} label={{ value: 'Section', angle: -90, position: 'insideLeft', offset: -15, fill: '#1f2937', fontSize: 13, fontWeight: 'bold' }} />
                            <Tooltip cursor={{fill: '#f3f4f6'}} />
                            <Bar dataKey="avg" name="Average %" fill="#8e44ad" radius={[0, 2, 2, 0]} barSize={30} isAnimationActive={!isPrinting} />
                          </BarChart>
                        </PrintSafeChart>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
