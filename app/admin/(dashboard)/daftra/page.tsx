'use client';

import { useState, useEffect } from 'react';
import { Database, Save, CheckCircle, AlertCircle, Wifi } from 'lucide-react';

interface DaftraSettings {
  enabled: boolean;
  subdomain: string;
  apiKey: string;
  storeId: number;
  currencyCode: string;
}

const DEFAULT: DaftraSettings = {
  enabled: false,
  subdomain: '',
  apiKey: '',
  storeId: 1,
  currencyCode: 'SAR',
};

export default function DaftraSettingsPage() {
  const [settings, setSettings] = useState<DaftraSettings>(DEFAULT);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [testing, setTesting]   = useState(false);
  const [toast,   setToast]     = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/daftra')
      .then(r => r.json())
      .then(data => { setSettings({ ...DEFAULT, ...data }); setLoading(false); });
  }, []);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/daftra', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) showToast('success', 'Daftra settings saved.');
    else showToast('error', 'Failed to save settings.');
  }

  async function handleTest() {
    if (!settings.subdomain || !settings.apiKey) {
      return showToast('error', 'Enter subdomain and API key first.');
    }
    setTesting(true);
    const res = await fetch('/api/admin/daftra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subdomain: settings.subdomain, apiKey: settings.apiKey }),
    });
    const json = await res.json();
    setTesting(false);
    if (json.ok) {
      setSettings(s => ({ ...s, enabled: true }));
      showToast('success', 'Connection successful! Daftra enabled — click Save Settings to confirm.');
    } else {
      showToast('error', `Connection failed: ${json.error ?? 'Unknown error'}`);
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>;

  return (
    <div className="p-8 max-w-2xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
          <Database size={20} className="text-emerald-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Daftra ERP Integration</h1>
          <p className="text-gray-400 text-sm">Automatically create estimates in Daftra when customers submit quote requests</p>
        </div>
      </div>

      {/* Setup instructions */}
      <div className="bg-blue-900/30 border border-blue-700/40 rounded-lg p-4 mb-8 text-sm text-blue-200 space-y-1.5">
        <p className="font-semibold text-blue-100">How to connect your Daftra account</p>
        <p>1. Log in to Daftra → <strong>Settings → API</strong> → copy your <strong>API Key</strong></p>
        <p>2. Go to <strong>Settings → Stores</strong> → note the <strong>Store ID</strong> (usually 1)</p>
        <p>3. Your subdomain is the prefix of your Daftra URL — e.g. <code className="bg-blue-900/50 px-1 rounded">mycompany</code> from <code className="bg-blue-900/50 px-1 rounded">mycompany.daftra.com</code></p>
        <p className="text-blue-300 pt-1">When enabled, each quote submission will create a client + estimate in Daftra. Products are auto-created in Daftra on first use and cached for future quotes.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Enable toggle */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-white font-semibold">Enable Daftra Integration</div>
              <div className="text-gray-400 text-sm mt-0.5">
                When active, quote submissions create estimates in Daftra instead of generating a PDF
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-emerald-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>

        {/* Credentials */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Subdomain <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={settings.subdomain}
                  onChange={e => setSettings(s => ({ ...s, subdomain: e.target.value.trim().replace(/\.daftra\.com.*$/i, '') }))}
                  placeholder="mycompany"
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-l-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <span className="bg-gray-700 border border-l-0 border-gray-700 rounded-r-lg px-3 py-2.5 text-gray-400 text-sm">.daftra.com</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Store ID <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={settings.storeId}
                onChange={e => setSettings(s => ({ ...s, storeId: parseInt(e.target.value) || 1 }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              API Key <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
              placeholder="Paste your Daftra API key"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <div className="sm:w-40">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Currency</label>
            <input
              type="text"
              value={settings.currencyCode}
              onChange={e => setSettings(s => ({ ...s, currencyCode: e.target.value.toUpperCase() }))}
              placeholder="SAR"
              maxLength={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 uppercase"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
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
            disabled={testing || !settings.subdomain || !settings.apiKey}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-40"
          >
            <Wifi size={15} />
            {testing ? 'Testing…' : 'Test Connection'}
          </button>
        </div>
      </form>
    </div>
  );
}
