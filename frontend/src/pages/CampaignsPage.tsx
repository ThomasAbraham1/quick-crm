import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Mail, Eye } from 'lucide-react';
import { useCampaigns } from '../hooks';

const CampaignsPage = () => {
    const navigate = useNavigate();
    const { data: campaigns = [], isLoading, error } = useCampaigns();

    if (isLoading) {
        return <div className="text-center py-20 text-gray-500">Loading campaigns...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error loading campaigns</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Campaigns</h1>
                <button
                    onClick={() => navigate('/launch-campaign')}
                    className="btn-primary"
                >
                    + New Campaign
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-20">
                    <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-4">No campaigns yet</p>
                    <button
                        onClick={() => navigate('/launch-campaign')}
                        className="btn-primary"
                    >
                        Create Your First Campaign
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {campaigns.map((campaign) => {
                        const progress = campaign.totalContacts > 0
                            ? ((campaign.sentCount + campaign.failedCount) / campaign.totalContacts) * 100
                            : 0;

                        return (
                            <div
                                key={campaign._id}
                                onClick={() => navigate(`/campaigns/${campaign._id}`)}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{campaign.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Created {new Date(campaign.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${campaign.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {campaign.status === 'running' ? '🔄 Running' : '✅ Completed'}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Progress</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Mail size={18} className="text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Sent</p>
                                            <p className="font-semibold text-gray-800">{campaign.sentCount}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye size={18} className="text-green-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Opened</p>
                                            <p className="font-semibold text-gray-800">{campaign.openedCount}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 size={18} className="text-gray-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Total</p>
                                            <p className="font-semibold text-gray-800">{campaign.totalContacts}</p>
                                        </div>
                                    </div>
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
