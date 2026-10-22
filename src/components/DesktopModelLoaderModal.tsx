import React, { useState } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  HardDrive,
  Cpu,
  Sparkles,
  RefreshCw,
  FolderDown,
  ShieldCheck,
} from 'lucide-react';

interface DesktopModelLoaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelsLoaded: () => void;
}

interface ModelItem {
  key: string;
  name: string;
  size: string;
  url: string;
  targetDir: string;
  status: 'idle' | 'downloading' | 'completed' | 'error';
  progress: number;
}

export const DesktopModelLoaderModal: React.FC<DesktopModelLoaderModalProps> = ({
  isOpen,
  onClose,
  onModelsLoaded,
}) => {
  const [models, setModels] = useState<ModelItem[]>([
    {
      key: 'sensevoice',
      name: 'SenseVoice Small (FunAudioLLM - ASR)',
      size: '410 MB',
      url: 'https://huggingface.co/FunAudioLLM/SenseVoiceSmall/resolve/main/model.pt',
      targetDir: 'sensevoice-small',
      status: 'idle',
      progress: 0,
    },
    {
      key: 'paraformer',
      name: 'Paraformer-ZH (Model dự phòng ASR)',
      size: '220 MB',
      url: 'https://huggingface.co/funasr/paraformer-zh/resolve/main/model.pt',
      targetDir: 'paraformer-zh',
      status: 'idle',
      progress: 0,
    },
    {
      key: 'qwen3',
      name: 'Qwen3-4B-Instruct-2507 (GGUF Q4_K_M)',
      size: '2.62 GB',
      url: 'https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507/resolve/main/qwen3-4b-instruct-2507-q4_k_m.gguf',
      targetDir: 'qwen3-4b-instruct-2507',
      status: 'idle',
      progress: 0,
    },
    {
      key: 'vieneu',
      name: 'VieNeu-TTS v3 Turbo (ONNX 48kHz)',
      size: '305 MB',
      url: 'https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo/resolve/main/gguf/vieneu-v3-turbo-q8_0.gguf',
      targetDir: 'vieneu-tts-v3-turbo',
      status: 'idle',
      progress: 0,
    },
  ]);

  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadSingle = async (index: number) => {
    const item = models[index];
    setModels((prev) =>
      prev.map((m, i) => (i === index ? { ...m, status: 'downloading', progress: 0 } : m))
    );

    // Check if running in Electron environment with IPC
    const win: any = window;
    if (win.electronAPI && win.electronAPI.downloadModel) {
      try {
        win.electronAPI.onDownloadProgress((data: any) => {
          if (data.modelKey === item.key) {
            setModels((prev) =>
              prev.map((m, i) => (i === index ? { ...m, progress: data.percent } : m))
            );
          }
        });

        await win.electronAPI.downloadModel(item.key, item.url, item.targetDir);

        setModels((prev) =>
          prev.map((m, i) => (i === index ? { ...m, status: 'completed', progress: 100 } : m))
        );
      } catch (err) {
        console.error(err);
        setModels((prev) =>
          prev.map((m, i) => (i === index ? { ...m, status: 'error' } : m))
        );
      }
    } else {
      // Web browser preview simulation of model download
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 15;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setModels((prev) =>
            prev.map((m, i) => (i === index ? { ...m, status: 'completed', progress: 100 } : m))
          );
        } else {
          setModels((prev) =>
            prev.map((m, i) => (i === index ? { ...m, progress: currentProgress } : m))
          );
        }
      }, 300);
    }
  };

  const handleDownloadAllAndLoad = async () => {
    setIsDownloadingAll(true);
    for (let i = 0; i < models.length; i++) {
      if (models[i].status !== 'completed') {
        await handleDownloadSingle(i);
      }
    }
    setIsDownloadingAll(false);
    setAllLoaded(true);
    setTimeout(() => {
      onModelsLoaded();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#16161a] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#19191e]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-rose-400">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Trình Quản lý & Tự động Nạp Model AI (Offline Desktop)
              </h3>
              <p className="text-zinc-400 text-xs">
                Tải toàn bộ model trực tiếp từ Hugging Face vào máy và nạp vào tool
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs bg-[#101014]">
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-zinc-200 block">
                Cấu hình hệ thống mục tiêu:
              </span>
              <span className="text-zinc-400 text-[11px]">
                NVIDIA GeForce GTX 1050 Ti (4GB VRAM) • RAM 16GB • Windows x64
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sẵn sàng tải</span>
            </div>
          </div>

          {/* Model List */}
          <div className="space-y-2.5">
            {models.map((model, idx) => (
              <div
                key={model.key}
                className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-bold text-zinc-200 text-xs">{model.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
                      {model.size}
                    </span>
                  </div>

                  {model.status === 'completed' ? (
                    <span className="text-emerald-400 font-semibold text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã tải & Nạp xong</span>
                    </span>
                  ) : model.status === 'downloading' ? (
                    <span className="text-amber-400 font-semibold text-[11px] flex items-center space-x-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải ({model.progress}%)</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDownloadSingle(idx)}
                      className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] transition-colors"
                    >
                      Tải riêng
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {model.status === 'downloading' && (
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${model.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {allLoaded && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-center font-semibold animate-fadeIn">
              ✨ Đã tải và tự động nạp thành công toàn bộ model vào tool! Sẵn sàng sử dụng.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#16161a] flex items-center justify-between">
          <span className="text-zinc-500 text-[11px]">
            Model lưu tại: <code className="text-zinc-300">userData/resources/models/</code>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs"
            >
              Đóng
            </button>
            <button
              onClick={handleDownloadAllAndLoad}
              disabled={isDownloadingAll || allLoaded}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 flex items-center space-x-2 disabled:opacity-50 transition-all"
            >
              {isDownloadingAll ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Tải toàn bộ & Nạp vào Tool</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
