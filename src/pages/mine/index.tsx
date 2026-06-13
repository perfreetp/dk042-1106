import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/AppContext';

const MinePage: React.FC = () => {
  const { user, stats } = useApp();

  const menuItems = [
    {
      icon: '📋',
      iconBg: 'rgba(124, 107, 240, 0.12)',
      text: '社区规则',
      onClick: () => Taro.navigateTo({ url: '/pages/rules/index' }),
    },
    {
      icon: '⚙️',
      iconBg: 'rgba(103, 213, 181, 0.12)',
      text: '设置',
      tag: user.isMatchingPaused ? '已暂停匹配' : '',
      onClick: () => Taro.navigateTo({ url: '/pages/settings/index' }),
    },
    {
      icon: '✅',
      iconBg: 'rgba(255, 209, 102, 0.15)',
      text: '行动清单',
      onClick: () => Taro.navigateTo({ url: '/pages/actions/index' }),
    },
    {
      icon: '🚫',
      iconBg: 'rgba(255, 139, 167, 0.12)',
      text: '举报与反馈',
      warning: true,
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }),
    },
  ];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <View className={styles.avatar}>
            <Image className={styles.avatarImg} src={user.avatar} mode="aspectFill" />
          </View>
          <View className={styles.profileText}>
            <Text className={styles.name}>{user.name}</Text>
            <Text className={styles.age}>{user.age} 岁</Text>
            <Text className={styles.bio}>{user.bio}</Text>
          </View>
        </View>

        <View className={styles.statsBar}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.troubleCount}</Text>
            <Text className={styles.statLabel}>发布烦恼</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.replyCount}</Text>
            <Text className={styles.statLabel}>回应他人</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.helpCount}</Text>
            <Text className={styles.statLabel}>累计帮助</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.thankedCount}</Text>
            <Text className={styles.statLabel}>被感谢</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <View key={idx} className={styles.menuItem} onClick={item.onClick}>
              <View className={styles.menuIcon} style={{ background: item.iconBg }}>
                {item.icon}
              </View>
              <Text className={classnames(styles.menuText, item.warning && styles.warningText)}>
                {item.text}
              </Text>
              {item.tag && <Text className={styles.menuTag}>{item.tag}</Text>}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
