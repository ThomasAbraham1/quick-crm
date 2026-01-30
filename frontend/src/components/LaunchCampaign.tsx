import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Send } from 'lucide-react';

const LaunchCampaign = () => {
    const [templateId, setTemplateId] = useState(() => localStorage.getItem('campaign_templateId') || '');
    const [jsonInput, setJsonInput] = useState(() => localStorage.getItem('campaign_jsonInput') || '[{"email": "test@example.com", "name": "Test User"}]');
    const [status, setStatus] = useState('');

    // Safety Modal State
    const [checkResult, setCheckResult] = useState<any>(null); // { duplicates: [], total: 0 }
    const [showModal, setShowModal] = useState(false);

    // Persist to LocalStorage whenever inputs change
    useEffect(() => {
        localStorage.setItem('campaign_templateId', templateId);
        localStorage.setItem('campaign_jsonInput', jsonInput);
    }, [templateId, jsonInput]);

    const getCleanContacts = () => {
        // Simplified Robust Cleaning:
        const sanitizedInput = jsonInput
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u0000-\u001F]/g, ' ');
        return JSON.parse(sanitizedInput);
    };

    const handlePreCheck = async () => {
        try {
            setStatus('Checking...');
            const contacts = getCleanContacts();

            // Polish: Trim whitespace
            const polishedContacts = Array.isArray(contacts) ? contacts.map((c: any) => ({
                ...c,
                email: c.email?.trim(),
                name: c.name?.trim()
            })) : [];

            if (polishedContacts.length === 0) {
                alert('No valid contacts found in JSON');
                setStatus('');
                return;
            }

            const res = await axios.post('/api/mail/check-campaign', {
                templateId,
                contacts: polishedContacts
            });

            setCheckResult(res.data);

            // If duplicates found, show warning. If not, just launch.
            if (res.data.duplicateCount > 0) {
                setShowModal(true);
                setStatus('');
            } else {
                // No duplicates, safe to auto-launch
                launchActual(false, polishedContacts);
            }

        } catch (err: any) {
            console.error(err);
            setStatus('Error: ' + err.message);
        }
    };

    const launchActual = async (force: boolean, contactsOverride?: any[]) => {
        try {
            setShowModal(false);
            setStatus('Launching...');

            const contacts = contactsOverride || getCleanContacts(); // Use override if passed, else re-parse

            // Polish again just in case (redundant if override passed but safe)
            const polishedContacts = Array.isArray(contacts) ? contacts.map((c: any) => ({
                ...c,
                email: c.email?.trim(),
                name: c.name?.trim()
            })) : [];
            // console.log(polishedContacts, templateId, force)
            const res = await axios.post('/api/mail/launch', {
                templateId,
                contacts: polishedContacts,
                force
            });

            setStatus(force ? '⚠️ Launched with FORCE (Duplicates included)' : '✅ Campaign Launched!');

            // Redirect to campaign detail page
            if (res.data.campaignId) {
                setTimeout(() => {
                    window.location.href = `/campaigns/${res.data.campaignId}`;
                }, 1500);
            }

        } catch (err: any) {
            setStatus('Error launching: ' + err.message);
        }
    };

    const createTestTemplate = async () => {
        try {
            const res = await axios.post('/api/mail/template', {
                subject: "Hello {{name}}",
                body: "This is a test email for {{name}}."
            });
            setTemplateId(res.data._id);
            alert('Created Template ID: ' + res.data._id);
        } catch (err) {
            alert('Error creating template');
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl relative">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">🚀 Launch Campaign</h1>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">1. Template</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Paste Template ID"
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="flex-1 p-2 border rounded"
                    />
                    <button onClick={createTestTemplate} className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
                        Create Test Template
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">2. Contacts (JSON)</label>
                <textarea
                    rows={6}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full p-2 border rounded font-mono text-sm"
                />
            </div>

            <button
                onClick={handlePreCheck}
                disabled={status === 'Checking...' || status === 'Launching...'}
                className={`w-full py-3 rounded-lg font-semibold transition text-white ${status.includes('...') ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {status || 'Check & Launch Campaign'}
            </button>

            {/* Warning Modal */}
            {showModal && checkResult && (
                <div className="absolute inset-x-0 top-0 bg-white p-6 shadow-2xl rounded-xl border-2 border-orange-200 z-10 animate-fade-in">
                    <div className="flex items-center gap-3 text-orange-600 mb-4">
                        <AlertTriangle size={32} />
                        <h2 className="text-xl font-bold">Duplicate Warning</h2>
                    </div>

                    <p className="mb-4 text-gray-700">
                        We found <strong>{checkResult.duplicateCount}</strong> duplicate(s) out of <strong>{checkResult.total}</strong> contacts.
                        <br />
                        These people have <strong>already received</strong> this template.
                    </p>

                    <div className="mb-4 p-3 bg-gray-50 rounded text-xs font-mono max-h-32 overflow-y-auto border">
                        {checkResult.duplicates.join(', ')}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => launchActual(false)}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            Skip Duplicates ({checkResult.newContacts} new)
                        </button>

                        <button
                            onClick={() => launchActual(true)}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 text-sm"
                        >
                            Force Send All (Risk Spam)
                        </button>

                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            {/* Status Output */}
            {/* {status && !showModal && (
                    <div className={`mt-4 p-3 rounded-lg text-center font-medium ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {status}
                    </div>
                )} */}
        </div>
    );
};

export default LaunchCampaign;
