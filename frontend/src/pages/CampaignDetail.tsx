import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Mail, Eye, XCircle, Clock } from 'lucide-react';

interface Campaign {
    _id: string;
    name: string;
    templateId: string;
    totalContacts: number;
    sentCount: number;
    openedCount: number;
    failedCount: number;
    status: string;
    createdAt: string;
}

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCampaign();
            // Poll every 3 seconds for live updates
            const interval = setInterval(fetchCampaign, 3000);
            return () => clearInterval(interval);
        }
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const res = await api.get(`/api/campaigns/${id}`);
            setCampaign(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching campaign:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading campaign...</div>;
    }

    if (!campaign) {
        return <div className="text-center py-20 text-gray-500">Campaign not found</div>;
    }

    const progress = campaign.totalContacts > 0
        ? ((campaign.sentCount + campaign.failedCount) / campaign.totalContacts) * 100
        : 0;

    const openRate = campaign.sentCount > 0
        ? ((campaign.openedCount / campaign.sentCount) * 100).toFixed(1)
        : '0.0';

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/campaigns')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{campaign.name}</h1>
                    <p className="text-sm text-gray-500">Created {new Date(campaign.createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Campaign Progress</span>
                    <span className="text-sm font-semibold text-blue-600">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    {campaign.sentCount + campaign.failedCount} of {campaign.totalContacts} processed
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail size={20} className="text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Sent</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{campaign.sentCount}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Eye size={20} className="text-green-600" />
                        <span className="text-xs font-medium text-green-700">Opened</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{campaign.openedCount}</p>
                    <p className="text-xs text-green-600 mt-1">{openRate}% open rate</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle size={20} className="text-red-600" />
                        <span className="text-xs font-medium text-red-700">Failed</span>
                    </div>
                    <p className="text-3xl font-bold text-red-900">{campaign.failedCount}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={20} className="text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Pending</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {campaign.totalContacts - campaign.sentCount - campaign.failedCount}
                    </p>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${campaign.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {campaign.status === 'running' ? '🔄 Running' : '✅ Completed'}
                </span>
            </div>
        </div>
    );
};

export default CampaignDetail;
