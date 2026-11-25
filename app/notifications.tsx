import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Trash2,
  Megaphone,
  Star,
  Gift,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markNotificationAsRead } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'status':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Megaphone size={20} color={Theme.colors.primary} />
          </View>
        );
      case 'point':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Star size={20} color="#D97706" fill="#F59E0B" />
          </View>
        );
      case 'promo':
      default:
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Gift size={20} color="#DC2626" />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifikasi</Text>

        <TouchableOpacity style={styles.circleBtn} activeOpacity={0.8}>
          <Trash2 size={20} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada notifikasi baru.</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notifCard,
                !item.read && styles.notifCardUnread,
              ]}
              onPress={() => markNotificationAsRead(item.id)}
              activeOpacity={0.8}>
              {getNotifIcon(item.type)}

              <View style={styles.notifTextContent}>
                <View style={styles.notifTopRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifTime}>{item.timeAgo}</Text>
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
              </View>

              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 12,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Theme.shadows.sm,
  },
  notifCardUnread: {
    backgroundColor: '#F8FAFC',
    borderColor: '#DBEAFE',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  notifTextContent: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  notifTime: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  notifMessage: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: Theme.colors.textMuted,
  },
});

