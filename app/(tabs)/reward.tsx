import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {
  Star,
  Gift,
  Wallet,
  Coffee,
  Fuel,
  Leaf,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';

export default function RewardScreen() {
  const { points, rewards, redeemReward } = useApp();

  const handleRedeem = (item: (typeof rewards)[0]) => {
    if (points < item.points) {
      Alert.alert(
        'Poin Belum Cukup',
        `Kamu membutuhkan ${item.points} poin untuk menukarkan voucher ini. Poin kamu saat ini: ${points} poin. Terus laporkan kerusakan jalan untuk mengumpulkan poin!`
      );
      return;
    }

    Alert.alert(
      'Konfirmasi Penukaran',
      `Tukarkan ${item.points} poin untuk voucher "${item.title} (${item.category})"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tukarkan',
          onPress: () => {
            const success = redeemReward(item.id);
            if (success) {
              Alert.alert('Berhasil! 🎉', `Voucher "${item.title}" siap digunakan di menu profil.`);
            }
          },
        },
      ]
    );
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'wallet':
        return <Wallet size={24} color="#2563EB" />;
      case 'coffee':
        return <Coffee size={24} color="#D97706" />;
      case 'fuel':
        return <Fuel size={24} color="#16A34A" />;
      default:
        return <Leaf size={24} color="#0D9488" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Reward Saya</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Main Points Banner */}
        <View style={styles.pointsBanner}>
          <View style={styles.bannerGraphics}>
            <View style={styles.starCircle}>
              <Star size={36} color="#FFFFFF" fill="#F59E0B" />
            </View>
            <View style={styles.giftCircle}>
              <Gift size={40} color="#FFFFFF" fill="#3B82F6" />
            </View>
          </View>

          <View style={styles.bannerInfo}>
            <View style={styles.pointsRow}>
              <Award size={28} color={Theme.colors.accent} fill={Theme.colors.accent} />
              <Text style={styles.pointsValue}>{points}</Text>
              <Text style={styles.pointsLabel}>Poin</Text>
            </View>
            <Text style={styles.bannerSub}>
              Terus laporkan untuk kumpulkan poin!
            </Text>
          </View>
        </View>

        {/* Section Tukar Poin */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tukar Poin</Text>
          <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
            <ChevronRight size={14} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Reward Items List */}
        <View style={styles.rewardsList}>
          {rewards.map((item) => {
            const canAfford = points >= item.points;

            return (
              <View key={item.id} style={styles.rewardCard}>
                <View
                  style={[
                    styles.rewardIconBox,
                    { backgroundColor: item.imageBg || '#EFF6FF' },
                  ]}>
                  {getRewardIcon(item.icon)}
                </View>

                <View style={styles.rewardDetails}>
                  <Text style={styles.rewardTitle}>{item.title}</Text>
                  <Text style={styles.rewardCategory}>{item.category}</Text>
                  <View style={styles.costBadge}>
                    <Text style={styles.costBadgeText}>{item.points} Poin</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.redeemBtn,
                    !canAfford && styles.redeemBtnDisabled,
                  ]}
                  onPress={() => handleRedeem(item)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.redeemBtnText,
                      !canAfford && styles.redeemBtnTextDisabled,
                    ]}>
                    Tukar
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Cara Dapatkan Poin Info */}
        <View style={styles.howToCard}>
          <View style={styles.howToHeader}>
            <Sparkles size={20} color={Theme.colors.accent} />
            <Text style={styles.howToTitle}>Cara Mendapatkan Poin</Text>
          </View>
          <Text style={styles.howToItem}>
            • <Text style={{ fontWeight: '700' }}>+50 Poin</Text> untuk setiap laporan kerusakan valid.
          </Text>
          <Text style={styles.howToItem}>
            • <Text style={{ fontWeight: '700' }}>+25 Poin</Text> saat perbaikan jalan dinyatakan selesai.
          </Text>
          <Text style={styles.howToItem}>
            • <Text style={{ fontWeight: '700' }}>+10 Poin</Text> bonus verifikasi komunitas.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  pointsBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#FEF08A',
    ...Theme.shadows.md,
  },
  bannerGraphics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  starCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    alignItems: 'center',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Theme.colors.text,
  },
  pointsLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  bannerSub: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '600',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  rewardsList: {
    gap: 12,
    marginBottom: 24,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Theme.shadows.sm,
  },
  rewardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  rewardCategory: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  costBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  costBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  redeemBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  redeemBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  redeemBtnTextDisabled: {
    color: '#94A3B8',
  },
  howToCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Theme.shadows.sm,
  },
  howToHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  howToTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  howToItem: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
});

