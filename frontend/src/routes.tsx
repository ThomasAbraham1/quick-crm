
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LaunchCampaign from './components/LaunchCampaign';
import TemplatesPage from './pages/TemplatesPage';
import ContactsPage from './pages/ContactsPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetail from './pages/CampaignDetail';

// Placeholder pages for now
const Dashboard = () => <LaunchCampaign />;

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="templates" element={<TemplatesPage />} />
                    <Route path="contacts" element={<ContactsPage />} />
                    <Route path="campaigns" element={<CampaignsPage />} />
                    <Route path="campaigns/:id" element={<CampaignDetail />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
