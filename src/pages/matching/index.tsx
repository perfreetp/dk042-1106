import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TroubleCard from '@/components/TroubleCard';
import { useApp } from '@/store/AppContext';
import { MatchMode, Trouble } from '@/types';

const MatchingPage: React.FC = () => {
  const { troubles, user, toggleMatching } = useApp();
  const [mode, setMode] = useState<MatchMode>('peer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);

  const modeDescriptions: Record<MatchMode, string> = {
    peer: '匹配与你年龄相仿的同龄人烦恼',
    opposite: '匹配与你经历相反的烦恼，换个角度看问题',
    random: '随机抽取，遇见不一样的故事',
  };

  const availableTroubles = useMemo(() => {
    let filtered = troubles.filter(
      t => !acceptedIds.includes(t.id) && !skippedIds.includes(t.id) && t.status === 'open'
    );

    if (mode === 'peer') {
      filtered = filtered.filter(t => Math.abs(t.authorAge - user.age) <= 5);
    } else if (mode === 'opposite') {
      filtered = filtered.filter(t => Math.abs(t.authorAge - user.age) > 10);
    }

    return filtered;
  }, [troubles, mode, acceptedIds, skippedIds, user.age]);

  const currentTrouble: Trouble | undefined = availableTroubles[currentIndex];

  const handleModeChange = (newMode: MatchMode) => {
    setMode(newMode);
    setCurrentIndex(0);
  };

  const handleSkip = () => {
    if (currentTrouble) {
      setSkippedIds(prev => [...prev, currentTrouble.id]);
    }
  };

  const handleAccept = () => {
    if (currentTrouble) {
      setAcceptedIds(prev => [...prev, currentTrouble.id]);
      Taro.navigateTo({
        url: `/pages/respond/index?id=${currentTrouble.id}`,
      });
    }
  };

  const handleResume = () => {
    toggleMatching();
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>匹配池</Text>
        <Text className={styles.subtitle}>  选择一种方式，遇见需要帮助的人</Text>

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
              剩余 {availableTroubles.length - currentIndex - 1} 张卡片等待抽取
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default MatchingPage;
