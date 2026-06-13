import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Reply, FollowUp } from '@/types';
import { formatTime } from '@/utils';
import { useApp } from '@/store/AppContext';

interface ReplyCardProps {
  reply: Reply;
  troubleId: string;
  showRating?: boolean;
  showFollowUpButton?: boolean;
  onFollowUp?: (replyId: string) => void;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  troubleId,
  showRating = true,
  showFollowUpButton = false,
  onFollowUp,
}) => {
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

  const handleMarkUseful = (e: any, sentence: string) => {
    e.stopPropagation();
    markUseful(troubleId, reply.id, sentence);
  };

  const splitSentences = (content: string): string[] => {
    const parts: string[] = [];
    const paragraphs = content.split('\n\n');
    paragraphs.forEach((para, pIdx) => {
      const sentences = para.split(/(?<=[。！？.!?])/g);
      sentences.forEach((sent, sIdx) => {
        if (sent.trim()) {
          parts.push(sent.trim());
        }
      });
      if (pIdx < paragraphs.length - 1) {
        parts.push('\n\n');
      }
    });
    return parts;
  };

  const renderContent = () => {
    const parts = splitSentences(reply.content);
    return parts.map((part, idx) => {
      if (part === '\n\n') {
        return <View key={idx} className={styles.paragraphBreak} />;
      }
      const isUseful = reply.usefulSentences.includes(part);
      return (
        <Text
          key={idx}
          className={classnames(styles.sentence, isUseful && styles.usefulSentence)}
          onClick={(e) => handleMarkUseful(e, part)}
        >
          {part}
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
        {renderContent()}
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
        {showFollowUpButton && (
          <Text className={styles.followUpBtn} onClick={() => onFollowUp?.(reply.id)}>
            发起回访
          </Text>
        )}
      </View>

      {reply.followUps && reply.followUps.length > 0 && (
        <View className={styles.followUps}>
          <Text className={styles.followUpTitle}>💬 回访记录</Text>
          {reply.followUps.map((fu: FollowUp) => (
            <View key={fu.id} className={styles.followUpItem}>
              <View className={styles.followUpHeader}>
                <Text className={styles.followUpAuthor}>
                  {fu.isFromOwner ? '📝 楼主回复' : '💭 对方回复'}
                  <Text className={styles.followUpName}> · {fu.authorName}</Text>
                </Text>
                <Text className={styles.followUpTime}>{formatTime(fu.createdAt)}</Text>
              </View>
              <Text className={styles.followUpContent}>{fu.content}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ReplyCard;
