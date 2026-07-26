import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Defer the camera/barcode bundle (@zxing) until the scanner is actually shown.
import '../index.css';

// Sign In Equipment = a student returning to school. Scans a barcode, looks the student
export default function SignInEquipmentPage() {
    const navigate = useNavigate();

    return (
        <div className="sign-in-equipment">
            <h1>Sign In Equipment</h1>
            {/* Add your sign-in equipment form or content here */}
        </div>
    );
}
