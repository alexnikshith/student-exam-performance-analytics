const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Utility to calculate median
const calculateMedian = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// Process Data
const processData = (records) => {
    // 1. Identify headers and handle median imputation
    if (records.length === 0) throw new Error("Empty CSV");
    
    let headers = Object.keys(records[0]);
    
    // Convert numerical columns to numbers and track values for medians
    let colValues = {};
    headers.forEach(h => colValues[h] = []);
    
    records.forEach(row => {
        headers.forEach(h => {
            let val = parseFloat(row[h]);
            if (!isNaN(val)) colValues[h].push(val);
        });
    });
    
    let medians = {};
    headers.forEach(h => {
        if (colValues[h].length > 0) medians[h] = calculateMedian(colValues[h]);
    });
    
    // Fill NaN with median
    let df = records.map(row => {
        let newRow = { ...row };
        headers.forEach(h => {
            let val = parseFloat(row[h]);
            if (isNaN(val) && medians[h] !== undefined) {
                newRow[h] = medians[h];
            } else if (!isNaN(val)) {
                newRow[h] = val;
            }
        });
        
        // Ensure student name
        if (!newRow['Student_Name']) {
            newRow['Student_Name'] = newRow['Name'] || `Student_${Math.random().toString(36).substring(7)}`;
        }
        return newRow;
    });

    // 2. Identify subjects dynamically
    let internalCols = headers.filter(h => h.endsWith('_Internal'));
    let subjects = [];
    let maxTotal = 0;
    
    if (internalCols.length > 0) {
        subjects = internalCols.map(c => c.replace('_Internal', ''));
        subjects.forEach(sub => {
            df.forEach(row => {
                let internal = row[`${sub}_Internal`] || 0;
                let external = row[`${sub}_External`] || 0;
                row[`${sub}_Total`] = internal + external;
            });
        });
        maxTotal = subjects.length * 100;
    } else {
        let exclude = ['Student_ID', 'ID', 'Total_Classes', 'Classes_Attended', 'Class', 'Section', 'Student_Name', 'Name'];
        let numCols = headers.filter(h => medians[h] !== undefined && !exclude.includes(h) && !h.endsWith('_Total'));
        
        if (numCols.length === 0) throw new Error("No numerical columns found to analyze.");
        subjects = numCols;
        subjects.forEach(sub => {
            df.forEach(row => {
                row[`${sub}_Total`] = row[sub] || 0;
            });
        });
        maxTotal = subjects.length * 100; // Assume 100 max per metric
    }
    
    maxTotal = Math.max(maxTotal, 1);
    
    // 3. Compute Metrics
    df.forEach(row => {
        let totalMarks = subjects.reduce((sum, sub) => sum + row[`${sub}_Total`], 0);
        row['Total_Marks'] = totalMarks;
        row['Percentage'] = (totalMarks / maxTotal) * 100;
        row['Average_Marks'] = totalMarks / subjects.length;
        
        if (row['Classes_Attended'] !== undefined && row['Total_Classes'] !== undefined) {
            row['Attendance_Percentage'] = (row['Classes_Attended'] / row['Total_Classes']) * 100;
        } else {
            row['Attendance_Percentage'] = 100;
        }
        
        let p = row['Percentage'];
        if (p >= 90) row['Grade'] = 'A+';
        else if (p >= 80) row['Grade'] = 'A';
        else if (p >= 70) row['Grade'] = 'B';
        else if (p >= 60) row['Grade'] = 'C';
        else if (p >= 50) row['Grade'] = 'D';
        else row['Grade'] = 'F';
        
        let failedAny = subjects.some(sub => row[`${sub}_Total`] < 40);
        row['Status'] = failedAny ? 'Fail' : 'Pass';
    });
    
    // Ranking
    df.sort((a, b) => b.Total_Marks - a.Total_Marks);
    let currentRank = 1;
    df.forEach((row, idx) => {
        if (idx > 0 && row.Total_Marks < df[idx - 1].Total_Marks) {
            currentRank = idx + 1;
        }
        row['Rank'] = currentRank;
    });
    
    // Remarks
    df.forEach(row => {
        if (row.Status === 'Fail') row.Remarks = 'Needs significant improvement';
        else if (row.Grade === 'A+') row.Remarks = 'Excellent performance';
        else if (row.Grade === 'A') row.Remarks = 'Very Good';
        else if (row.Attendance_Percentage < 75) row.Remarks = 'Improve attendance';
        else row.Remarks = 'Good - keep it up';
    });

    // 4. Generate Insights
    let insights = {};
    
    let subjectAvgs = {};
    subjects.forEach(sub => {
        const col = `${sub}_Total`;
        // Determine max mark for this subject (default to 100 if all scores are <= 100)
        const maxScoreInCol = Math.max(...df.map(r => r[col] || 0));
        const maxBasis = maxScoreInCol > 100 ? maxScoreInCol : 100;
        
        let totalNormalized = df.reduce((sum, row) => {
            const raw = row[col] || 0;
            const normalized = (raw / maxBasis) * 100;
            return sum + normalized;
        }, 0);
        
        subjectAvgs[sub] = totalNormalized / df.length;
    });
    insights.subject_averages = subjectAvgs;
    
    insights.strongest_subject = Object.keys(subjectAvgs).reduce((a, b) => subjectAvgs[a] > subjectAvgs[b] ? a : b);
    insights.weakest_subject = Object.keys(subjectAvgs).reduce((a, b) => subjectAvgs[a] < subjectAvgs[b] ? a : b);
    
    insights.overall_average = df.reduce((sum, r) => sum + r.Percentage, 0) / df.length;
    insights.total_students = df.length;
    
    let passCount = df.filter(r => r.Status === 'Pass').length;
    insights.pass_percentage = (passCount / df.length) * 100;
    
    insights.top_student = df[0].Student_Name;
    insights.top_marks = df[0].Total_Marks;
    insights.top_5 = df.slice(0, 5).map(r => ({ Student_Name: r.Student_Name, Percentage: r.Percentage, Rank: r.Rank }));
    
    let atRisk = df.filter(r => r.Status === 'Fail').map(r => ({ Student_Name: r.Student_Name, Percentage: r.Percentage, Attendance_Percentage: r.Attendance_Percentage }));
    insights.at_risk_students = atRisk;
    
    let lowAttendance = df.filter(r => r.Attendance_Percentage < 75).map(r => ({ Student_Name: r.Student_Name, Attendance_Percentage: r.Attendance_Percentage }));
    insights.low_attendance = lowAttendance;
    
    let highAttScores = df.filter(r => r.Attendance_Percentage >= 85).map(r => r.Percentage);
    let lowAttScores = df.filter(r => r.Attendance_Percentage < 85).map(r => r.Percentage);
    let highAttAvg = highAttScores.length > 0 ? highAttScores.reduce((a, b) => a + b, 0) / highAttScores.length : 0;
    let lowAttAvg = lowAttScores.length > 0 ? lowAttScores.reduce((a, b) => a + b, 0) / lowAttScores.length : 0;
    
    insights.attendance_correlation = { high_att_avg: highAttAvg, low_att_avg: lowAttAvg };
    
    let statements = [
        `🏆 The strongest subject overall is **${insights.strongest_subject}** with an average of **${subjectAvgs[insights.strongest_subject].toFixed(1)} marks**.`,
        `⚠️ Students are struggling the most in **${insights.weakest_subject}** (Average: ${subjectAvgs[insights.weakest_subject].toFixed(1)} marks).`,
        `📊 The overall class average percentage is **${insights.overall_average.toFixed(1)}%**.`,
        `✅ The overall pass rate is **${insights.pass_percentage.toFixed(1)}%**.`
    ];
    
    let attDiff = highAttAvg - lowAttAvg;
    if (attDiff > 0 && highAttScores.length && lowAttScores.length) {
        statements.push(`📈 Students with >85% attendance score on average **${attDiff.toFixed(1)}% higher** than those below 85%.`);
    }
    
    statements.push(`🚨 **${atRisk.length} students** are currently at risk.`);
    statements.push(`📅 **${lowAttendance.length} students** have attendance below 75%.`);
    
    let distinctionCount = df.filter(r => r.Percentage >= 80).length;
    if (distinctionCount > 0) {
        statements.push(`🌟 **${distinctionCount} students** (${(distinctionCount / df.length * 100).toFixed(1)}%) achieved a distinction (80% or above).`);
    }

    let sortedPercentages = df.map(r => r.Percentage).sort((a, b) => a - b);
    if (sortedPercentages.length > 0) {
        let top10Index = Math.floor(sortedPercentages.length * 0.9);
        let bottom10Index = Math.floor(sortedPercentages.length * 0.1);
        let top10Score = sortedPercentages[Math.min(top10Index, sortedPercentages.length - 1)];
        let bottom10Score = sortedPercentages[Math.max(bottom10Index, 0)];
        statements.push(`📉 The top 10% of the class scored above **${top10Score.toFixed(1)}%**, while the bottom 10% scored below **${bottom10Score.toFixed(1)}%**.`);
    }
    
    insights.statements = statements;
    
    // Grade Counts
    let gradeCounts = {};
    df.forEach(r => { gradeCounts[r.Grade] = (gradeCounts[r.Grade] || 0) + 1; });
    insights.grade_counts = gradeCounts;
    
    let statusCounts = { 'Pass': passCount, 'Fail': df.length - passCount };
    insights.status_counts = statusCounts;
    
    return { df, insights, subjects };
};

app.post('/api/analyze', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            if (Object.keys(data).length > 1) results.push(data);
        })
        .on('end', () => {
            try {
                const responseData = processData(results);
                fs.unlinkSync(req.file.path); // cleanup
                res.json(responseData);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        })
        .on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
});

app.post('/api/analyze-sample', (req, res) => {
    const results = [];
    const path = require('path');
    const samplePath = path.join(__dirname, '../data/student_marks.csv');
    
    if (!fs.existsSync(samplePath)) {
        return res.status(404).json({ error: 'Sample dataset not found on disk.' });
    }

    fs.createReadStream(samplePath)
        .pipe(csv())
        .on('data', (data) => {
            if (Object.keys(data).length > 1) results.push(data);
        })
        .on('end', () => {
            try {
                const responseData = processData(results);
                res.json(responseData);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        })
        .on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
