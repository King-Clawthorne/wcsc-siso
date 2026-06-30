import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage.jsx';
import SignInPage from '@/pages/SignInPage.jsx';
import SignOutPage from '@/pages/SignOutPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-out" element={<SignOutPage />} />
    </Routes>
  );
}
