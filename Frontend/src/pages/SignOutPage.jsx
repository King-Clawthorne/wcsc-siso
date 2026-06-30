import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentCard from '@/components/StudentCard.jsx';

// Defer the camera/barcode bundle (@zxing) until the scanner is actually shown.
const BarcodeScanner = lazy(() => import('@/components/BarcodeScanner.jsx'));
import { getStudent, studentLeave } from '@/services/api.js';
import '../index.css';

// Sign Out = a student leaving school. Scans a barcode, looks the student up,
// collects a destination/reason, then POSTs to /api/student/leave.
export default function SignOutPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const [destinationId, setDestinationId] = useState('');
  const [reason, setReason] = useState('');

  async function handleScan(barcode) {
    setError(null);
    setLoading(true);
    try {
      const found = await getStudent(barcode);
      setStudent(found);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      const res = await studentLeave({
        barcode: student.id,
        destinationId: destinationId ? Number(destinationId) : undefined,
        reason: reason || undefined,
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStudent(null);
    setResult(null);
    setError(null);
    setDestinationId('');
    setReason('');
    setScanKey((k) => k + 1);
  }

  return (
    <div className="scan-container">
      <div className="scan-panel glass-panel">
        <div className="scan-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1 className="scan-title">Sign Out</h1>
      </div>

      {error && <p className="scan-error">{error}</p>}
      {loading && <p className="scan-status">Loading…</p>}

      {!student && !result && (
        <Suspense fallback={<p className="scan-status">Starting camera…</p>}>
          <BarcodeScanner onScan={handleScan} resetKey={scanKey} />
        </Suspense>
      )}

      {student && !result && (
        <div className="scan-fields">
          <StudentCard student={student} />
          <label className="scan-field">
            Destination ID
            <input
              type="number"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
            />
          </label>
          <label className="scan-field">
            Reason
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="action-btn"
            disabled={loading}
            onClick={handleConfirm}
          >
            Sign {student.name_first} out
          </button>
        </div>
      )}

      {result && (
        <div className="scan-fields">
          <h2 className="scan-title">Signed out</h2>
          <p className="scan-status">Destination: {result.destination}</p>
          <p className="scan-status">Left at: {result.time_out}</p>
          <button type="button" className="action-btn" onClick={reset}>
            Scan another
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
