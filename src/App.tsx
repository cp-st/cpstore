/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import DashboardHome from './pages/DashboardHome';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import AddFunds from './pages/AddFunds';
import AdminServices from './pages/AdminServices';
import AdminDeposits from './pages/AdminDeposits';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/register" element={<AuthPage type="register" />} />

            {/* Dashboard Routes (Protected) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardHome />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/new-order" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NewOrder />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/dashboard/orders" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Orders />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/add-funds" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AddFunds />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Minimal Placeholder for missing pages to avoid errors */}
            <Route path="/dashboard/services" element={<ProtectedRoute><DashboardLayout><div className="py-20 text-center font-bold opacity-20 uppercase tracking-widest">Services Page Coming Soon</div></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/api" element={<ProtectedRoute><DashboardLayout><div className="py-20 text-center font-bold opacity-20 uppercase tracking-widest">API Documentation Coming Soon</div></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/tickets" element={<ProtectedRoute><DashboardLayout><div className="py-20 text-center font-bold opacity-20 uppercase tracking-widest">Support Tickets Coming Soon</div></DashboardLayout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <DashboardLayout>
                    <AdminServices />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/deposits" 
              element={
                <ProtectedRoute adminOnly>
                  <DashboardLayout>
                    <AdminDeposits />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <FloatingWhatsApp />
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#1A1A1E',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600'
              }
            }}
          />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
