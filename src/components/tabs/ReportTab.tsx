import React from 'react';
import { 
  Investigation 
} from '../../types/investigation.ts';
import { 
  Printer, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Calendar,
  Download
} from 'lucide-react';

interface ReportTabProps {
  investigation: Investigation;
}

export const ReportTab: React.FC<ReportTabProps> = ({ investigation }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(investigation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${investigation.id}_RCA_Report_Draft.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Action Header Bar (Hidden during print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Investigation report draft</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Working draft for investigator and Quality Unit review; verify source records before use.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export record JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print draft report</span>
          </button>
        </div>
      </div>

      {/* The Formal Investigation Document */}
      <div className="bg-slate-900 text-slate-100 p-8 rounded-lg border border-slate-800 shadow-xl space-y-8 font-sans print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        
        {/* Document Header & Regulatory Metadata */}
        <div className="border-b-2 border-slate-700 pb-6 print:border-black">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider print:text-slate-600">
                <span>ROOTWISE AI demonstration workspace</span>
                <span>·</span>
                <span>GMP Quality Event Investigation</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1 print:text-black">
                ROOT CAUSE ANALYSIS & CAPA REPORT
              </h1>
              <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
                Draft only. Not validated or intended to establish regulatory compliance.
              </p>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div className="text-base font-bold text-teal-300 print:text-black">
                {investigation.id}
              </div>
              <div className="text-slate-400 print:text-slate-600">
                Severity: <span className="font-semibold text-slate-200 print:text-black">{investigation.severity}</span>
              </div>
              <div className="text-slate-400 print:text-slate-600">
                Status: <span className="font-semibold text-slate-200 print:text-black">{investigation.status}</span>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-800 text-xs print:border-slate-300">
            <div>
              <span className="text-slate-500 block text-[11px] print:text-slate-600">Drug Substance:</span>
              <span className="font-semibold text-slate-200 print:text-black">{investigation.apiProduct}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] print:text-slate-600">Batch Lot Number:</span>
              <span className="font-mono font-semibold text-teal-300 print:text-black">{investigation.batchNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] print:text-slate-600">Process Equipment:</span>
              <span className="text-slate-200 print:text-black">{investigation.equipmentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] print:text-slate-600">Facility / Suite:</span>
              <span className="text-slate-200 print:text-black">{investigation.facility}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Event Description & Immediate Containment */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1 print:text-black print:border-slate-300">
            1. Event Description & Immediate Containment
          </h2>
          <div className="text-xs text-slate-300 leading-relaxed space-y-3 print:text-black">
            <div>
              <span className="font-semibold text-slate-200 block mb-1 print:text-black">Deviation Narrative:</span>
              <p className="bg-slate-950 p-3 rounded border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
                {investigation.eventDescription}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-200 block mb-1 print:text-black">Immediate Actions Taken & Lot Segregation:</span>
              <p className="bg-slate-950 p-3 rounded border border-slate-800/80 whitespace-pre-line font-mono text-[11px] print:bg-slate-50 print:border-slate-300">
                {investigation.immediateContainment}
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Laboratory & Analytical Findings */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1 print:text-black print:border-slate-300">
            2. Quality Control Analytical Testing Records
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] print:bg-slate-100 print:text-black">
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Test Method</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Parameter</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Result</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Specification</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Status</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-black">
                {investigation.labResults.map(lab => (
                  <tr key={lab.id}>
                    <td className="p-2 font-medium">{lab.testName}</td>
                    <td className="p-2">{lab.parameter}</td>
                    <td className="p-2 font-mono font-semibold">{lab.result}</td>
                    <td className="p-2 font-mono text-[11px]">{lab.specification}</td>
                    <td className="p-2 font-semibold">
                      <span className={lab.status === 'OOS' ? 'text-rose-400 print:text-rose-700' : 'text-emerald-400 print:text-emerald-700'}>
                        {lab.status}
                      </span>
                    </td>
                    <td className="p-2">{lab.analyst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: 5-Whys Causal Progression */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1 print:text-black print:border-slate-300">
            3. 5-Whys Root Cause Deductive Analysis
          </h2>
          <div className="space-y-2 text-xs">
            {investigation.fiveWhys.map(why => (
              <div 
                key={why.id}
                className={`p-3 rounded border text-xs leading-relaxed ${
                  why.isRootCause
                    ? 'bg-rose-950/20 border-rose-500/50 print:bg-slate-100 print:border-slate-400'
                    : 'bg-slate-950/60 border-slate-800 print:bg-white print:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-teal-400 print:text-slate-600 mb-1">
                  <span>Step {why.level} ({why.contributingCategory})</span>
                  <span>{why.isRootCause ? '★ PRIMARY ROOT CAUSE' : `Status: ${why.status}`}</span>
                </div>
                <div className="font-semibold text-slate-200 print:text-black">
                  Q: {why.question}
                </div>
                <div className="text-slate-300 print:text-black mt-0.5">
                  A: {why.answer}
                </div>
                {why.evidence && (
                  <div className="text-[11px] text-slate-500 print:text-slate-600 font-mono mt-1">
                    Evidence Link: {why.evidence}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Confirmed Root Cause Statement */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1 print:text-black print:border-slate-300">
            4. Formal Root Cause Determination
          </h2>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-200 font-mono print:bg-slate-50 print:text-black print:border-slate-300">
            {investigation.rootCauseSummary || 'Root cause determination under technical verification.'}
          </div>
        </section>

        {/* Section 5: FMEA Risk & Corrective and Preventive Actions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 print:border-slate-300">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 print:text-black">
              5. Corrective & Preventive Actions (CAPA)
            </h2>
            <div className="font-mono text-xs text-slate-400 print:text-black">
              ICH Q9 RPN: {investigation.riskAssessment.rpn} ({investigation.riskAssessment.riskCategory})
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] print:bg-slate-100 print:text-black">
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">CAPA ID</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Type</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Action Plan</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Owner</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Due Date</th>
                  <th className="p-2 border-b border-slate-800 print:border-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-black">
                {investigation.capas.map(capa => (
                  <tr key={capa.id}>
                    <td className="p-2 font-mono text-[11px] text-teal-300 print:text-black">{capa.id}</td>
                    <td className="p-2 font-mono text-[11px]">{capa.type}</td>
                    <td className="p-2">
                      <div className="font-semibold text-slate-100 print:text-black">{capa.title}</div>
                      <div className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">{capa.description}</div>
                    </td>
                    <td className="p-2">{capa.owner}</td>
                    <td className="p-2 font-mono text-[11px]">{capa.dueDate}</td>
                    <td className="p-2 font-semibold">{capa.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Demo review acknowledgements */}
        <section className="space-y-3 pt-4 border-t border-slate-800 print:border-slate-300">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1 print:text-black print:border-slate-300">
            6. Review acknowledgement history (demonstration only)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {investigation.electronicSignatures.length === 0 ? (
              <div className="col-span-2 p-4 text-center text-slate-500 border border-dashed border-slate-800 rounded print:border-slate-300">
                No review acknowledgement recorded.
              </div>
            ) : (
              investigation.electronicSignatures.map(sig => (
                <div key={sig.id} className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1 print:bg-white print:border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 print:text-black">{sig.signerName}</span>
                    <span className="font-mono text-[10px] text-amber-400 print:text-amber-700">DEMO ACKNOWLEDGEMENT</span>
                  </div>
                  <div className="text-[11px] text-teal-400 print:text-slate-600">{sig.role}</div>
                  <div className="text-[11px] italic text-slate-400 print:text-slate-700">"{sig.reason}"</div>
                  <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800 print:border-slate-200">
                    Acknowledged: {new Date(sig.timestamp).toUTCString()} · Identity is not verified in this prototype.
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Document Footer */}
        <div className="text-center pt-6 border-t border-slate-800 text-[11px] text-slate-500 print:border-slate-300">
          ROOTWISE AI educational prototype · Not a validated record · Generated {new Date().toUTCString()}
        </div>
      </div>
    </div>
  );
};
