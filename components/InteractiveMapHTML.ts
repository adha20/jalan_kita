import { ReportItem } from '@/services/mockData';

export function generateMapHtml(
  reports: ReportItem[],
  selectedReport?: ReportItem | null,
  center = { lat: -3.2220, lng: 104.6485 },
  zoom = 14,
  showHeatmap = false
): string {
  const reportsJson = JSON.stringify(
    reports.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      statusLabel: r.statusLabel,
      lat: r.latitude,
      lng: r.longitude,
      location: r.locationName,
      photoUrl: r.photoUrl,
    }))
  );

  const selectedId = selectedReport?.id || '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; overflow: hidden; background: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    
    .custom-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s ease;
    }
    .custom-marker.active {
      transform: scale(1.25);
      z-index: 1000 !important;
    }
    .marker-pin {
      width: 34px;
      height: 34px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .marker-pin.rusak { background: #EF4444; }
    .marker-pin.diperbaiki { background: #F59E0B; }
    .marker-pin.selesai { background: #10B981; }

    .marker-icon {
      transform: rotate(45deg);
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
    }

    .leaflet-popup-content-wrapper {
      border-radius: 14px;
      padding: 0;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden;
    }
    .leaflet-popup-content {
      margin: 0 !important;
      line-height: 1.4;
    }
    .popup-box {
      width: 200px;
    }
    .popup-img {
      width: 100%;
      height: 90px;
      object-fit: cover;
    }
    .popup-body {
      padding: 10px 12px;
    }
    .popup-title {
      font-size: 13px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 2px;
    }
    .popup-loc {
      font-size: 11px;
      color: #64748B;
      margin-bottom: 6px;
    }
    .popup-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
    }
    .popup-badge.rusak { background: #FEE2E2; color: #EF4444; }
    .popup-badge.diperbaiki { background: #FEF3C7; color: #D97706; }
    .popup-badge.selesai { background: #D1FAE5; color: #059669; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([${center.lat}, ${center.lng}], ${zoom});

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    var reports = ${reportsJson};
    var selectedId = "${selectedId}";
    var markersMap = {};

    ${
      showHeatmap
        ? `
    // Lapisan Heatmap Kepadatan Kerusakan Jalan (Konsentris Termal Hotspot)
    reports.forEach(function(r) {
      if (r.status === 'rusak' || r.status === 'diperbaiki') {
        var isCritical = r.status === 'rusak';

        // 1. Zona Luar (Dispersi Hangat - Radius 400m)
        L.circle([r.lat, r.lng], {
          radius: isCritical ? 420 : 280,
          stroke: false,
          fillColor: '#FDE047',
          fillOpacity: 0.38,
          interactive: false
        }).addTo(map);

        // 2. Zona Tengah (Area Terdampak Signifikan - Oranye - Radius 240m)
        L.circle([r.lat, r.lng], {
          radius: isCritical ? 240 : 160,
          stroke: false,
          fillColor: '#FB923C',
          fillOpacity: 0.58,
          interactive: false
        }).addTo(map);

        // 3. Zona Inti Titik Kritis (Inti Kerusakan - Merah Menyala - Radius 110m)
        L.circle([r.lat, r.lng], {
          radius: isCritical ? 110 : 80,
          color: '#DC2626',
          weight: 2,
          fillColor: isCritical ? '#EF4444' : '#F59E0B',
          fillOpacity: 0.85,
          interactive: false
        }).addTo(map);
      }
    });
    `
        : ''
    }

    function createMarkerIcon(item, isSelected) {
      var iconEmoji = item.status === 'rusak' ? '!' : (item.status === 'diperbaiki' ? '⚙' : '✓');
      var activeClass = isSelected ? 'active' : '';
      return L.divIcon({
        className: 'custom-marker ' + activeClass,
        html: '<div class="marker-pin ' + item.status + '"><span class="marker-icon">' + iconEmoji + '</span></div>',
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        popupAnchor: [0, -36]
      });
    }

    reports.forEach(function(item) {
      var isSelected = item.id === selectedId;
      var marker = L.marker([item.lat, item.lng], {
        icon: createMarkerIcon(item, isSelected)
      }).addTo(map);

      var popupHtml = '<div class="popup-box">' +
        (item.photoUrl ? '<img src="' + item.photoUrl + '" class="popup-img" />' : '') +
        '<div class="popup-body">' +
          '<div class="popup-title">' + item.title + '</div>' +
          '<div class="popup-loc">' + item.location + '</div>' +
          '<span class="popup-badge ' + item.status + '">' + item.statusLabel + '</span>' +
        '</div>' +
      '</div>';

      marker.bindPopup(popupHtml);

      marker.on('click', function() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SELECT_REPORT', id: item.id }));
        } else {
          window.parent.postMessage({ type: 'SELECT_REPORT', id: item.id }, '*');
        }
      });

      markersMap[item.id] = marker;
      if (isSelected) {
        marker.openPopup();
      }
    });

    window.flyToReport = function(lat, lng, id) {
      map.flyTo([lat, lng], 16, { duration: 0.8 });
      if (markersMap[id]) {
        markersMap[id].openPopup();
      }
    };

    window.addEventListener('message', function(event) {
      try {
        var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'FLY_TO' && markersMap[data.id]) {
          map.flyTo([data.lat, data.lng], 16, { duration: 0.8 });
          markersMap[data.id].openPopup();
        }
      } catch (err) {}
    });
  </script>
</body>
</html>
  `;
}

