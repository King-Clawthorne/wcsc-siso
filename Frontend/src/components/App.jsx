import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage.jsx';

// Heavy routes (they pull in the @zxing barcode scanner) are code-split so the
// initial bundle only contains the HomePage. Each page is fetched on demand the
// first time its route is visited.
const SignInPage = lazy(() => import('@/pages/SignInPage.jsx'));
const SignOutPage = lazy(() => import('@/pages/SignOutPage.jsx'));
const SignInEquipmentPage = lazy(() => import('@/pages/SignInEquipmentPage.jsx'));
const SignOutEquipmentPage = lazy(() => import('@/pages/SignOutEquipmentPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={<div className="scan-status">Loading…</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-out" element={<SignOutPage />} />
        <Route path="/sign-in-equipment" element={<SignInEquipmentPage />} />
        <Route path="/sign-out-equipment" element={<SignOutEquipmentPage />} />
      </Routes>
    </Suspense>
  );
}
