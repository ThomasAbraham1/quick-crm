
import React, { useState, useEffect } from 'react';
import { X, Save, User, Calendar, FileText } from 'lucide-react';
import axios from 'axios';

interface Contact {
    _id: string;
    email: string;
    name: string;
    phone?: string;
    notes?: string;
    assignee?: string; // ID of team member
    callbackDate?: string;
}

interface TeamMember {
    _id: string;
    name: string;
}

interface ContactEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact | null;
    onSave: () => void;
}

const ContactEditModal: React.FC<ContactEditModalProps> = ({ isOpen, onClose, contact, onSave }) => {
    const [formData, setFormData] = useState<Partial<Contact>>({});
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || '',
                email: contact.email || '',
                phone: contact.phone || '',
                notes: contact.notes || '',
                assignee: contact.assignee || '',
                callbackDate: contact.callbackDate ? contact.callbackDate.split('T')[0] : ''
            });
        }
        fetchTeam();
    }, [contact]);

    const fetchTeam = async () => {
        try {
            const res = await axios.get('/api/team');
            setMembers(res.data);
        } catch (err) {
            console.error("Failed to fetch team", err);
        }
    };

    const handleSubmit = async () => {
        if (!contact?._id) return;
        setLoading(true);
        try {
            await axios.put(`/api/contacts/${contact._id}`, formData);
            onSave();
            onClose();
        } catch (err) {
            alert('Failed to update contact');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !contact) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Edit Contact</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase mb-1">
                                    <User size={14} /> Assignee
                                </label>
                                <select
                                    className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.assignee}
                                    onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {members.map(m => (
                                        <option key={m._id} value={m._id}>{m.name}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-blue-600 mt-1">Select a team member specific to this lead.</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase mb-1">
                                    <Calendar size={14} /> Callback Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.callbackDate}
                                    onChange={e => setFormData({ ...formData, callbackDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                            <FileText size={14} /> Notes
                        </label>
                        <textarea
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm leading-relaxed"
                            placeholder="Add important details about this contact..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition font-medium text-sm">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactEditModal;
