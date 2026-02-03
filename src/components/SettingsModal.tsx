"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  widgetTheme: string;
  widgetLayout: string;
  primaryColor: string;
}

interface SettingsModalProps {
  project: Project;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const themes = [
  { value: "LIGHT", label: "Light", preview: "bg-white border-gray-200" },
  { value: "DARK", label: "Dark", preview: "bg-gray-900 border-gray-700" },
  { value: "AUTO", label: "Auto", preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400" },
];

const layouts = [
  { value: "GRID", label: "Grid", icon: "▦" },
  { value: "CAROUSEL", label: "Carousel", icon: "◀▶" },
  { value: "LIST", label: "List", icon: "☰" },
];

const colors = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#000000", // black
];

export default function SettingsModal({ project, onClose, onSave }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    widgetTheme: project.widgetTheme,
    widgetLayout: project.widgetLayout,
    primaryColor: project.primaryColor,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data.project);
        onClose();
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Widget Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSettings({ ...settings, widgetTheme: theme.value })}
                  className={`p-3 rounded-xl border-2 transition ${
                    settings.widgetTheme === theme.value
                      ? "border-brand-600 ring-2 ring-brand-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-full h-8 rounded-lg border ${theme.preview} mb-2`} />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Layout
            </label>
            <div className="grid grid-cols-3 gap-3">
              {layouts.map((layout) => (
                <button
                  key={layout.value}
                  onClick={() => setSettings({ ...settings, widgetLayout: layout.value })}
                  className={`p-3 rounded-xl border-2 transition ${
                    settings.widgetLayout === layout.value
                      ? "border-brand-600 ring-2 ring-brand-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{layout.icon}</div>
                  <span className="text-sm font-medium">{layout.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSettings({ ...settings, primaryColor: color })}
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    settings.primaryColor === color
                      ? "border-gray-900 ring-2 ring-gray-200"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">Custom:</span>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                    setSettings({ ...settings, primaryColor: e.target.value });
                  }
                }}
                className="w-24 px-2 py-1 border border-gray-200 rounded text-sm font-mono"
                placeholder="#6366f1"
              />
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preview
            </label>
            <div
              className={`p-4 rounded-xl border ${
                settings.widgetTheme === "DARK"
                  ? "bg-gray-900 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    style={{ color: settings.primaryColor, fill: settings.primaryColor }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p
                className={`text-sm ${
                  settings.widgetTheme === "DARK" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                "This is an amazing product! Highly recommend."
              </p>
              <p
                className={`text-xs mt-2 ${
                  settings.widgetTheme === "DARK" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                — John D.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
