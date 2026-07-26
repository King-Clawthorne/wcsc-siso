import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Defer the camera/barcode bundle (@zxing) until the scanner is actually shown.
import '../index.css';

// Sign Out Equipment = a student leaving school. Scans a barcode, looks the student
// up, then POSTs to /api/student/leave (backend toggles them out).
export default function SignOutEquipmentPage() {
    const navigate = useNavigate();

    return (
        <div className="sign-out-equipment">
            <h1>Sign Out Equipment</h1>
            {/* Add your sign-out equipment form or content here */}
        </div>
    );
}
