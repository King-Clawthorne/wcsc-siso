import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentCard from '@/components/StudentCard.jsx';
import { getStudent } from '@/services/api.js';

// Defer the camera/barcode bundle (@zxing) until the scanner is actually shown.
const BarcodeScanner = lazy(() => import('@/components/BarcodeScanner.jsx'));

export default function StudentLeavePage({
  title,
  successTitle,
  getConfirmLabel,
  onConfirm,
  renderFormFields,
  renderSuccessDetails,
}) {
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
      const res = await onConfirm(student);
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
          <h1 className="scan-title">{title}</h1>
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
            {renderFormFields?.({ student })}
            <button
              type="button"
              className="action-btn"
              disabled={loading}
              onClick={handleConfirm}
            >
              {getConfirmLabel(student)}
            </button>
          </div>
        )}

        {result && (
          <div className="scan-fields">
            <h2 className="scan-title">{successTitle}</h2>
            {renderSuccessDetails?.({ result, student })}
            <button type="button" className="action-btn" onClick={reset}>
              Scan another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}