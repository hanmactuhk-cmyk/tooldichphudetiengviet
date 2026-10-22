import React, { useState } from 'react';
import {
  X,
  Package,
  FileCode,
  Download,
  Copy,
  Check,
  HardDrive,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { OFFLINE_PACKAGE_MANIFEST, WINDOWS_BUILD_SCRIPT, triggerDownload } from '../lib/export-engine';

interface OfflinePackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflinePackagingModal: React.FC<OfflinePackagingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'script' | 'worker'>('manifest');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadManifest = () => {
    const jsonStr = JSON.stringify(OFFLINE_PACKAGE_MANIFEST, null, 2);
    triggerDownload(jsonStr, 'manifest.json', 'application/json');
  };

  const handleDownloadScript = () => {
    triggerDownload(WINDOWS_BUILD_SCRIPT, 'build-windows-offline.bat', 'text/plain');
  };

  const workerPythonCode = `# HN Voice Studio - Local Worker Server (FastAPI / llama.cpp / FunASR / VieNeu-TTS)
# Optimization: NVIDIA GTX 1050 Ti 4GB VRAM, 16GB RAM

import os
import gc
import torch
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(title="HN Voice Studio Offline Backend")

# Memory management for GTX 1050 Ti (4GB VRAM limit)
def clear_gpu_cache():
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    gc.collect()

# 1. Chinese ASR (SenseVoice Small)
@app.post("/api/asr/transcribe")
async def transcribe(audio_path: str, model_type: str = "sensevoice"):
    clear_gpu_cache()
    from funasr import AutoModel
    model_dir = "resources/models/sensevoice-small"
    model = AutoModel(model=model_dir, vad_model="resources/models/vad-punc/fsmn-vad", punc_model="resources/models/vad-punc/ct-punc")
    res = model.generate(input=audio_path, batch_size_s=300)
    del model
    clear_gpu_cache()
    return {"status": "ok", "subtitles": res}

# 2. Cinematic Translation (Qwen3-4B-Instruct-2507 GGUF Q4_K_M via llama.cpp)
@app.post("/api/translate")
async def translate(prompt: str):
    clear_gpu_cache()
    from llama_cpp import Llama
    llm = Llama(
        model_path="resources/models/qwen3-4b-instruct-2507/qwen3-4b-instruct-2507-q4_k_m.gguf",
        n_gpu_layers=24, # fits comfortably in 4GB GTX 1050 Ti
        n_ctx=2048
    )
    output = llm(f"<|im_start|>system\\nBạn là dịch giả phim tiếng Trung sang tiếng Việt chuyên nghiệp...<|im_end|>\\n<|im_start|>user\\n{prompt}<|im_end|>\\n<|im_start|>assistant\\n", max_tokens=512)
    del llm
    clear_gpu_cache()
    return {"text_vi": output["choices"][0]["text"]}

# 3. Speech Synthesis (VieNeu-TTS v3 Turbo 48kHz WAV)
@app.post("/api/tts/synthesize")
async def synthesize_tts(text: str, voice: str = "Mai Anh", speed: float = 1.0):
    clear_gpu_cache()
    from vieneu import Vieneu
    tts = Vieneu(mode="v3turbo", backend="onnx")
    audio = tts.infer(text, voice=voice)
    output_wav = "user-data/cache/output_48k.wav"
    tts.save(audio, output_wav)
    del tts
    clear_gpu_cache()
    return FileResponse(output_wav, media_type="audio/wav")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#16161a] border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#19191e]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Đóng gói Model & Bộ cài Windows Offline 100%
              </h3>
              <p className="text-zinc-400 text-xs">
                Cấu hình tối ưu: NVIDIA GTX 1050 Ti 4GB VRAM, RAM 16GB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-zinc-800 bg-[#121215] px-4 pt-2 space-x-3 text-xs">
          <button
            onClick={() => setActiveTab('manifest')}
            className={`pb-2 font-semibold flex items-center space-x-1.5 border-b-2 transition-all ${
              activeTab === 'manifest'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Manifest Model & SHA256</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`pb-2 font-semibold flex items-center space-x-1.5 border-b-2 transition-all ${
              activeTab === 'script'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>2. Script Build Windows (.bat)</span>
          </button>

          <button
            onClick={() => setActiveTab('worker')}
            className={`pb-2 font-semibold flex items-center space-x-1.5 border-b-2 transition-all ${
              activeTab === 'worker'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>3. Backend Worker Python</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-zinc-300 bg-[#0f0f12]">
          {activeTab === 'manifest' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-sans">
                <span className="text-zinc-400 text-xs">
                  Danh sách Model bắt buộc được khóa revision và SHA256:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify(OFFLINE_PACKAGE_MANIFEST, null, 2))}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                  <button
                    onClick={handleDownloadManifest}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs flex items-center space-x-1 font-sans"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải manifest.json</span>
                  </button>
                </div>
              </div>
              <pre className="p-3 bg-black/60 rounded-lg border border-zinc-800 overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
                {JSON.stringify(OFFLINE_PACKAGE_MANIFEST, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-sans">
                <span className="text-zinc-400 text-xs">
                  Script tự động tải model, xác minh SHA256 và đóng gói Electron:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(WINDOWS_BUILD_SCRIPT)}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                  <button
                    onClick={handleDownloadScript}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs flex items-center space-x-1 font-sans"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải build-windows-offline.bat</span>
                  </button>
                </div>
              </div>
              <pre className="p-3 bg-black/60 rounded-lg border border-zinc-800 overflow-x-auto text-[11px] leading-relaxed text-amber-300">
                {WINDOWS_BUILD_SCRIPT}
              </pre>
            </div>
          )}

          {activeTab === 'worker' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-sans">
                <span className="text-zinc-400 text-xs">
                  Server backend cục bộ giải phóng bộ nhớ tuần tự (GTX 1050 Ti):
                </span>
                <button
                  onClick={() => handleCopy(workerPythonCode)}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center space-x-1 font-sans"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black/60 rounded-lg border border-zinc-800 overflow-x-auto text-[11px] leading-relaxed text-blue-300">
                {workerPythonCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-zinc-800 bg-[#16161a] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Mọi model đều được nạp và giải phóng tuần tự theo thứ tự: ASR ➔ Qwen3 ➔ VieNeu-TTS</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold font-sans"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
