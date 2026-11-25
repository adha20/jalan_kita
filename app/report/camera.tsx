import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import {
  X,
  Zap,
  ZapOff,
  SwitchCamera,
  Image as ImageIcon,
  MapPin,
  Clock,
  Check,
} from 'lucide-react-native';
import { Theme } from '@/constants/Theme';

const { width } = Dimensions.get('window');

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);

  // GPS & Time watermark state
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: -2.9787,
    lng: 104.7603,
  });
  const [locationName, setLocationName] = useState<string>('Jl. Srijaya Negara, Indralaya');
  const [formattedTime, setFormattedTime] = useState<string>('8 Nov 2026, 09:41');

  useEffect(() => {
    (async () => {
      // 1. Dapatkan izin dan koordinat GPS
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setCoords({
            lat: Number(loc.coords.latitude.toFixed(4)),
            lng: Number(loc.coords.longitude.toFixed(4)),
          });

          // Geocoding untuk nama jalan jika memungkinkan
          const reverse = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          if (reverse.length > 0) {
            const place = reverse[0];
            const name = [place.street, place.subregion, place.city]
              .filter(Boolean)
              .join(', ');
            if (name) setLocationName(name);
          }
        }
      } catch {
        console.log('Location detection fallback to default');
      }

      // 2. Format waktu saat ini
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      setFormattedTime(now.toLocaleDateString('id-ID', options));
    })();
  }, []);

  const handleTakePicture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      let photoUri = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';

      if (cameraRef.current && cameraRef.current.takePictureAsync) {
        const result = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });
        if (result?.uri) {
          photoUri = result.uri;
        }
      }

      // Navigasi ke halaman form pelaporan dengan membawa data foto & metadata
      router.push({
        pathname: '/report/create',
        params: {
          photoUri,
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
          locationName,
          capturedTime: formattedTime,
        },
      });
    } catch (e) {
      console.error(e);
      // Fallback
      router.push({
        pathname: '/report/create',
        params: {
          photoUri: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
          locationName,
          capturedTime: formattedTime,
        },
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePickSample = () => {
    // Ambil sampel simulasi foto kerusakan
    router.push({
      pathname: '/report/create',
      params: {
        photoUri: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
        lat: coords.lat.toString(),
        lng: coords.lng.toString(),
        locationName,
        capturedTime: formattedTime,
      },
    });
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  if (!permission) {
    return <View style={styles.loadingContainer}><ActivityIndicator color="#FFF" /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Camera Live View atau Fallback jika emulator */}
      {permission.granted ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          enableTorch={flash === 'on'}
        />
      ) : (
        <View style={styles.permissionFallback}>
          <Text style={styles.permissionText}>Izin kamera dibutuhkan untuk foto kerusakan</Text>
          <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
            <Text style={styles.grantBtnText}>Beri Izin Kamera</Text>
          </TouchableOpacity>
        </View>
      )}

      <SafeAreaView style={styles.overlay}>
        {/* Top Bar: Close, Title, Flash */}
        <View style={styles.topControlBar}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.topTitleBadge}>
            <Text style={styles.topTitleText}>Kamera Pelaporan</Text>
          </View>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={toggleFlash}
            activeOpacity={0.8}>
            {flash === 'on' ? (
              <Zap size={22} color={Theme.colors.accent} />
            ) : (
              <ZapOff size={22} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* GPS & Timestamp Watermark HUD overlay */}
        <View style={styles.watermarkBox}>
          <View style={styles.watermarkRow}>
            <MapPin size={14} color="#60A5FA" />
            <Text style={styles.watermarkText}>
              Lokasi: {coords.lat}, {coords.lng}
            </Text>
          </View>
          <View style={[styles.watermarkRow, { marginTop: 4 }]}>
            <Clock size={14} color="#FBBF24" />
            <Text style={styles.watermarkText}>Waktu: {formattedTime}</Text>
          </View>
        </View>

        {/* Framing Grid Focus / Target Reticle */}
        <View style={styles.reticleContainer}>
          <View style={styles.reticleCornerTL} />
          <View style={styles.reticleCornerTR} />
          <View style={styles.reticleCornerBL} />
          <View style={styles.reticleCornerBR} />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Watermark Tag Note */}
          <View style={styles.watermarkNotePill}>
            <Check size={14} color="#10B981" />
            <Text style={styles.watermarkNoteText}>
              Foto akan otomatis dilengkapi lokasi & waktu
            </Text>
          </View>

          {/* Shutter & Controls Row */}
          <View style={styles.shutterRow}>
            {/* Gallery / Preset sample */}
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={handlePickSample}
              activeOpacity={0.75}>
              <ImageIcon size={26} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Main Shutter */}
            <TouchableOpacity
              style={styles.shutterOuter}
              onPress={handleTakePicture}
              disabled={isCapturing}
              activeOpacity={0.7}>
              <View style={styles.shutterInner}>
                {isCapturing && <ActivityIndicator color={Theme.colors.primary} />}
              </View>
            </TouchableOpacity>

            {/* Flip Camera */}
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={toggleFacing}
              activeOpacity={0.75}>
              <SwitchCamera size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  grantBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  grantBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitleBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  topTitleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  watermarkBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
  },
  watermarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  watermarkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  reticleContainer: {
    alignSelf: 'center',
    width: width * 0.75,
    height: width * 0.75,
    position: 'relative',
  },
  reticleCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  reticleCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  reticleCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  reticleCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  bottomSection: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 36,
    alignItems: 'center',
  },
  watermarkNotePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  watermarkNoteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 36,
  },
  sideBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  shutterInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

