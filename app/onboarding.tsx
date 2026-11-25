import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, MapPin, Camera, CheckCircle2 } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    badge: 'Selamat Datang',
    title: 'JalanKita',
    tagline: 'Lapor, Pantau, Wujudkan Jalan Lebih Baik!',
    description:
      'Wadah partisipasi warga untuk melaporkan jalan berlubang, lampu mati, dan infrastruktur umum dengan akurat dan transparan.',
    iconType: 'brand',
  },
  {
    id: '2',
    badge: 'Foto & GPS Otomatis',
    title: 'Laporkan dengan Mudah & Akurat',
    tagline: 'Kamera Khusus Bukti Kerusakan',
    description:
      'Ambil foto langsung di lokasi. Sistem otomatis membubuhkan koordinat GPS presisi dan stempel waktu anti-duplikasi.',
    iconType: 'camera',
  },
  {
    id: '3',
    badge: 'Pantau Real-Time',
    title: 'Pantau Perkembangan Laporanmu',
    tagline: 'Terhubung Langsung dengan Instansi',
    description:
      'Lihat status laporan secara real-time di peta interaktif dari Terkirim, Diterima Dinas, hingga Selesai Diperbaiki.',
    iconType: 'map',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const slide = SLIDES[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header: Skip Button */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>JalanKita</Text>
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      </View>

      {/* Main Illustration Area */}
      <View style={styles.illustrationArea}>
        <View style={styles.illustrationCircle}>
          {slide.iconType === 'brand' && (
            <View style={styles.brandIconWrapper}>
              <View style={styles.pinWrapper}>
                <MapPin size={64} color={Theme.colors.primary} fill={Theme.colors.accent} />
              </View>
              <Text style={styles.brandTitleText}>JalanKita</Text>
              <Text style={styles.brandSubText}>Lapor, Pantau, Wujudkan Jalan Lebih Baik!</Text>
            </View>
          )}

          {slide.iconType === 'camera' && (
            <View style={styles.cameraArtWrapper}>
              <View style={styles.cameraCircle}>
                <Camera size={72} color={Theme.colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.cameraWatermarkPill}>
                <Text style={styles.cameraWatermarkText}>📍 GPS & Waktu Otomatis</Text>
              </View>
            </View>
          )}

          {slide.iconType === 'map' && (
            <View style={styles.mapArtWrapper}>
              <View style={styles.mapCircle}>
                <MapPin size={60} color={Theme.colors.rusak} />
                <View style={styles.mapDonePill}>
                  <CheckCircle2 size={16} color={Theme.colors.selesai} />
                  <Text style={styles.mapDoneText}>Pantau Real-time</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Text Info Section */}
      <View style={styles.textSection}>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{slide.badge}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>

        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>
            {currentSlide === SLIDES.length - 1 ? 'Mulai Sekarang' : 'Selanjutnya'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.primary,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  illustrationArea: {
    flex: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationCircle: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  brandIconWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pinWrapper: {
    marginBottom: 12,
  },
  brandTitleText: {
    fontSize: 26,
    fontWeight: '900',
    color: Theme.colors.primary,
  },
  brandSubText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  cameraArtWrapper: {
    alignItems: 'center',
  },
  cameraCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  cameraWatermarkPill: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    ...Theme.shadows.sm,
  },
  cameraWatermarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  mapArtWrapper: {
    alignItems: 'center',
  },
  mapCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  mapDonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapDoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.selesai,
  },
  textSection: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  badgeText: {
    color: Theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
    backgroundColor: Theme.colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#CBD5E1',
  },
  nextButton: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    ...Theme.shadows.md,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

