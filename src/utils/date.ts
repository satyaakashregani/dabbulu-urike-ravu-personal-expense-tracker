export const formatDate = (date: string): string => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return d.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
};

export const getMonthName = (monthStr: string): string => {
  const date = new Date(monthStr + '-01');
  return date.toLocaleDateString('en-IN', { 
    month: 'long', 
    year: 'numeric' 
  });
};