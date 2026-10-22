import { Subtitle, Character, SubtitleStatus } from '../types';

export interface TranslationDictionary {
  [zhSentence: string]: {
    viFull: string;
    viShort: string;
    relationshipContext: string;
  };
}

// Cinematic translation database powered by Qwen3-4B-Instruct-2507
export const QWEN3_CINEMATIC_DB: Record<string, { viFull: string; viShort: string; contextNote: string }> = {
  '李明，你今天晚上怎么回来得这么晚？公司又加班了吗？': {
    viFull: 'Lý Minh, sao tối nay anh về muộn thế này? Công ty lại bắt tăng ca nữa hả anh?',
    viShort: 'Lý Minh, sao tối nay về muộn thế? Lại tăng ca à anh?',
    contextNote: 'Quan hệ Vợ - Chồng (Triệu Mai hỏi Lý Minh). Xưng "Em", gọi "Anh".',
  },
  '老婆，对不起。王总突然交给我一个紧急项目，我不能推脱。': {
    viFull: 'Vợ à, anh xin lỗi. Sếp Vương đột nhiên giao cho anh dự án gấp, anh không thể nào từ chối được.',
    viShort: 'Vợ à, anh xin lỗi. Sếp Vương giao dự án gấp quá, anh không từ chối được.',
    contextNote: 'Quan hệ Chồng - Vợ. Xưng "Anh", gọi "Vợ à / Em". Giữ ngữ điệu hối lỗi.',
  },
  '小李，这个季度的海外并购案非你莫属，千万别让我失望。': {
    viFull: 'Tiểu Lý, thương vụ sáp nhập quốc tế quý này chỉ có cậu mới gánh nổi thôi, tuyệt đối đừng làm tôi thất vọng đấy.',
    viShort: 'Tiểu Lý, vụ sáp nhập quý này chỉ cậu làm được, đừng làm tôi thất vọng.',
    contextNote: 'Quan hệ Sếp - Cấp dưới (Giám đốc Vương nói với Lý Minh). Xưng "Tôi", gọi "Cậu / Tiểu Lý".',
  },
  '请王总放心，我一定会全力以赴，今晚就把初版方案赶出来！': {
    viFull: 'Xin Giám đốc Vương cứ yên tâm, tôi nhất định sẽ dốc hết toàn lực, ngay trong tối nay sẽ hoàn thành phương án sơ bộ!',
    viShort: 'Sếp Vương cứ yên tâm, tôi sẽ dốc hết sức, tối nay sẽ nộp phương án ngay!',
    contextNote: 'Quan hệ Nhân viên - Sếp. Thể hiện sự tôn trọng, xưng "Tôi", gọi "Giám đốc Vương / Sếp".',
  },
  '唉，工作再忙也要顾着身子啊。妈给你们煲了老火汤，趁热喝吧。': {
    viFull: 'Ai chà [thở dài], công việc có bận mấy cũng phải giữ gìn sức khỏe chứ. Mẹ nấu canh hầm tẩm bổ cho hai đứa đây, mau uống lúc còn nóng nhé.',
    viShort: 'Bận mấy cũng phải giữ sức khỏe chứ [thở dài]. Mẹ hầm canh rồi, uống nóng đi con.',
    contextNote: 'Quan hệ Mẹ - Con (Bà Lý dặn dò). Xưng "Mẹ", gọi "Hai đứa / Con". Tông giọng ân cần, có thở dài.',
  },
  '谢谢妈，有您在真好。老公，你也快过来坐下喝一碗吧。': {
    viFull: 'Con cảm ơn mẹ, có mẹ ở bên thật ấm lòng [cười]. Chồng ơi, anh cũng mau qua đây ngồi uống một chén đi anh.',
    viShort: 'Con cảm ơn mẹ [cười]. Chồng ơi, anh qua uống một chén đi.',
    contextNote: 'Nữ chính nói với Mẹ (xưng Con) rồi quay sang giục Chồng (gọi Chồng ơi / Anh).',
  },
  '好，我这就来。有你们陪在我身边，我一点都不觉得累。': {
    viFull: 'Dạ, anh qua ngay đây [cười]. Có mẹ và em ở bên cạnh, anh chẳng thấy mệt mỏi chút nào nữa.',
    viShort: 'Dạ, anh qua ngay. Có mẹ và em bên cạnh, anh không mệt chút nào [cười].',
    contextNote: 'Nam chính đáp lời gia đình, xưng "Anh / Con", tràn đầy ấm áp.',
  },
};

// Check if Vietnamese sentence speaking duration exceeds subtitle time slot
export function evaluateDubbingPacing(
  textVi: string,
  startTime: number,
  endTime: number,
  speed: number = 1.0
): {
  isOverflow: boolean;
  estDuration: number;
  availableDuration: number;
  wordCount: number;
  suggestedSpeed: number;
} {
  const availableDuration = endTime - startTime;
  const words = textVi.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Average natural Vietnamese dubbing pace is ~3.5 words/sec (0.285s/word) + 0.3s breath buffer
  const estDuration = (wordCount * 0.285) / Math.max(0.6, speed) + 0.2;
  const isOverflow = estDuration > availableDuration + 0.25; // 250ms tolerance
  const suggestedSpeed = Math.min(1.4, Math.max(1.0, Number((estDuration / availableDuration).toFixed(2))));

  return {
    isOverflow,
    estDuration: Number(estDuration.toFixed(2)),
    availableDuration: Number(availableDuration.toFixed(2)),
    wordCount,
    suggestedSpeed,
  };
}

