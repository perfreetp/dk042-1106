import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ActionItem as ActionItemType } from '@/types';
import { formatDeadline } from '@/utils';
import { useApp } from '@/store/AppContext';

interface ActionItemProps {
  action: ActionItemType;
}

const ActionItem: React.FC<ActionItemProps> = ({ action }) => {
  const { toggleAction } = useApp();

  const isUrgent = action.deadline && new Date(action.deadline).getTime() - Date.now() < 86400000;

  return (
    <View className={styles.item} onClick={() => toggleAction(action.id)}>
      <View className={classnames(styles.checkbox, action.completed && styles.checked)}>
        {action.completed && <Text className={styles.checkIcon}>✓</Text>}
      </View>
      <View className={styles.content}>
        <Text className={classnames(styles.text, action.completed && styles.completedText)}>
          {action.content}
        </Text>
        {action.deadline && !action.completed && (
          <View className={styles.meta}>
            <Text className={classnames(styles.deadline, isUrgent && styles.deadlineUrgent)}>
              📅 {formatDeadline(action.deadline)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ActionItem;
