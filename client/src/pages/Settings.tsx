import { useState, useCallback, FormEvent } from 'react';
import { HiUser, HiLockClosed, HiMoon, HiSun, HiCheck, HiExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile, updatePassword } from '../api/auth.api';
import SectionCard from '../components/settings/SectionCard';

const getApiError = (err: unknown, fallback: string): string => {
  const e = err as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? fallback;
};

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Profile
  const [name, setName]               = useState(user?.name ?? '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved]     = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError]     = useState('');

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleProfileSave = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setProfileLoading(true);
    try {
      const { data } = await updateProfile({ name: name.trim() });
      updateUser({ name: data.data.name });
      setProfileSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      toast.error(getApiError(err, 'Failed to update profile'));
    } finally {
      setProfileLoading(false);
    }
  }, [name, updateUser]);

  const handlePasswordUpdate = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) { setPasswordError('Current password is required'); return; }
    if (newPassword.length < 6) { setPasswordError('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    setPasswordLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword, confirmPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(getApiError(err, 'Failed to update password'));
    } finally {
      setPasswordLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile */}
      <SectionCard title="Profile" icon={HiUser}>
        <form onSubmit={handleProfileSave}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">{name || user?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
                maxLength={50}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="input-field opacity-60 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-400 mt-0.5">Email cannot be changed</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="btn-primary flex items-center gap-2 px-4 py-2 disabled:opacity-60"
            >
              {profileSaved ? (
                <><HiCheck size={16} /> Saved</>
              ) : profileLoading ? (
                'Saving…'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security" icon={HiLockClosed}>
        <form onSubmit={handlePasswordUpdate}>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                <HiExclamationCircle size={16} className="flex-shrink-0" />
                {passwordError}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary px-4 py-2 disabled:opacity-60"
            >
              {passwordLoading ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Preferences */}
      <SectionCard title="Preferences" icon={isDark ? HiMoon : HiSun}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Switch between light and dark theme
            </p>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isDark ? 'bg-primary-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-sidebar-border flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Current Theme</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isDark ? 'Dark mode is active' : 'Light mode is active'}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isDark
              ? 'bg-primary-900/30 text-primary-400'
              : 'bg-amber-50 text-amber-600'
          }`}>
            {isDark ? <HiMoon size={12} /> : <HiSun size={12} />}
            {isDark ? 'Dark' : 'Light'}
          </span>
        </div>
      </SectionCard>
    </div>
  );
};

export default Settings;
