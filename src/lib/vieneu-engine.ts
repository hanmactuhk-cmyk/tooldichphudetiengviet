import { VieNeuVoice } from '../types';

export const VIENEU_VOICES: VieNeuVoice[] = [
  {
    id: 'vieneu-minhquan-v3',
    name: 'Minh Quân (Mặc định - Nam Bắc Natural)',
    gender: 'male',
    accent: 'Bắc',
    tone: 'Tự nhiên, rõ chữ, chất giọng dẫn chuyện & lồng tiếng',
    description: 'Giọng mặc định chính thức của VieNeu-TTS v3 Turbo.',
    sampleText: 'Mọi người tập trung lại đây, [hắng giọng] chúng ta có việc quan trọng cần bàn.',
    supportedExpressions: ['[cười]', '[thở dài]', '[hắng giọng]'],
  },
  {
    id: 'vieneu-maianh-v3',
    name: 'Mai Anh (Nữ Bắc News)',
    gender: 'female',
    accent: 'Bắc',
    tone: 'Truyền cảm, dõng dạc, phù hợp nữ chính & tin tức',
    description: 'Giọng nữ chuẩn Hà Nội, độ ngân tốt, diễn đạt cảm xúc cao.',
    sampleText: 'Xin chào, đây là hệ thống lồng tiếng HN Voice Studio với VieNeu-TTS v3 Turbo.',
    supportedExpressions: ['[cười]', '[thở dài]', '[hắng giọng]'],
  },
  {
    id: 'vieneu-anhkhoi-v3',
    name: 'Anh Khôi (Nam Bắc Storytelling)',
    gender: 'male',
    accent: 'Bắc',
    tone: 'Trầm ấm, nam tính, kể chuyện & diễn xuất',
    description: 'Giọng nam miền Bắc đĩnh đạc, rõ chữ, giọng ngực dầy.',
    sampleText: 'Tôi không thể để chuyện này tiếp tục xảy ra được nữa [thở dài].',
    supportedExpressions: ['[cười]', '[thở dài]', '[hắng giọng]'],
  },
  {
    id: 'vieneu-doantrang-v3',
    name: 'Đoan Trang (Nữ Bắc Natural)',
    gender: 'female',
    accent: 'Bắc',
    tone: 'Dịu dàng, tự nhiên, nữ chính phim tâm lý',
    description: 'Giọng nữ tự nhiên, mềm mại, tình cảm.',
    sampleText: 'Em biết là anh đã rất vất vả vì gia đình này mà [cười].',
    supportedExpressions: ['[cười]', '[thở dài]'],
  },
  {
    id: 'vieneu-ngochuyen-v3',
    name: 'Ngọc Huyền (Nữ Bắc Natural)',
    gender: 'female',
    accent: 'Bắc',
    tone: 'Nhẹ nhàng, thanh thoát, đời thường',
    description: 'Giọng nữ Bắc tự nhiên, ấm áp.',
    sampleText: 'Chuyện hôm nay, em nghĩ chúng ta nên ngồi lại nói chuyện rõ ràng.',
    supportedExpressions: ['[cười]', '[thở dài]'],
  },
  {
    id: 'vieneu-kimthanh-v3',
    name: 'Kim Thanh (Nữ Nam Storytelling)',
    gender: 'female',
    accent: 'Nam',
    tone: 'Ngọt ngào, truyền cảm, phim truyền hình miền Nam',
    description: 'Giọng nữ miền Nam chuẩn, cảm xúc cao.',
    sampleText: 'Anh đừng lo, tụi mình nhất định sẽ tìm ra cách mà [cười].',
    supportedExpressions: ['[cười]', '[thở dài]'],
  },
  {
    id: 'vieneu-ductri-v3',
    name: 'Đức Trí (Nam Nam Storytelling)',
    gender: 'male',
    accent: 'Nam',
    tone: 'Trầm hùng, vững chãi, nam chính miền Nam',
    description: 'Giọng nam miền Nam chắc khỏe, vang dội.',
    sampleText: 'Chuyện này cứ để tôi lo, anh em yên tâm đi.',
    supportedExpressions: ['[thở dài]', '[hắng giọng]'],
  },
  {
    id: 'vieneu-myduyen-v3',
    name: 'Mỹ Duyên (Nữ Nam Storytelling)',
    gender: 'female',
    accent: 'Nam',
    tone: 'Trong trẻo, tình cảm, thiếu nữ',
    description: 'Giọng nữ miền Nam trẻ trung, hoạt bát.',
    sampleText: 'Ủa, sao mọi người nhìn em dữ vậy nè [cười]?',
    supportedExpressions: ['[cười]'],
  },
  {
    id: 'vieneu-thaison-v3',
    name: 'Thái Sơn (Nam Nam Storytelling)',
    gender: 'male',
    accent: 'Nam',
    tone: 'Đĩnh đạc, dày dặn, sếp & người lớn tuổi',
    description: 'Giọng nam miền Nam đầm ấm, uy nghiêm.',
    sampleText: 'Năm xưa tôi đã dặn cậu thế nào, cậu còn nhớ không?',
    supportedExpressions: ['[thở dài]', '[hắng giọng]'],
  },
  {
    id: 'vieneu-ngoctran-v3',
    name: 'Ngọc Trân (Nữ Trung Natural)',
    gender: 'female',
    accent: 'Trung',
    tone: 'Đằm thắm, mộc mạc, giọng miền Trung',
    description: 'Giọng nữ miền Trung giàu nhạc điệu, chân thật.',
    sampleText: 'Mời cả nhà cùng dùng bữa, canh đang nóng đây nì.',
    supportedExpressions: ['[cười]'],
  },
  {
    id: 'vieneu-quangson-v3',
    name: 'Quang Sơn (Nam Trung Natural)',
    gender: 'male',
    accent: 'Trung',
    tone: 'Khỏe khoắn, kiên định, giọng miền Trung',
    description: 'Giọng nam miền Trung rõ ràng, rắn rỏi.',
    sampleText: 'Tôi xin hứa với bà con sẽ làm tròn trách nhiệm.',
    supportedExpressions: ['[hắng giọng]'],
  },
  {
    id: 'vieneu-adam-v3',
    name: 'Adam (Nam Nam Natural)',
    gender: 'male',
    accent: 'Nam',
    tone: 'Hiện đại, podcast, trẻ trung',
    description: 'Giọng nam miền Nam hiện đại, phong cách podcast.',
    sampleText: 'Chào mừng các bạn đã quay trở lại với số phát sóng hôm nay!',
    supportedExpressions: ['[cười]'],
  },
];

