export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const parsePrompt = (text: string): { intent: string; content: string } => {
  const intents = {
    spreadsheet: ['create (a )?(spreadsheet|sheet|table|csv)', 'generate (a )?(spreadsheet|sheet)'],
    presentation: ['create (a )?(presentation|slide|ppt)', 'generate (a )?(presentation|slides)'],
    checklist: ['create (a )?(checklist|todo|task list)', 'generate (a )?(checklist|todo)'],
    'lesson-plan': ['create (a )?(lesson plan|lesson)', 'generate (a )?(lesson plan)'],
    worksheet: ['create (a )?(worksheet|worksheet)?', 'generate (a )?(worksheet)'],
  };

  for (const [intent, patterns] of Object.entries(intents)) {
    for (const pattern of patterns) {
      if (new RegExp(pattern, 'i').test(text)) {
        return { intent, content: text };
      }
    }
  }

  return { intent: 'chat', content: text };
};

export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};
