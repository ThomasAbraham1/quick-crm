import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';
import JoditEditor from 'jodit-react';
import { useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate, type Template } from '../hooks';

const TemplatesPage = () => {
    // Use TanStack Query hooks instead of manual state management
    const { data: templates = [], isLoading, error } = useTemplates();
    const createTemplate = useCreateTemplate();
    const updateTemplate = useUpdateTemplate();
    const deleteTemplate = useDeleteTemplate();

    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({});

    const handleSave = async () => {
        if (currentTemplate._id) {
            // Update existing template
            await updateTemplate.mutateAsync({
                id: currentTemplate._id,
                updates: currentTemplate
            });
        } else {
            // Create new template - 'name' is required but not in the form, use subject as name
            await createTemplate.mutateAsync({
                name: currentTemplate.subject || 'Untitled Template',
                subject: currentTemplate.subject || '',
                body: currentTemplate.body || ''
            });
        }
        setIsEditing(false);
        setCurrentTemplate({});
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await deleteTemplate.mutateAsync(id);
    }

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        alert('Template ID copied: ' + id);
    }

    const config = React.useMemo(() => ({
        readonly: false,
        height: 400,
        toolbarAdaptive: false,
        askBeforePasteHTML: true,
        askBeforePasteFromWord: true,
        // defaultActionOnPaste: 'insert_as_html', // Removed to allow the dialog to appear
        buttons: [
            'source', '|',
            'bold', 'strikethrough', 'underline', 'italic', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'fullsize',
        ]
    }), []);

    if (isLoading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
                    <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="text-center py-8 mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading your templates...
                    </div>
                </div>
                <div className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="h-6 bg-gray-200 rounded w-2/5 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error loading templates</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
                <button
                    onClick={() => { setCurrentTemplate({}); setIsEditing(true); }}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    <Plus size={18} />
                    <span>New Template</span>
                </button>
            </div>

            {/* No templates yet */}
            {!isLoading && !error && (isEditing ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                    <h2 className="text-lg font-semibold mb-4">{currentTemplate._id ? 'Edit Template' : 'Create Template'}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Subject</label>
                            <input
                                className="w-full border p-2 rounded-lg"
                                value={currentTemplate.subject || ''}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                                placeholder="Hello {{name}}"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Body</label>
                            <div className="mb-12">
                                <JoditEditor
                                    value={currentTemplate.body || ''}
                                    onBlur={(newContent: string) => setCurrentTemplate({ ...currentTemplate, body: newContent })}
                                    config={config}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Template</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                            <h3 className="font-semibold text-gray-800 mb-2 truncate">{t.subject}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4" dangerouslySetInnerHTML={{ __html: t.body }}></p>
                            <div className="flex justify-end gap-2 border-t pt-3">
                                <button onClick={() => handleCopyId(t._id)} className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50" title="Copy ID">
                                    <Copy size={16} />
                                </button>
                                <button onClick={() => { setCurrentTemplate(t); setIsEditing(true); }} className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(t._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            )}
        </div >
    );
};

export default TemplatesPage;
