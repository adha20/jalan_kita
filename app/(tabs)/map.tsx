import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { InteractiveMap } from '@/components/InteractiveMap';

const FILTERS = ['Semua', 'Rusak', 'Diperbaiki', 'Selesai'] as const;

export default function MapScreen() {
  const router = useRouter();
  const {
    reports,
    filterStatus,
    setFilterStatus,
    selectedReport,
    setSelectedReport,
  } = useApp();

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'Semua') return true;
    if (filterStatus === 'Rusak') return r.status === 'rusak';
    if (filterStatus === 'Diperbaiki') return r.status === 'diperbaiki';
    if (filterStatus === 'Selesai') return r.status === 'selesai';
    return true;
  });

  const activeReport = selectedReport || filteredReports[0] || reports[0];

  return (
    <View style={styles.container}>
      {/* Top Header & Filter Bar */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Peta Laporan</Text>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => {
            const isSelected = filterStatus === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
                onPress={() => setFilterStatus(f)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Real Interactive Map Canvas */}
      <View style={styles.mapCanvas}>
        <InteractiveMap
          reports={filteredReports}
          selectedReport={activeReport}
          onSelectReport={(report) => setSelectedReport(report)}
          center={{ lat: -3.2220, lng: 104.6485 }}
          zoom={14}
        />
      </View>

      {/* Bottom Selected Report Card */}
      {activeReport && (
        <View style={styles.bottomCardContainer}>
          <TouchableOpacity
            style={styles.previewCard}
            onPress={() => router.push(`/report/${activeReport.id}`)}
            activeOpacity={0.9}>
            <Image
              source={{ uri: activeReport.photoUrl }}
              style={styles.cardImage}
            />

            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {activeReport.title}
                </Text>
                <StatusBadge status={activeReport.status} label={activeReport.statusLabel} size="sm" />
              </View>

              <Text style={styles.cardAddress} numberOfLines={1}>
                {activeReport.locationName}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.cardTime}>{activeReport.timeAgo}</Text>
                <View style={styles.cardDetailBtn}>
                  <Text style={styles.cardDetailBtnText}>Detail</Text>
                  <ChevronRight size={14} color={Theme.colors.primary} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: Theme.colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EFF6FF',
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DBEAFE',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#DBEAFE',
  },
  roadDiagonal: {
    position: 'absolute',
    width: 300,
    height: 16,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  areaLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  areaLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  markerContainerSelected: {
    transform: [{ scale: 1.2 }],
    zIndex: 10,
  },
  markerBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Theme.shadows.md,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  floatingControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 10,
  },
  mapControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 20,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Theme.shadows.lg,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  cardAddress: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  cardDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cardDetailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
});

