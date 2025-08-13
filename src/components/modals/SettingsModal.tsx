import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Settings } from '@/types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onResetSettings: () => void;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings, 
  onResetSettings 
}: SettingsModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h4>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => onUpdateSettings({ theme: e.target.value as any })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Notifications</h4>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Enable notification sounds
            </span>
          </label>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Privacy</h4>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.saveHistory}
              onChange={(e) => onUpdateSettings({ saveHistory: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Save conversation history
            </span>
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onResetSettings}>
            Reset to Default
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}