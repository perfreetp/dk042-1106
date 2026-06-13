import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TroubleCard from '@/components/TroubleCard';
import { useApp } from '@/store/AppContext';
import { MatchMode, Trouble } from '@/types';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MatchingPage: React.FC = () => {
  const { troubles, user, toggleMatching } = useApp();
  const [mode, setMode] = useState<MatchMode>('peer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [shuffledRandomList, setShuffledRandomList] = useState<Trouble[]>([]);

  const modeDescriptions: Record<MatchMode, string> = {
    peer: '匹配与你年龄相仿的同龄人烦恼',
    opposite: '匹配与你经历相反的烦恼，换个角度看问题',
    random: '随机抽取，每次顺序都不一样哦',
  };

  const getFilteredTroubles = useCallback((matchMode: MatchMode): Trouble[] => {
    let filtered = troubles.filter(t => {
      if (acceptedIds.includes(t.id) || skippedIds.includes(t.id)) return false;
      if (t.status !== 'open') return false;
      if (t.authorId === user.id) return false;
      if (user.blockedUsers.includes(t.authorId)) return false;
      return true;
    });

    if (matchMode === 'peer') {
      filtered = filtered.filter(t => Math.abs(t.authorAge - user.age) <= 5);
    } else if (matchMode === 'opposite') {
      filtered = filtered.filter(t => Math.abs(t.authorAge - user.age) > 10);
    }

    return filtered;
  }, [troubles, acceptedIds, skippedIds, user.id, user.age, user.blockedUsers]);

  const reshuffleRandom = useCallback(() => {
    const base = getFilteredTroubles('random');
    setShuffledRandomList(shuffleArray(base));
    setCurrentIndex(0);
  }, [getFilteredTroubles]);

  const availableTroubles = useMemo(() => {
    if (mode === 'random') {
      return shuffledRandomList;
    }
    return getFilteredTroubles(mode);
  }, [mode, shuffledRandomList, getFilteredTroubles]);

  const currentTrouble: Trouble | undefined = availableTroubles[currentIndex];

  const handleModeChange = (newMode: MatchMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    if (newMode === 'random') {
      const base = getFilteredTroubles('random');
      setShuffledRandomList(shuffleArray(base));
    }
  };

  const advanceToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= availableTroubles.length) {
      if (mode === 'random') {
        reshuffleRandom();
        Taro.showToast({ title: '已重新洗牌', icon: 'none' });
      } else {
        Taro.showToast({ title: '已抽完当前所有卡片', icon: 'none' });
      }
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    if (currentTrouble) {
      setSkippedIds(prev => [...prev, currentTrouble.id]);
      setTimeout(() => advanceToNext(), 100);
    }
  };

  const handleAccept = () => {
    if (currentTrouble) {
      setAcceptedIds(prev => [...prev, currentTrouble.id]);
      setTimeout(() => advanceToNext(), 100);
      Taro.navigateTo({
        url: `/pages/respond/index?id=${currentTrouble.id}`,
      });
    }
  };

  const handleResume = () => {
    toggleMatching();
  };

  const handleRefresh = () => {
    if (mode === 'random') {
      reshuffleRandom();
    } else {
      setCurrentIndex(0);
    }
    Taro.showToast({ title: '已刷新', icon: 'success' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>匹配池</Text>
        <Text className={styles.subtitle}>✨ 选择一种方式，遇见需要帮助的人</Text>

        <View className={styles.modeTabs}>
          <View
            className={classnames(styles.modeTab, mode === 'peer' && styles.modeTabActive)}
            onClick={() => handleModeChange('peer')}
          >
            同龄人
          </View>
          <View
            className={classnames(styles.modeTab, mode === 'opposite' && styles.modeTabActive)}
            onClick={() => handleModeChange('opposite')}
          >
            相反经验
          </View>
          <View
            className={classnames(styles.modeTab, mode === 'random' && styles.modeTabActive)}
            onClick={() => handleModeChange('random')}
          >
            随机
          </View>
        </View>
        <Text className={styles.modeDesc}>{modeDescriptions[mode]}</Text>
        {mode === 'random' && (
          <Text className={styles.refreshLink} onClick={handleRefresh}>
            🔀 重新洗牌
          </Text>
        )}
      </View>

      <View className={styles.content}>
        <View className={styles.cardContainer}>
          {user.isMatchingPaused ? (
            <View className={styles.pausedOverlay}>
              <Text className={styles.pausedIcon}>😴</Text>
              <Text className={styles.pausedText}>你已暂停匹配</Text>
              <View className={styles.resumeBtn} onClick={handleResume}>
                恢复匹配
              </View>
            </View>
          ) : null}

          {!user.isMatchingPaused && !currentTrouble && (
            <View className={styles.empty}>
              <Text className={styles.emptyIcon}>🌙</Text>
              <Text className={styles.emptyText}>暂时没有新的烦恼卡片</Text>
              <Text className={styles.emptyHint}>下拉刷新或换一种匹配方式</Text>
              <View className={styles.refreshBtn} onClick={handleRefresh}>
                🔄 刷新一下
              </View>
            </View>
          )}

          {!user.isMatchingPaused && currentTrouble && (
            <TroubleCard trouble={currentTrouble} />
          )}
        </View>

        {!user.isMatchingPaused && currentTrouble && (
          <>
            <View className={styles.actionRow}>
              <View className={classnames(styles.actionBtn, styles.skipBtn)} onClick={handleSkip}>
                <Text className={styles.actionIcon}>👋</Text>
              </View>
              <View className={classnames(styles.actionBtn, styles.acceptBtn)} onClick={handleAccept}>
                <Text className={styles.actionIcon}>💝</Text>
              </View>
            </View>
            <Text className={styles.refreshHint}>
              第 {currentIndex + 1} / {availableTroubles.length} 张 · 剩余 {availableTroubles.length - currentIndex - 1} 张
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default MatchingPage;
