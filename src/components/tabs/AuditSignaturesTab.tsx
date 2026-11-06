import React, { useState } from 'react';
import { 
  Investigation, 
  ElectronicSignature, 
  AuditLogEntry 
} from '../../types/investigation.ts';
import { 
  ShieldCheck, 
  FileCheck2, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  Search, 
  Hash,
  AlertCircle,
  FileSignature
} from 'lucide-react';
import { authenticateAndApprove, submitElectronicSignature, verifyAuditIntegrity, AuditIntegrityResult } from '../../services/apiClient.ts';

interface AuditSignaturesTabProps {
  investigation: Investigation;
  onUpdate: (updated: Investigation) => void;
}

export const AuditSignaturesTab: React.FC<AuditSignaturesTabProps> = ({
  investigation,
  onUpdate
}) => {
  const [showSignModal, setShowSignModal] = useState(false);
  const [signerName, setSignerName] = useState('Dr. Elena Rostova');
  const [signerEmail, setSignerEmail] = useState('e.rostova@pharmamanuf.demo');
  const [signerRole, setSignerRole] = useState<'Lead Investigator' | 'QA Technical Reviewer' | 'Qualified Person (QP)' | 'Operations Head'>('QA Technical Reviewer');
  const [signatureReason, setSignatureReason] = useState('I have reviewed the root cause investigation and confirm that the corrective actions address the underlying failure mechanism per ICH Q7/Q10.');
  const [auditSearch, setAuditSearch] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [approvalEmail, setApprovalEmail] = useState('');
  const [approvalPassword, setApprovalPassword] = useState('');
  const [approvalReason, setApprovalReason] = useState('I reviewed the investigation record and approve it to proceed to the next quality review stage.');
  const [approvalNotice, setApprovalNotice] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [integrity, setIntegrity] = useState<AuditIntegrityResult | null>(null);
  const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);

  const signatures = investigation.electronicSignatures || [];
  const logs = investigation.auditLogs || [];

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName) return;

    setIsSigning(true);
    try {
      const updated = await submitElectronicSignature(
        investigation.id,
        signerName,
        signerEmail,
        signerRole,
        signatureReason
      );

      if (updated) {
        onUpdate(updated);
      }
      setShowSignModal(false);
    } catch (err) {
      console.error('Signature submission failed:', err);
    } finally {
      setIsSigning(false);
    }
  };

  const handleAuthenticatedApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApproving(true); setApprovalNotice('');
    try {
      const updated = await authenticateAndApprove(investigation.id, approvalEmail, approvalPassword, approvalReason);
      onUpdate(updated); setApprovalPassword(''); setApprovalNotice('Authenticated QA approval recorded with a dossier checksum and audit entry.');
    } catch (error) {
      setApprovalNotice(error instanceof Error ? error.message : 'Approval could not be recorded. Check reviewer configuration and API connection.');
    } finally { setIsApproving(false); }
  };
  const handleVerifyIntegrity = async () => {
    setIsCheckingIntegrity(true);
    try { setIntegrity(await verifyAuditIntegrity(investigation.id)); }
    catch (error) { setIntegrity({ valid: false, hashedEntries: 0, legacyUnhashedEntries: 0, scope: error instanceof Error ? error.message : 'Could not verify audit chain.' }); }
    finally { setIsCheckingIntegrity(false); }
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.operator.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.hash.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-teal-800/70 bg-teal-950/20 p-5">
        <div className="border-b border-teal-900/70 pb-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-teal-100"><ShieldCheck className="h-4 w-4 text-teal-300" />Authenticated QA review</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">Re-enter a configured QA reviewer or QP password to record an approval against this exact dossier version. A checksum and tamper-evident application audit entry are stored. This prototype is not validated for regulated electronic signatures.</p>
        </div>
        <form onSubmit={handleAuthenticatedApproval} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="text-xs text-slate-300">Reviewer email<input type="email" required autoComplete="username" value={approvalEmail} onChange={e => setApprovalEmail(e.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2.5 text-slate-100" /></label>
          <label className="text-xs text-slate-300">Re-enter password<input type="password" required autoComplete="current-password" value={approvalPassword} onChange={e => setApprovalPassword(e.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2.5 text-slate-100" /></label>
          <label className="text-xs text-slate-300 md:col-span-2">Approval reason<textarea minLength={8} required rows={2} value={approvalReason} onChange={e => setApprovalReason(e.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2.5 text-slate-100" /></label>
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
            <p role="status" className="text-xs text-teal-200">{approvalNotice || 'Configure reviewer accounts in backend/.env to enable authenticated approval.'}</p>
            <button type="submit" disabled={isApproving || !approvalEmail || !approvalPassword} className="rounded bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50">{isApproving ? 'Verifying reviewer…' : 'Authenticate & approve'}</button>
          </div>
        </form>
      </section>

      {/* Demonstration review acknowledgement; not an electronic signature system */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-emerald-400" />
              <span>Human review acknowledgements</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Demo acknowledgements are recorded in the activity history; this prototype does not authenticate identity or provide compliant electronic signatures.
            </p>
          </div>

          <button
            onClick={() => setShowSignModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors self-start sm:self-auto"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Record review acknowledgement</span>
          </button>
        </div>

        {/* Existing Signatures Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {signatures.length === 0 ? (
            <div className="col-span-2 p-6 text-center text-slate-500 bg-slate-950/40 border border-slate-800 rounded-lg text-xs">
              No review acknowledgements recorded yet.
            </div>
          ) : (
            signatures.map(sig => (
              <div 
                key={sig.id}
                className="p-4 bg-slate-950 border border-emerald-900/40 rounded-lg text-xs space-y-2.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-slate-100">{sig.signerName}</span>
                    </div>
                    <span className="text-[11px] text-teal-400 font-mono block mt-0.5">{sig.role}</span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {sig.isVerified ? 'AUTHENTICATED APPROVAL · PROTOTYPE' : 'DEMO ACKNOWLEDGEMENT'}
                  </span>
                </div>

                <div className="text-slate-300 text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800/60 leading-relaxed italic">
                  "{sig.reason}"
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-500 gap-1">
                  <span>Acknowledged: {new Date(sig.timestamp).toLocaleString()}</span>
                  <span>{sig.isVerified ? 'Credentials checked by configured reviewer service · prototype control' : 'Demo record only · identity not verified'}</span>
                </div>
                {sig.isVerified && sig.sha256Checksum && <div className="break-all font-mono text-[10px] text-slate-500">Reviewed dossier SHA-256: {sig.sha256Checksum}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Demonstration activity history */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Investigation activity history</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological activity entries for this demonstration record. This log is not an immutable compliance record.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button type="button" onClick={handleVerifyIntegrity} disabled={isCheckingIntegrity} className="rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-teal-600 disabled:opacity-50">{isCheckingIntegrity ? 'Checking…' : 'Verify audit chain'}</button>
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter audit log..."
              value={auditSearch}
              onChange={e => setAuditSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
          </div>
        </div>
        {integrity && <div role="status" className={`mt-3 rounded border p-3 text-xs ${integrity.valid ? 'border-emerald-800 bg-emerald-950/30 text-emerald-200' : 'border-amber-800 bg-amber-950/30 text-amber-200'}`}>
          <strong>{integrity.valid ? 'Application audit-chain check passed' : 'Audit-chain check needs review'}</strong>
          <span className="ml-2">{integrity.hashedEntries} protected entries · {integrity.legacyUnhashedEntries} earlier un-hashed entries</span>
          <p className="mt-1 text-slate-400">{integrity.scope}</p>
        </div>}

        {/* Audit Log Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/60">
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Operator / Authority</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Event Details</th>
                <th className="py-2.5 px-3 text-right">Reference value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/20 text-xs">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    {log.operator}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[11px] text-teal-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-md">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[10px] text-slate-500">
                    {log.hash.substring(0, 12)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Execution Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">
                Record a review acknowledgement
              </h3>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400 text-xs leading-relaxed">
              <span className="font-semibold text-slate-200">Demo notice:</span> This records a user-entered acknowledgement for <span className="font-mono text-teal-400">{investigation.id}</span>. It does not authenticate identity or constitute an electronic signature or approval.
            </div>

            <form onSubmit={handleSign} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Reviewer name</label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={e => setSignerName(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reviewer email</label>
                <input
                  type="email"
                  required
                  value={signerEmail}
                  onChange={e => setSignerEmail(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reviewer role</label>
                <select
                  value={signerRole}
                  onChange={e => setSignerRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                >
                  <option value="Lead Investigator">Lead Investigator (Author)</option>
                  <option value="QA Technical Reviewer">QA Technical Reviewer (Quality Unit)</option>
                  <option value="Qualified Person (QP)">Qualified Person (QP - Batch Disposition)</option>
                  <option value="Operations Head">Operations Head (Engineering/Manufacturing)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Review note</label>
                <textarea
                  rows={2}
                  required
                  value={signatureReason}
                  onChange={e => setSignatureReason(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigning}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded disabled:opacity-50"
                >
                  {isSigning ? 'Saving…' : 'Save acknowledgement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
