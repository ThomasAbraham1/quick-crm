import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { BarChart3, Mail, Eye, TrendingUp } from 'lucide-react';

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

const CampaignsPage = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await api.get('campaigns');
            setCampaigns(res.data);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">📊 Campaigns</h1>
                <button
                    onClick={() => navigate('/launch')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + New Campaign
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                    <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No campaigns yet. Launch your first one!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {campaigns.map(campaign => {
                        const progress = campaign.totalContacts > 0
                            ? ((campaign.sentCount + campaign.failedCount) / campaign.totalContacts) * 100
                            : 0;
                        const openRate = campaign.sentCount > 0
                            ? ((campaign.openedCount / campaign.sentCount) * 100).toFixed(1)
                            : '0';

                        return (
                            <div
                                key={campaign._id}
                                onClick={() => navigate(`/campaigns/${campaign._id}`)}
                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{campaign.name}</h3>
                                        <p className="text-xs text-gray-500">{new Date(campaign.createdAt).toLocaleString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${campaign.status === 'completed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {campaign.status === 'running' ? '🔄 Running' : '✅ Done'}
                                    </span>
                                </div>

                                <div className="flex gap-6 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-blue-500" />
                                        <span className="text-sm">
                                            <strong>{campaign.sentCount}</strong>/{campaign.totalContacts} sent
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye size={16} className="text-green-500" />
                                        <span className="text-sm">
                                            <strong>{campaign.openedCount}</strong> opened ({openRate}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CampaignsPage;
