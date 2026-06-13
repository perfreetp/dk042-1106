export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
};

export const formatDeadline = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (diff < 0) return '已截止';
  if (hours < 24) return `${hours}小时后截止`;
  return `${days}天后截止`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const getMoodColor = (mood?: string): string => {
  switch (mood) {
    case 'happy': return '#67D5B5';
    case 'calm': return '#7C6BF0';
    case 'anxious': return '#FFD166';
    case 'sad': return '#FF8BA7';
    default: return '#7C6BF0';
  }
};

export const getMoodLabel = (mood?: string): string => {
  switch (mood) {
    case 'happy': return '开心';
    case 'calm': return '平静';
    case 'anxious': return '焦虑';
    case 'sad': return '低落';
    default: return '平静';
  }
};

export const getThemeColor = (theme: string): string => {
  const colorMap: Record<string, string> = {
    '情感': '#FF8BA7',
    '学业': '#7C6BF0',
    '工作': '#67D5B5',
    '家庭': '#FFD166',
    '人际': '#A89CF5',
    '健康': '#FFB5C5',
    '其他': '#9D9AB8',
  };
  return colorMap[theme] || '#7C6BF0';
};
