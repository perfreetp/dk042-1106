import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';

const RulesPage: React.FC = () => {
  const coreRules = [
    {
      title: '尊重与共情',
      desc: '每个人都有自己的难处，试着站在对方的角度理解。不评判、不说教，你的倾听本身就是力量。',
    },
    {
      title: '真诚与善意',
      desc: '用真心回应每一份信任。即使意见不同，也请用温和的方式表达。',
    },
    {
      title: '保护隐私',
      desc: '这里是安全的树洞，不要询问或猜测他人的真实身份，也不要泄露自己的个人信息。',
    },
    {
      title: '互相支持',
      desc: '我们都是彼此的过客，但善意会留下痕迹。一句鼓励、一个拥抱，都可能点亮对方的一天。',
    },
  ];

  const doNot = [
    '人身攻击', '言语暴力', '泄露隐私', '广告骚扰',
    '恶意揣测', '歧视言论', '虚假信息', '诱导行为',
  ];

  const doIt = [
    '认真倾听', '温柔回应', '给予鼓励', '分享经验',
    '保护隐私', '遵守规则', '举报违规', '互相尊重',
  ];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>🌿 社区规则</Text>
        <Text className={styles.subtitle}>
          这里是一个让心灵休息的地方。{'\n'}
          让我们一起守护这份温柔与安全。
        </Text>
      </View>

      <View className={styles.content}>
        <View className={styles.tipCard}>
          <Text className={styles.tipTitle}>💡 我们的理念</Text>
          <Text className={styles.tipContent}>
            每个人都有烦恼的时候，有时候只是需要一个愿意倾听的人。
            在这里，我们不做评判，不给压力，只提供一个安全的空间让你倾诉，
            以及一些来自陌生人的温暖。
          </Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💜</Text>
            核心原则
          </Text>
          <View className={styles.ruleList}>
            {coreRules.map((rule, idx) => (
              <View key={idx} className={styles.ruleItem}>
                <View className={styles.ruleIndex}>{idx + 1}</View>
                <View className={styles.ruleContent}>
                  <Text className={styles.ruleTitle}>{rule.title}</Text>
                  <Text className={styles.ruleDesc}>{rule.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>✅</Text>
            我们鼓励
          </Text>
          <View className={styles.doList}>
            {doIt.map((item, idx) => (
              <View key={idx} className={styles.doTag}>{item}</View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🚫</Text>
            我们禁止
          </Text>
          <View className={styles.dontList}>
            {doNot.map((item, idx) => (
              <View key={idx} className={styles.dontTag}>{item}</View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🛡️</Text>
            你的权利
          </Text>
          <View className={styles.ruleList}>
            <View className={styles.ruleItem}>
              <View className={styles.ruleIndex}>1</View>
              <View className={styles.ruleContent}>
                <Text className={styles.ruleTitle}>举报违规内容</Text>
                <Text className={styles.ruleDesc}>
                  遇到任何让你不舒服的内容，可以随时举报，我们会尽快处理。
                </Text>
              </View>
            </View>
            <View className={styles.ruleItem}>
              <View className={styles.ruleIndex}>2</View>
              <View className={styles.ruleContent}>
                <Text className={styles.ruleTitle}>屏蔽不想看到的用户</Text>
                <Text className={styles.ruleDesc}>
                  你可以屏蔽任何用户，屏蔽后不会再看到对方的内容。
                </Text>
              </View>
            </View>
            <View className={styles.ruleItem}>
              <View className={styles.ruleIndex}>3</View>
              <View className={styles.ruleContent}>
                <Text className={styles.ruleTitle}>暂停匹配</Text>
                <Text className={styles.ruleDesc}>
                  需要休息时可以随时暂停匹配，想回来时我们一直都在。
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text className={styles.footer}>
          感谢每一个温柔的你，让这里变得更好 🌸
        </Text>
      </View>
    </ScrollView>
  );
};

export default RulesPage;
