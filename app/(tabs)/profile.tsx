import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, points, reports } = useApp();

  const handleLogout = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => router.replace('/onboarding') },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{userName}</Text>
              <ShieldCheck size={18} color={Theme.colors.primary} />
            </View>
            <Text style={styles.userEmail}>nisa@wargaindralaya.id</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>⭐ Relawan Peduli Jalan</Text>
            </View>
          </View>
        </View>

        {/* User Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>{points}</Text>
            <Text style={styles.statLabel}>Poin Saya</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>{reports.length}</Text>
            <Text style={styles.statLabel}>Laporan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Fitur & Layanan</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/dashboard-instansi')}
            activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Building2 size={20} color={Theme.colors.primary} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={styles.menuTitle}>Dashboard Instansi (Heatmap)</Text>
              <Text style={styles.menuSub}>Lihat sebaran kerusakan jalan kota</Text>
            </View>
            <ChevronRight size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/onboarding')}
            activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Compass size={20} color="#D97706" />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={styles.menuTitle}>Panduan & Onboarding</Text>
              <Text style={styles.menuSub}>Cara mudah melapor & kumpulkan poin</Text>
            </View>
            <ChevronRight size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Akun & Preferensi</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Pengaturan', 'Fitur notifikasi dan tema akun aktif.')}
            activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Settings size={20} color={Theme.colors.textSecondary} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={styles.menuTitle}>Pengaturan Aplikasi</Text>
              <Text style={styles.menuSub}>Notifikasi, privasi & GPS</Text>
            </View>
            <ChevronRight size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'Bantuan PUPR',
                'Layanan Pengaduan Jalan Kabupaten Ogan Ilir / Indralaya.\nHotline: 0812-3456-7890\nEmail: pupr@oganilirkab.go.id'
              )
            }
            activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
              <HelpCircle size={20} color="#16A34A" />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={styles.menuTitle}>Pusat Bantuan & Kontak Dinas</Text>
              <Text style={styles.menuSub}>Hubungi dinas dan pertanyaan umum</Text>
            </View>
            <ChevronRight size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
            activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEE2E2' }]}>
              <LogOut size={20} color="#DC2626" />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={[styles.menuTitle, { color: '#DC2626' }]}>Keluar</Text>
              <Text style={styles.menuSub}>Keluar dari sesi aplikasi</Text>
            </View>
            <ChevronRight size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.versionCard}>
          <Text style={styles.versionText}>JalanKita v1.0.0 (Expo SDK 58)</Text>
          <Text style={styles.versionSub}>Wujudkan Jalan Lebih Baik Bersama Warga</Text>
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
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
    ...Theme.shadows.sm,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: Theme.colors.primaryLight,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 24,
    ...Theme.shadows.sm,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  menuSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  versionCard: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
  },
  versionSub: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
});

