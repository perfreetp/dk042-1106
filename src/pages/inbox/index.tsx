import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TroubleCard from '@/components/TroubleCard';
import { useApp } from '@/store/AppContext';

type TabType = 'all' | 'open' | 'matched' | 'resolved';

const InboxPage: React.FC = () => {
  const { myTroubles } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredTroubles = myTroubles.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'open', label: '等待回应' },
    { key: 'matched', label: '已回应' },
    { key: 'resolved', label: '已解决' },
  ];

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/publish/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <View>
            <Text className={styles.title}>我的烦恼</Text>
            <Text className={styles.subtitle}>  共 {myTroubles.length} 条记录</Text>
          </View>
        </View>
        <View className={styles.tabs}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.content}>
        {filteredTroubles.length === 0 ? (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>💭</Text>
            <Text className={styles.emptyText}>还没有烦恼，有心事就说出来吧</Text>
          </View>
        ) : (
          filteredTroubles.map(trouble => (
            <TroubleCard key={trouble.id} trouble={trouble} />
          ))
        )}
      </View>

      <View className={styles.fab} onClick={handlePublish}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </ScrollView>
  );
};

export default InboxPage;
