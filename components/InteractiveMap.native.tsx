import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ReportItem } from '@/services/mockData';
import { generateMapHtml } from './InteractiveMapHTML';

const RNWebView = WebView as unknown as React.ComponentType<any>;

export interface InteractiveMapProps {
  reports: ReportItem[];
  selectedReport?: ReportItem | null;
  onSelectReport?: (report: ReportItem) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  showHeatmap?: boolean;
}

export function InteractiveMap({
  reports,
  selectedReport,
  onSelectReport,
  center = { lat: -3.2220, lng: 104.6485 },
  zoom = 14,
  showHeatmap = false,
}: InteractiveMapProps) {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'SELECT_REPORT' && onSelectReport) {
        const found = reports.find((r) => r.id === data.id);
        if (found) {
          onSelectReport(found);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (selectedReport && webViewRef.current) {
      const jsCode = `if (window.flyToReport) { window.flyToReport(${selectedReport.latitude}, ${selectedReport.longitude}, "${selectedReport.id}"); } true;`;
      webViewRef.current.injectJavaScript(jsCode);
    }
  }, [selectedReport]);

  const html = generateMapHtml(reports, selectedReport, center, zoom, showHeatmap);

  return (
    <View style={styles.container}>
      <RNWebView
        key={`map-${showHeatmap ? 'heat-on' : 'heat-off'}-${reports.length}`}
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
});
