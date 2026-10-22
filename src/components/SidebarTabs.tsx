import React, { useState } from 'react';
import {
  Film,
  Subtitles,
  Languages,
  Users,
  Download,
  Upload,
  Play,
  Sparkles,
  Volume2,
  Mic,
  Sliders,
  CheckCircle,
  FileText,
  AlertCircle,
  Cpu,
  Layers,
} from 'lucide-react';
import { ProjectData, Character, VieNeuVoice, HardwareVramStatus } from '../types';
import { VIENEU_VOICES, playAudioPreview } from '../lib/vieneu-engine';

interface SidebarTabsProps {
  activeTab: 'project' | 'asr' | 'translation' | 'characters' | 'export';
  setActiveTab: (tab: 'project' | 'asr' | 'translation' | 'characters' | 'export') => void;
  project: ProjectData;
  hardwareStatus: HardwareVramStatus;
  onUploadVideo: (file: File) => void;
  onLoadSampleVideo: () => void;
  onRunAsr: (model: 'SenseVoice-Small' | 'Paraformer-ZH') => void;
  onRunTranslation: (mode: 'fast' | 'advanced') => void;
  onRunBatchTts: () => void;
  onExportSrt: (type: 'zh' | 'vi' | 'bilingual') => void;
  onExportWav: () => void;
  onExportProjectJson: () => void;
  onUpdateCharacter: (id: string, updates: Partial<Character>) => void;
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  activeTab,
  setActiveTab,
  project,
  hardwareStatus,
  onUploadVideo,
  onLoadSampleVideo,
  onRunAsr,
  onRunTranslation,
  onRunBatchTts,
  onExportSrt,
  onExportWav,
  onExportProjectJson,
  onUpdateCharacter,
}) => {
  const [selectedAsrModel, setSelectedAsrModel] = useState<'SenseVoice-Small' | 'Paraformer-ZH'>('SenseVoice-Small');
  const [translationMode, setTranslationMode] = useState<'fast' | 'advanced'>('advanced');
  const [useVad, setUseVad] = useState(true);
  const [usePunc, setUsePunc] = useState(true);

  return (
    <div className="w-80 lg:w-96 bg-[#18181c] border-r border-[#27272a] flex flex-col shrink-0 select-none overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-[#27272a] bg-[#141418] p-1 space-x-1 text-xs">
        <button
          onClick={() => setActiveTab('project')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center space-x-1 transition-all ${
            activeTab === 'project'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
          title="1. Dự án & Nhập Video"
        >
          <Film className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate">1. Video</span>
        </button>

        <button
          onClick={() => setActiveTab('asr')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center space-x-1 transition-all ${
            activeTab === 'asr'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
          title="2. Nhận diện tiếng Trung (SenseVoice)"
        >
          <Subtitles className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">2. ASR Trung</span>
        </button>

        <button
          onClick={() => setActiveTab('translation')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center space-x-1 transition-all ${
            activeTab === 'translation'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
          title="3. Dịch tiếng Việt (Qwen3-4B)"
        >
          <Languages className="w-3.5 h-3.5 text-purple-400" />
          <span className="truncate">3. Dịch Việt</span>
        </button>

        <button
          onClick={() => setActiveTab('characters')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center space-x-1 transition-all ${
            activeTab === 'characters'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
          title="4. Quản lý nhân vật & VieNeu-TTS v3"
        >
          <Users className="w-3.5 h-3.5 text-rose-400" />
          <span className="truncate">4. VieNeu-TTS</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center space-x-1 transition-all ${
            activeTab === 'export'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
          title="5. Xuất file & Dự án"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate">5. Xuất</span>
        </button>
      </div>

      {/* Progress banner when hardware is processing */}
      {hardwareStatus.isProcessing && (
        <div className="p-3 bg-rose-950/40 border-b border-rose-500/30 text-xs space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-rose-300 font-semibold text-[11px]">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-400" />
              <span className="truncate">{hardwareStatus.currentTaskName}</span>
            </span>
            <span>{hardwareStatus.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
              style={{ width: `${hardwareStatus.progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4">
        {/* ================= TAB 1: VIDEO & PROJECT ================= */}
        {activeTab === 'project' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm mb-1">
                1. Nhập video MP4 tiếng Trung
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Tải lên video MP4 hoặc mở mẫu phim truyền hình tiếng Trung nhiều nhân vật để bắt đầu quy trình lồng tiếng.
              </p>
            </div>

            {/* Video File Drop Zone */}
            <label className="border-2 border-dashed border-zinc-700 hover:border-rose-500/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-900/50">
              <Upload className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="text-zinc-200 font-semibold text-xs text-center">
                Chọn video MP4 / MKV / WebM
              </span>
              <span className="text-zinc-500 text-[10px] text-center mt-1">
                Kéo thả hoặc nhấn để duyệt file máy tính
              </span>
              <input
                type="file"
                accept="video/mp4,video/mkv,video/webm"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onUploadVideo(e.target.files[0]);
                  }
                }}
              />
            </label>

            {/* Pre-loaded Sample Scene Button */}
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-zinc-200 text-xs">
                  Mẫu phim truyền hình Trung Quốc
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Bao gồm 4 nhân vật: Lý Minh, Triệu Mai, Giám đốc Vương, Bà Lý (30.8s, 7 câu đối thoại).
              </p>
              <button
                onClick={onLoadSampleVideo}
                className="w-full py-2 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-medium transition-colors"
              >
                Nạp lại mẫu phim
              </button>
            </div>

            {/* Video Meta Info */}
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] space-y-1.5 font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>File video:</span>
                <span className="text-zinc-200 truncate max-w-[150px]">{project.videoFileName}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời lượng:</span>
                <span className="text-zinc-200">{project.duration.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>Số câu phụ đề:</span>
                <span className="text-zinc-200">{project.subtitles.length} câu</span>
              </div>
              <div className="flex justify-between">
                <span>Nhân vật:</span>
                <span className="text-zinc-200">{project.characters.length} nhân vật</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ASR CHINESE ================= */}
        {activeTab === 'asr' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm mb-1">
                2. Nhận diện tiếng Trung từ âm thanh
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Chạy model nhận diện lời thoại SenseVoice Small và căn chỉnh thời gian bằng VAD / Punc.
              </p>
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-zinc-300 font-semibold text-xs">Model nhận diện:</label>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <input
                    type="radio"
                    name="asr-model"
                    checked={selectedAsrModel === 'SenseVoice-Small'}
                    onChange={() => setSelectedAsrModel('SenseVoice-Small')}
                    className="accent-rose-500"
                  />
                  <div>
                    <div className="font-semibold text-zinc-200 text-xs">
                      SenseVoice Small (Bắt buộc chính)
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      FunAudioLLM/SenseVoiceSmall • Tốc độ siêu nhanh, nhận diện lời thoại phim.
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <input
                    type="radio"
                    name="asr-model"
                    checked={selectedAsrModel === 'Paraformer-ZH'}
                    onChange={() => setSelectedAsrModel('Paraformer-ZH')}
                    className="accent-rose-500"
                  />
                  <div>
                    <div className="font-semibold text-zinc-200 text-xs">
                      Paraformer-ZH (Model dự phòng)
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      funasr/paraformer-zh • Căn chỉnh timestamp từ và câu khó.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* VAD & Punc toggles */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-zinc-300 text-xs block">
                Phân đoạn & Dấu câu:
              </span>
              <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={useVad}
                  onChange={(e) => setUseVad(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
                <span>FSMN-VAD: Tự động tách khoảng lặng</span>
              </label>
              <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={usePunc}
                  onChange={(e) => setUsePunc(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
                <span>CT-PUNC: Bổ sung dấu câu tự nhiên</span>
              </label>
            </div>

            {/* Run ASR Button */}
            <button
              onClick={() => onRunAsr(selectedAsrModel)}
              disabled={hardwareStatus.isProcessing}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-md shadow-amber-950/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Subtitles className="w-4 h-4" />
              <span>Tạo phụ đề tiếng Trung ({selectedAsrModel})</span>
            </button>
          </div>
        )}

        {/* ================= TAB 3: TRANSLATION ================= */}
        {activeTab === 'translation' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm mb-1">
                3. Dịch sang tiếng Việt (Qwen3-4B-Instruct-2507)
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Dịch hội thoại phim tự nhiên theo bối cảnh, quan hệ nhân vật (vợ-chồng, mẹ-con, sếp-nhân viên) và tối ưu độ dài cho lồng tiếng.
              </p>
            </div>

            {/* Translation Mode */}
            <div className="space-y-2">
              <label className="text-zinc-300 font-semibold text-xs">Chế độ dịch:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTranslationMode('fast')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    translationMode === 'fast'
                      ? 'bg-purple-950/50 border-purple-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-purple-300">Dịch nhanh</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Ưu tiên tốc độ, ngữ cảnh ngắn.</div>
                </button>

                <button
                  onClick={() => setTranslationMode('advanced')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    translationMode === 'advanced'
                      ? 'bg-purple-950/50 border-purple-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-purple-300">Dịch nâng cao</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Phân tích sâu quan hệ, xưng hô.</div>
                </button>
              </div>
            </div>

            {/* Pacing optimizer info banner */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] space-y-1 text-zinc-300">
              <div className="flex items-center space-x-1.5 font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tối ưu độ dài lồng tiếng:</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[10px]">
                Hệ thống tự động kiểm tra số từ tiếng Việt so với thời gian phụ đề. Nếu câu quá dài, tự động đề xuất bản rút gọn mà không làm mất ý chính.
              </p>
            </div>

            {/* Run Translation Button */}
            <button
              onClick={() => onRunTranslation(translationMode)}
              disabled={hardwareStatus.isProcessing || project.subtitles.length === 0}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-950/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Languages className="w-4 h-4" />
              <span>Dịch sang tiếng Việt ({translationMode === 'advanced' ? 'Nâng cao' : 'Nhanh'})</span>
            </button>
          </div>
        )}

        {/* ================= TAB 4: CHARACTERS & VIENEU-TTS ================= */}
        {activeTab === 'characters' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm mb-1">
                4. Quản lý nhân vật & VieNeu-TTS v3 Turbo
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Gán giọng đọc cho từng nhân vật, tinh chỉnh tốc độ, cao độ và hỗ trợ biểu cảm [cười], [thở dài], [hắng giọng].
              </p>
            </div>

            {/* Character Cards */}
            <div className="space-y-2.5">
              {project.characters.map((char) => (
                <div
                  key={char.id}
                  className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: char.color }}
                      />
                      <span className="font-bold text-zinc-200 text-xs">{char.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {char.role}
                    </span>
                  </div>

                  <div className="text-[10px] text-zinc-400">
                    <span className="text-zinc-500">Xưng hô:</span> {char.pronounSelf} ↔ {char.pronounCall} ({char.relationship})
                  </div>

                  {/* Voice Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-semibold">Giọng đọc VieNeu-TTS:</label>
                    <select
                      value={char.voiceId}
                      onChange={(e) => onUpdateCharacter(char.id, { voiceId: e.target.value })}
                      className="w-full bg-[#111114] border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                    >
                      {VIENEU_VOICES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.tone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sliders: Speed & Pitch */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-zinc-400">
                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span>Tốc độ:</span>
                        <span className="font-mono text-zinc-300">{char.speed.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.5"
                        step="0.05"
                        value={char.speed}
                        onChange={(e) => onUpdateCharacter(char.id, { speed: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span>Cao độ:</span>
                        <span className="font-mono text-zinc-300">{char.pitch > 0 ? `+${char.pitch}` : char.pitch}</span>
                      </div>
                      <input
                        type="range"
                        min="-6"
                        max="6"
                        step="1"
                        value={char.pitch}
                        onChange={(e) => onUpdateCharacter(char.id, { pitch: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Run Batch TTS Button */}
            <button
              onClick={onRunBatchTts}
              disabled={hardwareStatus.isProcessing || project.subtitles.length === 0}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs shadow-md shadow-rose-950/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Mic className="w-4 h-4" />
              <span>Tạo giọng đọc hàng loạt (VieNeu-TTS v3 Turbo)</span>
            </button>
          </div>
        )}

        {/* ================= TAB 5: EXPORT & PACKAGING ================= */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm mb-1">
                5. Xuất Video & Phụ đề & Âm thanh
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Xuất file video hoàn chỉnh đã lồng tiếng, file phụ đề SRT hoặc file audio WAV 48kHz.
              </p>
            </div>

            {/* Subtitles Export */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-zinc-300 text-xs block">
                Xuất file phụ đề (.SRT):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onExportSrt('bilingual')}
                  className="py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium"
                >
                  SRT Song ngữ
                </button>
                <button
                  onClick={() => onExportSrt('vi')}
                  className="py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium"
                >
                  SRT Tiếng Việt
                </button>
                <button
                  onClick={() => onExportSrt('zh')}
                  className="py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium"
                >
                  SRT Tiếng Trung
                </button>
              </div>
            </div>

            {/* Audio Dubbing Export */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-zinc-300 text-xs block">
                Xuất âm thanh lồng tiếng (.WAV 48kHz):
              </span>
              <button
                onClick={onExportWav}
                className="w-full py-2 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải trọn bộ Audio lồng tiếng (WAV)</span>
              </button>
            </div>

            {/* Project Backup Export */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-zinc-300 text-xs block">
                Sao lưu dự án (.JSON / SQLite):
              </span>
              <button
                onClick={onExportProjectJson}
                className="w-full py-2 rounded-md bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs flex items-center justify-center space-x-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Tải file dự án HN Voice Studio (.json)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
