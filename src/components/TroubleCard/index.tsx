import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Trouble } from '@/types';
import { formatTime, getMoodColor, getMoodLabel, getThemeColor } from '@/utils';

interface TroubleCardProps {
  trouble: Trouble;
  onClick?: () => void;
}

const TroubleCard: React.FC<TroubleCardProps> = ({ trouble, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${trouble.id}`,
      });
    }
  };

  const statusMap = {
    open: { text: '等待回应', color: '#FFD166', bg: 'rgba(255, 209, 102, 0.15)' },
    matched: { text: '已收到回应', color: '#7C6BF0', bg: 'rgba(124, 107, 240, 0.12)' },
    resolved: { text: '已解决', color: '#67D5B5', bg: 'rgba(103, 213, 181, 0.15)' },
  };

  const status = statusMap[trouble.status];
  const themeColor = getThemeColor(trouble.theme);

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.tags}>
          <View
            className={styles.tag}
            style={{ color: themeColor, background: `${themeColor}20` }}
          >
            {trouble.theme}
          </View>
          {trouble.mood && (
            <View
              className={classnames(styles.tag, styles.moodTag)}
              style={{
                color: getMoodColor(trouble.mood),
                background: `${getMoodColor(trouble.mood)}20`,
              }}
            >
              <View
                className={styles.moodDot}
                style={{ background: getMoodColor(trouble.mood) }}
              />
              {getMoodLabel(trouble.mood)}
            </View>
          )}
          {trouble.needSolution && (
            <View
              className={styles.tag}
              style={{ color: '#67D5B5', background: 'rgba(103, 213, 181, 0.12)' }}
            >
              求方案
            </View>
          )}
        </View>
        <View
          className={styles.statusBadge}
          style={{ color: status.color, background: status.bg }}
        >
          {status.text}
        </View>
      </View>

      <View className={styles.content}>
        {trouble.content}
      </View>

      <View className={styles.footer}>
        <View className={styles.author}>
          <Text className={styles.authorName}>{trouble.authorName}</Text>
          <Text className={styles.authorAge}>· {trouble.authorAge}岁</Text>
        </View>
        <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
          {trouble.replies.length > 0 && (
            <Text className={styles.replyCount}>{trouble.replies.length} 条回应</Text>
          )}
          <Text className={styles.time}>{formatTime(trouble.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
};

export default TroubleCard;
