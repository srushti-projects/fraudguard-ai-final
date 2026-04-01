import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ShieldAlert, AlertTriangle, Loader2, UploadCloud } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

// Maps display label → backend API type string
const TYPE_MAP = {
  'sms/chat': 'sms',
  'sms':      'sms',
  'email':    'email',
  'url':      'url',
  'image':    'image',
  'audio':    'audio',
  'video':    'video',
  'prompt injection': 'prompt',
  'jailbreak': 'jailbreak',
};

export default function ScannerModal({ type, onClose }) {
  const [content, setContent]       = useState('');
  const [senderEmail, setSender]    = useState('');
  const [file, setFile]             = useState(null);
  const [scanning, setScanning]     = useState(false);
  const [result, setResult]         = useState(null);
  const [errorMsg, setErrorMsg]     = useState('');
  const fileRef                     = useRef(null);

  // ── classify result into UI status ────────────────────────────────────
  const classify = (prediction, confidence) => {
    // prediction=1 → fraud; prediction=0 → safe
    if (prediction === 1 && confidence >= 0.8) {
      return {
        status: 'danger',
        title: 'Scam Detected',
        desc: 'High probability of malicious intent. Threat vector confirmed. Do not engage.',
        color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10',
      };
    } else if (prediction === 1 || confidence < 0.6) {
      return {
        status: 'warning',
        title: 'Suspicious',
        desc: 'Characteristics of a threat are present, but confidence is mixed. Proceed with heightened caution.',
        color: 'text-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-400/10',
      };
    } else {
      return {
        status: 'safe',
        title: 'Not a Scam',
        desc: 'No known malicious signatures or behaviors detected in tracking algorithms.',
        color: 'text-green-400', border: 'border-green-400', bg: 'bg-green-400/10',
      };
    }
  };

  // ── main scan handler ────────────────────────────────────────────────
  const handleScan = async () => {
    setErrorMsg('');

    // Normalise display label → API type (e.g. 'SMS/Chat' → 'sms')
    const apiType = TYPE_MAP[type.toLowerCase()] || type.toLowerCase();

    const isFileScan = ['image', 'audio', 'video'].includes(apiType);

    // Validate input
    if (isFileScan) {
      if (!file) { setErrorMsg(`Please select an ${apiType} file to scan.`); return; }
    } else {
      if (!content.trim()) { setErrorMsg('Please enter some content to scan.'); return; }
      if (apiType === 'email' && !senderEmail.trim()) { setErrorMsg('Sender email is required for email scans.'); return; }
    }

    setScanning(true);
    setResult(null);

    try {
      let response;

      // New direct /scan/ endpoints
      const scanUrl = `${API_BASE.replace('/api', '/scan')}/${apiType}`;

      if (isFileScan) {
        // multipart/form-data for file
        const formData = new FormData();
        formData.append('file', file);
        console.log('[SCAN] POST', scanUrl, file.name);
        response = await fetch(scanUrl, {
          method: 'POST',
          body: formData,
        });
      } else {
        const payload = {
          content: content.trim(),
          ...(apiType === 'email' && { sender: senderEmail.trim() }),
        };
        console.log('[SCAN] POST', scanUrl, payload);
        response = await fetch(scanUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[RESPONSE]', data);

      const prediction  = data.prediction ?? 0;
      const confidence  = data.confidence ?? 0;

      const statusInfo = classify(prediction, confidence);
      setResult({ type: type.toLowerCase(), prediction, confidence, ...statusInfo });

    } catch (err) {
      console.error('[SCAN ERROR]', err);
      setErrorMsg(`Scan failed: ${err.message}. Is the backend running on port 8000?`);
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setResult(null);
    setContent('');
    setSender('');
    setFile(null);
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0a0f1a]/90 backdrop-blur-2xl border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.1)] p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-wider">
            <span className="text-green-400">{type}</span> Analyzer
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm">
            Deep inspection against global intelligence bases and AI threat models.
          </p>

          {/* ── Inputs ── */}
          {!result && (
            <div className="mb-6 flex flex-col gap-4">

              {/* Type display */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Target Vector Type</label>
                <input
                  type="text"
                  value={type}
                  disabled
                  className="w-full bg-black/30 border border-white/5 rounded-lg p-3 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              {/* Email sender */}
              {type === 'Email' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-green-400 tracking-widest uppercase">Sender Email</label>
                  <input
                    id="scanner-sender-email"
                    type="email"
                    value={senderEmail}
                    onChange={e => setSender(e.target.value)}
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-green-400 transition-all"
                    placeholder="e.g. unknown-billing@example.com"
                  />
                </div>
              )}

              {/* Content / file */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-green-400 tracking-widest uppercase">Payload Content</label>

                {['Image', 'Audio', 'Video'].includes(type) ? (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-green-500/40 rounded-xl bg-black/40 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors group"
                  >
                    <UploadCloud className="w-8 h-8 text-green-500 group-hover:text-green-400 mb-2 transition-all" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {file ? file.name : `Click or drag & drop ${type.toLowerCase()} file here`}
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept={type === 'Image' ? 'image/*,.pdf' : type === 'Audio' ? 'audio/*' : 'video/*'}
                      className="hidden"
                      onChange={e => setFile(e.target.files[0] || null)}
                    />
                  </div>
                ) : type === 'URL' ? (
                  <input
                    id="scanner-url-input"
                    type="text"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-green-400 focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all"
                    placeholder="Enter URL to scan, e.g. https://example.com"
                  />
                ) : (
                  <textarea
                    id="scanner-text-input"
                    rows={type === 'Email' ? 4 : 3}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-green-400 focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all resize-none"
                    placeholder={`Paste raw ${type} content here...`}
                  />
                )}
              </div>

              {/* Error */}
              {errorMsg && (
                <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  ⚠ {errorMsg}
                </p>
              )}
            </div>
          )}

          {/* ── Scan button ── */}
          {!result && !scanning && (
            <button
              id="scanner-scan-btn"
              onClick={handleScan}
              className="w-full py-3 rounded bg-green-500 text-black font-bold hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(0,255,157,0.4)] hover:shadow-[0_0_25px_rgba(0,255,157,0.7)] text-lg uppercase tracking-widest active:scale-95"
            >
              Initiate Vector Scan
            </button>
          )}

          {/* ── Scanning animation ── */}
          {scanning && (
            <div className="w-full py-6 flex flex-col items-center justify-center border border-green-500/30 rounded bg-green-500/10">
              <Loader2 className="w-10 h-10 text-green-400 animate-spin drop-shadow-[0_0_15px_rgba(0,255,157,0.8)] mb-3" />
              <span className="font-bold text-green-400 animate-pulse tracking-widest text-sm uppercase">
                Analyzing Signatures...
              </span>
            </div>
          )}

          {/* ── Result panel ── */}
          {result && !scanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
              className={`w-full p-6 rounded-2xl border ${result.border} ${result.bg} flex items-start gap-4 shadow-lg relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className={`mt-1 flex-shrink-0 ${result.color} drop-shadow-[0_0_15px_currentColor] relative z-10`}>
                {result.status === 'safe'    && <ShieldCheck  className="w-8 h-8" />}
                {result.status === 'warning' && <AlertTriangle className="w-8 h-8" />}
                {result.status === 'danger'  && <ShieldAlert  className="w-8 h-8" />}
              </div>

              <div className="flex flex-col flex-1 relative z-10 w-full">
                <div className="flex justify-between items-center mb-2 gap-2">
                  <h4 className={`font-orbitron font-bold text-xl ${result.color} leading-tight drop-shadow-[0_0_5px_currentColor]`}>
                    {result.title}
                  </h4>
                </div>

                <p className="text-sm font-inter text-gray-200 leading-relaxed opacity-90 mb-5">{result.desc}</p>

                {/* Clean Confidence UI */}
                <div className="w-full bg-black/40 rounded-xl p-4 border border-white/10 flex flex-col gap-3 mb-5 shadow-inner">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-orbitron font-bold text-gray-400 tracking-widest uppercase">AI Confidence Target</span>
                    <span className={`text-xs font-bold ${result.color}`}>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${result.confidence * 100}%` }} 
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-current rounded-full"
                      style={{ color: result.status === 'safe' ? '#4ade80' : result.status === 'danger' ? '#f87171' : '#facc15' }}
                    />
                  </div>
                  <p className="text-[11px] font-inter text-gray-400 mt-1 leading-relaxed">
                    {result.status === 'safe' 
                      ? '✓ No suspicious patterns detected across known threat heuristics.' 
                      : result.status === 'warning'
                      ? '⚠ Contains ambiguous structural anomalies. Exercise manual verification.'
                      : '⚠ High-probability match against known malicious behavioral signatures.'}
                  </p>
                </div>

                <div className="flex border-t border-white/10 pt-4 mt-2">
                  <button
                    onClick={reset}
                    className="text-xs font-orbitron font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                  >
                    ← Scan New Payload
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
