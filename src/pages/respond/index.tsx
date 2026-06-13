import React, { useState, useEffect } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApp } from '@/store/AppContext';
import { ToneType, Trouble } from '@/types';
import { generateId, formatTime } from '@/utils';

const prompts = [
  { icon: '💭', text: '我理解你的感受，因为...' },
  { icon: '🤗', text: '你已经做得很好了，因为...' },
  { icon: '💡', text: '也许可以试试这样...' },
  { icon: '🌱', text: '时间会证明一切，你可以...' },
];

const tones: { key: ToneType; desc: string; color: string; bg: string }[] = [
  { key: '温暖共情', desc: '像朋友一样倾听和安慰', color: '#FF8BA7', bg: 'rgba(255, 139, 167, 0.12)' },
  { key: '理性分析', desc: '客观分析问题给出建议', color: '#7C6BF0', bg: 'rgba(124, 107, 240, 0.12)' },
  { key: '轻松幽默', desc: '用轻松的方式化解烦恼', color: '#FFD166', bg: 'rgba(255, 209, 102, 0.15)' },
  { key: '真诚倾听', desc: '专注倾听不急于给建议', color: '#67D5B5', bg: 'rgba(103, 213, 181, 0.12)' },
];

const RespondPage: React.FC = () => {
  const router = useRouter();
  const troubleId = router.params.id as string;
  const { troubles, myTroubles, user, addReply, drafts, saveDraft, deleteDraft } = useApp();
  const [trouble, setTrouble] = useState<Trouble | null>(null);
  const [content, setContent] = useState('');
  const [tone, setTone] = useState<ToneType>('温暖共情');
  const [activePrompts, setActivePrompts] = useState<number[]>([]);

  useEffect(() => {
    const all = [...troubles, ...myTroubles];
    const found = all.find(t => t.id === troubleId);
    if (found) setTrouble(found);
  }, [troubleId, troubles, myTroubles]);

  const myDrafts = drafts.filter(d => d.troubleId === troubleId);

  const handleInsertPrompt = (idx: number) => {
    const prompt = prompts[idx];
    setContent(prev => prev + (prev ? '\n\n' : '') + prompt.text + ' ');
    setActivePrompts(prev => [...prev, idx]);
  };

  const checks = [
    { pass: content.length >= 20, text: '内容长度合适（建议20字以上）' },
    { pass: !content.includes('傻逼') && !content.includes('滚'), text: '语言文明友善' },
    { pass: tone === '温暖共情' || tone === '真诚倾听' || content.length >= 50, text: '回应真诚，不空泛' },
  ];

  const allPass = checks.every(c => c.pass);

  const handleSaveDraft = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }
    saveDraft({
      id: `draft_${Date.now()}`,
      troubleId,
      content: content.trim(),
      tone,
      sections: activePrompts.map(i => prompts[i].text),
      savedAt: new Date().toISOString(),
    });
    Taro.showToast({ title: '已保存草稿', icon: 'success' });
  };

  const handleLoadDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setContent(draft.content);
      setTone(draft.tone);
      Taro.showToast({ title: '已载入草稿', icon: 'success' });
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    Taro.showModal({
      title: '删除草稿',
      content: '确定要删除这篇草稿吗？',
      success: (res) => {
        if (res.confirm) {
          deleteDraft(draftId);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入回应内容', icon: 'none' });
      return;
    }
    if (!allPass) {
      Taro.showModal({
        title: '回应自检提示',
        content: '部分自检项未通过，是否仍要发送？',
        success: (res) => {
          if (res.confirm) doSubmit();
        },
      });
      return;
    }
    doSubmit();
  };

  const doSubmit = () => {
    const newReply = {
      id: generateId(),
      troubleId,
      content: content.trim(),
      tone,
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.name,
      usefulSentences: [],
      isVoice: false,
    };
    addReply(troubleId, newReply);
    Taro.showToast({ title: '回应已发送', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  const currentTone = tones.find(t => t.key === tone);

  return (
    <View className={styles.page}>
      {trouble && (
        <View className={styles.troublePreview}>
          <Text className={styles.previewLabel}>正在回应 {trouble.authorName} 的烦恼：</Text>
          <Text className={styles.previewContent}>{trouble.content}</Text>
        </View>
      )}

      {myDrafts.length > 0 && (
        <View className={styles.draftsSection}>
          <Text className={styles.draftsTitle}>我的草稿（{myDrafts.length}）</Text>
          {myDrafts.map(draft => (
            <View key={draft.id} className={styles.draftItem}>
              <Text
                className={styles.draftContent}
                onClick={() => handleLoadDraft(draft.id)}
              >
                {draft.content}
              </Text>
              <Text className={styles.draftTime}>{formatTime(draft.savedAt)}</Text>
              <Text
                className={styles.draftDelete}
                onClick={() => handleDeleteDraft(draft.id)}
              >
                删除
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>✨ 分段提示（点击插入）</Text>
        <View className={styles.promptList}>
          {prompts.map((p, idx) => (
            <View
              key={idx}
              className={classnames(styles.promptItem, activePrompts.includes(idx) && styles.promptActive)}
              onClick={() => handleInsertPrompt(idx)}
            >
              <Text className={styles.promptIcon}>{p.icon}</Text>
              <Text className={styles.promptText}>{p.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🎭 选择语气</Text>
        <View className={styles.toneOptions}>
          {tones.map(t => (
            <View
              key={t.key}
              className={classnames(styles.toneOption, tone === t.key && styles.toneOptionActive)}
              style={tone === t.key ? {} : { color: t.color, background: t.bg }}
              onClick={() => setTone(t.key)}
            >
              {t.key}
            </View>
          ))}
        </View>
        {currentTone && <Text className={styles.toneDesc}>{currentTone.desc}</Text>}
      </View>

      <View className={styles.editorArea}>
        <Textarea
          className={styles.textarea}
          placeholder="在这里写下你的回应...\n\n真诚是最好的礼物，你的每一句话都可能温暖一个人。"
          value={content}
          onInput={(e) => setContent(e.detail.value)}
          maxlength={1000}
          autoHeight
        />
        <Text className={styles.charCount}>{content.length}/1000</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🔍 发送前自检</Text>
        <View className={styles.checkList}>
          {checks.map((c, idx) => (
            <View key={idx} className={styles.checkItem}>
              <View className={classnames(styles.checkIcon, c.pass ? styles.checkPass : styles.checkWarn)}>
                {c.pass ? '✓' : '!'}
              </View>
              <Text className={styles.checkText}>{c.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.footer}>
        <View className={classnames(styles.footerBtn, styles.footerBtnSecondary)} onClick={handleSaveDraft}>
          存草稿
        </View>
        <View
          className={classnames(styles.footerBtn, styles.footerBtnPrimary, !content.trim() && styles.footerBtnDisabled)}
          onClick={handleSubmit}
        >
          发送回应
        </View>
      </View>
    </View>
  );
};

export default RespondPage;
