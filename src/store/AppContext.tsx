import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trouble, Reply, ActionItem, UserProfile, UserStats, Draft } from '@/types';
import { mockTroubles, mockMyTroubles, mockActions, mockUser, mockStats, mockDrafts, mockReplies } from '@/data/mockData';

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
  toggleMatching: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [stats] = useState<UserStats>(mockStats);
  const [troubles, setTroubles] = useState<Trouble[]>(mockTroubles);
  const [myTroubles, setMyTroubles] = useState<Trouble[]>(mockMyTroubles);
  const [actions, setActions] = useState<ActionItem[]>(mockActions);
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);

  const addTrouble = (trouble: Trouble) => {
    setMyTroubles(prev => [trouble, ...prev]);
  };

  const addReply = (troubleId: string, reply: Reply) => {
    setTroubles(prev => prev.map(t => 
      t.id === troubleId ? { ...t, replies: [...t.replies, reply] } : t
    ));
    setMyTroubles(prev => prev.map(t => 
      t.id === troubleId ? { ...t, replies: [...t.replies, reply] } : t
    ));
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

  const toggleMatching = () => {
    setUser(prev => ({ ...prev, isMatchingPaused: !prev.isMatchingPaused }));
  };

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
      toggleMatching,
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
