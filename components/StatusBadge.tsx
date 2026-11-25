import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/constants/Theme';

interface StatusBadgeProps {
  status: 'rusak' | 'diperbaiki' | 'selesai' | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  let bg = Theme.colors.rusakBg;
  let text = Theme.colors.rusak;
  let defaultLabel = 'Belum Ditangani';

  if (status === 'diperbaiki' || status === 'dikerjakan') {
    bg = Theme.colors.diperbaikiBg;
    text = Theme.colors.diperbaiki;
    defaultLabel = 'Sedang Dikerjakan';
  } else if (status === 'selesai') {
    bg = Theme.colors.selesaiBg;
    text = Theme.colors.selesai;
    defaultLabel = 'Selesai';
  } else if (status === 'diterima') {
    bg = '#E0F2FE';
    text = '#0284C7';
    defaultLabel = 'Diterima Dinas';
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        isSmall && styles.badgeSm,
        isLarge && styles.badgeLg,
      ]}>
      <View style={[styles.dot, { backgroundColor: text }]} />
      <Text
        style={[
          styles.text,
          { color: text },
          isSmall && styles.textSm,
          isLarge && styles.textLg,
        ]}>
        {label || defaultLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radii.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeLg: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSm: {
    fontSize: 11,
  },
  textLg: {
    fontSize: 13,
  },
});

