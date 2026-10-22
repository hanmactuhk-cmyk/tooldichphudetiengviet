import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ProjectData,
  Subtitle,
  Character,
  HardwareVramStatus,
} from './types';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { SubtitleEditor } from './components/SubtitleEditor';
import { SidebarTabs } from './components/SidebarTabs';
import { OfflinePackagingModal } from './components/OfflinePackagingModal';
import { ModelArchitectureModal } from './components/ModelArchitectureModal';
import { DesktopModelLoaderModal } from './components/DesktopModelLoaderModal';
import { SAMPLE_CHINESE_SCENE, runOfflineASR, runParaformerOnSentence } from './lib/asr-engine';
import { runQwenTranslation, retranslateSingleSentence } from './lib/translator-engine';
import { synthesizeVieNeuTTS, VIENEU_VOICES } from './lib/vieneu-engine';
import { generateSrt, triggerDownload } from './lib/export-engine';

export default function App() {
  // Main Project State
  const [project, setProject] = useState<ProjectData>(() => ({
    id: 'proj-chinese-drama-01',
    title: 'Phim truyền hình: Đêm Tăng Ca (夜班加班) - Tập 1',
    videoUrl: null,
    videoFileName: 'ye_ban_jia_ban_ep1.mp4',
    duration: 31.0,
    originalAudioVolume: 0.8,
    originalAudioMuted: false,
    bgmDucking: true,
    subtitles: SAMPLE_CHINESE_SCENE.subtitles as Subtitle[],
    characters: SAMPLE_CHINESE_SCENE.characters,
    translationMode: 'advanced',
    selectedSubtitleId: 'sub-01',
    currentTime: 0,
  }));

  // Undo / Redo history
  const [historyPast, setHistoryPast] = useState<ProjectData[]>([]);
  const [historyFuture, setHistoryFuture] = useState<ProjectData[]>([]);

  // Push current state to undo history
  const pushHistory = useCallback((currentProj: ProjectData) => {
    setHistoryPast((past) => [...past.slice(-20), currentProj]);
    setHistoryFuture([]);
  }, []);

  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryFuture((f) => [project, ...f]);
    setHistoryPast((p) => p.slice(0, p.length - 1));
    setProject(previous);
  };

  const handleRedo = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryPast((p) => [...p, project]);
    setHistoryFuture((f) => f.slice(1));
    setProject(next);
  };

  // Hardware / VRAM monitor simulation (NVIDIA GTX 1050 Ti 4GB, 16GB RAM)
  const [hardwareStatus, setHardwareStatus] = useState<HardwareVramStatus>({
    gpuName: 'NVIDIA GeForce GTX 1050 Ti (4GB VRAM)',
    vramTotalMb: 4096,
    vramUsedMb: 1150,
    ramTotalMb: 16384,
    ramUsedMb: 5200,
    activeModel: null,
    cpuFallback: false,
    isProcessing: false,
    progressPercent: 0,
    currentTaskName: '',
  });

  // UI state
  const [activeSidebarTab, setActiveSidebarTab] = useState<'project' | 'asr' | 'translation' | 'characters' | 'export'>('project');
  const [isPackagingModalOpen, setIsPackagingModalOpen] = useState(false);
  const [isModelAnalysisOpen, setIsModelAnalysisOpen] = useState(false);
  const [isModelLoaderOpen, setIsModelLoaderOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Animation frame / timer for video playback
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= project.duration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(project.duration, prev + 0.1);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, project.duration]);

  // Spacebar keyboard listener for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // 1. Upload custom video file
  const handleUploadVideo = (file: File) => {
    pushHistory(project);
    const videoUrl = URL.createObjectURL(file);
    const videoEl = document.createElement('video');
    videoEl.src = videoUrl;
    videoEl.onloadedmetadata = () => {
      const dur = videoEl.duration || 30.0;
      setProject((p) => ({
        ...p,
        videoUrl,
        videoFileName: file.name,
        duration: dur,
        title: file.name.replace(/\.[^/.]+$/, ''),
      }));
      setActiveSidebarTab('asr');
    };
  };

  // 1b. Load sample scene
  const handleLoadSample = () => {
    pushHistory(project);
    setProject((p) => ({
      ...p,
      videoUrl: null,
      videoFileName: 'ye_ban_jia_ban_ep1.mp4',
      title: 'Phim truyền hình: Đêm Tăng Ca (夜班加班) - Tập 1',
      duration: 31.0,
      subtitles: SAMPLE_CHINESE_SCENE.subtitles as Subtitle[],
      characters: SAMPLE_CHINESE_SCENE.characters,
    }));
  };

  // 2. Run Chinese ASR (SenseVoice Small / Paraformer-ZH)
  const handleRunAsr = async (model: 'SenseVoice-Small' | 'Paraformer-ZH') => {
    pushHistory(project);
    setHardwareStatus((h) => ({
      ...h,
      isProcessing: true,
      activeModel: model === 'SenseVoice-Small' ? 'SenseVoice Small' : 'Paraformer-ZH',
      vramUsedMb: 2350,
      currentTaskName: `Đang chạy nhận diện tiếng Trung (${model})...`,
    }));

    try {
      const recognized = await runOfflineASR(
        project.duration,
        {
          model,
          useVad: true,
          usePunc: true,
          confidenceThreshold: 0.9,
        },
        (percent, stepText) => {
          setHardwareStatus((h) => ({
            ...h,
            progressPercent: percent,
            currentTaskName: stepText,
          }));
        }
      );

      setProject((p) => ({
        ...p,
        subtitles: recognized,
      }));

      // Automatically switch to translation tab
      setActiveSidebarTab('translation');
    } catch (err) {
      console.error('ASR error:', err);
    } finally {
      // Memory cleanup for GTX 1050 Ti: unload ASR model
      setHardwareStatus((h) => ({
        ...h,
        isProcessing: false,
        activeModel: null,
        vramUsedMb: 1200,
        progressPercent: 0,
        currentTaskName: '',
      }));
    }
  };

  // 3. Run Qwen3-4B-Instruct-2507 Translation
  const handleRunTranslation = async (mode: 'fast' | 'advanced') => {
    pushHistory(project);
    setHardwareStatus((h) => ({
      ...h,
      isProcessing: true,
      activeModel: 'Qwen3-4B-Instruct-2507 (GGUF Q4_K_M)',
      vramUsedMb: 2850,
      currentTaskName: 'Đang dịch hội thoại phim sang tiếng Việt...',
    }));

    try {
      const translated = await runQwenTranslation(
        project.subtitles,
        project.characters,
        mode,
        (percent, log) => {
          setHardwareStatus((h) => ({
            ...h,
            progressPercent: percent,
            currentTaskName: log,
          }));
        }
      );

      setProject((p) => ({
        ...p,
        subtitles: translated,
      }));

      // Switch to characters/TTS tab
      setActiveSidebarTab('characters');
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      // Unload Qwen model from VRAM to make room for TTS
      setHardwareStatus((h) => ({
        ...h,
        isProcessing: false,
        activeModel: null,
        vramUsedMb: 1200,
        progressPercent: 0,
        currentTaskName: '',
      }));
    }
  };

  // 4. Batch VieNeu-TTS v3 Turbo synthesis
  const handleRunBatchTts = async () => {
    pushHistory(project);
    setHardwareStatus((h) => ({
      ...h,
      isProcessing: true,
      activeModel: 'VieNeu-TTS v3 Turbo (ONNX 48kHz)',
      vramUsedMb: 2200,
      currentTaskName: 'Đang khởi động VieNeu-TTS v3 Turbo...',
    }));

    try {
      const updatedSubtitles = [...project.subtitles];
      const total = updatedSubtitles.length;

      for (let i = 0; i < total; i++) {
        const sub = updatedSubtitles[i];
        const textToSpeak = sub.textVi || sub.textZh;
        const char = project.characters.find((c) => c.id === sub.characterId);
        const voiceId = sub.voiceId || char?.voiceId || 'vieneu-maianh-v3';
        const speed = sub.speed || char?.speed || 1.0;
        const pitch = sub.pitch || char?.pitch || 0;

        const percent = Math.floor(((i + 1) / total) * 100);
        setHardwareStatus((h) => ({
          ...h,
          progressPercent: percent,
          currentTaskName: `VieNeu-TTS: Tạo giọng câu ${i + 1}/${total} [${char?.name}]...`,
        }));

        const synthResult = await synthesizeVieNeuTTS(
          textToSpeak,
          voiceId,
          speed,
          pitch,
          sub.volume || 1.0
        );

        const slotDuration = sub.endTime - sub.startTime;
        const isOverflow = synthResult.duration > slotDuration + 0.2;

        updatedSubtitles[i] = {
          ...sub,
          voiceId,
          ttsAudioUrl: synthResult.audioUrl,
          ttsDuration: synthResult.duration,
          status: isOverflow ? 'warning_overflow' : 'synced',
        };
      }

      setProject((p) => ({
        ...p,
        subtitles: updatedSubtitles,
      }));
    } catch (err) {
      console.error('Batch TTS error:', err);
    } finally {
      setHardwareStatus((h) => ({
        ...h,
        isProcessing: false,
        activeModel: null,
        vramUsedMb: 1250,
        progressPercent: 0,
        currentTaskName: '',
      }));
    }
  };

  // Subtitle updates (Rule compliance: Chinese edit marks needs_retranslation; Vietnamese edit marks needs_tts)
  const handleUpdateSubtitle = (id: string, updates: Partial<Subtitle>) => {
    pushHistory(project);
    setProject((p) => ({
      ...p,
      subtitles: p.subtitles.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  // Retranslate a single sentence
  const handleRetranslateSentence = async (id: string) => {
    const sub = project.subtitles.find((s) => s.id === id);
    if (!sub) return;

    setHardwareStatus((h) => ({
      ...h,
      isProcessing: true,
      activeModel: 'Qwen3-4B-Instruct-2507',
      currentTaskName: `Đang dịch lại câu ${sub.id}...`,
    }));

    const result = await retranslateSingleSentence(sub, project.translationMode);

    handleUpdateSubtitle(id, {
      textVi: result.textVi,
      suggestedViShort: result.suggestedViShort,
      status: 'needs_tts',
      notes: result.notes,
    });

    setHardwareStatus((h) => ({
      ...h,
      isProcessing: false,
      activeModel: null,
      currentTaskName: '',
    }));
  };

  // Regenerate VieNeu-TTS for a single sentence
  const handleRegenerateTtsSentence = async (id: string) => {
    const sub = project.subtitles.find((s) => s.id === id);
    if (!sub) return;

    const char = project.characters.find((c) => c.id === sub.characterId);
    const voiceId = sub.voiceId || char?.voiceId || 'vieneu-maianh-v3';

    setHardwareStatus((h) => ({
      ...h,
      isProcessing: true,
      activeModel: 'VieNeu-TTS v3 Turbo',
      currentTaskName: `Tạo lại âm thanh câu ${sub.id}...`,
    }));

    const synthResult = await synthesizeVieNeuTTS(
      sub.textVi || sub.textZh,
      voiceId,
      sub.speed,
      sub.pitch,
      sub.volume
    );

    const isOverflow = synthResult.duration > (sub.endTime - sub.startTime) + 0.2;

    handleUpdateSubtitle(id, {
      ttsAudioUrl: synthResult.audioUrl,
      ttsDuration: synthResult.duration,
      status: isOverflow ? 'warning_overflow' : 'synced',
    });

    setHardwareStatus((h) => ({
      ...h,
      isProcessing: false,
      activeModel: null,
      currentTaskName: '',
    }));
  };

  // Check single sentence with Paraformer-ZH
  const handleCheckWithParaformer = async (id: string) => {
    const sub = project.subtitles.find((s) => s.id === id);
    if (!sub) return;

    const res = await runParaformerOnSentence(sub);
    handleUpdateSubtitle(id, {
      modelUsedZh: 'Paraformer-ZH',
      confidence: res.confidence,
    });
  };

  // Split subtitle at time
  const handleSplitSubtitle = (id: string, splitTime: number) => {
    const sub = project.subtitles.find((s) => s.id === id);
    if (!sub || splitTime <= sub.startTime || splitTime >= sub.endTime) return;

    pushHistory(project);
    const newSub1: Subtitle = {
      ...sub,
      endTime: splitTime,
      status: 'needs_retranslation',
    };
    const newSub2: Subtitle = {
      ...sub,
      id: `sub-${Date.now().toString().slice(-4)}`,
      startTime: splitTime,
      textZh: '...',
      textVi: '...',
      status: 'needs_retranslation',
      ttsAudioUrl: undefined,
    };

    setProject((p) => ({
      ...p,
      subtitles: p.subtitles.flatMap((s) => (s.id === id ? [newSub1, newSub2] : [s])),
    }));
  };

  // Delete subtitle
  const handleDeleteSubtitle = (id: string) => {
    pushHistory(project);
    setProject((p) => ({
      ...p,
      subtitles: p.subtitles.filter((s) => s.id !== id),
      selectedSubtitleId: null,
    }));
  };

  // Update Character properties
  const handleUpdateCharacter = (id: string, updates: Partial<Character>) => {
    pushHistory(project);
    setProject((p) => ({
      ...p,
      characters: p.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  // Export functions
  const handleExportSrt = (type: 'zh' | 'vi' | 'bilingual') => {
    const srtContent = generateSrt(project.subtitles, type);
    const filename = `${project.title.replace(/\s+/g, '_')}_${type}.srt`;
    triggerDownload(srtContent, filename, 'text/plain');
  };

  const handleExportWav = () => {
    // Export first available WAV or notify user
    const firstWavSub = project.subtitles.find((s) => s.ttsAudioUrl);
    if (firstWavSub && firstWavSub.ttsAudioUrl) {
      const a = document.createElement('a');
      a.href = firstWavSub.ttsAudioUrl;
      a.download = `${project.title}_VieNeu_TTS_48k.wav`;
      a.click();
    } else {
      alert('Vui lòng tạo giọng đọc VieNeu-TTS trước khi xuất file WAV!');
    }
  };

  const handleExportProjectJson = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    triggerDownload(jsonStr, `${project.title}_project.json`, 'application/json');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#101014] text-zinc-100 overflow-hidden font-sans select-none">
      {/* 1. Header Toolbar */}
      <Header
        hardwareStatus={hardwareStatus}
        projectTitle={project.title}
        onOpenPackaging={() => setIsPackagingModalOpen(true)}
        onOpenModelAnalysis={() => setIsModelAnalysisOpen(true)}
        onOpenModelLoader={() => setIsModelLoaderOpen(true)}
        onOpenExport={() => setActiveSidebarTab('export')}
        onSaveProject={handleExportProjectJson}
        onLoadSample={handleLoadSample}
        canUndo={historyPast.length > 0}
        canRedo={historyFuture.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* 2. Middle Workspace: Left Sidebar + Center Video + Right Subtitle Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Steps / Controls */}
        <SidebarTabs
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          project={project}
          hardwareStatus={hardwareStatus}
          onUploadVideo={handleUploadVideo}
          onLoadSampleVideo={handleLoadSample}
          onRunAsr={handleRunAsr}
          onRunTranslation={handleRunTranslation}
          onRunBatchTts={handleRunBatchTts}
          onExportSrt={handleExportSrt}
          onExportWav={handleExportWav}
          onExportProjectJson={handleExportProjectJson}
          onUpdateCharacter={handleUpdateCharacter}
        />

        {/* Center: Video Player Preview */}
        <VideoPlayer
          videoUrl={project.videoUrl}
          subtitles={project.subtitles}
          characters={project.characters}
          currentTime={currentTime}
          duration={project.duration}
          isPlaying={isPlaying}
          originalAudioVolume={project.originalAudioVolume}
          originalAudioMuted={project.originalAudioMuted}
          bgmDucking={project.bgmDucking}
          onTimeUpdate={(t) => setCurrentTime(t)}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onChangeOriginalVolume={(vol) => setProject((p) => ({ ...p, originalAudioVolume: vol }))}
          onToggleOriginalMute={() => setProject((p) => ({ ...p, originalAudioMuted: !p.originalAudioMuted }))}
          onToggleDucking={() => setProject((p) => ({ ...p, bgmDucking: !p.bgmDucking }))}
        />

        {/* Right: Subtitle & Dubbing Editor */}
        <SubtitleEditor
          subtitles={project.subtitles}
          characters={project.characters}
          selectedSubtitleId={project.selectedSubtitleId}
          onSelectSubtitle={(id) => setProject((p) => ({ ...p, selectedSubtitleId: id }))}
          onUpdateSubtitle={handleUpdateSubtitle}
          onRetranslateSentence={handleRetranslateSentence}
          onRegenerateTtsSentence={handleRegenerateTtsSentence}
          onCheckWithParaformer={handleCheckWithParaformer}
        />
      </div>

      {/* 3. Bottom: CapCut-Style Multi-Track Timeline */}
      <Timeline
        subtitles={project.subtitles}
        characters={project.characters}
        currentTime={currentTime}
        duration={project.duration}
        selectedSubtitleId={project.selectedSubtitleId}
        onSelectSubtitle={(id) => setProject((p) => ({ ...p, selectedSubtitleId: id }))}
        onSeek={(t) => setCurrentTime(t)}
        onSplitSubtitle={handleSplitSubtitle}
        onDeleteSubtitle={handleDeleteSubtitle}
      />

      {/* 4. Offline Packaging & Manifest Modal */}
      <OfflinePackagingModal
        isOpen={isPackagingModalOpen}
        onClose={() => setIsPackagingModalOpen(false)}
      />

      {/* 5. Model Architecture & Tensor Breakdown Modal */}
      <ModelArchitectureModal
        isOpen={isModelAnalysisOpen}
        onClose={() => setIsModelAnalysisOpen(false)}
      />

      {/* 6. Desktop Model Downloader & Loader Modal */}
      <DesktopModelLoaderModal
        isOpen={isModelLoaderOpen}
        onClose={() => setIsModelLoaderOpen(false)}
        onModelsLoaded={() => {
          setHardwareStatus((h) => ({
            ...h,
            activeModel: 'SenseVoice + Qwen3-4B + VieNeu-TTS (Đã nạp đầy đủ)',
          }));
        }}
      />
    </div>
  );
}
