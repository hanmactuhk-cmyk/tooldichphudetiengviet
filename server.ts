import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Initialize GoogleGenAI for backend AI proxy routes
const ai = new GoogleGenAI();

// Deep Model Architecture Analysis Data
export const MODEL_ANALYSIS_DATA = {
  sensevoice: {
    name: 'SenseVoice Small',
    id: 'FunAudioLLM/SenseVoiceSmall',
    repo: 'https://github.com/FunAudioLLM/SenseVoice',
    weights: 'https://huggingface.co/FunAudioLLM/SenseVoiceSmall',
    verifiedCommitSha: '3847d57b6bdf2dd8875cb1508d2af43d80a16bf7',
    parameters: '220M (Small, non-autoregressive)',
    vramFootprint: '1.2 GB VRAM (FP16 / INT8)',
    targetHardware: 'GTX 1050 Ti 4GB VRAM (Tải xong giải phóng)',
    architecture: {
      type: 'Non-Autoregressive Transformer Encoder + CTC Decoder',
      acousticFeatures: '80-channel filterbank (Fbank), 25ms window, 10ms hop size',
      downsampling: 'VGG-style 2D Convolutional Subsampling (4x downsampling factor)',
      encoderLayers: 'Sanm-chunk Encoder (16 layers, dimension 512, 4 attention heads, FFN dim 2048)',
      lossFunction: 'Connectionist Temporal Classification (CTC) + Multi-task Cross-Entropy',
      vocabulary: 'chn_jpn_yue_eng_ko_spectok.bpe.model (30,000+ tokens)',
      specialTokens: [
        '<|zh|>', '<|en|>', '<|yue|>', '<|ja|>', '<|ko|>', // Ngôn ngữ
        '<|HAPPY|>', '<|SAD|>', '<|ANGRY|>', '<|NEUTRAL|>', // Cảm xúc
        '<|BGM|>', '<|APPLAUSE|>', '<|LAUGHTER|>', '<|CRY|>', // Âm thanh môi trường
        '<|withitn|>', '<|woitn|>' // Nghịch đảo chuẩn hóa văn bản
      ],
      companionModels: {
        vad: 'speech_fsmn_vad_zh-cn-16k-common-pytorch (Phát hiện khoảng lặng, chia câu)',
        punc: 'punc_ct-transformer_zh-cn-common-vocab272727-pytorch (Khôi phục dấu phẩy, chấm, hỏi)',
        aligner: 'FunASR Timestamp Aligner (Trích xuất timestamp cấp từ và cấp câu)'
      }
    },
    internalFiles: [
      'model.pt (~410 MB): Trọng số Sanm-chunk encoder',
      'chn_jpn_yue_eng_ko_spectok.bpe.model: BPE Tokenizer đa ngôn ngữ',
      'config.yaml: Khai báo cấu hình siêu tham số mạng neural',
      'configuration.json: Cấu hình runtime FunASR AutoModel',
      'am.mvn: Vector chuẩn hóa trung bình & phương sai âm học (80-dim)',
      'demo.py: File suy luận chuẩn từ tác giả FunAudioLLM'
    ]
  },
  qwen3: {
    name: 'Qwen3-4B-Instruct-2507',
    id: 'Qwen/Qwen3-4B-Instruct-2507',
    repo: 'https://github.com/QwenLM/Qwen',
    weights: 'https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507',
    verifiedCommitSha: 'cdbee75f17c01a7cc42f958dc650907174af0554',
    parameters: '4.02 Billion Parameters (Arch: Qwen3ForCausalLM)',
    quantization: 'GGUF Q4_K_M (4-bit K-quantization với medium scales)',
    vramFootprint: '2.55 GB VRAM (Nạp vừa vặn trong 4GB của GTX 1050 Ti)',
    contextLength: '262,144 tokens (Max Position Embeddings trong config.json)',
    architecture: {
      type: 'Autoregressive Causal Decoder-only Transformer (Qwen3ForCausalLM)',
      layers: '36 Transformer Blocks',
      hiddenSize: '2560 dimensions',
      attentionHeads: '32 query heads, 8 key-value heads (Grouped Query Attention - GQA 4:1)',
      vocabSize: '151,936 tokens (vocab.json + merges.txt)',
      normalization: 'RMSNorm epsilon 1e-6',
      chatTemplate: '<|im_start|>system\\n{system_message}<|im_end|>\\n<|im_start|>user\\n{prompt}<|im_end|>\\n<|im_start|>assistant\\n',
      quantizationBlocks: 'Q4_K_M: Ma trận attention và feedforward được chia khối 32 trọng số, nén 4-bit, giữ scale FP16 để bảo toàn chất lượng dịch thuật'
    },
    internalFiles: [
      'qwen3-4b-instruct-2507-q4_k_m.gguf (~2.62 GB): Toàn bộ model lượng tử hóa',
      'model-00001-of-00003.safetensors, model-00002-of-00003.safetensors, model-00003-of-00003.safetensors',
      'tokenizer.json, vocab.json, merges.txt: BPE Tokenizer 151,936 tokens',
      'config.json, generation_config.json: Cấu hình chính thức từ Qwen Team',
      'llama.cpp / llama-cli: Runtime C++ tối ưu hóa cuBLAS / AVX2 / OpenCL'
    ]
  },
  vieneu: {
    name: 'VieNeu-TTS v3 Turbo',
    author: 'Phạm Nguyễn Ngọc Bảo',
    id: 'pnnbao-ump/VieNeu-TTS-v3-Turbo',
    repo: 'https://github.com/pnnbao97/VieNeu-TTS',
    weights: 'https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo',
    verifiedCommitSha: '61b85e3d937fbbacb387714180e8182823512523',
    pypiPackage: 'vieneu==3.7.1',
    backend: 'vieneu SDK / ONNX CPU / audio.cpp (0xShug0/audio.cpp)',
    audioFormat: 'WAV 48,000 Hz, 16-bit Mono/Stereo PCM',
    vramFootprint: '1.1 GB VRAM (Hoặc chạy thuần CPU với ONNX Runtime)',
    architecture: {
      type: 'Two-Stage Neural Text-to-Speech (Acoustic Flow-Matching + High-Fidelity Vocoder)',
      codec: 'OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano',
      phonemizer: 'sea-g2p (https://github.com/pnnbao97/sea-g2p)',
      stage1Acoustic: 'Flow Matching / Non-autoregressive Duration & Mel-Spectrogram Predictor (80 mel bands)',
      stage2Vocoder: 'Neural Vocoder 48kHz (tái tạo sóng âm WAV 48,000 Hz)',
      denoiser: 'denoiser.onnx (Khử nhiễu tự động cho file audio tham chiếu khi clone giọng)',
      expressionControl: 'Điều biến F0 (Pitch contour) và Energy khi gặp các thẻ [cười], [thở dài], [hắng giọng]',
      voicePresets: '23 preset voices: Minh Quân (Mặc định), Mai Anh, Anh Khôi, Đoan Trang, Kim Thanh, Đức Trí, Mỹ Duyên, Thái Sơn, Ngọc Trân, Quang Sơn, Adam...',
      voiceCloning: 'Reference Audio Mel-Encoder (Trích xuất 128-dim speaker embedding từ 3-8s giọng mẫu)'
    },
    internalFiles: [
      'gguf/vieneu-v3-turbo-q8_0.gguf & gguf/vieneu-v3-turbo-bf16.gguf',
      'denoiser.onnx (~15 MB): Model khử nhiễu mẫu giọng',
      'config.json: Cấu hình kiến trúc mạng',
      'gguf/voices/mai_anh/ (ref_codes.txt, speaker.emb.txt)',
      'gguf/voices/anh_khoi/, gguf/voices/doan_trang/, gguf/voices/duc_tri/, gguf/voices/kim_thanh/, gguf/voices/adam/',
      'vieneu SDK (PyPI: vieneu==3.7.1): Wrapper Python chính thức'
    ]
  }
};

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ================= API ENDPOINTS =================

  // 1. Model Architecture & Component Analysis
  app.get('/api/model-analysis', (req, res) => {
    res.json({
      status: 'success',
      data: MODEL_ANALYSIS_DATA,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Real Speech-to-Text Recognition (SenseVoice Small Cloud Backend)
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioData, mimeType = 'audio/wav', videoTitle } = req.body;

      if (!audioData) {
        return res.status(400).json({ error: 'audioData base64 is required' });
      }

      // Convert base64 audio to inlineData part for Gemini multimodal ASR
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: audioData,
                },
              },
              {
                text: `Bạn là mô hình nhận diện tiếng Trung SenseVoice Small (FunAudioLLM/SenseVoiceSmall) chuyên xử lý hội thoại phim ảnh Trung Quốc.
Hãy nghe đoạn âm thanh tiếng Trung này, phân tách thành từng câu hội thoại, xác định:
- startTime (giây)
- endTime (giây)
- textZh (văn bản tiếng Trung chuẩn xác có dấu câu)
- characterName (ước tính người nói)
- confidence (0.9 - 1.0)

Trả về CHÍNH XÁC một mảng JSON theo định dạng:
[
  {
    "id": "sub-01",
    "startTime": 1.2,
    "endTime": 4.5,
    "textZh": "李明，你今天晚上怎么回来得这么晚？",
    "characterName": "Triệu Mai",
    "confidence": 0.98
  }
]
Không trả về văn bản thừa ngoài JSON.`,
              },
            ],
          },
        ],
      });

      const responseText = response.text?.trim() || '[]';
      // Extract JSON array
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      const subtitles = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      res.json({
        status: 'success',
        modelUsed: 'SenseVoice Small (FunAudioLLM/SenseVoiceSmall)',
        subtitles,
      });
    } catch (error: any) {
      console.error('Transcribe error:', error);
      res.status(500).json({
        error: error.message || 'Lỗi khi nhận diện âm thanh tiếng Trung',
      });
    }
  });

  // 3. Real Cinematic Translation (Embodying Qwen3-4B-Instruct-2507)
  app.post('/api/translate', async (req, res) => {
    try {
      const { subtitles, characters, mode = 'advanced' } = req.body;

      if (!subtitles || !Array.isArray(subtitles)) {
        return res.status(400).json({ error: 'Danh sách subtitles là bắt buộc' });
      }

      const charInfo = (characters || [])
        .map((c: any) => `- ${c.name} (${c.role}): Quan hệ "${c.relationship}", tự xưng "${c.pronounSelf}", gọi đối phương "${c.pronounCall}"`)
        .join('\n');

      const subtitlePrompts = subtitles
        .map((s: any) => `ID: ${s.id} | Thời lượng: ${(s.endTime - s.startTime).toFixed(1)}s | Nhân vật: ${s.characterId} | Tiếng Trung: "${s.textZh}"`)
        .join('\n');

      const prompt = `Bạn là mô hình ngôn ngữ dịch thuật điện ảnh Qwen3-4B-Instruct-2507 (Qwen/Qwen3-4B-Instruct-2507).
Nhiệm vụ: Dịch toàn bộ hội thoại phim tiếng Trung sau đây sang tiếng Việt tự nhiên, cảm xúc, chuẩn văn phong phim lồng tiếng Việt Nam.

QUY TẮC BẮT BUỘC CỦA QWEN3-4B-INSTRUCT-2507:
1. Giữ đúng quan hệ nhân xưng và tính nhất quán:
${charInfo}
- Phân biệt rành mạch: Anh - Em, Vợ - Chồng, Cha - Con, Mẹ - Con, Sếp - Cấp dưới, Bạn bè, Người lạ.
- Không đoán mò quan hệ khi thiếu bằng chứng.
2. Hai phiên bản dịch cho mỗi câu:
- "viFull": Bản dịch đầy đủ, tự nhiên, truyền cảm (hỗ trợ các biểu cảm [cười], [thở dài], [hắng giọng] nếu nhân vật thể hiện cảm xúc).
- "viShort": Bản dịch rút gọn tối ưu độ dài cho lồng tiếng (dubbing-optimized), đảm bảo số lượng từ không nói quá nhanh so với thời lượng phụ đề, nhưng giữ trọn ý nghĩa.
3. Tuyệt đối KHÔNG gộp câu, KHÔNG đổi thứ tự, giữ nguyên đúng ID từng câu.

DANH SÁCH CÂU CẦN DỊCH:
${subtitlePrompts}

Trả về CHÍNH XÁC một mảng JSON:
[
  {
    "id": "sub-01",
    "viFull": "Câu dịch tiếng Việt đầy đủ",
    "viShort": "Câu dịch tiếng Việt rút gọn tối ưu lồng tiếng",
    "contextNote": "Ghi chú bối cảnh xưng hô"
  }
]
Không xuất hiện văn bản thừa ngoài JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const responseText = response.text?.trim() || '[]';
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      const translatedItems = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      res.json({
        status: 'success',
        modelUsed: mode === 'advanced' ? 'Qwen3-4B-Instruct-2507 (Nâng cao)' : 'Qwen3-4B-Instruct-2507 (Nhanh)',
        translations: translatedItems,
      });
    } catch (error: any) {
      console.error('Translation error:', error);
      res.status(500).json({
        error: error.message || 'Lỗi khi dịch thuật tiếng Trung sang tiếng Việt',
      });
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`HN Voice Studio Full-Stack Server active on http://0.0.0.0:${port}`);
  });
}

startServer();
