export type TroubleTheme = '情感' | '学业' | '工作' | '家庭' | '人际' | '健康' | '其他';
export type MatchMode = 'peer' | 'opposite' | 'random';
export type ToneType = '温暖共情' | '理性分析' | '轻松幽默' | '真诚倾听';
export type ReplyLength = '简短' | '适中' | '详细';
export type MoodType = 'happy' | 'calm' | 'anxious' | 'sad';

export interface Trouble {
  id: string;
  content: string;
  theme: TroubleTheme;
  needSolution: boolean;
  allowVoice: boolean;
  expectedLength: ReplyLength;
  deadline: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorAge: number;
  status: 'open' | 'matched' | 'resolved';
  replies: Reply[];
  mood?: MoodType;
}

export interface Reply {
  id: string;
  troubleId: string;
  content: string;
  tone: ToneType;
  createdAt: string;
  authorId: string;
  authorName: string;
  rating?: number;
  usefulSentences: string[];
  isVoice: boolean;
  voiceUrl?: string;
  followUp?: FollowUp;
}

export interface FollowUp {
  id: string;
  content: string;
  createdAt: string;
  isFromOwner: boolean;
}

export interface ActionItem {
  id: string;
  troubleId: string;
  content: string;
  completed: boolean;
  createdAt: string;
  deadline?: string;
}

export interface UserStats {
  helpCount: number;
  thankedCount: number;
  moodTrend: { date: string; mood: number }[];
  replyCount: number;
  troubleCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  isMatchingPaused: boolean;
  blockedUsers: string[];
}

export interface Draft {
  id: string;
  troubleId?: string;
  content: string;
  tone: ToneType;
  sections: string[];
  savedAt: string;
}
