import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  MapPin,
  Clock,
  Cone,
  Lightbulb,
  Trees,
  Sparkles,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';

const CATEGORIES = [
  {
    id: 'jalan_berlubang',
    label: 'Jalan Berlubang',
    icon: Cone,
    color: '#F97316',
    bgColor: '#FFF7ED',
    desc: 'Aspal berlubang, retak, atau amblas',
  },
  {
    id: 'lampu_mati',
    label: 'Lampu Mati',
    icon: Lightbulb,
    color: '#EAB308',
    bgColor: '#FEFCE8',
    desc: 'Penerangan Jalan Umum (PJU) padam',
  },
  {
    id: 'pohon_tumbang',
    label: 'Pohon Tumbang',
    icon: Trees,
    color: '#16A34A',
    bgColor: '#F0FDF4',
    desc: 'Dahan rapuh atau pohon menghalangi',
  },
];

export default function CreateReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    photoUri?: string;
    lat?: string;
    lng?: string;
    locationName?: string;
    capturedTime?: string;
  }>();

  const { addReport } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<string>('jalan_berlubang');
  const [description, setDescription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fallbacks from params & safe decode
  const rawUri = params.photoUri ? decodeURIComponent(params.photoUri) : null;
  const photoUri =
    rawUri ||
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';
  const latitude = params.lat ? parseFloat(params.lat) : -2.9787;
  const longitude = params.lng ? parseFloat(params.lng) : 104.7603;
  const locationName = params.locationName || 'Jl. Srijaya Negara, Indralaya';
  const capturedTime = params.capturedTime || '8 Nov 2026, 09:41';

  // Voice to text simulation / handler
  const handleToggleVoice = async () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate live voice recognition result
      setTimeout(() => {
        const voiceText =
          ' Jalan berlubang cukup parah di lajur kiri dekat persimpangan, membahayakan pengendara motor.';
        setDescription((prev) => (prev ? prev + voiceText : voiceText.trim()));
        setIsRecording(false);
      }, 2500);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const selectedCat = CATEGORIES.find((c) => c.id === category);

    setTimeout(() => {
      const created = addReport({
        title: selectedCat?.label || 'Laporan Jalan',
        category: category as any,
        categoryLabel: selectedCat?.label || 'Jalan Berlubang',
        categoryIcon: category,
        locationName,
        latitude,
        longitude,
        photoUrl: photoUri,
        status: 'rusak',
        statusLabel: 'Terkirim',
        description: description || 'Laporan infrastruktur jalan dari warga setempat.',
      });

      setIsSubmitting(false);
      Alert.alert(
        'Laporan Terkirim! 🎉',
        'Laporan kamu telah masuk ke dinas terkait dan kamu mendapatkan +50 Poin JalanKita!',
        [
          {
            text: 'Lihat Detail Laporan',
            onPress: () => router.replace(`/report/${created.id}`),
          },
        ]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Laporan</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 3-Step Wizard Indicator */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperRow}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
              <Text style={[styles.stepCircleText, step >= 1 && styles.stepCircleTextActive]}>
                1
              </Text>
            </View>
            <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Kategori</Text>
          </View>

          <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
              <Text style={[styles.stepCircleText, step >= 2 && styles.stepCircleTextActive]}>
                2
              </Text>
            </View>
            <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Detail</Text>
          </View>

          <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 3 && styles.stepCircleActive]}>
              <Text style={[styles.stepCircleText, step >= 3 && styles.stepCircleTextActive]}>
                3
              </Text>
            </View>
            <Text style={[styles.stepLabel, step >= 3 && styles.stepLabelActive]}>Konfirmasi</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* STEP 1: Pilih Kategori & Deskripsi */}
        {step === 1 && (
          <View>
            <Text style={styles.fieldSectionTitle}>Pilih Kategori</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                const IconComponent = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardSelected,
                    ]}
                    onPress={() => setCategory(cat.id)}
                    activeOpacity={0.8}>
                    <View
                      style={[
                        styles.categoryIconCircle,
                        { backgroundColor: cat.bgColor },
                      ]}>
                      <IconComponent size={28} color={cat.color} />
                    </View>
                    <Text
                      style={[
                        styles.categoryTitle,
                        isSelected && styles.categoryTitleSelected,
                      ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Deskripsi Area + Voice-to-Text Button */}
            <View style={styles.inputSection}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.fieldSectionTitle}>Deskripsi (Opsional)</Text>
                {isRecording && (
                  <View style={styles.recordingBadge}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>Mendengarkan...</Text>
                  </View>
                )}
              </View>

              <View style={styles.textAreaWrapper}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Ceritakan lebih detail... (bisa pakai suara juga!)"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
                  textAlignVertical="top"
                />

                {/* Voice-to-Text Mic Button */}
                <TouchableOpacity
                  style={[
                    styles.micButton,
                    isRecording && styles.micButtonActive,
                  ]}
                  onPress={handleToggleVoice}
                  activeOpacity={0.8}>
                  {isRecording ? (
                    <MicOff size={20} color="#FFFFFF" />
                  ) : (
                    <Mic size={20} color={Theme.colors.primary} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.helperText}>
                💡 Tip: Tekan ikon mikrofon untuk berbicara langsung tanpa mengetik.
              </Text>
            </View>
          </View>
        )}

        {/* STEP 2: Detail Foto & Lokasi */}
        {step === 2 && (
          <View>
            <Text style={styles.fieldSectionTitle}>Bukti Foto & Metadata GPS</Text>

            {/* Photo Card with Watermark */}
            <View style={styles.previewImageCard}>
              <Image
                source={{ uri: photoUri }}
                style={styles.previewImage}
                contentFit="cover"
                transition={250}
              />
              <View style={styles.photoWatermarkTag}>
                <View style={styles.watermarkLine}>
                  <MapPin size={13} color="#93C5FD" />
                  <Text style={styles.watermarkLineText}>
                    {latitude}, {longitude}
                  </Text>
                </View>
                <View style={[styles.watermarkLine, { marginTop: 3 }]}>
                  <Clock size={13} color="#FDE047" />
                  <Text style={styles.watermarkLineText}>{capturedTime}</Text>
                </View>
              </View>
            </View>

            {/* Location Card */}
            <View style={styles.locationDetailCard}>
              <View style={styles.locationIconBox}>
                <MapPin size={22} color={Theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationTitle}>Lokasi Terdeteksi</Text>
                <Text style={styles.locationSub}>{locationName}</Text>
                <Text style={styles.coordsSub}>
                  Koordinat: {latitude}, {longitude}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: Konfirmasi & Kirim */}
        {step === 3 && (
          <View>
            <Text style={styles.fieldSectionTitle}>Konfirmasi Laporan</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Kategori:</Text>
                <Text style={styles.summaryValue}>
                  {CATEGORIES.find((c) => c.id === category)?.label}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Lokasi:</Text>
                <Text style={styles.summaryValue}>{locationName}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Waktu:</Text>
                <Text style={styles.summaryValue}>{capturedTime}</Text>
              </View>

              <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.summaryLabel}>Deskripsi:</Text>
                <Text style={[styles.summaryValue, { flex: 1, textAlign: 'right' }]}>
                  {description || '-'}
                </Text>
              </View>
            </View>

            {/* Reward Bonus Banner */}
            <View style={styles.rewardBonusCard}>
              <Sparkles size={24} color={Theme.colors.accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.rewardBonusTitle}>Dapatkan +50 Poin</Text>
                <Text style={styles.rewardBonusSub}>
                  Poin otomatis ditambahkan ke akun Anda dan bisa ditukar dengan voucher menarik!
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleNext}
          disabled={isSubmitting}
          activeOpacity={0.85}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.continueBtnText}>
                {step === 3 ? 'Kirim Laporan' : 'Lanjutkan'}
              </Text>
              <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
            </>
          )}
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  stepperContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: Theme.colors.primary,
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stepLabelActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: Theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fieldSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...Theme.shadows.sm,
  },
  categoryCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  categoryTitleSelected: {
    color: Theme.colors.primary,
  },
  inputSection: {
    marginTop: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  textAreaWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    position: 'relative',
    ...Theme.shadows.sm,
  },
  textArea: {
    fontSize: 14,
    color: Theme.colors.text,
    minHeight: 100,
    paddingRight: 40,
  },
  micButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: '#EF4444',
  },
  helperText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
  previewImageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
    height: 220,
    marginBottom: 16,
    ...Theme.shadows.md,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  photoWatermarkTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  watermarkLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  watermarkLineText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  locationDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Theme.shadows.sm,
  },
  locationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  locationSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  coordsSub: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Theme.shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    color: Theme.colors.text,
    fontWeight: '700',
  },
  rewardBonusCard: {
    backgroundColor: '#FEFCE8',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  rewardBonusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#854D0E',
  },
  rewardBonusSub: {
    fontSize: 12,
    color: '#A16207',
    marginTop: 2,
    lineHeight: 16,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  continueBtn: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    ...Theme.shadows.md,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

