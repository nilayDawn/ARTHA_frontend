import { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDocument } from '../services/api';

export default function DocumentUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadDocument(formData);
      setResult(res);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Document processing failed.');
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-emerald-400" size={20} />
            <h3 className="font-semibold text-slate-100">Upload Receipt / Statement</h3>
          </div>
          <button onClick={resetModal} className="text-slate-400 hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!result ? (
            <>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/30"
              >
                <UploadCloud size={40} className="text-emerald-400 mb-3" />
                <p className="text-sm font-medium text-slate-200">
                  {file ? file.name : 'Drag and drop file here, or click to browse'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP, HEIC</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={handleFileChange}
                  className="hidden"
                  id="document-input"
                />
                <label
                  htmlFor="document-input"
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg cursor-pointer border border-slate-700"
                >
                  Select File
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Gemini 2.5 Flash Analyzing Receipt...</span>
                  </>
                ) : (
                  <span>Upload & Auto-Extract</span>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-300">Document Processed!</h4>
                  <p className="text-xs text-slate-300">{result.message}</p>
                </div>
              </div>

              {result.extracted_data && (
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 space-y-2 text-xs">
                  <h5 className="font-semibold text-slate-200 mb-2">Extracted Transaction:</h5>
                  <div className="flex justify-between text-slate-300">
                    <span>Merchant:</span>
                    <span className="font-medium text-slate-100">{result.extracted_data.merchant}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Amount:</span>
                    <span className="font-medium text-emerald-400">${result.extracted_data.amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Category:</span>
                    <span className="font-medium text-slate-100">{result.extracted_data.category}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Date:</span>
                    <span className="font-medium text-slate-100">{result.extracted_data.date}</span>
                  </div>
                </div>
              )}

              <button
                onClick={resetModal}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}