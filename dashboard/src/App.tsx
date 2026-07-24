import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Users, FileQuestion, TrendingUp, TrendingDown } from 'lucide-react';
import surveyData from './data.json';
import './App.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

function App() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const departments = useMemo(() => ['All', ...Array.from(new Set(surveyData.map((d: any) => d.Department)))].sort(), []);
  const roles = useMemo(() => ['All', ...Array.from(new Set(surveyData.map((d: any) => d.Role)))].sort(), []);

  const filteredData = useMemo(() => {
    return surveyData.filter((d: any) => {
      const deptMatch = selectedDept === 'All' || d.Department === selectedDept;
      const roleMatch = selectedRole === 'All' || d.Role === selectedRole;
      return deptMatch && roleMatch;
    });
  }, [selectedDept, selectedRole]);

  // KPIs
  const validResponses = filteredData.filter((d: any) => d.Response !== null);
  const avgResponse = validResponses.length > 0 
    ? validResponses.reduce((acc: number, curr: any) => acc + curr.Response, 0) / validResponses.length 
    : 0;
  
  const incompleteCount = filteredData.filter((d: any) => d.Response === null).length;
  
  const isPositiveTrend = avgResponse >= 3.0;

  // Role Distribution
  const roleDistribution = useMemo(() => {
    const counts = filteredData.reduce((acc: any, curr: any) => {
      acc[curr.Role] = (acc[curr.Role] || 0) + 1;
      return acc;
    }, {});
    const total = filteredData.length || 1;
    return Object.entries(counts).map(([name, value]: [string, any]) => ({ 
      name: `${name} ${((value / total) * 100).toFixed(0)}%`, 
      value 
    }));
  }, [filteredData]);

  // Department-wise Avg
  const deptAvg = useMemo(() => {
    const depts: any = {};
    filteredData.forEach((d: any) => {
      if (d.Response !== null) {
        if (!depts[d.Department]) depts[d.Department] = { sum: 0, count: 0 };
        depts[d.Department].sum += d.Response;
        depts[d.Department].count += 1;
      }
    });
    return Object.entries(depts)
      .map(([name, val]: [string, any]) => ({ name, avg: parseFloat((val.sum / val.count).toFixed(2)) }))
      .sort((a, b) => b.avg - a.avg);
  }, [filteredData]);

  // Trend Analysis
  const trendData = useMemo(() => {
    const months: any = {};
    filteredData.forEach((d: any) => {
      if (d.Response !== null && d.Date) {
        const month = d.Date.substring(0, 7);
        if (!months[month]) months[month] = { sum: 0, count: 0 };
        months[month].sum += d.Response;
        months[month].count += 1;
      }
    });
    return Object.entries(months)
      .map(([name, val]: [string, any]) => ({ name, avg: parseFloat((val.sum / val.count).toFixed(2)) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);

  // Comparative Analysis
  const compData = useMemo(() => {
    const depts: any = {};
    filteredData.forEach((d: any) => {
      if (d.Response !== null) {
        if (!depts[d.Department]) depts[d.Department] = { name: d.Department };
        if (!depts[d.Department][d.Role]) {
           depts[d.Department][`${d.Role}_sum`] = 0;
           depts[d.Department][`${d.Role}_count`] = 0;
        }
        depts[d.Department][`${d.Role}_sum`] += d.Response;
        depts[d.Department][`${d.Role}_count`] += 1;
      }
    });
    
    return Object.values(depts).map((dept: any) => {
      const res: any = { name: dept.name };
      roles.filter(r => r !== 'All').forEach(r => {
        if (dept[`${r}_count`]) {
          res[r] = parseFloat((dept[`${r}_sum`] / dept[`${r}_count`]).toFixed(2));
        } else {
          res[r] = 0;
        }
      });
      return res;
    });
  }, [filteredData, roles]);

  const customTooltipStyle = { background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', padding: '8px' };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>HR Survey Insights</h1>
        <div className="controls">
          <div className="filter-group">
            <label htmlFor="dept-filter" className="filter-label">Department</label>
            <select id="dept-filter" className="filter-select" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
              {departments.map(d => <option key={d as string} value={d as string}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="role-filter" className="filter-label">Role</label>
            <select id="role-filter" className="filter-select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              {roles.map(r => <option key={r as string} value={r as string}>{r === 'All' ? 'All Roles' : r}</option>)}
            </select>
          </div>
        </div>
      </header>

      <div className="main-grid">
        {/* Column 1: KPIs, Pie, Table */}
        <div className="col">
          <div className="kpi-row">
            <div className="glass-panel kpi-card">
              <div className="kpi-icon">
                <Users size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Avg Score</span>
                <span className="kpi-value">{avgResponse.toFixed(2)}</span>
                <span className={`kpi-trend ${isPositiveTrend ? 'trend-up' : 'trend-down'}`}>
                  {isPositiveTrend ? <TrendingUp size={12} className="inline" /> : <TrendingDown size={12} className="inline" />}
                  {' '}{isPositiveTrend ? '>= 3.0' : '< 3.0'}
                </span>
              </div>
            </div>
            <div className="glass-panel kpi-card">
              <div className="kpi-icon" style={{color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)'}}>
                <FileQuestion size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Incomplete</span>
                <span className="kpi-value">{incompleteCount}</span>
                <span className="kpi-trend">Total: {filteredData.length}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel chart-card pie-card">
            <h3>Role Demographics</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="40%" cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    stroke="none"
                  >
                    {roleDistribution.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '11px', paddingRight: '10px'}} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel chart-card table-card">
            <h3>Recent Responses (Top 5)</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Dept</th>
                    <th>Role</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 5).map((d: any) => (
                    <tr key={d['Response ID']}>
                      <td><span style={{color: d.Status === 'Complete' ? 'var(--success)' : 'var(--danger)'}}>{d.Status}</span></td>
                      <td>{d.Department}</td>
                      <td>{d.Role}</td>
                      <td>{d.Response !== null ? d.Response : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column 2: Dept Avg, Comparative */}
        <div className="col">
          <div className="glass-panel chart-card">
            <h3>Department Avg Response</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptAvg} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" domain={[0, 4]} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="avg" fill="var(--success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-panel chart-card">
            <h3>Comparative Analysis (Role vs Dept)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" domain={[0, 4]} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Legend verticalAlign="top" wrapperStyle={{fontSize: '11px', paddingBottom: '10px'}} iconType="circle" />
                  {roles.filter(r => r !== 'All').map((role, idx) => (
                    <Bar key={role as string} dataKey={role as string} fill={COLORS[idx % COLORS.length]} radius={[2, 2, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 3: Trend Analysis */}
        <div className="col">
          <div className="glass-panel chart-card" style={{flex: 1}}>
            <h3>Trend Analysis (Monthly Average)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{top: 10, right: 20, left: -20, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" domain={['dataMin - 0.2', 'dataMax + 0.2']} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Line type="monotone" dataKey="avg" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: '#0f172a' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
