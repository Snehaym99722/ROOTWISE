import React, { useState } from 'react';
import { 
  Investigation, 
  LabResult, 
  TelemetryPoint 
} from '../../types/investigation.ts';
import { 
  AlertTriangle, 
  Activity, 
  TestTube2, 
  FileText, 
  CheckCircle2, 
  AlertOctagon,
  Calendar,
  Building,
  UserCheck,
  Plus
} from 'lucide-react';

interface EventOverviewTabProps {
  investigation: Investigation;
  onUpdate: (updated: Investigation) => void;
}

export const EventOverviewTab: React.FC<EventOverviewTabProps> = ({
  investigation,
  onUpdate
}) => {
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [newEvidenceGap, setNewEvidenceGap] = useState('');
  const [newLabTest, setNewLabTest] = useState({
    testName: '',
    parameter: '',
    result: '',
    specification: '',
    unit: '',
    status: 'PASS' as 'PASS' | 'OOS' | 'OOT',
    instrumentId: '',
    analyst: ''
  });

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabTest.testName || !newLabTest.result) return;

    const newResult: LabResult = {
      id: `LAB-${Date.now()}`,
      ...newLabTest
    };

    onUpdate({
      ...investigation,
      labResults: [...investigation.labResults, newResult]
    });

    setShowAddLabModal(false);
    setNewLabTest({
      testName: '',
      parameter: '',
      result: '',
      specification: '',
      unit: '',
      status: 'PASS',
      instrumentId: '',
      analyst: ''
    });
  };

  const handleAddEvidenceGap = (e: React.FormEvent) => {
    e.preventDefault();
    const gap = newEvidenceGap.trim();
    if (!gap) return;
    onUpdate({ ...investigation, evidenceGaps: [...(investigation.evidenceGaps || []), gap] });
    setNewEvidenceGap('');
  };

  // Compute excursion telemetry points
  const excursionPoints = investigation.telemetryData.filter(t => t.isExcursion);

  return (
    <div className="space-y-6">
      {investigation.demoMode && (
        <section className="rounded-lg border border-amber-700/70 bg-amber-950/40 p-4" role="note" aria-label="Fictional demonstration data notice">
          <div className="flex items-start gap-3">
            <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold text-amber-200">Fictional demonstration dossier · not a GMP record</h2>
              <p className="mt-1 text-xs leading-relaxed text-amber-100/80">{investigation.demoNotice}</p>
              <p className="mt-1 text-xs text-amber-100/80">Every causal link remains a hypothesis until actual source records are reviewed and a qualified human makes the determination.</p>
            </div>
          </div>
        </section>
      )}
      {/* Dossier Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Incident Summary Card */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Event Narrative & Immediate Containment</span>
            </h2>
            <div className="text-xs text-slate-400">
              ICH Q7 §11.6 Protocol
            </div>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block mb-1">
                Event Description & Symptomology
              </span>
              <p className="text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded border border-slate-800/80">
                {investigation.eventDescription}
              </p>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block mb-1">
                Immediate Physical & Electronic Containment
              </span>
              <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded border border-slate-800/80 whitespace-pre-line font-mono text-[11px]">
                {investigation.immediateContainment}
              </p>
            </div>
          </div>
        </div>

        {/* Manufacturing & Batch Metadata */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3.5 text-xs">
          <h3 className="text-sm font-semibold text-slate-200 pb-2 border-b border-slate-800">
            Batch Execution Context
          </h3>

          <div>
            <span className="text-slate-500 block text-[11px]">API Drug Substance</span>
            <span className="font-semibold text-slate-200">{investigation.apiProduct}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Batch Lot Number</span>
            <span className="font-mono text-teal-300 font-semibold">{investigation.batchNumber}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Equipment Unit</span>
            <span className="text-slate-300">{investigation.equipmentId}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Manufacturing Stage</span>
            <span className="text-slate-300">{investigation.manufacturingStage}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">GMP Facility</span>
            <span className="text-slate-300">{investigation.facility}</span>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 block text-[11px]">Batch Disposition Status</span>
            <span className={`font-mono font-semibold text-xs ${
              investigation.batchDisposition === 'QUARANTINED' ? 'text-rose-400' :
              investigation.batchDisposition === 'REJECTED' ? 'text-red-500' : 'text-amber-400'
            }`}>
              {investigation.batchDisposition} (QA-HOLD)
            </span>
          </div>
        </div>
      </div>

      <section className="bg-amber-950/20 border border-amber-900/60 rounded-lg p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-amber-200 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Evidence gaps to close</h2>
            <p className="text-xs text-slate-400 mt-1">Outstanding records are requests for investigation; they are not evidence that a cause occurred.</p>
          </div>
          <span className="text-[10px] font-mono text-amber-300">{investigation.evidenceGaps?.length || 0} OPEN</span>
        </div>
        <ul className="mt-3 space-y-2">
          {(investigation.evidenceGaps || []).map((gap, index) => <li key={`${index}-${gap}`} className="flex items-start gap-2 text-xs text-slate-200">
            <span className="font-mono text-amber-400">{String(index + 1).padStart(2, '0')}</span><span className="flex-1">{gap}</span>
            <button type="button" onClick={() => onUpdate({ ...investigation, evidenceGaps: (investigation.evidenceGaps || []).filter((_, i) => i !== index) })} className="text-slate-500 hover:text-emerald-300" aria-label="Remove resolved evidence gap">Resolved</button>
          </li>)}
          {!(investigation.evidenceGaps || []).length && <li className="text-xs text-slate-400">No open evidence gaps recorded.</li>}
        </ul>
        <form onSubmit={handleAddEvidenceGap} className="mt-3 flex gap-2">
          <input value={newEvidenceGap} onChange={e => setNewEvidenceGap(e.target.value)} placeholder="Add an outstanding record or evidence request…" className="flex-1 min-w-0 p-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 placeholder:text-slate-500" />
          <button type="submit" className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-100">Add gap</button>
        </form>
      </section>

      {investigation.evidenceRecords?.length ? (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200"><FileText className="h-4 w-4 text-teal-400" />Evidence register & traceability</h2>
              <p className="mt-1 text-xs text-slate-400">{investigation.demoMode ? 'Synthetic demo source references; replace each with controlled records before using the workflow.' : 'Original source attachments are retained with a SHA-256 checksum; extracted text remains subject to investigator verification.'}</p>
            </div>
            <span className={`shrink-0 rounded border px-2 py-1 font-mono text-[10px] ${investigation.demoMode ? 'border-amber-800/60 bg-amber-950/40 text-amber-300' : 'border-teal-800/60 bg-teal-950/40 text-teal-300'}`}>{investigation.demoMode ? 'DEMO SOURCES' : 'RETAINED SOURCES'}</span>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Reference</th><th className="px-3 py-2">Record / source</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Finding / note</th></tr></thead>
              <tbody className="divide-y divide-slate-800/70">
                {investigation.evidenceRecords.map(record => <tr key={record.id}>
                  <td className="px-3 py-3 font-mono text-teal-300">{record.id}</td>
                  <td className="px-3 py-3 font-medium text-slate-200">{record.name}</td>
                  <td className="px-3 py-3 text-slate-400">{record.type}</td>
                  <td className="px-3 py-3"><span className="rounded-full bg-amber-950/60 px-2 py-1 text-[10px] font-semibold text-amber-300">{record.status}</span></td>
                  <td className="max-w-sm px-3 py-3 text-slate-400">
                    <span>{record.finding}</span>
                    {record.pageCount ? <span className="ml-2 text-[10px] text-slate-500">{record.pageCount} pages{record.ocrUsed ? ' · OCR' : ''}</span> : null}
                    {record.sha256 ? <span className="mt-1 block font-mono text-[10px] text-slate-500">SHA-256 {record.sha256.slice(0, 16)}…</span> : null}
                    {record.downloadUrl ? <a href={record.downloadUrl} className="mt-1 inline-block text-teal-300 underline underline-offset-2 hover:text-teal-200">Download original</a> : null}
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Sensor Telemetry Excursion Graph & Data Points */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>SCADA Process Telemetry & Golden Batch Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous temperature and pressure historian logs highlighting excursion timeframe
            </p>
          </div>
          {excursionPoints.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>Excursion Window Detected ({excursionPoints.length} points out of envelope)</span>
            </div>
          )}
        </div>

        {/* SVG Telemetry Visualization */}
        <div className="mt-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-400 inline-block"></span>
                <span>Jacket Temp (°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
                <span>Slurry Temp (°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-500 inline-block"></span>
                <span>Target Recipe Setpoint</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Sampling Interval: 30 min</span>
          </div>

          {/* Simple Clean Scalable SVG Chart */}
          <div className="w-full h-44 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="700" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#1e293b" strokeWidth="1" />

              {/* Target Curve */}
              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                points={investigation.telemetryData.map((d, i) => {
                  const x = (i / (investigation.telemetryData.length - 1)) * 680 + 10;
                  const y = 150 - (d.targetTemp / 70) * 130;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Slurry Temp Curve */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                points={investigation.telemetryData.map((d, i) => {
                  const x = (i / (investigation.telemetryData.length - 1)) * 680 + 10;
                  const y = 150 - (d.slurryTemp / 70) * 130;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Jacket Temp Curve */}
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                points={investigation.telemetryData.map((d, i) => {
                  const x = (i / (investigation.telemetryData.length - 1)) * 680 + 10;
                  const y = 150 - (d.jacketTemp / 70) * 130;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Data points & Excursion highlights */}
              {investigation.telemetryData.map((d, i) => {
                const x = (i / (investigation.telemetryData.length - 1)) * 680 + 10;
                const ySlurry = 150 - (d.slurryTemp / 70) * 130;
                const yJacket = 150 - (d.jacketTemp / 70) * 130;

                return (
                  <g key={i}>
                    {d.isExcursion && (
                      <circle cx={x} cy={yJacket} r="6" fill="#f43f5e" fillOpacity="0.3" className="animate-pulse" />
                    )}
                    <circle cx={x} cy={ySlurry} r="3" fill="#06b6d4" />
                    <circle cx={x} cy={yJacket} r="3" fill="#f43f5e" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Time axis points */}
          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-3 px-2">
            {investigation.telemetryData.map((d, i) => (
              <span key={i} className={d.isExcursion ? 'text-rose-400 font-semibold' : ''}>
                {d.time}
              </span>
            ))}
          </div>
        </div>

        {/* Telemetry tabular strip */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Jacket Temp</th>
                <th className="py-2 px-3">Slurry Temp</th>
                <th className="py-2 px-3">Target Setpoint</th>
                <th className="py-2 px-3">Agitator RPM</th>
                <th className="py-2 px-3">Reactor Pressure</th>
                <th className="py-2 px-3 text-right">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {investigation.telemetryData.map((d, i) => (
                <tr key={i} className={d.isExcursion ? 'bg-rose-950/20 text-rose-200' : 'text-slate-300'}>
                  <td className="py-2 px-3">{d.time}</td>
                  <td className="py-2 px-3">{d.jacketTemp.toFixed(1)} °C</td>
                  <td className="py-2 px-3">{d.slurryTemp.toFixed(1)} °C</td>
                  <td className="py-2 px-3 text-slate-500">{d.targetTemp.toFixed(1)} °C</td>
                  <td className="py-2 px-3">{d.agitatorRpm} RPM</td>
                  <td className="py-2 px-3">{d.pressure.toFixed(2)} bar</td>
                  <td className="py-2 px-3 text-right">
                    {d.isExcursion ? (
                      <span className="text-rose-400 font-sans font-semibold text-[11px]">Thermal Excursion</span>
                    ) : (
                      <span className="text-slate-500 font-sans text-[11px]">In Spec</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytical Lab Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-emerald-400" />
              <span>Quality Control Analytical Results & Specifications</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Illustrative release and in-process analytical results; verify every result against its controlled source record
            </p>
          </div>
          <button
            onClick={() => setShowAddLabModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lab Test</span>
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-2.5 px-3">Test Method</th>
                <th className="py-2.5 px-3">Parameter / Compound</th>
                <th className="py-2.5 px-3">Observed Result</th>
                <th className="py-2.5 px-3">Acceptance Criteria</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Instrument ID</th>
                <th className="py-2.5 px-3">Analyst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {investigation.labResults.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{lab.testName}</td>
                  <td className="py-2.5 px-3 text-slate-300">{lab.parameter}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-100">
                    <span className={lab.status === 'OOS' ? 'text-rose-400' : lab.status === 'OOT' ? 'text-amber-400' : 'text-emerald-400'}>
                      {lab.result}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{lab.specification}</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-semibold text-xs ${
                      lab.status === 'OOS' ? 'text-rose-400' : lab.status === 'OOT' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {lab.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{lab.instrumentId}</td>
                  <td className="py-2.5 px-3 text-slate-400">{lab.analyst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding lab result */}
      {showAddLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-semibold text-white">Record Analytical Test Result</h3>
            <form onSubmit={handleAddLab} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Test Method (e.g. Related Substances HPLC)</label>
                <input
                  type="text"
                  required
                  value={newLabTest.testName}
                  onChange={e => setNewLabTest({ ...newLabTest, testName: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Parameter Analyzed</label>
                  <input
                    type="text"
                    required
                    value={newLabTest.parameter}
                    onChange={e => setNewLabTest({ ...newLabTest, parameter: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Observed Result</label>
                  <input
                    type="text"
                    required
                    value={newLabTest.result}
                    onChange={e => setNewLabTest({ ...newLabTest, result: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Acceptance Limit</label>
                  <input
                    type="text"
                    required
                    value={newLabTest.specification}
                    onChange={e => setNewLabTest({ ...newLabTest, specification: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Outcome Status</label>
                  <select
                    value={newLabTest.status}
                    onChange={e => setNewLabTest({ ...newLabTest, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  >
                    <option value="PASS">PASS (Conforming)</option>
                    <option value="OOS">OOS (Out of Specification)</option>
                    <option value="OOT">OOT (Out of Trend)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Instrument ID</label>
                  <input
                    type="text"
                    value={newLabTest.instrumentId}
                    onChange={e => setNewLabTest({ ...newLabTest, instrumentId: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Analyst Name</label>
                  <input
                    type="text"
                    value={newLabTest.analyst}
                    onChange={e => setNewLabTest({ ...newLabTest, analyst: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddLabModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
