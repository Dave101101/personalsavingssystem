import React, { useState } from 'react';
import { FileText, Shield, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

export const TermsOfUse = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'disclosure' | 'contact'>('terms');

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif italic text-blue-900 tracking-tight">Legal & Policies</h1>
        <p className="text-blue-600 text-sm">Important information about using First Groups Accounting</p>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-blue-200 pb-2">
        {[
          { id: 'terms', label: 'Terms of Use', icon: FileText },
          { id: 'privacy', label: 'Privacy Policy', icon: Shield },
          { id: 'disclosure', label: 'Regulatory Disclosure', icon: AlertCircle },
          { id: 'contact', label: 'Contact Info', icon: Phone },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-900 border-t border-x border-blue-200'
                : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-blue-200 rounded-2xl p-12 shadow-lg">
        {activeTab === 'terms' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif italic text-blue-900 mb-4">Terms of Service</h2>
              <p className="text-sm text-blue-600 mb-6">Last updated: February 9, 2026</p>
            </div>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">1. Acceptance of Terms</h3>
              <p className="text-blue-600 leading-relaxed">
                By accessing and using First Groups Accounting ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">2. Description of Service</h3>
              <p className="text-blue-600 leading-relaxed">
                First Groups Accounting provides a personal financial management platform designed specifically for students to develop financial discipline. The Service includes savings plans, investment marketplace access, collaborative circles, bill payment flows, and real-time balance tracking.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">3. User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-600">
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized account access</li>
                <li>Provide accurate and current information</li>
                <li>Use the Service in compliance with all applicable laws</li>
                <li>Do not attempt to gain unauthorized access to any part of the Service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">4. Financial Transactions</h3>
              <p className="text-blue-600 leading-relaxed">
                All financial transactions conducted through the Service are subject to verification and approval. We reserve the right to refuse, cancel, or limit any transaction at our discretion. Transaction fees may apply and will be clearly disclosed before confirmation.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">5. Intellectual Property</h3>
              <p className="text-blue-600 leading-relaxed">
                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, and software, are the exclusive property of First Groups Accounting and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">6. Limitation of Liability</h3>
              <p className="text-blue-600 leading-relaxed">
                First Groups Accounting shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service. We do not guarantee uninterrupted or error-free operation of the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">7. Modifications to Terms</h3>
              <p className="text-blue-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the Service. Your continued use of the Service following any changes constitutes acceptance of those changes.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif italic text-blue-900 mb-4">Privacy Policy</h2>
              <p className="text-sm text-blue-600 mb-6">Protecting your personal information</p>
            </div>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Information We Collect</h3>
              <p className="text-blue-600 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-blue-600">
                <li>Account information (name, email address, phone number)</li>
                <li>Financial data (transaction history, account balances)</li>
                <li>Profile information (savings goals, preferences)</li>
                <li>Usage data (pages visited, features used)</li>
                <li>Device information (IP address, browser type)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">How We Use Your Information</h3>
              <p className="text-blue-600 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, including to process transactions, send account notifications, provide customer support, and personalize your experience.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Data Security</h3>
              <p className="text-blue-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Information Sharing</h3>
              <p className="text-blue-600 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist in operating our platform, subject to confidentiality agreements.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Your Rights</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-600">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Cookies and Tracking</h3>
              <p className="text-blue-600 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'disclosure' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif italic text-blue-900 mb-4">Regulatory Disclosure</h2>
              <p className="text-sm text-blue-600 mb-6">Important regulatory information</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Important Notice</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    First Groups Accounting is an educational financial management platform. We are not a licensed financial institution, bank, or investment advisor. This platform is designed for personal finance education and should not be considered professional financial advice.
                  </p>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Platform Purpose</h3>
              <p className="text-blue-600 leading-relaxed">
                First Groups Accounting is specifically designed to help students develop financial discipline and money management skills. The platform provides tools for tracking savings, setting financial goals, and understanding basic investment concepts.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">No Investment Advice</h3>
              <p className="text-blue-600 leading-relaxed">
                Information provided through the Marketplace and other investment-related features is for educational purposes only. We do not provide personalized investment recommendations. Always consult with a licensed financial advisor before making investment decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Risk Disclosure</h3>
              <p className="text-blue-600 leading-relaxed">
                All financial activities carry inherent risks. Past performance does not guarantee future results. Users should carefully consider their financial situation and risk tolerance before engaging in any financial activity through the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Data Storage and Protection</h3>
              <p className="text-blue-600 leading-relaxed">
                Financial data is stored securely using industry-standard encryption. However, users are responsible for maintaining the security of their account credentials and should enable two-factor authentication where available.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Third-Party Services</h3>
              <p className="text-blue-600 leading-relaxed">
                The platform may integrate with third-party financial services. First Groups Accounting is not responsible for the practices or content of third-party services. Review their terms and privacy policies independently.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Complaint Procedures</h3>
              <p className="text-blue-600 leading-relaxed">
                If you have concerns about the platform or wish to file a complaint, please contact our support team through the channels listed in the Contact Info section. We aim to respond to all inquiries within 48 hours.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif italic text-blue-900 mb-4">Contact Information</h2>
              <p className="text-sm text-blue-600 mb-6">Get in touch with our team</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Email Support</h3>
                  <p className="text-sm text-blue-600 mb-3">For general inquiries and support</p>
                  <a href="mailto:support@firstgroupsaccounting.com" className="text-blue-600 font-bold hover:text-blue-900 transition-colors">
                    support@firstgroupsaccounting.com
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Phone Support</h3>
                  <p className="text-sm text-blue-600 mb-3">Available Mon-Fri, 9AM-5PM WAT</p>
                  <a href="tel:+2348123456789" className="text-blue-600 font-bold hover:text-blue-900 transition-colors">
                    +234 (0) 812-345-6789
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 space-y-4 md:col-span-2">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Office Address</h3>
                  <p className="text-sm text-blue-600 leading-relaxed">
                    First Groups Accounting<br />
                    456 Financial District, Victoria Island<br />
                    Lagos, Nigeria<br />
                    Postal Code: 101241
                  </p>
                </div>
              </div>
            </div>

            <section className="space-y-4 pt-6 border-t border-blue-200">
              <h3 className="text-lg font-bold text-blue-900">Support Hours</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-blue-600">Monday - Friday</span>
                  <span className="text-blue-900 font-bold">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-blue-600">Saturday</span>
                  <span className="text-blue-900 font-bold">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-blue-600">Sunday</span>
                  <span className="text-blue-900 font-bold">Closed</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-blue-600">Public Holidays</span>
                  <span className="text-blue-900 font-bold">Closed</span>
                </div>
              </div>
            </section>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h4 className="font-bold text-emerald-900 mb-2">Emergency Support</h4>
              <p className="text-sm text-emerald-800">
                For urgent account security issues, please call our 24/7 emergency hotline: <span className="font-bold">+234 (0) 800-SECURE-NOW</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