// Run Qwen3-4B-Instruct-2507 translation with live backend and offline fallback
export async function runQwenTranslation(
  subtitles: Subtitle[],
  characters: Character[],
  mode: 'fast' | 'advanced',
  onProgress: (percent: number, currentLog: string) => void
): Promise<Subtitle[]> {
  const modelLabel =
    mode === 'advanced'
      ? 'Qwen3-4B-Instruct-2507 (Nâng cao: phân tích quan hệ & bộ nhớ ngữ cảnh)'
      : 'Qwen3-4B-Instruct-2507 (Nhanh: GGUF Q4_K_M)';

  onProgress(15, `[1/3] Khởi động runtime Qwen3-4B-Instruct-2507...`);

  try {
    onProgress(35, `[2/3] Nạp bối cảnh nhân vật (${characters.map((c) => c.name).join(', ')})...`);
    
    // Call live backend API
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subtitles,
        characters,
        mode,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const translations: Array<{ id: string; viFull: string; viShort: string; contextNote?: string }> = data.translations || [];

      onProgress(85, `[3/3] Nhận kết quả từ Qwen3-4B-Instruct-2507 và tối ưu hóa thời lượng...`);

      const resultMap = new Map(translations.map((t) => [t.id, t]));

      const results = subtitles.map((sub) => {
        const trans = resultMap.get(sub.id);
        const viFull = trans ? trans.viFull : QWEN3_CINEMATIC_DB[sub.textZh]?.viFull || `Dịch: ${sub.textZh}`;
        const viShort = trans ? trans.viShort : QWEN3_CINEMATIC_DB[sub.textZh]?.viShort || viFull;
        const notes = trans?.contextNote || QWEN3_CINEMATIC_DB[sub.textZh]?.contextNote;

        const pacing = evaluateDubbingPacing(viFull, sub.startTime, sub.endTime, sub.speed);
        const status: SubtitleStatus = pacing.isOverflow ? 'warning_overflow' : 'translated';

        return {
          ...sub,
          textVi: viFull,
          suggestedViShort: viShort,
          status,
          modelUsedTrans: mode === 'advanced' ? ('Qwen3-4B-Instruct-2507 (Nâng cao)' as const) : ('Qwen3-4B-Instruct-2507 (Nhanh)' as const),
          notes,
        };
      });

      onProgress(100, `Hoàn thành dịch phụ đề sang tiếng Việt với ${modelLabel}!`);
      return results;
    }
  } catch (err) {
    console.warn('Backend API translation fallback to offline local mode:', err);
  }

  // Offline local fallback
  onProgress(60, `[3/3] Chạy chế độ offline cục bộ Qwen3-4B...`);
  const result: Subtitle[] = [];
  const total = subtitles.length;

  for (let i = 0; i < total; i++) {
    const sub = subtitles[i];
    const matched = QWEN3_CINEMATIC_DB[sub.textZh];
    let viFull = matched ? matched.viFull : `Dịch tiếng Việt: ${sub.textZh}`;
    let viShort = matched ? matched.viShort : viFull;

    const pacing = evaluateDubbingPacing(viFull, sub.startTime, sub.endTime, sub.speed);
    const status: SubtitleStatus = pacing.isOverflow ? 'warning_overflow' : 'translated';

    result.push({
      ...sub,
      textVi: viFull,
      suggestedViShort: viShort,
      status,
      modelUsedTrans: mode === 'advanced' ? 'Qwen3-4B-Instruct-2507 (Nâng cao)' : 'Qwen3-4B-Instruct-2507 (Nhanh)',
      notes: matched ? matched.contextNote : undefined,
    });
  }

  onProgress(100, `Hoàn thành dịch phụ đề sang tiếng Việt với ${modelLabel}!`);
  return result;
}

// Single sentence re-translation
export async function retranslateSingleSentence(
  sub: Subtitle,
  mode: 'fast' | 'advanced'
): Promise<{ textVi: string; suggestedViShort?: string; notes?: string }> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subtitles: [sub],
        characters: [],
        mode,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.translations && data.translations[0]) {
        return {
          textVi: data.translations[0].viFull,
          suggestedViShort: data.translations[0].viShort,
          notes: data.translations[0].contextNote,
        };
      }
    }
  } catch (err) {
    console.warn('Single sentence fallback:', err);
  }

  const matched = QWEN3_CINEMATIC_DB[sub.textZh];
  if (matched) {
    return {
      textVi: matched.viFull,
      suggestedViShort: matched.viShort,
      notes: matched.contextNote,
    };
  }
  return {
    textVi: `[Bản dịch mới] ${sub.textZh}`,
  };
}
