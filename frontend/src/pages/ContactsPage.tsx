import React, { useEffect, useState, useMemo } from 'react';
import { Upload, Plus, Trash2, Copy, Filter, Calendar } from 'lucide-react';
import axios from 'axios';

interface Contact {
    _id: string;
    email: string;
    name: string;
    phone?: string;
    dateAdded?: string;
}

const ContactsPage = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [jsonInput, setJsonInput] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    // Filtering & Selection
    const [filterDate, setFilterDate] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const res = await axios.get('/api/contacts');
        setContacts(res.data);
    };

    // Derived State: Filtered Contacts
    const filteredContacts = useMemo(() => {
        if (!filterDate) return contacts;
        const filterTime = new Date(filterDate).getTime();
        return contacts.filter(c => {
            if (!c.dateAdded) return false;
            return new Date(c.dateAdded).getTime() >= filterTime;
        });
    }, [contacts, filterDate]);

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredContacts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredContacts.map(c => c._id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleImport = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error('Must be an array');

            await axios.post('/api/contacts/import', { contacts: parsed });
            setIsImporting(false);
            setJsonInput('');
            fetchContacts();
        } catch (e: any) {
            alert('Invalid JSON format: ' + e.message);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await axios.delete(`/api/contacts/${id}`);
        fetchContacts();
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.size} contacts?`)) return;
        // In a real app, use a bulk delete endpoint. Here we loop (MVP style).
        for (const id of selectedIds) {
            await axios.delete(`/api/contacts/${id}`);
        }
        setSelectedIds(new Set());
        fetchContacts();
    }

    const handleCopyFilteredDocs = () => {
        // Prepare clean JSON for the Campaign Page
        const exportData = filteredContacts.map(c => ({
            name: c.name,
            email: c.email,
            phone: c.phone
        }));
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
        alert(`Copied ${exportData.length} contacts to clipboard! Paste this in the Campaign page.`);
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Contacts</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>Filter Added After:</span>
                        <input
                            type="date"
                            className="border rounded px-2 py-1"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {filterDate && (
                            <button onClick={() => setFilterDate('')} className="text-red-500 hover:underline">Clear</button>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {selectedIds.size > 0 && (
                        <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition">
                            <Trash2 size={18} />
                            <span>Delete ({selectedIds.size})</span>
                        </button>
                    )}

                    <button
                        onClick={handleCopyFilteredDocs}
                        className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                    >
                        <Copy size={18} />
                        <span>Copy Filtered JSON</span>
                    </button>

                    <button
                        onClick={() => setIsImporting(!isImporting)}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                        <Upload size={18} />
                        <span>Import JSON</span>
                    </button>
                </div>
            </div>

            {isImporting && (
                <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-2">Paste JSON Data</h3>
                    <p className="text-xs text-blue-700 mb-2">Format: <code>[{`{"email": "...", "name": "...", "phone": "..."}`}]</code></p>
                    <textarea
                        className="w-full p-3 rounded-lg border border-blue-200 mb-3 h-32 font-mono text-sm"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='[{"email":"alex@example.com", "name": "Alex", "phone": "555-0199"}]'
                    />
                    <button onClick={handleImport} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Run Import
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={filteredContacts.length > 0 && selectedIds.size === filteredContacts.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Added</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredContacts.map(c => (
                            <tr key={c._id} className={`hover:bg-gray-50/50 transition ${selectedIds.has(c._id) ? 'bg-blue-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(c._id)}
                                        onChange={() => toggleSelect(c._id)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{c.phone || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {c.dateAdded ? new Date(c.dateAdded).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(c._id)} className="text-gray-300 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredContacts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">
                                    {contacts.length === 0 ? "No contacts found. Import some!" : "No contacts match filter."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactsPage;
