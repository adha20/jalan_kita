import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ReportItem } from '@/services/mockData';
import { generateMapHtml } from './InteractiveMapHTML';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
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

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [reports, onSelectReport]);

  useEffect(() => {
    if (selectedReport && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'FLY_TO',
          lat: selectedReport.latitude,
          lng: selectedReport.longitude,
          id: selectedReport.id,
        },
        '*'
      );
    }
  }, [selectedReport]);

  const html = generateMapHtml(reports, selectedReport, center, zoom, showHeatmap);

  return (
    <View style={styles.container}>
      <iframe
        key={`map-web-${showHeatmap ? 'heat-on' : 'heat-off'}-${reports.length}`}
        ref={iframeRef}
        srcDoc={html}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="JalanKita Interactive Real Map"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

