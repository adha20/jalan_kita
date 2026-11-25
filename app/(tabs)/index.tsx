import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Camera,
  ChevronRight,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  MapPin,
  Building2,
  Award,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';

export default function HomeScreen() {
  const router = useRouter();
  const { userName, stats, notifications, points, reports } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Halo, {userName}! 👋</Text>
          <Text style={styles.subtitle}>
            Bersama kita wujudkan jalanan yang lebih baik.
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.8}>
            <Bell size={22} color={Theme.colors.primary} />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Mascot & Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTextContainer}>
          <View style={styles.badgeKeluarga}>
            <Text style={styles.badgeKeluargaText}>JalanKita Indralaya</Text>
          </View>
          <Text style={styles.welcomeTitle}>Lapor Cepat, Jalan Terawat</Text>
          <Text style={styles.welcomeDescription}>
            Foto langsung dari lokasi kerusakan. Sistem otomatis mendeteksi GPS dan waktu.
          </Text>
          <View style={styles.pointChip}>
            <Award size={16} color={Theme.colors.accent} />
            <Text style={styles.pointChipText}>{points} Poin Terkumpul</Text>
          </View>
        </View>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          }}
          style={styles.mascotAvatar}
        />
      </View>

      {/* Main CTA: Lapor Sekarang Banner */}
      <TouchableOpacity
        style={styles.laporBanner}
        onPress={() => router.push('/report/camera')}
        activeOpacity={0.9}>
        <View style={styles.laporBannerLeft}>
          <View style={styles.laporIconContainer}>
            <Camera size={26} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View style={styles.laporTextWrapper}>
            <Text style={styles.laporBannerTitle}>Lapor Sekarang</Text>
            <Text style={styles.laporBannerSub}>
              Klik untuk membuat laporan baru dengan foto & GPS
            </Text>
          </View>
        </View>
        <View style={styles.laporArrowCircle}>
          <ChevronRight size={20} color="#FFFFFF" strokeWidth={3} />
        </View>
      </TouchableOpacity>

      {/* Section: Informasi Jalan di Sekitarmu */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Informasi Jalan di Sekitarmu</Text>
        <TouchableOpacity
          style={styles.seeMapBtn}
          onPress={() => router.push('/(tabs)/map')}
          activeOpacity={0.7}>
          <Text style={styles.seeMapText}>Lihat Peta</Text>
          <ChevronRight size={16} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Mini Map Card Preview */}
      <TouchableOpacity
        style={styles.miniMapCard}
        onPress={() => router.push('/(tabs)/map')}
        activeOpacity={0.9}>
        <View style={styles.miniMapBackground} pointerEvents="none">
          <InteractiveMap
            reports={reports}
            center={{ lat: -3.2220, lng: 104.6485 }}
            zoom={13}
          />
          <View style={styles.miniMapOverlay}>
            <View style={styles.miniMapTag}>
              <MapPin size={12} color={Theme.colors.primary} />
              <Text style={styles.miniMapTagText}>Kota Indralaya & Kampus Unsri</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Summary Chips: Rusak, Diperbaiki, Selesai */}
      <View style={styles.statsRow}>
        {/* Rusak */}
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: '#FFF5F5', borderColor: '#FEE2E2' }]}
          onPress={() => {
            router.push('/(tabs)/map');
          }}
          activeOpacity={0.8}>
          <View style={[styles.statIconBadge, { backgroundColor: Theme.colors.rusak }]}>
            <AlertTriangle size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.statNumber, { color: Theme.colors.rusak }]}>{stats.rusak}</Text>
          <Text style={styles.statLabel}>Rusak</Text>
        </TouchableOpacity>

        {/* Diperbaiki */}
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}
          onPress={() => {
            router.push('/(tabs)/map');
          }}
          activeOpacity={0.8}>
          <View style={[styles.statIconBadge, { backgroundColor: Theme.colors.diperbaiki }]}>
            <Wrench size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.statNumber, { color: Theme.colors.diperbaiki }]}>{stats.diperbaiki}</Text>
          <Text style={styles.statLabel}>Diperbaiki</Text>
        </TouchableOpacity>

        {/* Selesai */}
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }]}
          onPress={() => {
            router.push('/(tabs)/map');
          }}
          activeOpacity={0.8}>
          <View style={[styles.statIconBadge, { backgroundColor: Theme.colors.selesai }]}>
            <CheckCircle2 size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.statNumber, { color: Theme.colors.selesai }]}>{stats.selesai}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Instansi Portal Banner */}
      <TouchableOpacity
        style={styles.instansiCard}
        onPress={() => router.push('/dashboard-instansi')}
        activeOpacity={0.85}>
        <View style={styles.instansiLeft}>
          <View style={styles.instansiIcon}>
            <Building2 size={24} color={Theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.instansiTitle}>Dashboard Instansi Terpadu</Text>
            <Text style={styles.instansiSub}>
              Pantau Heatmap Sebaran & kelola perbaikan dinas
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={Theme.colors.textMuted} />
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  headerRight: {
    marginLeft: 12,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Theme.colors.rusak,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    ...Theme.shadows.sm,
  },
  welcomeTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  badgeKeluarga: {
    backgroundColor: Theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeKeluargaText: {
    color: Theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  welcomeDescription: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  pointChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pointChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  mascotAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Theme.colors.primaryLight,
  },
  laporBanner: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...Theme.shadows.md,
  },
  laporBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  laporIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  laporTextWrapper: {
    flex: 1,
  },
  laporBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  laporBannerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    lineHeight: 16,
  },
  laporArrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  seeMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: 8,
  },
  seeMapText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  miniMapCard: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Theme.shadows.sm,
  },
  miniMapBackground: {
    flex: 1,
    backgroundColor: '#E0E7FF',
    position: 'relative',
  },
  mapGridPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EEF2FF',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  mapRoadDiagonal: {
    position: 'absolute',
    width: 140,
    height: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '35deg' }],
  },
  miniPin: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Theme.shadows.sm,
  },
  miniMapOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  miniMapTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  miniMapTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    ...Theme.shadows.sm,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  instansiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Theme.shadows.sm,
  },
  instansiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instansiIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instansiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  instansiSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
});
