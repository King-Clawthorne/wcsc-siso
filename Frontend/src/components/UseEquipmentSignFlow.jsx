import { useState } from 'react';
import { getStudent, equipmentSignOut } from '@/services/api.js';

// Shared state + handlers for the "scan student, then scan equipment" flow
// used by both SignInEquipmentPage and SignOutEquipmentPage. The two pages
// call the same /api/equipment/signout endpoint; the backend toggles the
// equipment in or out depending on its current state. Only the copy/labels
// differ between sign-in and sign-out, which stays in the page components.
export function useEquipmentSignFlow() {
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

  // Full reset: back to scanning a student from scratch.
  function reset() {
    setStudent(null);
    setEquipmentBarcode(null);
    setResult(null);
    setError(null);
    setStudentScanKey((k) => k + 1);
    setEquipmentScanKey((k) => k + 1);
  }

  // Partial reset: keep the current student, go back to scanning equipment.
  function resetEquipmentScan() {
    setEquipmentBarcode(null);
    setResult(null);
    setError(null);
    setEquipmentScanKey((k) => k + 1);
  }

  return {
    student,
    equipmentBarcode,
    result,
    error,
    loading,
    studentScanKey,
    equipmentScanKey,
    handleStudentScan,
    handleEquipmentScan,
    reset,
    resetEquipmentScan,
  };
}
