import { memo, useState, ChangeEvent } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AdminUser } from '../../types';

const getApiError = (err: unknown, fallback: string) => {
  const e = err as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? fallback;
};

interface PasswordModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSave: (id: string, pwd: string, confirm: string) => Promise<void>;
}

const PasswordModal = ({ user, onClose, onSave }: PasswordModalProps) => {
  const [pwd, setPwd]         = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy]       = useState(false);
  const [err, setErr]         = useState('');

  const handleSubmit = async () => {
    if (pwd.length < 6)  { setErr('Password must be at least 6 characters'); return; }
    if (pwd !== confirm) { setErr('Passwords do not match'); return; }
    setBusy(true);
    try {
      await onSave(user!._id, pwd, confirm);
      onClose();
    } catch (e) {
      setErr(getApiError(e, 'Failed to update password'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={!!user} onClose={onClose} title="Update Password">
      {user && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting new password for <span className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              value={pwd}
              onChange={(e: ChangeEvent<HTMLInputElement>) => { setPwd(e.target.value); setErr(''); }}
              placeholder="Min. 6 characters"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => { setConfirm(e.target.value); setErr(''); }}
              placeholder="Repeat password"
              className="input-field"
            />
          </div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} loading={busy}>Update Password</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default memo(PasswordModal);
