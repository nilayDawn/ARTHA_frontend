import { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  Receipt,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError('Could not retrieve uploaded financial documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setUploadSuccess(null);

      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadDocument(formData);
      
      setUploadSuccess({
        message: res.message || 'File processed successfully!',
        extracted: res.extracted_data
      });

      // Refresh list
      await fetchDocs();
    } catch (err) {
      console.error('File upload failed:', err);
      setError(err.response?.data?.detail || 'Failed to upload document.');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      setDeletingId(id);
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => String(d.id) !== String(id)));
    } catch (err) {
      console.error('Failed to delete document:', err);
      alert(err.response?.data?.detail || 'Failed to delete document.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5 w-full max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Documents & Receipts"
        subtitle="Upload receipts or bank statements for ARTHA Vision extraction & transaction logging"
      />

      {/* Upload Zone */}
      <div className="bg-neutral-950 border border-neutral-900 border-dashed rounded-xl p-6 text-center space-y-3 relative">
        <input
          type="file"
          accept="image/*,.pdf,.csv"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
        
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            {uploading ? 'Processing document with ARTHA Vision...' : 'Click or Drag & Drop receipt photo / bank statement'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Supports JPG, PNG, WEBP receipts & PDF statements</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[11px] text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>ARTHA Vision OCR auto-extracts merchant, amount, category & date</span>
        </div>
      </div>

      {/* Notifications */}
      <ErrorAlert message={error} />

      {uploadSuccess && (
        <div className="py-3 px-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg space-y-1.5">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{uploadSuccess.message}</span>
          </div>
          {uploadSuccess.extracted && (
            <div className="pl-6 text-[11px] text-neutral-300 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-emerald-500/10">
              <div><span className="text-neutral-500">Merchant:</span> {uploadSuccess.extracted.merchant}</div>
              <div><span className="text-neutral-500">Amount:</span> ₹{uploadSuccess.extracted.amount}</div>
              <div><span className="text-neutral-500">Category:</span> {uploadSuccess.extracted.category}</div>
              <div><span className="text-neutral-500">Date:</span> {uploadSuccess.extracted.date}</div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-900 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Uploaded Documents ({documents.length})</h3>
        </div>

        {loading ? (
          <LoadingState message="Loading document library..." />
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents uploaded yet"
            subtitle="Upload receipts or PDF bank statements above"
          />
        ) : (
          <div className="divide-y divide-neutral-900">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-emerald-400">
                    {doc.document_type === 'receipt' ? (
                      <Receipt className="w-4 h-4" />
                    ) : (
                      <FileCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200 capitalize">
                      {doc.document_type || 'Financial Document'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Uploaded on {doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.signed_url && (
                    <a
                      href={doc.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors flex items-center gap-1 text-xs"
                      title="View File"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="p-1.5 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-30 cursor-pointer"
                    title="Delete Document"
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
