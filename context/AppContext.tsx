import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_REWARDS,
  NotificationItem,
  ReportItem,
  RewardItem,
} from '@/services/mockData';

interface AppContextType {
  reports: ReportItem[];
  rewards: RewardItem[];
  notifications: NotificationItem[];
  points: number;
  userName: string;
  filterStatus: 'Semua' | 'Rusak' | 'Diperbaiki' | 'Selesai';
  setFilterStatus: (filter: 'Semua' | 'Rusak' | 'Diperbaiki' | 'Selesai') => void;
  selectedReport: ReportItem | null;
  setSelectedReport: (report: ReportItem | null) => void;
  addReport: (newReport: Omit<ReportItem, 'id' | 'createdAt' | 'timeAgo' | 'reporterName' | 'timeline'>) => ReportItem;
  updateReportStatus: (
    reportId: string,
    newStatus: 'rusak' | 'diperbaiki' | 'selesai',
    statusLabel: string
  ) => void;
  redeemReward: (rewardId: string) => boolean;
  markNotificationAsRead: (id: string) => void;
  stats: {
    rusak: number;
    diperbaiki: number;
    selesai: number;
    total: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [rewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [points, setPoints] = useState<number>(250);
  const [userName] = useState<string>('Nisa');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Rusak' | 'Diperbaiki' | 'Selesai'>('Semua');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(INITIAL_REPORTS[0]);

  const stats = useMemo(() => {
    const rusak = reports.filter((r) => r.status === 'rusak').length;
    const diperbaiki = reports.filter((r) => r.status === 'diperbaiki').length;
    const selesai = reports.filter((r) => r.status === 'selesai').length;
    return {
      rusak,
      diperbaiki,
      selesai,
      total: reports.length,
    };
  }, [reports]);

  const addReport = (data: Omit<ReportItem, 'id' | 'createdAt' | 'timeAgo' | 'reporterName' | 'timeline'>): ReportItem => {
    const id = `rep-${Date.now()}`;
    const newReport: ReportItem = {
      ...data,
      id,
      createdAt: 'Baru saja',
      timeAgo: 'Baru saja',
      reporterName: userName,
      timeline: [
        { status: 'terkirim', title: 'Terkirim', time: 'Baru saja', done: true },
        { status: 'diterima', title: 'Diterima Dinas', time: 'Menunggu', done: false },
        { status: 'dikerjakan', title: 'Sedang Dikerjakan', time: '-', done: false },
        { status: 'selesai', title: 'Selesai', time: '-', done: false },
      ],
    };

    setReports((prev) => [newReport, ...prev]);
    setPoints((prev) => prev + 50);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Kamu dapat 50 poin!',
      message: `Terima kasih atas laporan "${newReport.title}" di ${newReport.locationName}.`,
      timeAgo: 'Baru saja',
      type: 'point',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newReport;
  };

  const updateReportStatus = (
    reportId: string,
    newStatus: 'rusak' | 'diperbaiki' | 'selesai',
    statusLabel: string
  ) => {
    let targetReport: ReportItem | undefined;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        targetReport = r;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

        const updatedTimeline = r.timeline.map((t) => {
          if (newStatus === 'diperbaiki') {
            if (t.status === 'terkirim' || t.status === 'diterima' || t.status === 'dikerjakan') {
              return { ...t, done: true, time: t.done ? t.time : timeStr };
            }
          } else if (newStatus === 'selesai') {
            return { ...t, done: true, time: t.done ? t.time : timeStr };
          } else if (newStatus === 'rusak') {
            if (t.status === 'dikerjakan' || t.status === 'selesai') {
              return { ...t, done: false, time: '-' };
            }
          }
          return t;
        });

        const updated: ReportItem = {
          ...r,
          status: newStatus,
          statusLabel,
          timeline: updatedTimeline,
        };

        if (selectedReport?.id === reportId) {
          setSelectedReport(updated);
        }

        return updated;
      })
    );

    if (targetReport) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Update Dinas: ${statusLabel}`,
        message: `Laporan "${targetReport.title}" di ${targetReport.locationName} statusnya telah diperbarui menjadi ${statusLabel}.`,
        timeAgo: 'Baru saja',
        type: 'status',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const redeemReward = (rewardId: string): boolean => {
    const item = rewards.find((r) => r.id === rewardId);
    if (!item) return false;
    if (points < item.points) return false;

    setPoints((prev) => prev - item.points);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Berhasil Menukar Poin',
      message: `Selamat! Voucher ${item.title} (${item.category}) berhasil ditukarkan.`,
      timeAgo: 'Baru saja',
      type: 'promo',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return true;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        reports,
        rewards,
        notifications,
        points,
        userName,
        filterStatus,
        setFilterStatus,
        selectedReport,
        setSelectedReport,
        addReport,
        updateReportStatus,
        redeemReward,
        markNotificationAsRead,
        stats,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
