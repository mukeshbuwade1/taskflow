export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validateName = (name: string): string => {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const validateTitle = (title: string): string => {
  if (!title || !title.trim()) return 'Title is required';
  if (title.trim().length > 100) return 'Title cannot exceed 100 characters';
  return '';
};