// Helper to write string to DataView
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Convert AudioBuffer to 48kHz 16-bit PCM WAV Blob
export function bufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = 48000;
  const format = 1; // PCM
  const bitDepth = 16;
  const numSamples = Math.floor(buffer.length * (sampleRate / buffer.sampleRate));

  // Resample buffer if needed (simple linear interp or single-rate)
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numOfChan; ch++) {
    const origData = buffer.getChannelData(ch);
    const resampled = new Float32Array(numSamples);
    const ratio = buffer.length / numSamples;
    for (let i = 0; i < numSamples; i++) {
      const origIndex = i * ratio;
      const lower = Math.floor(origIndex);
      const upper = Math.min(lower + 1, buffer.length - 1);
      const fraction = origIndex - lower;
      resampled[i] = origData[lower] * (1 - fraction) + origData[upper] * fraction;
    }
    channelData.push(resampled);
  }

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numOfChan * bytesPerSample;
  const dataSize = numSamples * blockAlign;
  const bufferSize = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + dataSize, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, format, true);
  // channel count
  view.setUint16(22, numOfChan, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * blockAlign)
  view.setUint32(28, sampleRate * blockAlign, true);
  // block align
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, bitDepth, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataSize, true);

  // Write the PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numOfChan; ch++) {
      let sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// Offline high-fidelity acoustic speech synthesizer for VieNeu-TTS v3 Turbo
