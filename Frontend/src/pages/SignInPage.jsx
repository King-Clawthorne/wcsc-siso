import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScanner from '@/components/BarcodeScanner.jsx';
import StudentCard from '@/components/StudentCard.jsx';
import { getStudent, studentLeave } from '@/services/api.js';
import '../index.css';

// Sign In = a student returning to school. Scans a barcode, looks the student
// up, then POSTs to /api/student/leave (backend toggles them back in).
export default function SignInPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanKey, setScanKey] = useState(0);

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
      const res = await studentLeave({ barcode: student.id });
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
        <h1 className="scan-title">Sign In</h1>
      </div>

      {error && <p className="scan-error">{error}</p>}
      {loading && <p className="scan-status">Loading…</p>}

      {!student && !result && (
        <BarcodeScanner onScan={handleScan} resetKey={scanKey} />
      )}

      {student && !result && (
        <div className="scan-fields">
          <StudentCard student={student} />
          <button
            type="button"
            className="action-btn"
            disabled={loading}
            onClick={handleConfirm}
          >
            Sign {student.name_first} back in
          </button>
        </div>
      )}

      {result && (
        <div className="scan-fields">
          <h2 className="scan-title">Signed in</h2>
          <p className="scan-status">Returned at: {result.time_in}</p>
          <button type="button" className="action-btn" onClick={reset}>
            Scan another
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
