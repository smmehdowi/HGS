'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Save, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface WhatsAppSettings {
  enabled: boolean;
  phoneNumberId: string;
  apiToken: string;
  testPhone: string;
}

export default function WhatsAppSettingsPage() {
  const [settings, setSettings] = useState<WhatsAppSettings>({
    enabled: false,
    phoneNumberId: '',
    apiToken: '',
    testPhone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/whatsapp')
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
    const res = await fetch('/api/admin/whatsapp', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) showToast('success', 'WhatsApp settings saved.');
    else showToast('error', 'Failed to save settings.');
  }

  async function handleTest() {
    if (!settings.testPhone) return showToast('error', 'Enter a test phone number first.');
    if (!settings.apiToken || !settings.phoneNumberId) return showToast('error', 'Enter API Token and Phone Number ID first.');
    setTesting(true);
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${settings.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${settings.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: settings.testPhone.replace(/\D/g, ''),
          type: 'text',
          text: { body: 'Test message from Himalayan Gulf Stones admin panel. WhatsApp integration is working!' },
        }),
      });
      if (res.ok) showToast('success', 'Test message sent! Check the phone.');
      else {
        const err = await res.json();
        showToast('error', `Failed: ${err?.error?.message || 'Unknown error'}`);
      }
    } catch {
      showToast('error', 'Network error. Check console.');
    }
    setTesting(false);
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
        <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
          <MessageSquare size={20} className="text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">WhatsApp Notifications</h1>
          <p className="text-gray-400 text-sm">Send quote confirmation messages to customers via WhatsApp</p>
        </div>
      </div>

      {/* Setup info */}
      <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-4 mb-8 text-sm text-green-200">
        <p className="font-semibold mb-2">Setup — Meta WhatsApp Business Platform</p>
        <ol className="list-decimal list-inside space-y-1.5 text-green-300">
          <li>Go to <strong>developers.facebook.com</strong> → create a Meta App (Business type)</li>
          <li>Add the <strong>WhatsApp</strong> product to your app</li>
          <li>In WhatsApp → API Setup: copy your <strong>Phone Number ID</strong></li>
          <li>Generate a <strong>temporary access token</strong> (or a permanent one via System Users in Business Settings)</li>
          <li>Enter both values below, enable, and save</li>
        </ol>
        <p className="mt-3 text-yellow-300 text-xs">
          ⚠ Note: WhatsApp Business API requires pre-approved message templates for outbound messages to new contacts. Without an approved template, messages will fail silently. Contact Meta Business Support to get a notification template approved.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Enable toggle */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-white font-semibold">Enable WhatsApp Notifications</div>
              <div className="text-gray-400 text-sm mt-0.5">Send a WhatsApp message when a customer selects WhatsApp as their preferred contact method</div>
            </div>
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>

        {/* API fields */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Phone Number ID <span className="text-red-400">*</span>
              <span className="text-gray-500 font-normal ml-2">— from Meta WhatsApp API Setup page</span>
            </label>
            <input
              type="text"
              value={settings.phoneNumberId}
              onChange={e => setSettings(s => ({ ...s, phoneNumberId: e.target.value }))}
              placeholder="1234567890123456"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              API Token <span className="text-red-400">*</span>
              <span className="text-gray-500 font-normal ml-2">— temporary or permanent access token</span>
            </label>
            <input
              type="password"
              value={settings.apiToken}
              onChange={e => setSettings(s => ({ ...s, apiToken: e.target.value }))}
              placeholder="EAAxxxxxxxxxxxx..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Test Phone Number
              <span className="text-gray-500 font-normal ml-2">— include country code, e.g. 966501234567</span>
            </label>
            <input
              type="text"
              value={settings.testPhone}
              onChange={e => setSettings(s => ({ ...s, testPhone: e.target.value }))}
              placeholder="966501234567"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
            />
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
            title={!settings.enabled ? 'Enable WhatsApp first' : 'Send a test message to the test phone number'}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-40"
          >
            <Send size={15} />
            {testing ? 'Sending…' : 'Send Test Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
