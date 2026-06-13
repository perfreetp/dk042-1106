import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/AppContext';
import { mockTroubles, mockMyTroubles } from '@/data/mockData';

const SettingsPage: React.FC = () => {
  const { user, toggleMatching, unblockUser, troubles, myTroubles } = useApp();
  const [showBlockedList, setShowBlockedList] = useState(false);

  const getBlockedUserNames = () => {
    const allTroubles = [...mockTroubles, ...mockMyTroubles, ...troubles, ...myTroubles];
    const userMap: Record<string, string> = {};
    allTroubles.forEach(t => {
      userMap[t.authorId] = t.authorName;
    });
    return user.blockedUsers.map(uid => ({
      id: uid,
      name: userMap[uid] || `用户 ${uid.slice(-6)}`,
    }));
  };

  const handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？草稿和设置不会被清除。',
      success: (res) => {
        if (res.confirm) {
          Taro.clearStorageSync();
          Taro.showToast({ title: '已清除', icon: 'success' });
        }
      },
    });
  };

  const handleFeedback = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于烦恼交换',
      content: '版本 1.0.0\n\n一个让心灵休息的地方，这里有人愿意听你说话。',
      showCancel: false,
    });
  };

  const handleUnblock = (userId: string, userName: string) => {
    Taro.showModal({
      title: '解除屏蔽',
      content: `确定要解除对「${userName}」的屏蔽吗？解除后将再次收到对方的烦恼。`,
      success: (res) => {
        if (res.confirm) {
          unblockUser(userId);
          Taro.showToast({ title: '已解除屏蔽', icon: 'success' });
        }
      },
    });
  };

  const blockedUsers = getBlockedUserNames();

  return (
    <ScrollView className={styles.page} scrollY>
      {user.isMatchingPaused && (
        <View className={styles.pausedCard}>
          <Text className={styles.pausedTitle}>😴 匹配已暂停</Text>
          <Text className={styles.pausedDesc}>
            休息一下也没关系，等你准备好的时候，随时可以回来继续帮助他人。
          </Text>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>匹配设置</Text>
        <View className={styles.item}>
          <View className={styles.itemIcon} style={{ background: 'rgba(124, 107, 240, 0.12)' }}>
            🌙
          </View>
          <View style={{ flex: 1 }}>
            <Text className={styles.itemText}>暂停匹配</Text>
            <Text className={styles.itemDesc}>开启后不会收到新的烦恼卡片</Text>
          </View>
          <View
            className={classnames(styles.switch, user.isMatchingPaused && styles.switchOn)}
            onClick={toggleMatching}
          >
            <View className={styles.switchDot} />
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>隐私与安全</Text>
        <View
          className={classnames(styles.item, showBlockedList && styles.itemActive)}
          onClick={() => setShowBlockedList(!showBlockedList)}
        >
          <View className={styles.itemIcon} style={{ background: 'rgba(255, 139, 167, 0.12)' }}>
            🚫
          </View>
          <View style={{ flex: 1 }}>
            <Text className={styles.itemText}>屏蔽的用户</Text>
            <Text className={styles.itemDesc}>
              {blockedUsers.length > 0 ? `已屏蔽 ${blockedUsers.length} 人` : '暂无屏蔽用户'}
            </Text>
          </View>
          <Text className={classnames(styles.itemArrow, showBlockedList && styles.itemArrowOpen)}>›</Text>
        </View>

        {showBlockedList && blockedUsers.length > 0 && (
          <View className={styles.blockedList}>
            {blockedUsers.map((u) => (
              <View key={u.id} className={styles.blockedItem}>
                <View className={styles.blockedAvatar}>
                  <Text className={styles.blockedAvatarText}>{u.name.charAt(0)}</Text>
                </View>
                <Text className={styles.blockedName}>{u.name}</Text>
                <View
                  className={styles.unblockBtn}
                  onClick={() => handleUnblock(u.id, u.name)}
                >
                  解除屏蔽
                </View>
              </View>
            ))}
          </View>
        )}

        {showBlockedList && blockedUsers.length === 0 && (
          <View className={styles.emptyBlocked}>
            <Text className={styles.emptyBlockedIcon}>✨</Text>
            <Text className={styles.emptyBlockedText}>当前没有屏蔽任何人</Text>
          </View>
        )}

        <View className={styles.item} onClick={handleClearCache}>
          <View className={styles.itemIcon} style={{ background: 'rgba(255, 209, 102, 0.15)' }}>
            🗑️
          </View>
          <Text className={styles.itemText}>清除缓存</Text>
          <Text className={styles.itemArrow}>›</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>其他</Text>
        <View className={styles.item} onClick={() => Taro.navigateTo({ url: '/pages/rules/index' })}>
          <View className={styles.itemIcon} style={{ background: 'rgba(103, 213, 181, 0.12)' }}>
            📋
          </View>
          <Text className={styles.itemText}>社区规则</Text>
          <Text className={styles.itemArrow}>›</Text>
        </View>
        <View className={styles.item} onClick={handleFeedback}>
          <View className={styles.itemIcon} style={{ background: 'rgba(124, 107, 240, 0.12)' }}>
            💬
          </View>
          <Text className={styles.itemText}>意见反馈</Text>
          <Text className={styles.itemArrow}>›</Text>
        </View>
        <View className={styles.item} onClick={handleAbout}>
          <View className={styles.itemIcon} style={{ background: 'rgba(255, 139, 167, 0.12)' }}>
            ℹ️
          </View>
          <Text className={styles.itemText}>关于我们</Text>
          <Text className={styles.itemArrow}>›</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View
          className={classnames(styles.item, styles.dangerItem)}
          onClick={() => Taro.showToast({ title: '已退出登录', icon: 'success' })}
        >
          <Text style={{ color: '#FF6B8A', fontWeight: 500 }}>退出登录</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsPage;
