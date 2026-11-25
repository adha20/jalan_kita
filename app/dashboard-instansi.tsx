import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Share,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Flame,
  Check,
  RefreshCw,
  X,
  MapPin,
  Clock,
  User,
  ListFilter,
  Layers,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';
import { StatusBadge } from '@/components/StatusBadge';
import { ReportItem } from '@/services/mockData';

export default function DashboardInstansiScreen() {
  const router = useRouter();
  const { reports, stats, updateReportStatus } = useApp();

  const [activeTab, setActiveTab] = useState<'map' | 'queue'>('queue');
  const [filterStatus, setFilterStatus] = useState<'semua' | 'rusak' | 'diperbaiki' | 'selesai'>('semua');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ReportItem | null>(null);

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'semua') return true;
    return r.status === filterStatus;
  });

  const completionRate = stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;

  const handleShare = async () => {
    try {
      const summaryText = `LAPORAN REKAPITULASI INFRASTRUKTUR JALANKITA (INDRALAYA):\n` +
        `Total Laporan: ${stats.total}\n` +
        `• Belum Ditangani (Rusak): ${stats.rusak}\n` +
        `• Sedang Dikerjakan: ${stats.diperbaiki}\n` +
        `• Selesai Diperbaiki: ${stats.selesai}\n` +
        `Tingkat Penyelesaian: ${completionRate}%\n` +
        `Dinas Pekerjaan Umum & Penataan Ruang Kab. Ogan Ilir.`;

      await Share.share({ message: summaryText });
    } catch {
      // ignore
    }
  };

  const handleActionClick = (
    item: ReportItem,
    newStatus: 'rusak' | 'diperbaiki' | 'selesai',
    statusLabel: string
  ) => {
    updateReportStatus(item.id, newStatus, statusLabel);
    setSelectedItem(null);
    Alert.alert(
      'Status Berhasil Diperbarui! ✅',
      `Laporan "${item.title}" di ${item.locationName} sekarang berstatus "${statusLabel}". Notifikasi telah dikirim ke pelapor.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Admin */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Portal Dinas PUPR</Text>
          <Text style={styles.headerSubtitle}>Kabupaten Ogan Ilir • Indralaya</Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={handleShare}
          activeOpacity={0.8}>
          <Share2 size={20} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* KPI Stats Bar */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiRow}>
          {/* Rusak */}
          <TouchableOpacity
            style={[
              styles.kpiBox,
              filterStatus === 'rusak' && styles.kpiBoxActive,
              { backgroundColor: '#FFF5F5', borderColor: '#FEE2E2' },
            ]}
            onPress={() => {
              setActiveTab('queue');
              setFilterStatus('rusak');
            }}
            activeOpacity={0.8}>
            <View style={[styles.kpiIcon, { backgroundColor: Theme.colors.rusak }]}>
              <AlertTriangle size={14} color="#FFF" />
            </View>
            <Text style={[styles.kpiNumber, { color: Theme.colors.rusak }]}>{stats.rusak}</Text>
            <Text style={styles.kpiLabel}>Perlu Tindakan</Text>
          </TouchableOpacity>

          {/* Sedang Dikerjakan */}
          <TouchableOpacity
            style={[
              styles.kpiBox,
              filterStatus === 'diperbaiki' && styles.kpiBoxActive,
              { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' },
            ]}
            onPress={() => {
              setActiveTab('queue');
              setFilterStatus('diperbaiki');
            }}
            activeOpacity={0.8}>
            <View style={[styles.kpiIcon, { backgroundColor: Theme.colors.diperbaiki }]}>
              <Wrench size={14} color="#FFF" />
            </View>
            <Text style={[styles.kpiNumber, { color: Theme.colors.diperbaiki }]}>{stats.diperbaiki}</Text>
            <Text style={styles.kpiLabel}>Dikerjakan</Text>
          </TouchableOpacity>

          {/* Selesai */}
          <TouchableOpacity
            style={[
              styles.kpiBox,
              filterStatus === 'selesai' && styles.kpiBoxActive,
              { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' },
            ]}
            onPress={() => {
              setActiveTab('queue');
              setFilterStatus('selesai');
            }}
            activeOpacity={0.8}>
            <View style={[styles.kpiIcon, { backgroundColor: Theme.colors.selesai }]}>
              <CheckCircle2 size={14} color="#FFF" />
            </View>
            <Text style={[styles.kpiNumber, { color: Theme.colors.selesai }]}>{stats.selesai}</Text>
            <Text style={styles.kpiLabel}>Tuntas</Text>
          </TouchableOpacity>

          {/* Progress % */}
          <View style={[styles.kpiBox, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
            <View style={[styles.kpiIcon, { backgroundColor: Theme.colors.primary }]}>
              <Check size={14} color="#FFF" />
            </View>
            <Text style={[styles.kpiNumber, { color: Theme.colors.primary }]}>{completionRate}%</Text>
            <Text style={styles.kpiLabel}>Selesai</Text>
          </View>
        </View>
      </View>

      {/* Admin Mode Switcher: [ Peta & Heatmap ] vs [ Antrian Penanganan ] */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.switchBtn, activeTab === 'queue' && styles.switchBtnActive]}
          onPress={() => setActiveTab('queue')}
          activeOpacity={0.8}>
          <ListFilter size={16} color={activeTab === 'queue' ? '#FFF' : Theme.colors.textSecondary} />
          <Text style={[styles.switchBtnText, activeTab === 'queue' && styles.switchBtnTextActive]}>
            Kelola Penanganan ({filteredReports.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchBtn, activeTab === 'map' && styles.switchBtnActive]}
          onPress={() => setActiveTab('map')}
          activeOpacity={0.8}>
          <Layers size={16} color={activeTab === 'map' ? '#FFF' : Theme.colors.textSecondary} />
          <Text style={[styles.switchBtnText, activeTab === 'map' && styles.switchBtnTextActive]}>
            Peta & Heatmap
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODE 1: PETA & HEATMAP */}
      {activeTab === 'map' && (
        <View style={styles.mapViewContainer}>
          <View style={styles.mapHeaderRow}>
            <Text style={styles.mapHeaderTitle}>Peta Sebaran Laporan Warga</Text>
            <TouchableOpacity
              style={[styles.heatmapToggle, showHeatmap && styles.heatmapToggleActive]}
              onPress={() => setShowHeatmap(!showHeatmap)}
              activeOpacity={0.8}>
              <Flame size={14} color={showHeatmap ? '#FFF' : '#EF4444'} />
              <Text style={[styles.heatmapToggleText, showHeatmap && styles.heatmapToggleTextActive]}>
                Heatmap: {showHeatmap ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapWrapper}>
            <InteractiveMap
              reports={filteredReports}
              showHeatmap={showHeatmap}
              center={{ lat: -3.2220, lng: 104.6485 }}
              zoom={13}
              onSelectReport={(report) => setSelectedItem(report)}
            />

            {showHeatmap && (
              <View style={styles.legendOverlay}>
                <Text style={styles.legendTitle}>Kepadatan Kerusakan:</Text>
                <View style={styles.legendBar}>
                  <View style={[styles.legendColor, { backgroundColor: '#FDE047' }]} />
                  <View style={[styles.legendColor, { backgroundColor: '#FB923C' }]} />
                  <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
                </View>
                <View style={styles.legendLabels}>
                  <Text style={styles.legendLabelText}>Rendah</Text>
                  <Text style={styles.legendLabelText}>Kritis</Text>
                </View>
              </View>
            )}
          </View>
          <Text style={styles.mapTipText}>
            💡 Tip: Ketuk salah satu pin marker di peta untuk langsung mengubah status penanganannya.
          </Text>
        </View>
      )}

      {/* MODE 2: KELOLA ANTRIAN & TINDAK LANJUT */}
      {activeTab === 'queue' && (
        <ScrollView
          style={styles.queueContainer}
          contentContainerStyle={styles.queueContent}
          showsVerticalScrollIndicator={false}>
          {/* Filter Chips */}
          <View style={styles.filterChipRow}>
            {(['semua', 'rusak', 'diperbaiki', 'selesai'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.filterChip,
                  filterStatus === s && styles.filterChipActive,
                ]}
                onPress={() => setFilterStatus(s)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.filterChipText,
                    filterStatus === s && styles.filterChipTextActive,
                  ]}>
                  {s.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Report Cards with Inline Action Buttons */}
          <View style={styles.cardsList}>
            {filteredReports.map((item) => (
              <View key={item.id} style={styles.adminCard}>
                <View style={styles.cardTopRow}>
                  <Image source={{ uri: item.photoUrl }} style={styles.cardThumb} />
                  <View style={styles.cardMeta}>
                    <View style={styles.cardBadgeRow}>
                      <StatusBadge status={item.status} label={item.statusLabel} size="sm" />
                      <Text style={styles.cardTime}>{item.timeAgo}</Text>
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.cardLocRow}>
                      <MapPin size={12} color={Theme.colors.primary} />
                      <Text style={styles.cardLocText} numberOfLines={1}>
                        {item.locationName}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Quick Workflow Action Buttons */}
                <View style={styles.actionButtonRow}>
                  {item.status === 'rusak' && (
                    <>
                      <TouchableOpacity
                        style={[styles.btnAction, { backgroundColor: Theme.colors.primary }]}
                        onPress={() => handleActionClick(item, 'diperbaiki', 'Sedang Dikerjakan')}
                        activeOpacity={0.85}>
                        <Wrench size={14} color="#FFF" />
                        <Text style={styles.btnActionText}>Tugaskan Tim & Kerjakan</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.btnActionOutline, { borderColor: Theme.colors.primary }]}
                        onPress={() => handleActionClick(item, 'diperbaiki', 'Diterima Dinas')}
                        activeOpacity={0.85}>
                        <Check size={14} color={Theme.colors.primary} />
                        <Text style={[styles.btnActionTextOutline, { color: Theme.colors.primary }]}>
                          Terima Laporan
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {item.status === 'diperbaiki' && (
                    <TouchableOpacity
                      style={[styles.btnAction, { backgroundColor: Theme.colors.selesai }]}
                      onPress={() => handleActionClick(item, 'selesai', 'Selesai Diperbaiki')}
                      activeOpacity={0.85}>
                      <CheckCircle2 size={16} color="#FFF" />
                      <Text style={styles.btnActionText}>Tandai Selesai Diperbaiki</Text>
                    </TouchableOpacity>
                  )}

                  {item.status === 'selesai' && (
                    <View style={styles.completedRow}>
                      <View style={styles.completedBadge}>
                        <CheckCircle2 size={14} color={Theme.colors.selesai} />
                        <Text style={styles.completedText}>Perbaikan Tuntas</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.reopenBtn}
                        onPress={() => handleActionClick(item, 'diperbaiki', 'Sedang Dikerjakan')}
                        activeOpacity={0.8}>
                        <RefreshCw size={12} color={Theme.colors.textSecondary} />
                        <Text style={styles.reopenBtnText}>Buka Kembali</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* MODAL DETAIL / QUICK ACTION DARI MAP PIN */}
      {selectedItem && (
        <Modal
          visible={!!selectedItem}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedItem(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Tindak Lanjut Dinas</Text>
                  <Text style={styles.modalSub}>{selectedItem.locationName}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.modalCloseBtn}>
                  <X size={20} color={Theme.colors.text} />
                </TouchableOpacity>
              </View>

              <Image source={{ uri: selectedItem.photoUrl }} style={styles.modalImage} />

              <View style={styles.modalBody}>
                <Text style={styles.modalReportTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalReportDesc}>{selectedItem.description}</Text>

                <View style={styles.modalMetaRow}>
                  <User size={14} color={Theme.colors.primary} />
                  <Text style={styles.modalMetaText}>Pelapor: {selectedItem.reporterName}</Text>
                  <Clock size={14} color={Theme.colors.textMuted} style={{ marginLeft: 10 }} />
                  <Text style={styles.modalMetaText}>{selectedItem.createdAt}</Text>
                </View>

                {/* Workflow Buttons */}
                <Text style={styles.workflowLabel}>Pilih Status Penanganan:</Text>
                <View style={styles.workflowButtons}>
                  <TouchableOpacity
                    style={[
                      styles.workflowBtn,
                      { backgroundColor: '#FFF5F5', borderColor: '#FEE2E2' },
                    ]}
                    onPress={() => handleActionClick(selectedItem, 'rusak', 'Belum Ditangani')}
                    activeOpacity={0.8}>
                    <AlertTriangle size={16} color={Theme.colors.rusak} />
                    <Text style={[styles.workflowBtnText, { color: Theme.colors.rusak }]}>
                      Belum Ditangani
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.workflowBtn,
                      { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' },
                    ]}
                    onPress={() => handleActionClick(selectedItem, 'diperbaiki', 'Sedang Dikerjakan')}
                    activeOpacity={0.8}>
                    <Wrench size={16} color={Theme.colors.diperbaiki} />
                    <Text style={[styles.workflowBtnText, { color: Theme.colors.diperbaiki }]}>
                      Sedang Dikerjakan
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.workflowBtn,
                      { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' },
                    ]}
                    onPress={() => handleActionClick(selectedItem, 'selesai', 'Selesai Diperbaiki')}
                    activeOpacity={0.8}>
                    <CheckCircle2 size={16} color={Theme.colors.selesai} />
                    <Text style={[styles.workflowBtnText, { color: Theme.colors.selesai }]}>
                      Selesai Diperbaiki
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    paddingBottom: 12,
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  kpiContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
  },
  kpiBoxActive: {
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  kpiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  kpiNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
  },
  switchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  switchBtnActive: {
    backgroundColor: Theme.colors.primary,
  },
  switchBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  switchBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mapViewContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  heatmapToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heatmapToggleActive: {
    backgroundColor: '#EF4444',
  },
  heatmapToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  heatmapToggleTextActive: {
    color: '#FFFFFF',
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  legendOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 8,
    borderRadius: 8,
    width: 130,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  legendBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  legendColor: {
    flex: 1,
  },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  legendLabelText: {
    fontSize: 8,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  mapTipText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  queueContainer: {
    flex: 1,
  },
  queueContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  filterChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  cardsList: {
    gap: 12,
  },
  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Theme.shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cardThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  cardMeta: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: {
    fontSize: 10,
    color: Theme.colors.textMuted,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: 2,
  },
  cardLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cardLocText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    flex: 1,
  },
  cardDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionButtonRow: {
    gap: 8,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  btnActionOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  btnActionTextOutline: {
    fontSize: 12,
    fontWeight: '700',
  },
  completedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.selesai,
  },
  reopenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  reopenBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  modalSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 14,
  },
  modalBody: {
    gap: 8,
  },
  modalReportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  modalReportDesc: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  modalMetaText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginLeft: 4,
  },
  workflowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: 10,
    marginBottom: 4,
  },
  workflowButtons: {
    gap: 8,
  },
  workflowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  workflowBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
