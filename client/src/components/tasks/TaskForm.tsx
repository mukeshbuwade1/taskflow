import { memo, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Task, TaskFormData, TaskPriority } from '../../types';
import { validateTitle } from '../../utils/validators';

interface FormState {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
}

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

const TaskForm = ({ task, onSubmit, onCancel, loading }: TaskFormProps) => {
  const [form, setForm] = useState<FormState>({ title: '', description: '', priority: 'medium', dueDate: '', dueTime: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  useEffect(() => {
    if (task) {
      const d = task.dueDate ? new Date(task.dueDate) : null;
      const pad = (n: number) => String(n).padStart(2, '0');
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '',
        dueTime: d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : '',
      });
    }
  }, [task]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: '' }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const titleError = validateTitle(form.title);
    if (titleError) { setErrors({ title: titleError }); return; }
    const dueDate = form.dueDate
      ? `${form.dueDate}T${form.dueTime || '00:00'}`
      : null;
    onSubmit({ title: form.title, description: form.description, priority: form.priority, dueDate });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title *"
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        maxLength={100}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Optional description…"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
          className="input-field resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="input-field"
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Time <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="time"
          name="dueTime"
          value={form.dueTime}
          onChange={handleChange}
          className="input-field"
          disabled={!form.dueDate}
        />
        {!form.dueDate && (
          <p className="text-xs text-gray-400">Set a due date first to specify time</p>
        )}
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{task ? 'Update Task' : 'Create Task'}</Button>
      </div>
    </form>
  );
};

export default memo(TaskForm);