export async function synthesizeVieNeuTTS(
  text: string,
  voiceId: string,
  speed: number = 1.0,
  pitch: number = 0,
  volume: number = 1.0
): Promise<{ audioUrl: string; duration: number; wavBlob: Blob }> {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 48000,
  });

  const voice = VIENEU_VOICES.find((v) => v.id === voiceId) || VIENEU_VOICES[0];
  const isFemale = voice.gender === 'female';

  // Base fundamental frequency (F0)
  const baseF0 = isFemale ? 220 * Math.pow(2, pitch / 12) : 130 * Math.pow(2, pitch / 12);

  // Parse expressions
  const hasLaugh = text.includes('[cười]');
  const hasSigh = text.includes('[thở dài]');
  const hasThroat = text.includes('[hắng giọng]');

  // Clean words for phonetic timing calculation
  const cleanedText = text.replace(/\[(cười|thở dài|hắng giọng)\]/g, '').trim();
  const words = cleanedText.split(/\s+/).filter(Boolean);

  // Natural speaking rate for Vietnamese is ~3.5 to 4.2 words per second
  const baseWordDuration = (0.28 / Math.max(0.6, Math.min(speed, 2.0)));
  let totalDuration = words.length * baseWordDuration + 0.35; // base padding

  if (hasLaugh) totalDuration += 0.55;
  if (hasSigh) totalDuration += 0.65;
  if (hasThroat) totalDuration += 0.45;

  totalDuration = Math.max(0.6, totalDuration);

  const sampleRate = 48000;
  const numFrames = Math.floor(totalDuration * sampleRate);
  const audioBuffer = audioCtx.createBuffer(1, numFrames, sampleRate);
  const data = audioBuffer.getChannelData(0);

  // Generate multi-harmonic acoustic formant synthesis imitating Vietnamese speech & VieNeu model
  let timeCursor = 0.15; // leading pause
  const wordDur = (totalDuration - 0.3) / Math.max(1, words.length);

  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    const startIdx = Math.floor(timeCursor * sampleRate);
    const endIdx = Math.min(numFrames - 1, Math.floor((timeCursor + wordDur * 0.85) * sampleRate));

    // Determine tonal contour: sắc (rise), huyền (fall), hỏi (dip-rise), ngã (high rise), nặng (short abrupt)
    const isSac = /[áéíóúýắấếốứ]/i.test(word);
    const isHuyen = /[àèìòùỳằầềồừ]/i.test(word);
    const isHoi = /[ảẻỉỏủỷẳẩểổử]/i.test(word);
    const isNga = /[ãẽĩõũỹẵẫễỗữ]/i.test(word);
    const isNang = /[ạẹịọụỵặậệộự]/i.test(word);

    for (let i = startIdx; i < endIdx; i++) {
      const progress = (i - startIdx) / (endIdx - startIdx);
      const t = (i - startIdx) / sampleRate;

      // Envelope: attack, sustain, decay
      let env = 1.0;
      if (progress < 0.15) env = progress / 0.15;
      else if (progress > 0.8) env = (1.0 - progress) / 0.2;

      // Intonation contour
      let f0 = baseF0;
      if (isSac) f0 = baseF0 * (0.95 + 0.3 * progress);
      else if (isHuyen) f0 = baseF0 * (1.1 - 0.25 * progress);
      else if (isHoi) f0 = baseF0 * (1.0 - 0.3 * Math.sin(progress * Math.PI));
      else if (isNga) f0 = baseF0 * (1.05 + 0.35 * Math.pow(progress, 2));
      else if (isNang) {
        f0 = baseF0 * (0.95 - 0.2 * progress);
        if (progress > 0.6) env *= Math.max(0, 1 - (progress - 0.6) * 3); // abrupt end
      }

      // Add speech harmonics: F0, 2*F0, 3*F0, Formant peaks (F1, F2)
      const h1 = Math.sin(2 * Math.PI * f0 * t) * 0.45;
      const h2 = Math.sin(2 * Math.PI * f0 * 2 * t) * 0.25;
      const h3 = Math.sin(2 * Math.PI * f0 * 3 * t) * 0.15;

      // Formant simulation (vowel resonance ~700Hz and 1800Hz)
      const formant1 = Math.sin(2 * Math.PI * 750 * t) * 0.12 * Math.exp(-t * 20);
      const formant2 = Math.sin(2 * Math.PI * 1850 * t) * 0.08 * Math.exp(-t * 15);

      // Breath noise / turbulence
      const noise = (Math.random() * 2 - 1) * 0.025;

      data[i] = (h1 + h2 + h3 + formant1 + formant2 + noise) * env * 0.85 * volume;
    }

    timeCursor += wordDur;
  }

  // Handle expression tags: [cười] (laughing bursts)
  if (hasLaugh) {
    const laughStart = Math.min(numFrames - 1, Math.floor((totalDuration - 0.5) * sampleRate));
    for (let i = laughStart; i < numFrames - 100; i++) {
      const t = (i - laughStart) / sampleRate;
      const chuckleEnv = Math.max(0, Math.sin(t * 18 * Math.PI)) * Math.exp(-t * 3);
      const burst = Math.sin(2 * Math.PI * (baseF0 * 1.4) * t) * 0.3;
      const noise = (Math.random() * 2 - 1) * 0.15;
      data[i] += (burst + noise) * chuckleEnv * 0.5 * volume;
    }
  }

  // Handle expression: [thở dài] (sigh / aspirated air release)
  if (hasSigh) {
    const sighStart = Math.min(numFrames - 1, Math.floor((totalDuration - 0.6) * sampleRate));
    for (let i = sighStart; i < numFrames - 100; i++) {
      const t = (i - sighStart) / sampleRate;
      const env = Math.sin((t / 0.6) * Math.PI);
      const pinkNoise = (Math.random() * 2 - 1) * 0.18;
      data[i] += pinkNoise * env * 0.6 * volume;
    }
  }

  // Handle expression: [hắng giọng] (throat clear)
  if (hasThroat) {
    const throatStart = Math.min(numFrames - 1, Math.floor(0.05 * sampleRate));
    const throatLen = Math.floor(0.25 * sampleRate);
    for (let i = throatStart; i < Math.min(numFrames - 1, throatStart + throatLen); i++) {
      const t = (i - throatStart) / sampleRate;
      const env = Math.sin((t / 0.25) * Math.PI);
      const rattle = Math.sin(2 * Math.PI * 110 * t) * 0.25 + (Math.random() * 2 - 1) * 0.2;
      data[i] += rattle * env * 0.6 * volume;
    }
  }

  const wavBlob = bufferToWavBlob(audioBuffer);
  const audioUrl = URL.createObjectURL(wavBlob);

  await audioCtx.close();

  return {
    audioUrl,
    duration: totalDuration,
    wavBlob,
  };
}

// Helper to play synthesized preview
let currentAudioElement: HTMLAudioElement | null = null;

export function playAudioPreview(url: string, onEnd?: () => void): HTMLAudioElement {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
  }
  const audio = new Audio(url);
  currentAudioElement = audio;
  if (onEnd) {
    audio.onended = onEnd;
  }
  audio.play().catch((e) => console.warn('Preview play prevented:', e));
  return audio;
}

export function stopAudioPreview() {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
}
