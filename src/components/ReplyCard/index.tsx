import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Reply } from '@/types';
import { formatTime } from '@/utils';
import { useApp } from '@/store/AppContext';

interface ReplyCardProps {
  reply: Reply;
  troubleId: string;
  showRating?: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ reply, troubleId, showRating = true }) => {
  const { rateReply, markUseful } = useApp();
  const [localRating, setLocalRating] = useState(reply.rating || 0);
  const [showThanked, setShowThanked] = useState(false);

  const handleRate = (star: number) => {
    setLocalRating(star);
    rateReply(troubleId, reply.id, star);
    if (star >= 4) {
      setShowThanked(true);
    }
  };

  const handleMarkUseful = (sentence: string) => {
    markUseful(troubleId, reply.id, sentence);
  };

  const renderContent = () => {
    const sentences = reply.content.split(/(?<=[。！？.!?])\s*/);
    return sentences.map((sentence, idx) => {
      const isUseful = reply.usefulSentences.includes(sentence);
      return (
        <Text
          key={idx}
          className={isUseful ? styles.usefulSentence : ''}
          onClick={() => handleMarkUseful(sentence)}
        >
          {sentence}
        </Text>
      );
    });
  };

  const toneColors: Record<string, { color: string; bg: string }> = {
    '温暖共情': { color: '#FF8BA7', bg: 'rgba(255, 139, 167, 0.12)' },
    '理性分析': { color: '#7C6BF0', bg: 'rgba(124, 107, 240, 0.12)' },
    '轻松幽默': { color: '#FFD166', bg: 'rgba(255, 209, 102, 0.15)' },
    '真诚倾听': { color: '#67D5B5', bg: 'rgba(103, 213, 181, 0.12)' },
  };

  const toneStyle = toneColors[reply.tone] || toneColors['温暖共情'];

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <View className={styles.author}>
          <View className={styles.avatar} />
          <View className={styles.authorInfo}>
            <Text className={styles.authorName}>{reply.authorName}</Text>
            <Text className={styles.time}>{formatTime(reply.createdAt)}</Text>
          </View>
        </View>
        <View
          className={styles.toneTag}
          style={{ color: toneStyle.color, background: toneStyle.bg }}
        >
          {reply.tone}
        </View>
      </View>

      <View className={styles.content}>
        {reply.usefulSentences.length > 0 ? renderContent() : reply.content}
      </View>

      <View className={styles.actions}>
        {showRating && (
          <View className={styles.rating}>
            {[1, 2, 3, 4, 5].map(star => (
              <Text
                key={star}
                className={styles.star}
                style={{ color: star <= localRating ? '#FFD166' : '#E8E6F5' }}
                onClick={() => handleRate(star)}
              >
                ★
              </Text>
            ))}
          </View>
        )}
        <View
          className={classnames(styles.actionItem, reply.usefulSentences.length > 0 && styles.actionActive)}
        >
          <Text>♥</Text>
          <Text>有用 {reply.usefulSentences.length}</Text>
        </View>
        {showThanked && <Text className={styles.thanks}>已感谢 ♡</Text>}
      </View>
    </View>
  );
};

export default ReplyCard;
