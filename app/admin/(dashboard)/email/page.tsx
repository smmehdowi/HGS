'use client';

import { useState, useEffect } from 'react';
import { Mail, Save, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface EmailSettings {
  toEmail: string;
  ccEmail: string;
  fromName: string;
  enabled: boolean;
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>({
    toEmail: '',
    ccEmail: '',
    fromName: 'Himalayan Gulf Stones',
    enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/email')
      .then(r => r.json())
      .then(data => { setSettings(data); setLoading(false); });
  }, []);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) showToast('success', 'Email settings saved.');
    else showToast('error', 'Failed to save settings.');
  }

  async function handleTest() {
    if (!settings.toEmail) return showToast('error', 'Enter a recipient email first and save.');
    setTesting(true);
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stoneType: 'Slate', variety: 'Black Riven Slate', quantity: '50',
        dimensions: '60x60cm', thickness: '20mm', finish: 'Natural Cleft',
        projectType: 'Test', city: 'Riyadh', timeline: 'Immediate',
        name: 'Admin Test', company: 'HGS', phone: '+966500000000',
        email: settings.toEmail, contactMethod: 'email',
      }),
    });
    setTesting(false);
    if (res.ok) showToast('success', 'Test email sent! Check your inbox.');
    else showToast('error', 'Test failed. Check RESEND_API_KEY environment variable.');
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>;

  return (
    <div className="p-8 max-w-2xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
          <Mail size={20} className="text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Email Settings</h1>
          <p className="text-gray-400 text-sm">Configure where quote and contact submissions are sent</p>
        </div>
      </div>

      {/* Resend setup info */}
      <div className="bg-blue-900/30 border border-blue-700/40 rounded-lg p-4 mb-8 text-sm text-blue-200">
        <p className="font-semibold mb-1">Setup required: Resend API key</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-300">
          <li>Create a free account at <strong>resend.com</strong> (3,000 emails/month free)</li>
          <li>Copy your API key from the Resend dashboard</li>
          <li>In Railway → your service → Variables, add: <code className="bg-blue-900/50 px-1.5 py-0.5 rounded font-mono">RESEND_API_KEY = re_xxxxxxxxxxxx</code></li>
          <li>Enable emails below and save</li>
        </ol>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Enable toggle */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-white font-semibold">Enable Email Notifications</div>
              <div className="text-gray-400 text-sm mt-0.5">Send an email for every quote and contact form submission</div>
            </div>
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-amber-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>

        {/* Fields */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Recipient Email <span className="text-red-400">*</span>
              <span className="text-gray-500 font-normal ml-2">— where submissions are delivered</span>
            </label>
            <input
              type="email"
              required
              value={settings.toEmail}
              onChange={e => setSettings(s => ({ ...s, toEmail: e.target.value }))}
              placeholder="info@himalayangulfstones.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              CC Email
              <span className="text-gray-500 font-normal ml-2">— optional, sends a copy to this address</span>
            </label>
            <input
              type="email"
              value={settings.ccEmail}
              onChange={e => setSettings(s => ({ ...s, ccEmail: e.target.value }))}
              placeholder="manager@himalayangulfstones.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Sender Name
              <span className="text-gray-500 font-normal ml-2">— shown in the From field</span>
            </label>
            <input
              type="text"
              value={settings.fromName}
              onChange={e => setSettings(s => ({ ...s, fromName: e.target.value }))}
              placeholder="Himalayan Gulf Stones"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            />
            <p className="text-gray-500 text-xs mt-1">Emails are sent via Resend's shared domain until you verify your own domain at resend.com</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>

          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !settings.enabled}
            title={!settings.enabled ? 'Enable emails first' : 'Send a test quote email to your recipient'}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-40"
          >
            <Send size={15} />
            {testing ? 'Sending…' : 'Send Test Email'}
          </button>
        </div>
      </form>
    </div>
  );
}
