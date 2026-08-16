import { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-emerald-400 w-4 h-4" />
            <h3 className="font-semibold text-white text-sm">Upload Receipt / Statement</h3>
          </div>
          <button onClick={resetModal} className="text-neutral-500 hover:text-white p-1 rounded-lg hover:bg-neutral-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!result ? (
            <>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border border-dashed border-neutral-800 hover:border-emerald-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-900/30"
              >
                <UploadCloud className="w-8 h-8 text-emerald-400 mb-3 stroke-1" />
                <p className="text-xs font-medium text-neutral-200">
                  {file ? file.name : 'Drag and drop file here, or click to browse'}
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">Supports JPG, PNG, WEBP receipts & PDF statements</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,.pdf,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="document-input"
                />
                <label
                  htmlFor="document-input"
                  className="mt-4 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 rounded-lg cursor-pointer border border-neutral-800 transition-colors"
                >
                  Select File
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>ARTHA Vision Extracting Receipt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Upload & Auto-Extract</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                <CheckCircle className="text-emerald-400 shrink-0 w-5 h-5" />
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400">Document Processed!</h4>
                  <p className="text-xs text-neutral-300">{result.message}</p>
                </div>
              </div>

              {result.extracted_data && (
                <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-2 text-xs">
                  <h5 className="font-semibold text-neutral-200 mb-2">Extracted Transaction:</h5>
                  <div className="flex justify-between text-neutral-400">
                    <span>Merchant:</span>
                    <span className="font-medium text-white">{result.extracted_data.merchant}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Amount:</span>
                    <span className="font-medium text-emerald-400">₹{result.extracted_data.amount}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Category:</span>
                    <span className="font-medium text-white">{result.extracted_data.category}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Date:</span>
                    <span className="font-medium text-white">{result.extracted_data.date}</span>
                  </div>
                </div>
              )}

              <button
                onClick={resetModal}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer border border-neutral-800"
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