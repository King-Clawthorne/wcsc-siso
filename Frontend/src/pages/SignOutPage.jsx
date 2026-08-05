import { useState } from 'react';
import StudentLeavePage from '@/components/StudentLeavePage.jsx';
import { studentLeave } from '@/services/api.js';
import '../index.css';

// Sign Out = a student leaving school. Scans a barcode, looks the student up,
// collects a destination/reason, then POSTs to /api/student/leave.
export default function SignOutPage() {
  const [destinationId, setDestinationId] = useState('');
  const [reason, setReason] = useState('');

  return (
    <StudentLeavePage
      title="Sign Out"
      successTitle="Signed out"
      getConfirmLabel={(student) => `Sign ${student.name_first} out`}
      onConfirm={(student) =>
        studentLeave({
          barcode: student.id,
          destinationId: destinationId ? Number(destinationId) : undefined,
          reason: reason || undefined,
        })
      }
      renderFormFields={() => (
        <>
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
        </>
      )}
      renderSuccessDetails={({ result }) => (
        <>
          <p className="scan-status">Destination: {result.destination}</p>
          <p className="scan-status">Left at: {result.time_out}</p>
        </>
      )}
    />
  );
}
