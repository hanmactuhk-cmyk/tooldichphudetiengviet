import { Subtitle, ProjectData } from '../types';

// Convert seconds to SRT timestamp format (00:00:00,000)
export function formatSrtTimestamp(seconds: number): string {
  const pad = (num: number, size: number) => ('000' + num).slice(-size);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);
  return `${pad(hrs, 2)}:${pad(mins, 2)}:${pad(secs, 2)},${pad(millis, 3)}`;
}

// Generate SRT file string
export function generateSrt(
  subtitles: Subtitle[],
  type: 'zh' | 'vi' | 'bilingual'
): string {
  const sorted = [...subtitles].sort((a, b) => a.startTime - b.startTime);
  return sorted
    .map((sub, index) => {
      const idx = index + 1;
      const timeStr = `${formatSrtTimestamp(sub.startTime)} --> ${formatSrtTimestamp(sub.endTime)}`;
      let text = '';
      if (type === 'zh') text = sub.textZh;
      else if (type === 'vi') text = sub.textVi || '';
      else text = `${sub.textVi || ''}\n${sub.textZh}`;
      return `${idx}\n${timeStr}\n${text.trim()}\n`;
    })
    .join('\n');
}

// Trigger file download in browser
export function triggerDownload(content: BlobPart, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Full Offline Deployment Manifest Specification
export const OFFLINE_PACKAGE_MANIFEST = {
  softwareName: 'HN Voice Studio',
  version: '3.0.0-turbo-offline',
  targetPlatform: 'Windows 10/11 x64',
  hardwareTarget: 'NVIDIA GTX 1050 Ti 4GB VRAM, 16GB RAM',
  offlineReady: true,
  models: {
    asr_primary: {
      name: 'SenseVoice Small',
      modelId: 'FunAudioLLM/SenseVoiceSmall',
      repository: 'https://github.com/FunAudioLLM/SenseVoice',
      huggingface: 'https://huggingface.co/FunAudioLLM/SenseVoiceSmall',
      targetDir: 'resources/models/sensevoice-small',
      commitSha: '3847d57b6bdf2dd8875cb1508d2af43d80a16bf7',
      files: ['model.pt', 'chn_jpn_yue_eng_ko_spectok.bpe.model', 'config.yaml', 'configuration.json', 'am.mvn', 'demo.py'],
      vramBudgetMb: 1200,
    },
    asr_fallback: {
      name: 'Paraformer-ZH',
      modelId: 'funasr/paraformer-zh',
      repository: 'https://github.com/modelscope/FunASR',
      huggingface: 'https://huggingface.co/funasr/paraformer-zh',
      targetDir: 'resources/models/paraformer-zh',
      commitSha: 'd7811ee3ac581fbcfdeb37c98c6ba674028433dc',
      files: ['model.pt', 'config.yaml', 'configuration.json', 'am.mvn', 'seg_dict', 'tokens.json'],
      vramBudgetMb: 900,
    },
    vad_and_punc: {
      fsmnVad: 'speech_fsmn_vad_zh-cn-16k-common-pytorch',
      ctPunc: 'punc_ct-transformer_zh-cn-common-vocab272727-pytorch',
      repository: 'https://github.com/modelscope/FunASR',
      targetDir: 'resources/models/vad-punc',
    },
    translation: {
      name: 'Qwen3-4B-Instruct-2507 (GGUF Q4_K_M)',
      modelId: 'Qwen/Qwen3-4B-Instruct-2507',
      runtime: 'llama.cpp (cuBLAS / OpenCL / CPU)',
      huggingface: 'https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507',
      commitSha: 'cdbee75f17c01a7cc42f958dc650907174af0554',
      filename: 'qwen3-4b-instruct-2507-q4_k_m.gguf',
      targetDir: 'resources/models/qwen3-4b-instruct-2507',
      vramBudgetMb: 2600,
    },
    tts_primary: {
      name: 'VieNeu-TTS v3 Turbo',
      author: 'Phạm Nguyễn Ngọc Bảo',
      modelId: 'pnnbao-ump/VieNeu-TTS-v3-Turbo',
      repository: 'https://github.com/pnnbao97/VieNeu-TTS',
      huggingface: 'https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo',
      commitSha: '61b85e3d937fbbacb387714180e8182823512523',
      pypiPackage: 'vieneu==3.7.1',
      backend: 'vieneu SDK / ONNX / audio.cpp (https://github.com/0xShug0/audio.cpp)',
      outputAudio: 'WAV 48kHz 16-bit PCM',
      targetDir: 'resources/models/vieneu-tts-v3-turbo',
      vramBudgetMb: 1100,
    },
  },
  ffmpeg: {
    version: '6.1-win64-gpl',
    binaryPath: 'resources/ffmpeg/bin/ffmpeg.exe',
  },
};

// Build script for Windows 10/11 x64 offline packaging
export const WINDOWS_BUILD_SCRIPT = `@echo off
echo ========================================================
echo   HN VOICE STUDIO - WINDOWS X64 OFFLINE BUILD PIPELINE
echo   Optimized for: NVIDIA GTX 1050 Ti 4GB VRAM, 16GB RAM
echo ========================================================

set PROJECT_ROOT=%~dp0
set DIST_DIR=%PROJECT_ROOT%dist-electron
set MODELS_DIR=%PROJECT_ROOT%resources\\models
set RUNTIMES_DIR=%PROJECT_ROOT%resources\\runtimes

echo [1/6] Kiem tra moi truong Node.js va Python...
where node >nul 2>nul || (echo Loi: Khong tim thay Node.js & exit /b 1)
where python >nul 2>nul || (echo Loi: Khong tim thay Python 3.10+ & exit /b 1)

echo [2/6] Tai va xac minh checksum SHA256 cac model AI offline:
echo   - FunAudioLLM/SenseVoiceSmall
echo   - funasr/paraformer-zh, FSMN-VAD, CT-PUNC
echo   - Qwen/Qwen3-4B-Instruct-2507 GGUF Q4_K_M
echo   - pnnbao-ump/VieNeu-TTS-v3-Turbo (SDK & ONNX 48kHz)
python scripts\\download_and_verify_models.py --manifest resources\\manifest.json
if %errorlevel% neq 0 (echo Loi tai model & exit /b 1)

echo [3/6] Build React Vite Frontend...
call npm run build
if %errorlevel% neq 0 (echo Loi build frontend & exit /b 1)

echo [4/6] Dong goi Engine cuc bo (llama.cpp + funasr + vieneu)...
call pyinstaller --noconfirm --onedir scripts\\worker_server.py --distpath resources\\runtimes

echo [5/6] Dong goi Electron Installer Windows x64...
call npx electron-builder --win nsis:x64
if %errorlevel% neq 0 (echo Loi dong goi Electron & exit /b 1)

echo ========================================================
echo   BUILD THANH CONG!
echo   Bo cai offline hoan chinh: dist-electron\\HN-Voice-Studio-Setup.exe
echo   Tat ca model da dong goi 100% offline, khong can Internet!
echo ========================================================
pause
`;
