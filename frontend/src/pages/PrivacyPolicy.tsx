import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-8">Last Updated: February 17, 2026</p>

                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                        <p className="text-gray-600 mb-4">
                            Quick CRM ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our customer relationship management platform.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Account information (name, email address, password)</li>
                            <li>Contact information for your leads and customers</li>
                            <li>Email campaign content and templates</li>
                            <li>Team member information and assignments</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Log data (IP address, browser type, access times)</li>
                            <li>Device information</li>
                            <li>Usage data and analytics</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-600 mb-4">We use the collected information to:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Provide, maintain, and improve our CRM services</li>
                            <li>Send email campaigns on your behalf</li>
                            <li>Process and manage your contacts and leads</li>
                            <li>Authenticate users via Google OAuth 2.0</li>
                            <li>Track email campaign performance (opens, clicks)</li>
                            <li>Provide customer support</li>
                            <li>Send administrative notifications</li>
                            <li>Improve user experience and platform functionality</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Google OAuth Integration</h2>
                        <p className="text-gray-600 mb-4">
                            Quick CRM uses Google OAuth 2.0 to authenticate users and send emails through Gmail. When you connect your Google account:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>We request permission to send emails on your behalf</li>
                            <li>We access your basic profile information (name, email)</li>
                            <li>We store OAuth tokens securely to maintain the connection</li>
                            <li>You can revoke access at any time through your Google Account settings</li>
                        </ul>
                        <p className="text-gray-600 mb-4">
                            <strong>Google API Services User Data Policy Compliance:</strong> Quick CRM's use of information received from Google APIs adheres to the{' '}
                            <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                Google API Services User Data Policy
                            </a>, including the Limited Use requirements.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Sharing and Disclosure</h2>
                        <p className="text-gray-600 mb-4">We do not sell your personal information. We may share your information:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li><strong>With Your Consent:</strong> When you explicitly authorize data sharing</li>
                            <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., AWS, MongoDB)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Data Security</h2>
                        <p className="text-gray-600 mb-4">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Encryption of data in transit (HTTPS/TLS)</li>
                            <li>Secure password hashing (bcrypt)</li>
                            <li>OAuth token encryption</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and authentication</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
                        <p className="text-gray-600 mb-4">
                            We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Your Rights</h2>
                        <p className="text-gray-600 mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Export your data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Revoke Google OAuth permissions</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Cookies</h2>
                        <p className="text-gray-600 mb-4">
                            We use cookies and similar technologies for authentication, preferences, and analytics. You can control cookies through your browser settings.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
                        <p className="text-gray-600 mb-4">
                            Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
                        <p className="text-gray-600 mb-4">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the platform.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
                        <p className="text-gray-600 mb-4">
                            If you have questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
