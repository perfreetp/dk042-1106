import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  value: number | string;
  label: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color }) => {
  return (
    <View className={styles.card}>
      <Text className={styles.value} style={{ color: color || '#7C6BF0' }}>
        {value}
      </Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
