import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Share,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MapPin,
  User,
  Info,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { TimelineTracker } from '@/components/TimelineTracker';

export default function ReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reports } = useApp();

  const report = reports.find((r) => r.id === id) || reports[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Laporan JalanKita: ${report.title} di ${report.locationName}. Pantau status perbaikan di aplikasi JalanKita!`,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Laporan</Text>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={handleShare}
          activeOpacity={0.8}>
          <Share2 size={20} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Photo Evidence with Location Pill */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: report.photoUrl }}
            style={styles.mainImage}
            contentFit="cover"
            transition={250}
          />
          <View style={styles.imageCoordsPill}>
            <MapPin size={12} color="#60A5FA" />
            <Text style={styles.imageCoordsText}>
              {report.latitude}, {report.longitude}
            </Text>
          </View>
        </View>

        {/* Status Badge & Title Header */}
        <View style={styles.titleCard}>
          <StatusBadge
            status={report.status}
            label={report.statusLabel}
            size="md"
          />

          <Text style={styles.reportTitle}>{report.title}</Text>

          <View style={styles.locationRow}>
            <MapPin size={16} color={Theme.colors.primary} />
            <Text style={styles.locationText}>{report.locationName}</Text>
          </View>
        </View>

        {/* Timeline Progress Tracking */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Perkembangan Penanganan</Text>
          <Text style={styles.sectionSub}>
            Laporan diproses dan ditindaklanjuti oleh dinas pekerjaan umum terkait.
          </Text>

          <View style={styles.timelineWrapper}>
            <TimelineTracker steps={report.timeline} />
          </View>
        </View>

        {/* Description & Reporter Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Deskripsi Keluhan</Text>
          <Text style={styles.descriptionText}>
            {report.description || 'Tidak ada deskripsi tambahan.'}
          </Text>

          <View style={styles.divider} />

          <View style={styles.reporterRow}>
            <View style={styles.reporterAvatar}>
              <User size={18} color={Theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.reporterName}>
                Dilaporkan oleh {report.reporterName || 'Warga'}
              </Text>
              <Text style={styles.reporterTime}>{report.createdAt}</Text>
            </View>
          </View>
        </View>

        {/* Support Hotline / Info Banner */}
        <View style={styles.infoBanner}>
          <Info size={20} color={Theme.colors.primary} />
          <Text style={styles.infoBannerText}>
            Perbaikan jalan dikoordinasikan secara berkala dengan pihak Dinas PUPR Kab. Ogan Ilir / Indralaya.
          </Text>
        </View>

        {/* Action shortcut to Admin Portal */}
        <TouchableOpacity
          style={styles.adminShortcutBtn}
          onPress={() => router.push('/dashboard-instansi')}
          activeOpacity={0.85}>
          <Text style={styles.adminShortcutText}>Kelola Laporan Ini di Portal Dinas</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  },
  imageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    height: 220,
    marginBottom: 16,
    position: 'relative',
    ...Theme.shadows.md,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageCoordsPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageCoordsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  titleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Theme.shadows.sm,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text,
    marginTop: 10,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 16,
  },
  timelineWrapper: {
    paddingLeft: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: Theme.colors.text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  reporterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reporterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reporterName: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  reporterTime: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  infoBanner: {
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: Theme.colors.primaryDark,
    lineHeight: 18,
  },
  adminShortcutBtn: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminShortcutText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});

