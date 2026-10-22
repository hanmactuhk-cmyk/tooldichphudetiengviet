import React from 'react';
import {
  Cpu,
  HardDrive,
  Download,
  Package,
  Sparkles,
  WifiOff,
  RotateCcw,
  RotateCw,
  FolderOpen,
  Save,
  Film,
  Layers,
} from 'lucide-react';
import { HardwareVramStatus } from '../types';

interface HeaderProps {
  hardwareStatus: HardwareVramStatus;
  projectTitle: string;
  onOpenPackaging: () => void;
  onOpenModelAnalysis: () => void;
  onOpenModelLoader: () => void;
  onOpenExport: () => void;
  onSaveProject: () => void;
  onLoadSample: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hardwareStatus,
  projectTitle,
  onOpenPackaging,
  onOpenModelAnalysis,
  onOpenModelLoader,
  onOpenExport,
  onSaveProject,
  onLoadSample,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  const vramPercent = Math.round((hardwareStatus.vramUsedMb / hardwareStatus.vramTotalMb) * 100);
  const ramPercent = Math.round((hardwareStatus.ramUsedMb / hardwareStatus.ramTotalMb) * 100);

  return (
    <header className="h-14 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-4 select-none shrink-0 z-30">
      {/* Brand & Project Name */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white text-base tracking-tight">HN Voice Studio</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                v3 Turbo
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 flex items-center space-x-1 border border-emerald-500/25">
                <WifiOff className="w-2.5 h-2.5" />
                <span>100% Offline</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[220px]">
              {projectTitle}
            </p>
          </div>
        </div>

        {/* History controls */}
        <div className="h-6 w-[1px] bg-zinc-800 mx-2" />
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Hoàn tác (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Làm lại (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hardware / VRAM monitor bar (Target: GTX 1050 Ti 4GB, 16GB RAM) */}
      <div className="hidden lg:flex items-center space-x-4 bg-[#121214] px-3 py-1.5 rounded-lg border border-zinc-800 text-xs">
        {/* GPU VRAM */}
        <div className="flex items-center space-x-2">
          <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 space-x-2">
              <span className="font-semibold text-zinc-300">GTX 1050 Ti VRAM</span>
              <span className="font-mono text-amber-300 font-medium">
                {hardwareStatus.vramUsedMb} / {hardwareStatus.vramTotalMb} MB ({vramPercent}%)
              </span>
            </div>
            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
              <div
                className={`h-full transition-all duration-300 ${
                  vramPercent > 85 ? 'bg-red-500' : vramPercent > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${vramPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-zinc-800" />

        {/* System RAM */}
        <div className="flex items-center space-x-2">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 space-x-2">
              <span className="font-semibold text-zinc-300">RAM Hệ thống</span>
              <span className="font-mono text-blue-300 font-medium">
                {(hardwareStatus.ramUsedMb / 1024).toFixed(1)} / {(hardwareStatus.ramTotalMb / 1024).toFixed(0)} GB
              </span>
            </div>
            <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${ramPercent}%` }}
              />
            </div>
          </div>
        </div>

        {hardwareStatus.activeModel && (
          <>
            <div className="h-6 w-[1px] bg-zinc-800" />
            <div className="flex items-center space-x-1.5 text-rose-300 text-[11px] animate-pulse">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span className="font-medium truncate max-w-[150px]">
                {hardwareStatus.activeModel}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Main Action buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onLoadSample}
          className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center space-x-1.5 transition-colors border border-zinc-700"
          title="Nạp dự án phim truyền hình Trung Quốc mẫu với 4 nhân vật"
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Nạp mẫu phim</span>
        </button>

        <button
          onClick={onSaveProject}
          className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center space-x-1.5 transition-colors border border-zinc-700"
          title="Lưu dự án offline"
        >
          <Save className="w-3.5 h-3.5 text-blue-400" />
          <span>Lưu dự án</span>
        </button>

        <button
          onClick={onOpenModelLoader}
          className="px-2.5 py-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
          title="Tải toàn bộ model AI trực tiếp vào máy tính và nạp vào tool"
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Nạp model</span>
        </button>

        <button
          onClick={onOpenModelAnalysis}
          className="px-2.5 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
          title="Xem phân tích chi tiết cấu trúc 3 model AI: SenseVoice, Qwen3-4B, VieNeu-TTS v3 Turbo"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Phân tích Model</span>
        </button>

        <button
          onClick={onOpenPackaging}
          className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center space-x-1.5 transition-colors border border-zinc-700"
          title="Xem manifest và script đóng gói Electron Windows x64"
        >
          <Package className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Đóng gói Offline</span>
        </button>

        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded-md bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-rose-950/40 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất video & Audio</span>
        </button>
      </div>
    </header>
  );
};
