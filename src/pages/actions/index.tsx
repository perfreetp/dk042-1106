import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ActionItem from '@/components/ActionItem';
import { useApp } from '@/store/AppContext';
import { generateId } from '@/utils';

type FilterType = 'pending' | 'completed' | 'all';

const ActionsPage: React.FC = () => {
  const { actions, addAction } = useApp();
  const [filter, setFilter] = useState<FilterType>('pending');
  const [newAction, setNewAction] = useState('');

  const filtered = actions.filter(a => {
    if (filter === 'pending') return !a.completed;
    if (filter === 'completed') return a.completed;
    return true;
  });

  const completedCount = actions.filter(a => a.completed).length;
  const pendingCount = actions.filter(a => !a.completed).length;
  const progress = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;

  const handleAdd = () => {
    if (!newAction.trim()) {
      Taro.showToast({ title: '请输入行动内容', icon: 'none' });
      return;
    }
    addAction({
      id: generateId(),
      troubleId: 'manual',
      content: newAction.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setNewAction('');
    Taro.showToast({ title: '已添加', icon: 'success' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>行动清单</Text>
        <Text className={styles.subtitle}>把烦恼变成一个个小目标</Text>
        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{pendingCount}</Text>
            <Text className={styles.statLabel}>待完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{completedCount}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{progress}%</Text>
            <Text className={styles.statLabel}>完成率</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        <View
          className={classnames(styles.tab, filter === 'pending' && styles.tabActive)}
          onClick={() => setFilter('pending')}
        >
          待完成
        </View>
        <View
          className={classnames(styles.tab, filter === 'completed' && styles.tabActive)}
          onClick={() => setFilter('completed')}
        >
          已完成
        </View>
        <View
          className={classnames(styles.tab, filter === 'all' && styles.tabActive)}
          onClick={() => setFilter('all')}
        >
          全部
        </View>
      </View>

      <View className={styles.addSection}>
        <Text className={styles.addTitle}>➕ 添加新行动</Text>
        <Input
          className={styles.addInput}
          placeholder="写下你想完成的一件小事..."
          value={newAction}
          onInput={(e) => setNewAction(e.detail.value)}
          confirmType="done"
          onConfirm={handleAdd}
        />
        <View className={styles.addBtn} onClick={handleAdd}>
          添加到清单
        </View>
      </View>

      <View className={styles.list}>
        {filtered.length === 0 ? (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🌱</Text>
            <Text className={styles.emptyText}>
              {filter === 'completed' ? '还没有完成的行动，加油！' : '暂无待办事项'}
            </Text>
          </View>
        ) : (
          filtered.map(action => (
            <ActionItem key={action.id} action={action} />
          ))
        )}
      </View>

      <View className={styles.footer}>
        <Text className={styles.completedCount}>
          你已经完成了 <strong>{completedCount}</strong> 个行动，继续加油！🌿
        </Text>
      </View>
    </ScrollView>
  );
};

export default ActionsPage;
