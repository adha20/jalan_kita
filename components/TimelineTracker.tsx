import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { TimelineStep } from '@/services/mockData';
import { Theme } from '@/constants/Theme';

interface TimelineTrackerProps {
  steps: TimelineStep[];
}

export function TimelineTracker({ steps }: TimelineTrackerProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = step.done && (!steps[index + 1] || !steps[index + 1].done);

        return (
          <View key={index} style={styles.itemRow}>
            {/* Indicator Column */}
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.circle,
                  step.done && styles.circleDone,
                  isCurrent && styles.circleCurrent,
                ]}>
                {step.done ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <View style={styles.circleInnerEmpty} />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.verticalLine,
                    step.done && styles.verticalLineDone,
                  ]}
                />
              )}
            </View>

            {/* Content Column */}
            <View style={[styles.contentCol, isLast && { paddingBottom: 0 }]}>
              <Text
                style={[
                  styles.title,
                  step.done && styles.titleDone,
                  isCurrent && styles.titleCurrent,
                ]}>
                {step.title}
              </Text>
              <Text style={styles.timeText}>{step.time}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circleDone: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  circleCurrent: {
    backgroundColor: Theme.colors.primary,
    borderColor: '#93C5FD',
    borderWidth: 3,
  },
  circleInnerEmpty: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  verticalLineDone: {
    backgroundColor: Theme.colors.primary,
  },
  contentCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  titleDone: {
    color: Theme.colors.text,
  },
  titleCurrent: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
});

