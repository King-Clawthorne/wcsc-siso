import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentCard from '@/components/StudentCard.jsx';

// Defer the camera/barcode bundle (@zxing) until the scanner is actually shown.
const BarcodeScanner = lazy(() => import('@/components/BarcodeScanner.jsx'));
import { getStudent, equipmentSignOut } from '@/services/api.js';
import '../index.css';

// Sign In Equipment = a student returning equipment. Scans the student's
// barcode, looks them up, then scans the equipment barcode and POSTs to
// /api/equipment/signout (backend toggles the equipment back in).
export default function SignInEquipmentPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [equipmentBarcode, setEquipmentBarcode] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentScanKey, setStudentScanKey] = useState(0);
  const [equipmentScanKey, setEquipmentScanKey] = useState(0);

  async function handleStudentScan(barcode) {
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

  async function handleEquipmentScan(barcode) {
    setError(null);
    setLoading(true);
    try {
      const res = await equipmentSignOut({
        studentBarcode: student.id,
        equipmentBarcode: barcode,
      });
      setEquipmentBarcode(barcode);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStudent(null);
    setEquipmentBarcode(null);
    setResult(null);
    setError(null);
    setStudentScanKey((k) => k + 1);
    setEquipmentScanKey((k) => k + 1);
  }

  function resetEquipmentScan() {
    setEquipmentBarcode(null);
    setResult(null);
    setError(null);
    setEquipmentScanKey((k) => k + 1);
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
          <h1 className="scan-title">Sign In Equipment</h1>
        </div>

        {error && <p className="scan-error">{error}</p>}
        {loading && <p className="scan-status">Loading…</p>}

        {!student && (
          <Suspense fallback={<p className="scan-status">Starting camera…</p>}>
            <BarcodeScanner onScan={handleStudentScan} resetKey={studentScanKey} />
          </Suspense>
        )}

        {student && !result && (
          <div className="scan-fields">
            <StudentCard student={student} />
            <p className="scan-status">Now scan the equipment barcode…</p>
            <Suspense fallback={<p className="scan-status">Starting camera…</p>}>
              <BarcodeScanner onScan={handleEquipmentScan} resetKey={equipmentScanKey} />
            </Suspense>
          </div>
        )}

        {result && (
          <div className="scan-fields">
            <h2 className="scan-title">Equipment signed in</h2>
            <p className="scan-status">Barcode: {equipmentBarcode}</p>
            <p className="scan-status">Returned at: {result.time_in}</p>
            <button type="button" className="action-btn" onClick={scanAnotherItem}>
              Sign in another item for {student.name_first}
            </button>
            <button type="button" className="action-btn" onClick={reset}>
              Scan a different student
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
