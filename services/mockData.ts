export interface TimelineStep {
  status: 'terkirim' | 'diterima' | 'dikerjakan' | 'selesai';
  title: string;
  time: string;
  done: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  category: 'jalan_berlubang' | 'lampu_mati' | 'pohon_tumbang' | 'lainnya';
  categoryLabel: string;
  categoryIcon: string;
  locationName: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  status: 'rusak' | 'diperbaiki' | 'selesai';
  statusLabel: string;
  createdAt: string;
  timeAgo: string;
  description: string;
  reporterName: string;
  timeline: TimelineStep[];
}

export interface RewardItem {
  id: string;
  title: string;
  category: string;
  points: number;
  icon: string;
  imageBg: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'status' | 'point' | 'promo';
  read: boolean;
}

// 8 Kondisi Nyata di Indralaya (4 Rusak, 2 Diperbaiki, 2 Selesai)
export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    title: 'Jalan Berlubang Parah',
    category: 'jalan_berlubang',
    categoryLabel: 'Jalan Berlubang',
    categoryIcon: 'cone',
    locationName: 'Jl. Srijaya Negara, Indralaya',
    latitude: -3.2205,
    longitude: 104.6477,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    status: 'rusak',
    statusLabel: 'Belum Ditangani',
    createdAt: '24 Nov 2026, 09:15',
    timeAgo: '2 jam yang lalu',
    description: 'Lubang cukup dalam sekitar 15 cm di tengah jalan arah kampus Unsri, rawan kecelakaan bagi pengendara sepeda motor.',
    reporterName: 'Nisa',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '24 Nov 2026, 09:15', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: 'Menunggu verifikasi', done: false },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '-', done: false },
      { status: 'selesai', title: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'rep-02',
    title: 'Lampu Penerangan Padam',
    category: 'lampu_mati',
    categoryLabel: 'Lampu Jalan (PJU)',
    categoryIcon: 'lightbulb',
    locationName: 'Simpang Timbangan Indralaya',
    latitude: -3.2260,
    longitude: 104.6510,
    photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    status: 'rusak',
    statusLabel: 'Belum Ditangani',
    createdAt: '24 Nov 2026, 07:45',
    timeAgo: '4 jam yang lalu',
    description: 'Lampu PJU mati total sudah beberapa malam, area persimpangan menjadi gelap dan rawan begal.',
    reporterName: 'Budi Santoso',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '24 Nov 2026, 07:45', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: 'Menunggu verifikasi', done: false },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '-', done: false },
      { status: 'selesai', title: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'rep-03',
    title: 'Dahan Rawan Tumbang',
    category: 'pohon_tumbang',
    categoryLabel: 'Pohon Menghalangi',
    categoryIcon: 'tree',
    locationName: 'Jl. Lintas Timur KM 33',
    latitude: -3.2350,
    longitude: 104.6400,
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    status: 'rusak',
    statusLabel: 'Belum Ditangani',
    createdAt: '24 Nov 2026, 06:30',
    timeAgo: '5 jam yang lalu',
    description: 'Dahan pohon trembesi rapuh menjulur rendah ke badan jalan lintas, membahayakan truk dan bus bertubuh tinggi.',
    reporterName: 'Ahmad Rizki',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '24 Nov 2026, 06:30', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: 'Menunggu verifikasi', done: false },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '-', done: false },
      { status: 'selesai', title: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'rep-04',
    title: 'Bahu Jalan Amblas',
    category: 'jalan_berlubang',
    categoryLabel: 'Jalan Rusak',
    categoryIcon: 'cone',
    locationName: 'Jl. Sarjana, Kel. Timbangan',
    latitude: -3.2195,
    longitude: 104.6425,
    photoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    status: 'rusak',
    statusLabel: 'Belum Ditangani',
    createdAt: '23 Nov 2026, 16:10',
    timeAgo: '1 hari yang lalu',
    description: 'Bahu aspal terkikis aliran air drainase, rawan amblas jika dilalui kendaraan roda empat.',
    reporterName: 'Dedi Kurniawan',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '23 Nov 2026, 16:10', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: 'Menunggu', done: false },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '-', done: false },
      { status: 'selesai', title: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'rep-05',
    title: 'Penambalan Lubang Aspal',
    category: 'jalan_berlubang',
    categoryLabel: 'Perbaikan Jalan',
    categoryIcon: 'wrench',
    locationName: 'Depan Terminal Indralaya',
    latitude: -3.2290,
    longitude: 104.6550,
    photoUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
    status: 'diperbaiki',
    statusLabel: 'Sedang Dikerjakan',
    createdAt: '23 Nov 2026, 10:20',
    timeAgo: '1 hari yang lalu',
    description: 'Tim Dinas PUPR sedang meratakan batu agregat dan pemadatan aspal hotmix.',
    reporterName: 'Rian Pratama',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '23 Nov 2026, 10:20', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: '23 Nov 2026, 11:00', done: true },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '24 Nov 2026, 08:30', done: true },
      { status: 'selesai', title: 'Selesai', time: 'Estimasi sore ini', done: false },
    ],
  },
  {
    id: 'rep-06',
    title: 'Perbaikan Lampu PJU',
    category: 'lampu_mati',
    categoryLabel: 'Lampu Jalan',
    categoryIcon: 'wrench',
    locationName: 'Jl. Lintas Palembang - Indralaya',
    latitude: -3.2120,
    longitude: 104.6590,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    status: 'diperbaiki',
    statusLabel: 'Sedang Dikerjakan',
    createdAt: '22 Nov 2026, 14:00',
    timeAgo: '2 hari yang lalu',
    description: 'Petugas teknisi sedang mengganti trafo dan bohlam LED lampu penerangan jalan.',
    reporterName: 'Siti Rahma',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '22 Nov 2026, 14:00', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: '22 Nov 2026, 15:30', done: true },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '24 Nov 2026, 09:00', done: true },
      { status: 'selesai', title: 'Selesai', time: 'Menunggu uji nyala', done: false },
    ],
  },
  {
    id: 'rep-07',
    title: 'Pengaspalan Ulang Mulus',
    category: 'jalan_berlubang',
    categoryLabel: 'Jalan Selesai',
    categoryIcon: 'check-circle',
    locationName: 'Gerbang Utama Kampus Unsri',
    latitude: -3.2180,
    longitude: 104.6540,
    photoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
    status: 'selesai',
    statusLabel: 'Selesai Diperbaiki',
    createdAt: '21 Nov 2026, 09:00',
    timeAgo: '3 hari yang lalu',
    description: 'Jalan masuk kampus sudah selesai di-overlay aspal hotmix baru dan marka jalan sudah dicat rapi.',
    reporterName: 'Nisa',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '21 Nov 2026, 09:00', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: '21 Nov 2026, 10:15', done: true },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '22 Nov 2026, 08:00', done: true },
      { status: 'selesai', title: 'Selesai', time: '23 Nov 2026, 16:00', done: true },
    ],
  },
  {
    id: 'rep-08',
    title: 'Pembersihan Pohon Tuntas',
    category: 'pohon_tumbang',
    categoryLabel: 'Pembersihan Selesai',
    categoryIcon: 'check-circle',
    locationName: 'Simpang Sakatiga Indralaya',
    latitude: -3.2380,
    longitude: 104.6490,
    photoUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    status: 'selesai',
    statusLabel: 'Selesai Dibersihkan',
    createdAt: '20 Nov 2026, 11:30',
    timeAgo: '4 hari yang lalu',
    description: 'Pohon tumbang pasca angin kencang sudah dievakuasi dan jalan kembali lancar tanpa hambatan.',
    reporterName: 'Warga Peduli',
    timeline: [
      { status: 'terkirim', title: 'Terkirim', time: '20 Nov 2026, 11:30', done: true },
      { status: 'diterima', title: 'Diterima Dinas', time: '20 Nov 2026, 12:00', done: true },
      { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '20 Nov 2026, 13:00', done: true },
      { status: 'selesai', title: 'Selesai', time: '20 Nov 2026, 15:30', done: true },
    ],
  },
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-01',
    title: 'Diskon Rp10.000',
    category: 'e-Wallet',
    points: 150,
    icon: 'wallet',
    imageBg: '#EFF6FF',
  },
  {
    id: 'rew-02',
    title: 'Gratis Es Kopi',
    category: 'Merchant Lokal',
    points: 200,
    icon: 'coffee',
    imageBg: '#FEF3C7',
  },
  {
    id: 'rew-03',
    title: 'Voucher BBM Rp20.000',
    category: 'Transportasi',
    points: 300,
    icon: 'fuel',
    imageBg: '#DCFCE7',
  },
  {
    id: 'rew-04',
    title: 'Donasi Pohon Penghijauan',
    category: 'Lingkungan',
    points: 100,
    icon: 'leaf',
    imageBg: '#E0F2FE',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Update Laporan',
    message: 'Laporan Jalan Berlubang Parah di Jl. Srijaya Negara telah tercatat dalam sistem pemantauan.',
    timeAgo: '2 jam lalu',
    type: 'status',
    read: false,
  },
  {
    id: 'notif-02',
    title: 'Kamu dapat 50 poin!',
    message: 'Terima kasih sudah melaporkan jalan rusak demi keselamatan bersama.',
    timeAgo: '3 jam lalu',
    type: 'point',
    read: false,
  },
  {
    id: 'notif-03',
    title: 'Promo Tukar Poin',
    message: 'Diskon 20% di merchant partner lokal Indralaya!',
    timeAgo: '1 hari lalu',
    type: 'promo',
    read: true,
  },
];
