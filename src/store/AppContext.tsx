import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { Trouble, Reply, ActionItem, UserProfile, UserStats, Draft, FollowUp } from '@/types';
import { mockTroubles, mockMyTroubles, mockActions, mockUser, mockStats, mockDrafts, mockReplies } from '@/data/mockData';
import { generateId } from '@/utils';

interface AppContextType {
  user: UserProfile;
  stats: UserStats;
  troubles: Trouble[];
  myTroubles: Trouble[];
  actions: ActionItem[];
  drafts: Draft[];
  addTrouble: (trouble: Trouble) => void;
  addReply: (troubleId: string, reply: Reply) => void;
  addAction: (action: ActionItem) => void;
  toggleAction: (id: string) => void;
  rateReply: (troubleId: string, replyId: string, rating: number) => void;
  markUseful: (troubleId: string, replyId: string, sentence: string) => void;
  saveDraft: (draft: Draft) => void;
  deleteDraft: (id: string) => void;
  deleteDraftByTroubleId: (troubleId: string) => void;
  toggleMatching: () => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  addFollowUp: (troubleId: string, replyId: string, followUp: FollowUp) => void;
  getBlockedUsers: () => string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DRAFTS: 'trouble_exchange_drafts',
  BLOCKED_USERS: 'trouble_exchange_blocked',
  TROUBLES: 'trouble_exchange_troubles',
  MY_TROUBLES: 'trouble_exchange_my_troubles',
  ACTIONS: 'trouble_exchange_actions',
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`[AppContext] Failed to load ${key}:`, e);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[AppContext] Failed to save ${key}:`, e);
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedBlocked = loadFromStorage<string[]>(STORAGE_KEYS.BLOCKED_USERS, mockUser.blockedUsers);
  const initialUser = { ...mockUser, blockedUsers: storedBlocked };

  const storedDrafts = loadFromStorage<Draft[]>(STORAGE_KEYS.DRAFTS, mockDrafts);
  const storedTroubles = loadFromStorage<Trouble[]>(STORAGE_KEYS.TROUBLES, mockTroubles);
  const storedMyTroubles = loadFromStorage<Trouble[]>(STORAGE_KEYS.MY_TROUBLES, mockMyTroubles);
  const storedActions = loadFromStorage<ActionItem[]>(STORAGE_KEYS.ACTIONS, mockActions);

  const [user, setUser] = useState<UserProfile>(initialUser);
  const [stats] = useState<UserStats>(mockStats);
  const [troubles, setTroubles] = useState<Trouble[]>(storedTroubles);
  const [myTroubles, setMyTroubles] = useState<Trouble[]>(storedMyTroubles);
  const [actions, setActions] = useState<ActionItem[]>(storedActions);
  const [drafts, setDrafts] = useState<Draft[]>(storedDrafts);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DRAFTS, drafts);
  }, [drafts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BLOCKED_USERS, user.blockedUsers);
  }, [user.blockedUsers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TROUBLES, troubles);
  }, [troubles]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MY_TROUBLES, myTroubles);
  }, [myTroubles]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIONS, actions);
  }, [actions]);

  const addTrouble = (trouble: Trouble) => {
    setMyTroubles(prev => [trouble, ...prev]);
  };

  const addReply = (troubleId: string, reply: Reply) => {
    const replyWithFollowUps = { ...reply, followUps: [] };
    const updateFn = (t: Trouble) =>
      t.id === troubleId ? { ...t, replies: [...t.replies, replyWithFollowUps] } : t;
    setTroubles(prev => prev.map(updateFn));
    setMyTroubles(prev => prev.map(updateFn));
  };

  const addFollowUp = (troubleId: string, replyId: string, followUp: FollowUp) => {
    const updateFn = (t: Trouble) => {
      if (t.id !== troubleId) return t;
      return {
        ...t,
        replies: t.replies.map(r =>
          r.id === replyId
            ? { ...r, followUps: [...(r.followUps || []), followUp] }
            : r
        ),
      };
    };
    setTroubles(prev => prev.map(updateFn));
    setMyTroubles(prev => prev.map(updateFn));
  };

  const addAction = (action: ActionItem) => {
    setActions(prev => [...prev, action]);
  };

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a =>
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const rateReply = (troubleId: string, replyId: string, rating: number) => {
    const updateFn = (t: Trouble) => {
      if (t.id !== troubleId) return t;
      return {
        ...t,
        replies: t.replies.map(r => r.id === replyId ? { ...r, rating } : r),
      };
    };
    setTroubles(prev => prev.map(updateFn));
    setMyTroubles(prev => prev.map(updateFn));
  };

  const markUseful = (troubleId: string, replyId: string, sentence: string) => {
    const updateFn = (t: Trouble) => {
      if (t.id !== troubleId) return t;
      return {
        ...t,
        replies: t.replies.map(r => {
          if (r.id !== replyId) return r;
          const hasSentence = r.usefulSentences.includes(sentence);
          return {
            ...r,
            usefulSentences: hasSentence
              ? r.usefulSentences.filter(s => s !== sentence)
              : [...r.usefulSentences, sentence],
          };
        }),
      };
    };
    setTroubles(prev => prev.map(updateFn));
    setMyTroubles(prev => prev.map(updateFn));
  };

  const saveDraft = (draft: Draft) => {
    setDrafts(prev => {
      const exists = prev.find(d => d.id === draft.id);
      if (exists) {
        return prev.map(d => d.id === draft.id ? draft : d);
      }
      return [draft, ...prev];
    });
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const deleteDraftByTroubleId = (troubleId: string) => {
    setDrafts(prev => prev.filter(d => d.troubleId !== troubleId));
  };

  const toggleMatching = () => {
    setUser(prev => ({ ...prev, isMatchingPaused: !prev.isMatchingPaused }));
  };

  const blockUser = (userId: string) => {
    setUser(prev => {
      if (prev.blockedUsers.includes(userId)) return prev;
      return { ...prev, blockedUsers: [...prev.blockedUsers, userId] };
    });
  };

  const unblockUser = (userId: string) => {
    setUser(prev => ({
      ...prev,
      blockedUsers: prev.blockedUsers.filter(id => id !== userId),
    }));
  };

  const getBlockedUsers = () => user.blockedUsers;

  return (
    <AppContext.Provider value={{
      user,
      stats,
      troubles,
      myTroubles,
      actions,
      drafts,
      addTrouble,
      addReply,
      addAction,
      toggleAction,
      rateReply,
      markUseful,
      saveDraft,
      deleteDraft,
      deleteDraftByTroubleId,
      toggleMatching,
      blockUser,
      unblockUser,
      addFollowUp,
      getBlockedUsers,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
