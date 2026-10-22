import { Subtitle, Character } from '../types';

export interface AsrOptions {
  model: 'SenseVoice-Small' | 'Paraformer-ZH';
  useVad: boolean;
  usePunc: boolean;
  confidenceThreshold: number;
}

// Sample authentic Chinese drama multi-character dialogue
export const SAMPLE_CHINESE_SCENE: {
  subtitles: Omit<Subtitle, 'ttsAudioUrl' | 'ttsDuration'>[];
  characters: Character[];
} = {
  characters: [
    {
      id: 'char-lyminh',
      name: 'Lý Minh (李明)',
      gender: 'male',
      role: 'Nam chính (Chồng / Nhân viên)',
      relationship: 'Chồng của Triệu Mai, cấp dưới Giám đốc Vương',
      pronounSelf: 'Anh / Tôi',
      pronounCall: 'Em / Sếp',
      color: '#3B82F6', // Blue
      voiceId: 'vieneu-namkhanh-v3',
      speed: 1.0,
      pitch: 0,
    },
    {
      id: 'char-trieumai',
      name: 'Triệu Mai (赵梅)',
      gender: 'female',
      role: 'Nữ chính (Vợ)',
      relationship: 'Vợ của Lý Minh, con gái Bà Lý',
      pronounSelf: 'Em / Con',
      pronounCall: 'Anh / Mẹ',
      color: '#EC4899', // Pink
      voiceId: 'vieneu-maianh-v3',
      speed: 1.0,
      pitch: 1,
    },
    {
      id: 'char-giamdocvuong',
      name: 'Giám đốc Vương (王总)',
      gender: 'male',
      role: 'Cấp trên (Sếp)',
      relationship: 'Sếp của Lý Minh tại tập đoàn',
      pronounSelf: 'Tôi',
      pronounCall: 'Cậu / Tiểu Lý',
      color: '#F59E0B', // Amber
      voiceId: 'vieneu-minhquan-v3',
      speed: 0.95,
      pitch: -2,
    },
    {
      id: 'char-baly',
      name: 'Bà Lý (李母)',
      gender: 'elder',
      role: 'Người mẹ',
      relationship: 'Mẹ ruột của Triệu Mai',
      pronounSelf: 'Mẹ',
      pronounCall: 'Con / Hai đứa',
      color: '#8B5CF6', // Purple
      voiceId: 'vieneu-hoangbach-v3',
      speed: 0.9,
      pitch: -1,
    },
  ],
  subtitles: [
    {
      id: 'sub-01',
      startTime: 1.2,
      endTime: 4.5,
      textZh: '李明，你今天晚上怎么回来得这么晚？公司又加班了吗？',
      characterId: 'char-trieumai',
      speed: 1.0,
      pitch: 0,
      volume: 1.0,
      status: 'raw',
      modelUsedZh: 'SenseVoice-Small',
      confidence: 0.96,
    },
    {
      id: 'sub-02',
      startTime: 5.1,
      endTime: 8.8,
      textZh: '老婆，对不起。王总突然交给我一个紧急项目，我不能推脱。',
      characterId: 'char-lyminh',
      speed: 1.0,
      pitch: 0,
      volume: 1.0,
      status: 'raw',
      modelUsedZh: 'SenseVoice-Small',
      confidence: 0.94,
    },
    {
      id: 'sub-03',
      startTime: 9.4,
      endTime: 13.0,
      textZh: '小李，这个季度的海外并购案非你莫属，千万别让我失望。',
      characterId: 'char-giamdocvuong',
      speed: 0.95,
      pitch: -2,
      volume: 1.0,
      status: 'raw',
      modelUsedZh: 'SenseVoice-Small',
      confidence: 0.98,
    },
    {
      id: 'sub-04',
      startTime: 13.6,
      endTime: 17.5,
      textZh: '请王总放心，我一定会全力以赴，今晚就把初版方案赶出来！',
      characterId: 'char-lyminh',
      speed: 1.05,
      pitch: 0,
      volume: 1.0,
      status: 'raw',
      modelUsedZh: 'SenseVoice-Small',
      confidence: 0.93,
    },
    {
      id: 'sub-05',
      startTime: 18.2,
      endTime: 22.4,
      textZh: '唉，工作再忙也要顾着身子啊。妈给你们煲了老火汤，趁热喝吧。',
      characterId: 'char-baly',
      speed: 0.9,
      pitch: -1,
      volume: 1.0,
      status: 'raw',
      modelUsedZh: 'SenseVoice-Small',
      confidence: 0.91,
    },
    {
      id: 'sub-06',
      startTime: 23.0,
      endTime: 26.8,
      textZh: '谢谢妈，有您在真好。老公，你也快过来坐下喝一碗吧。',
      characterId: 'char-trieumai',
      speed: 1.0,
      pitch: 0,
      volume: 1.0,
      status: 'raw',
      modelUsedZh: 'SenseVoice-Small',
      confidence: 0.97,
    },
    {
      id: 'sub-07',
      startTime: 27.5,
      endTime: 30.8,
      textZh: '好，我这就来。有你们陪在我身边，我一点都不觉得累。',
      characterId: 'char-lyminh',
      speed: 1.0,
      pitch: 0,
      volume: 1.0,
      status: 'raw',
      modelUsedZh: 'SenseVoice-Small',
      confidence: 0.95,
    },
  ],
};

// Simulate SenseVoice Small or Paraformer ASR execution with hardware-aware timing
export async function runOfflineASR(
  videoDuration: number,
  options: AsrOptions,
  onProgress: (percent: number, stepText: string) => void
): Promise<Subtitle[]> {
  const modelName = options.model === 'Paraformer-ZH' ? 'Paraformer-ZH (funasr/paraformer-zh)' : 'SenseVoice-Small (FunAudioLLM/SenseVoiceSmall)';

  onProgress(10, `[1/4] Đang nạp model VAD (FSMN-VAD) và kiểm tra VRAM GPU GTX 1050 Ti...`);
  await new Promise((r) => setTimeout(r, 400));

  onProgress(30, `[2/4] Trích xuất track âm thanh 16kHz PCM & phân đoạn khoảng lặng (VAD)...`);
  await new Promise((r) => setTimeout(r, 600));

  onProgress(65, `[3/4] Chạy nhận diện tiếng Trung qua ${modelName}...`);
  await new Promise((r) => setTimeout(r, 800));

  onProgress(90, `[4/4] Bổ sung dấu câu tiếng Trung (CT-PUNC) và căn chỉnh thời gian...`);
  await new Promise((r) => setTimeout(r, 400));

  onProgress(100, `Hoàn thành nhận diện tiếng Trung (${options.model})!`);

  // Return base sample or scaled subtitles
  return SAMPLE_CHINESE_SCENE.subtitles.map((sub, idx) => ({
    ...sub,
    modelUsedZh: options.model,
    confidence: options.model === 'Paraformer-ZH' ? 0.99 : 0.95,
  }));
}

// Fallback re-recognition for a single difficult sentence using Paraformer-ZH
export async function runParaformerOnSentence(
  sub: Subtitle,
  onProgress?: (text: string) => void
): Promise<{ textZh: string; confidence: number; model: 'Paraformer-ZH' }> {
  if (onProgress) onProgress('Đang nạp Paraformer-ZH kiểm tra lại câu...');
  await new Promise((r) => setTimeout(r, 600));

  return {
    textZh: sub.textZh,
    confidence: 0.992,
    model: 'Paraformer-ZH',
  };
}
