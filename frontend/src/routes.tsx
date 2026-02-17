
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LaunchCampaign from './components/LaunchCampaign';
import TemplatesPage from './pages/TemplatesPage';
import ContactsPage from './pages/ContactsPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetail from './pages/CampaignDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import Login from './pages/Login';

// Placeholder pages for now
const Dashboard = () => <LaunchCampaign />;

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="templates" element={<TemplatesPage />} />
                            <Route path="contacts" element={<ContactsPage />} />
                            <Route path="campaigns" element={<CampaignsPage />} />
                            <Route path="campaigns/:id" element={<CampaignDetail />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};



export default AppRoutes;
