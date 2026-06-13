import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ReplyCard from '@/components/ReplyCard';
import { useApp } from '@/store/AppContext';
import { Trouble } from '@/types';
import { formatTime, formatDeadline, getMoodColor, getMoodLabel, getThemeColor } from '@/utils';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const troubleId = router.params.id as string;
  const { troubles, myTroubles, user, addAction } = useApp();
  const [trouble, setTrouble] = useState<Trouble | null>(null);

  useEffect(() => {
    const allTroubles = [...troubles, ...myTroubles];
    const found = allTroubles.find(t => t.id === troubleId);
    if (found) {
      setTrouble(found);
    }
  }, [troubleId, troubles, myTroubles]);

  const isMine = trouble?.authorId === user.id;

  const handleConvertToActions = () => {
    if (!trouble) return;
    const sentences = trouble.content
      .split(/[。！？.!?\n]/)
      .filter(s => s.trim().length > 5)
      .slice(0, 3);

    if (sentences.length === 0) {
      Taro.showToast({ title: '无法提取行动项', icon: 'none' });
      return;
    }

    sentences.forEach((s, idx) => {
      addAction({
        id: `action_${Date.now()}_${idx}`,
        troubleId: trouble.id,
        content: `关于"${s.trim().slice(0, 20)}..."的思考与行动`,
        completed: false,
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
    });

    Taro.showToast({ title: '已转为行动清单', icon: 'success' });
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/actions/index' });
    }, 1000);
  };

  const handleFollowUp = () => {
    Taro.showToast({ title: '回访功能开发中', icon: 'none' });
  };

  const handleReport = () => {
    Taro.showActionSheet({
      itemList: ['举报内容不当', '屏蔽该用户', '取消'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showToast({ title: '已提交举报', icon: 'success' });
        } else if (res.tapIndex === 1) {
          Taro.showToast({ title: '已屏蔽该用户', icon: 'success' });
        }
      },
    });
  };

  if (!trouble) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text style={{ color: '#9D9AB8' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  const themeColor = getThemeColor(trouble.theme);

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.troubleCard}>
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
                className={styles.tag}
                style={{
                  color: getMoodColor(trouble.mood),
                  background: `${getMoodColor(trouble.mood)}20`,
                }}
              >
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
            {trouble.allowVoice && (
              <View
                className={styles.tag}
                style={{ color: '#7C6BF0', background: 'rgba(124, 107, 240, 0.12)' }}
              >
                可语音
              </View>
            )}
          </View>
        </View>

        <View className={styles.authorInfo}>
          <View className={styles.authorAvatar} />
          <View>
            <Text className={styles.authorName}>{trouble.authorName}</Text>
            <Text className={styles.authorMeta}>
              {trouble.authorAge}岁 · {formatTime(trouble.createdAt)}
            </Text>
          </View>
        </View>

        <View className={styles.content}>{trouble.content}</View>

        <View className={styles.meta}>
          <Text className={styles.metaItem}>期望回复：{trouble.expectedLength}</Text>
          <Text className={styles.metaItem}>{formatDeadline(trouble.deadline)}</Text>
        </View>

        {isMine && (
          <View className={styles.actionRow}>
            <View className={styles.actionBtn} onClick={handleConvertToActions}>
              📋 转为行动清单
            </View>
            <View className={styles.actionBtn} onClick={handleFollowUp}>
              💬 发起回访
            </View>
          </View>
        )}

        {!isMine && (
          <View className={styles.actionRow}>
            <View
              className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
              onClick={() => Taro.navigateTo({ url: `/pages/respond/index?id=${trouble.id}` })}
            >
              💝 我想回应
            </View>
            <View className={styles.actionBtn} onClick={handleReport}>
              ⚠️ 举报
            </View>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>收到的回应</Text>
          <Text className={styles.replyCount}>{trouble.replies.length} 条</Text>
        </View>

        {isMine && trouble.replies.length === 0 && (
          <View className={styles.tip}>
            💡 小提示：点击回应中的句子可以标记为"对我有用"，给好的回应打5星还能表达感谢哦~
          </View>
        )}

        {trouble.replies.length === 0 ? (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🌸</Text>
            <Text className={styles.emptyText}>暂时还没有回应</Text>
            <Text className={styles.emptyHint}>
              {isMine ? '耐心等待，总有人愿意倾听你' : '成为第一个回应的人吧'}
            </Text>
          </View>
        ) : (
          trouble.replies.map(reply => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              troubleId={trouble.id}
              showRating={isMine}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default DetailPage;
