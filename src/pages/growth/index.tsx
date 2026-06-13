import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import ActionItem from '@/components/ActionItem';
import { useApp } from '@/store/AppContext';
import { getMoodColor } from '@/utils';

const GrowthPage: React.FC = () => {
  const { stats, actions } = useApp();
  const moodColors = ['#FF8BA7', '#FFD166', '#7C6BF0', '#A89CF5', '#67D5B5'];

  const pendingActions = actions.filter(a => !a.completed).slice(0, 3);

  const handleViewActions = () => {
    Taro.navigateTo({ url: '/pages/actions/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>成长记录</Text>
        <Text className={styles.subtitle}>记录每一次温暖的相遇</Text>

        <View className={styles.statsRow}>
          <StatCard value={stats.helpCount} label="帮助他人" color="#7C6BF0" />
          <StatCard value={stats.thankedCount} label="被感谢" color="#FFD166" />
          <StatCard value={stats.replyCount} label="回应数" color="#67D5B5" />
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>情绪趋势</Text>
        <View className={styles.moodCard}>
          <View className={styles.moodHeader}>
            <Text style={{ fontSize: '28rpx', color: '#6B6891' }}>最近 7 天</Text>
          </View>
          <View className={styles.moodLabels}>
            <Text style={{ color: '#FF8BA7' }}>低落</Text>
            <Text style={{ color: '#FFD166' }}>一般</Text>
            <Text style={{ color: '#67D5B5' }}>开心</Text>
          </View>
          <View className={styles.moodChart}>
            {stats.moodTrend.map((item, idx) => (
              <View key={idx} className={styles.moodBar}>
                <View
                  className={styles.moodBarFill}
                  style={{
                    height: `${item.mood * 36}rpx`,
                    background: `linear-gradient(180deg, ${getMoodColor(['sad', 'anxious', 'calm', 'happy'][Math.min(item.mood - 1, 3)])} 0%, ${moodColors[idx % moodColors.length]}80 100%)`,
                  }}
                />
                <Text className={styles.moodBarLabel}>{item.date}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: '32rpx' }}>
          <Text className={styles.sectionTitle}>快捷入口</Text>
          <View className={styles.quickActions}>
            <View className={styles.quickAction} onClick={handleViewActions}>
              <Text className={styles.quickActionIcon}>✅</Text>
              <Text className={styles.quickActionText}>行动清单</Text>
            </View>
            <View
              className={styles.quickAction}
              onClick={() => Taro.switchTab({ url: '/pages/matching/index' })}
            >
              <Text className={styles.quickActionIcon}>💝</Text>
              <Text className={styles.quickActionText}>去帮助人</Text>
            </View>
            <View
              className={styles.quickAction}
              onClick={() => Taro.switchTab({ url: '/pages/inbox/index' })}
            >
              <Text className={styles.quickActionIcon}>💭</Text>
              <Text className={styles.quickActionText}>我的烦恼</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: '32rpx' }}>
          <View className={styles.listHeader}>
            <Text className={styles.recentTitle}>待完成行动</Text>
            <Text className={styles.viewAll} onClick={handleViewActions}>
              查看全部 →
            </Text>
          </View>
          {pendingActions.length === 0 ? (
            <View className={styles.empty}>
              <Text style={{ fontSize: '56rpx', opacity: 0.5 }}>🌿</Text>
              <Text className={styles.emptyText}>暂无待完成行动</Text>
            </View>
          ) : (
            pendingActions.map(action => (
              <ActionItem key={action.id} action={action} />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default GrowthPage;
