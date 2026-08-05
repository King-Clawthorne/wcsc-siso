import StudentLeavePage from '@/components/StudentLeavePage.jsx';
import { studentLeave } from '@/services/api.js';
import '../index.css';

// Sign In = a student returning to school. Scans a barcode, looks the student
// up, then POSTs to /api/student/leave (backend toggles them back in).
export default function SignInPage() {
  return (
    <StudentLeavePage
      title="Sign In"
      successTitle="Signed in"
      getConfirmLabel={(student) => `Sign ${student.name_first} back in`}
      onConfirm={(student) => studentLeave({ barcode: student.id })}
      renderSuccessDetails={({ result }) => (
        <p className="scan-status">Returned at: {result.time_in}</p>
      )}
    />
  );
}
