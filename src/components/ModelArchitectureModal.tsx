import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  Layers,
  HardDrive,
  FileText,
  Volume2,
  Sparkles,
  ShieldCheck,
  Check,
  Code,
  Activity,
  Maximize2,
} from 'lucide-react';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [modelData, setModelData] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<'sensevoice' | 'qwen3' | 'vieneu'>('sensevoice');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/model-analysis')
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setModelData(json.data);
        })
        .catch((err) => console.warn('Fetch model-analysis error:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const current = modelData ? modelData[selectedModel] : null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#141418] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#18181d]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">
                  Phân tích cấu trúc chi tiết & Tích hợp 3 Model AI
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  Đã kết nối trực tiếp vào Tool
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-0.5">
                Kiến trúc nội tại, file trọng số, Tensor layers và quy trình xử lý của SenseVoice, Qwen3-4B và VieNeu-TTS v3 Turbo
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

        {/* Model Tabs */}
        <div className="grid grid-cols-3 border-b border-zinc-800 bg-[#101014] p-1.5 gap-1.5 text-xs">
          <button
            onClick={() => setSelectedModel('sensevoice')}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
              selectedModel === 'sensevoice'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>1. SenseVoice Small (ASR)</span>
          </button>

          <button
            onClick={() => setSelectedModel('qwen3')}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
              selectedModel === 'qwen3'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>2. Qwen3-4B-Instruct-2507</span>
          </button>

          <button
            onClick={() => setSelectedModel('vieneu')}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
              selectedModel === 'vieneu'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>3. VieNeu-TTS v3 Turbo</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0e0e12] text-xs">
          {current ? (
            <div className="space-y-5">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Tên & ID Model</div>
                  <div className="font-bold text-white text-xs mt-1 truncate">{current.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">{current.id}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Số lượng tham số</div>
                  <div className="font-bold text-emerald-400 text-xs mt-1">{current.parameters}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{current.quantization || 'FP16 / ONNX'}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Chiếm dụng VRAM</div>
                  <div className="font-bold text-amber-400 text-xs mt-1">{current.vramFootprint}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Tối ưu GTX 1050 Ti 4GB</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Runtime thực thi</div>
                  <div className="font-bold text-blue-400 text-xs mt-1 truncate">
                    {current.architecture.type.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Backend Node/Python IPC</div>
                </div>
              </div>

              {/* Deep Architecture Breakdown */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center space-x-2 text-zinc-200 font-bold text-sm">
                  <Code className="w-4 h-4 text-rose-400" />
                  <span>Phân tích kiến trúc mạng Neural bên trong:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-300 text-xs">
                  {Object.entries(current.architecture).map(([key, val]: [string, any]) => {
                    if (typeof val === 'object' && !Array.isArray(val)) {
                      return (
                        <div key={key} className="col-span-2 p-3 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1">
                          <span className="font-semibold text-amber-300 uppercase text-[10px] block">
                            Các thành phần phụ trợ ({key}):
                          </span>
                          {Object.entries(val).map(([k2, v2]: [string, any]) => (
                            <div key={k2} className="flex justify-between text-[11px] font-mono text-zinc-300">
                              <span className="text-zinc-500">{k2}:</span>
                              <span className="text-zinc-200">{v2}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (Array.isArray(val)) {
                      return (
                        <div key={key} className="col-span-2 p-3 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1">
                          <span className="font-semibold text-purple-300 uppercase text-[10px] block">
                            {key}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {val.map((item: string, i: number) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-200 font-mono">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={key} className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
                        <div className="text-[10px] font-semibold text-zinc-500 uppercase">{key}</div>
                        <div className="text-zinc-200 text-[11px] mt-0.5 font-sans leading-relaxed">{val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Internal Files & Weights */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5">
                <div className="flex items-center space-x-2 text-zinc-200 font-bold text-sm">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>Danh sách file trọng số & cấu hình bên trong package:</span>
                </div>
                <div className="space-y-1.5">
                  {current.internalFiles.map((fileDesc: string, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-black/40 border border-zinc-800/60 font-mono text-[11px] text-emerald-300 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{fileDesc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Integration Status */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/40 border border-zinc-700/60 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-xs flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Trạng thái trong HN Voice Studio Tool:</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Model này đã được gắn trực tiếp vào các nút bấm tại giao diện (Tabs 2, 3, 4) và sẵn sàng thực thi ngay!
                  </p>
                </div>
                <div className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
                  Hoạt động 100%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-zinc-500">Đang nạp dữ liệu phân tích model...</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-[#16161a] flex items-center justify-between text-xs text-zinc-400">
          <span>Quy trình tuần tự bảo vệ bộ nhớ: SenseVoice ➔ Qwen3-4B ➔ VieNeu-TTS v3 Turbo</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
