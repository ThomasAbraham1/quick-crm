import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-8">Last Updated: February 17, 2026</p>

                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 mb-4">
                            By accessing and using Quick CRM ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                        <p className="text-gray-600 mb-4">
                            Quick CRM is a customer relationship management platform that allows you to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Manage contacts and leads</li>
                            <li>Create and send email campaigns via Gmail integration</li>
                            <li>Track email performance and engagement</li>
                            <li>Collaborate with team members</li>
                            <li>Store and organize customer data</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Account Creation</h3>
                        <p className="text-gray-600 mb-4">
                            You must create an account to use the Service. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Account Security</h3>
                        <p className="text-gray-600 mb-4">
                            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Google OAuth Integration</h2>
                        <p className="text-gray-600 mb-4">
                            By connecting your Google account:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>You authorize Quick CRM to send emails on your behalf through Gmail</li>
                            <li>You grant us access to your basic profile information</li>
                            <li>You acknowledge that emails sent through our platform will appear to come from your Gmail account</li>
                            <li>You can revoke this access at any time through your Google Account settings</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Acceptable Use</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Prohibited Activities</h3>
                        <p className="text-gray-600 mb-4">You agree NOT to:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Send spam or unsolicited commercial emails</li>
                            <li>Violate any laws, regulations, or third-party rights</li>
                            <li>Upload viruses, malware, or harmful code</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Harass, abuse, or harm others</li>
                            <li>Use the service for illegal activities</li>
                            <li>Impersonate others or misrepresent your identity</li>
                            <li>Scrape, copy, or reverse engineer our platform</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Email Compliance</h3>
                        <p className="text-gray-600 mb-4">
                            You must comply with all applicable email marketing laws including CAN-SPAM Act, GDPR, and similar regulations. You are responsible for obtaining proper consent from recipients.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Content</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Ownership</h3>
                        <p className="text-gray-600 mb-4">
                            You retain all rights to the content you upload to Quick CRM, including contacts, email templates, and campaign data.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 License to Us</h3>
                        <p className="text-gray-600 mb-4">
                            You grant us a limited license to use, store, and process your content solely to provide the Service to you.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Content Responsibility</h3>
                        <p className="text-gray-600 mb-4">
                            You are solely responsible for the content you create and distribute through our platform. We are not responsible for any content created by users.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Service Availability</h2>
                        <p className="text-gray-600 mb-4">
                            We strive to provide reliable service but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service at any time with or without notice.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Intellectual Property</h2>
                        <p className="text-gray-600 mb-4">
                            Quick CRM and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Termination</h2>
                        <p className="text-gray-600 mb-4">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Violation of these Terms of Service</li>
                            <li>Fraudulent or illegal activity</li>
                            <li>Prolonged inactivity</li>
                            <li>At your request</li>
                        </ul>
                        <p className="text-gray-600 mb-4">
                            Upon termination, your right to use the Service will cease immediately. You may request a data export before deletion.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Disclaimer of Warranties</h2>
                        <p className="text-gray-600 mb-4">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Limitation of Liability</h2>
                        <p className="text-gray-600 mb-4">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUICK CRM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Indemnification</h2>
                        <p className="text-gray-600 mb-4">
                            You agree to indemnify and hold Quick CRM harmless from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
                        <p className="text-gray-600 mb-4">
                            We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Continued use of the Service after changes constitutes acceptance of the new Terms.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Governing Law</h2>
                        <p className="text-gray-600 mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">15. Contact Information</h2>
                        <p className="text-gray-600 mb-4">
                            For questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="text-gray-600 mb-2">
                            <strong>Email:</strong> cta102938@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
