import React, { useState } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { TroubleTheme, ReplyLength, MoodType } from '@/types';
import { useApp } from '@/store/AppContext';
import { generateId } from '@/utils';

const themes: TroubleTheme[] = ['情感', '学业', '工作', '家庭', '人际', '健康', '其他'];
const lengths: { key: ReplyLength; label: string; desc: string }[] = [
  { key: '简短', label: '简短', desc: '几句话就好' },
  { key: '适中', label: '适中', desc: '一段完整的话' },
  { key: '详细', label: '详细', desc: '希望多听听你的想法' },
];
const deadlines: { key: number; label: string }[] = [
  { key: 1, label: '1天内' },
  { key: 3, label: '3天内' },
  { key: 7, label: '7天内' },
  { key: 14, label: '14天内' },
];
const moods: { key: MoodType; label: string; emoji: string }[] = [
  { key: 'sad', label: '低落', emoji: '😢' },
  { key: 'anxious', label: '焦虑', emoji: '😰' },
  { key: 'calm', label: '平静', emoji: '😌' },
  { key: 'happy', label: '还好', emoji: '🙂' },
];

const PublishPage: React.FC = () => {
  const { addTrouble, user } = useApp();
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState<TroubleTheme | null>(null);
  const [needSolution, setNeedSolution] = useState(false);
  const [allowVoice, setAllowVoice] = useState(false);
  const [expectedLength, setExpectedLength] = useState<ReplyLength>('适中');
  const [deadlineDays, setDeadlineDays] = useState(3);
  const [mood, setMood] = useState<MoodType | null>(null);

  const canSubmit = content.trim().length >= 10 && theme !== null;

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请完整填写内容', icon: 'none' });
      return;
    }

    const newTrouble = {
      id: generateId(),
      content: content.trim(),
      theme: theme!,
      needSolution,
      allowVoice,
      expectedLength,
      deadline: new Date(Date.now() + deadlineDays * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.name,
      authorAge: user.age,
      status: 'open' as const,
      mood: mood || undefined,
      replies: [],
    };

    addTrouble(newTrouble);
    Taro.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>说说你的烦恼吧</Text>
          <Textarea
            className={styles.textarea}
            placeholder="在这里写下你想说的话...\n\n不用担心，这里是安全的树洞。你可以选择匿名，只和愿意倾听的陌生人分享。"
            value={content}
            onInput={(e) => setContent(e.detail.value)}
            maxlength={500}
            autoHeight
          />
          <Text className={styles.charCount}>{content.length}/500</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>选择主题</Text>
          <View className={styles.optionsGrid}>
            {themes.map(t => (
              <View
                key={t}
                className={classnames(styles.option, theme === t && styles.optionActive)}
                onClick={() => setTheme(t)}
              >
                {t}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>你现在的心情</Text>
          <View className={styles.optionsGrid}>
            {moods.map(m => (
              <View
                key={m.key}
                className={classnames(styles.option, mood === m.key && styles.optionActive)}
                onClick={() => setMood(m.key)}
              >
                {m.emoji} {m.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>期望回复</Text>
          <View className={styles.lengthOptions}>
            {lengths.map(l => (
              <View
                key={l.key}
                className={classnames(styles.lengthOption, expectedLength === l.key && styles.lengthActive)}
                onClick={() => setExpectedLength(l.key)}
              >
                <Text className={styles.lengthLabel}>{l.label}</Text>
                <Text className={styles.lengthDesc}>{l.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>更多设置</Text>
          <View className={styles.switchRow}>
            <View>
              <Text className={styles.switchLabel}>需要具体解决方案</Text>
              <Text className={styles.switchDesc}>希望对方给出可操作的建议</Text>
            </View>
            <View
              className={classnames(styles.switch, needSolution && styles.switchOn)}
              onClick={() => setNeedSolution(!needSolution)}
            >
              <View className={styles.switchDot} />
            </View>
          </View>
          <View className={styles.switchRow}>
            <View>
              <Text className={styles.switchLabel}>允许语音回应</Text>
              <Text className={styles.switchDesc}>对方可以发送语音回复</Text>
            </View>
            <View
              className={classnames(styles.switch, allowVoice && styles.switchOn)}
              onClick={() => setAllowVoice(!allowVoice)}
            >
              <View className={styles.switchDot} />
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>截止时间</Text>
          <View className={styles.deadlineOptions}>
            {deadlines.map(d => (
              <View
                key={d.key}
                className={classnames(styles.option, deadlineDays === d.key && styles.optionActive)}
                onClick={() => setDeadlineDays(d.key)}
              >
                {d.label}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          取消
        </View>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.submitBtnDisabled)}
          onClick={handleSubmit}
        >
          发布烦恼
        </View>
      </View>
    </View>
  );
};

export default PublishPage;
