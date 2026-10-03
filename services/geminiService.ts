import { GoogleGenAI } from "@google/genai";

export interface ParsedQuestion {
    prompt: string;
    options: [string, string, string, string]; // Exactly 4 options: A, B, C, D
    originalCorrectIndex: number;              // 0: A, 1: B, 2: C, 3: D
}

export interface BalanceResult {
    formattedQuestions: string[];
    count: number;
    distribution: {
        A: number;
        B: number;
        C: number;
        D: number;
    };
}

/**
 * Fisher-Yates array shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Tách nội dung văn bản thành các khối câu hỏi riêng biệt
 */
export function splitIntoQuestionBlocks(text: string): string[] {
    // Xóa các khối code markdown nếu có
    const cleaned = text
        .replace(/```(?:markdown|text)?/gi, '')
        .replace(/```/g, '')
        .trim();

    const rawBlocks = cleaned.split(/\n\s*\n/);
    const result: string[] = [];

    for (const block of rawBlocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;

        // Nếu trong 1 block chứa nhiều câu "Câu X:" thì tách tiếp
        const subMatches = [...trimmed.matchAll(/(?:^|\n)\s*(?:Câu\s+\d+|\d+\.)[:.]/gi)];
        if (subMatches.length > 1) {
            const subBlocks = trimmed.split(/(?=(?:^|\n)\s*(?:Câu\s+\d+|\d+\.)[:.])/i);
            for (const sb of subBlocks) {
                if (sb.trim()) result.push(sb.trim());
            }
        } else {
            result.push(trimmed);
        }
    }

    return result;
}

/**
 * Phân tích và kiểm tra tính hợp lệ của từng khối câu hỏi
 * Đảm bảo:
 * 1. Nội dung câu hỏi rõ ràng
 * 2. Có đủ 4 phương án A, B, C, D
 * 3. Xác định chính xác đáp án đúng
 */
export function parseQuestionBlock(block: string): ParsedQuestion | null {
    const rawLines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (rawLines.length < 5) return null;

    // Tìm dòng đáp án (thường ở cuối)
    let answerLineIndex = -1;
    let answerText = "";

    for (let i = rawLines.length - 1; i >= 0; i--) {
        const line = rawLines[i].replace(/^\*+|\*+$/g, '').trim();
        if (/^(?:đáp án|đáp án đúng|câu trả lời đúng|answer|key)\s*[:：\-]/i.test(line) ||
            /^đáp án\b/i.test(line)) {
            answerLineIndex = i;
            answerText = line.replace(/^(?:đáp án|đáp án đúng|câu trả lời đúng|answer|key)\s*[:：\-]?\s*/i, '').trim();
            break;
        }
    }

    if (answerLineIndex === -1) {
        return null;
    }

    // Các dòng nội dung ngoại trừ dòng đáp án
    const contentLines = rawLines.filter((_, idx) => idx !== answerLineIndex);

    // Trích xuất các phương án A, B, C, D
    const optLetters = ['A', 'B', 'C', 'D'];
    const optionMatches: { letter: string; lineIndex: number; text: string }[] = [];

    contentLines.forEach((line, idx) => {
        const cleanLine = line.replace(/^\*+|\*+$/g, '').trim();
        const match = cleanLine.match(/^(?:\[|\()?\s*([A-D])\s*(?:\]|\))?[.:\-]\s*(.*)$/i) ||
                      cleanLine.match(/^([A-D])\s+[.:\-]?\s*(.*)$/i);
        if (match) {
            const letter = match[1].toUpperCase();
            optionMatches.push({
                letter,
                lineIndex: idx,
                text: match[2].replace(/^\*+|\*+$/g, '').trim()
            });
        }
    });

    if (optionMatches.length < 4) {
        return null;
    }

    const optA = optionMatches.find(o => o.letter === 'A');
    const optB = optionMatches.find(o => o.letter === 'B');
    const optC = optionMatches.find(o => o.letter === 'C');
    const optD = optionMatches.find(o => o.letter === 'D');

    if (!optA || !optB || !optC || !optD) {
        return null;
    }

    // Lấy câu hỏi: toàn bộ phần trước phương án đầu tiên
    const firstOptLineIndex = Math.min(optA.lineIndex, optB.lineIndex, optC.lineIndex, optD.lineIndex);
    let promptLines = contentLines.slice(0, firstOptLineIndex);
    let prompt = promptLines.join(' ').replace(/^\*+|\*+$/g, '').trim();

    // Chuẩn hóa, bỏ tiền tố "Câu X:" hoặc "1." nếu có
    prompt = prompt.replace(/^(?:câu|question)\s*\d+[\s:.-]*/i, '')
                   .replace(/^\d+[\s:.-]*/, '')
                   .trim();

    if (!prompt || prompt.length < 3) {
        return null;
    }

    // Xác định chỉ số phương án đúng ban đầu (0: A, 1: B, 2: C, 3: D)
    let originalCorrectIndex = -1;
    const cleanAnswerText = answerText.replace(/^\*+|\*+$/g, '').trim();

    // 1. Kiểm tra chữ cái trực tiếp trong đáp án (ví dụ "A", "A. Hà Nội", "[A]")
    const letterMatch = cleanAnswerText.match(/\b([A-D])\b/i) || cleanAnswerText.match(/^([A-D])[.):\s-]/i);
    if (letterMatch) {
        originalCorrectIndex = optLetters.indexOf(letterMatch[1].toUpperCase());
    } else {
        // 2. Dự phòng: so sánh nội dung đáp án với nội dung từng phương án
        const lowerAns = cleanAnswerText.toLowerCase();
        const optionsList = [optA.text, optB.text, optC.text, optD.text];
        for (let j = 0; j < 4; j++) {
            const optLower = optionsList[j].toLowerCase();
            if (optLower && (lowerAns === optLower || lowerAns.includes(optLower) || optLower.includes(lowerAns))) {
                originalCorrectIndex = j;
                break;
            }
        }
    }

    if (originalCorrectIndex < 0 || originalCorrectIndex > 3) {
        return null;
    }

    const options: [string, string, string, string] = [
        optA.text,
        optB.text,
        optC.text,
        optD.text
    ];

    // Đảm bảo không phương án nào bị rỗng
    if (options.some(o => !o || o.trim().length === 0)) {
        return null;
    }

    return {
        prompt,
        options,
        originalCorrectIndex
    };
}

/**
 * Thực hiện kiểm tra, hoán vị phương án trả lời và đáp án đúng
 * Đảm bảo mỗi phương án đúng A, B, C, D đạt tỉ lệ đồng đều 25%
 */
export function balanceAndPermuteQuestions(
    rawQuestions: string[],
    targetCount?: number,
    startNumber: number = 1
): BalanceResult {
    // 1. Phân tích và lọc các câu hỏi đạt chuẩn
    const parsedQuestions: ParsedQuestion[] = [];
    for (const raw of rawQuestions) {
        const parsed = parseQuestionBlock(raw);
        if (parsed) {
            parsedQuestions.push(parsed);
        }
    }

    // Giới hạn số lượng nếu có targetCount
    const selectedQuestions = targetCount && targetCount > 0 
        ? parsedQuestions.slice(0, targetCount) 
        : parsedQuestions;

    const n = selectedQuestions.length;
    if (n === 0) {
        return {
            formattedQuestions: [],
            count: 0,
            distribution: { A: 0, B: 0, C: 0, D: 0 }
        };
    }

    // 2. Tạo danh sách đáp án mục tiêu đảm bảo tỉ lệ 25% cho A, B, C, D
    const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const baseCount = Math.floor(n / 4);
    const remainder = n % 4;

    const targetList: ('A' | 'B' | 'C' | 'D')[] = [];
    for (const letter of letters) {
        for (let i = 0; i < baseCount; i++) {
            targetList.push(letter);
        }
    }

    // Phân bổ phần dư (nếu có) ngẫu nhiên cho các phương án khác nhau
    if (remainder > 0) {
        const extraLetters = shuffleArray([...letters]).slice(0, remainder);
        for (const extra of extraLetters) {
            targetList.push(extra);
        }
    }

    // Trộn ngẫu nhiên vị trí các đáp án mục tiêu để thứ tự xuất hiện không đoán trước được
    const shuffledTargets = shuffleArray(targetList);

    // 3. Hoán vị phương án và thiết lập lại đáp án đúng
    const formattedQuestions: string[] = [];
    const distribution = { A: 0, B: 0, C: 0, D: 0 };

    for (let i = 0; i < n; i++) {
        const q = selectedQuestions[i];
        const targetLetter = shuffledTargets[i];
        const targetIndex = letters.indexOf(targetLetter); // 0: A, 1: B, 2: C, 3: D

        distribution[targetLetter]++;

        const correctOptionText = q.options[q.originalCorrectIndex];
        const distractorOptions = q.options.filter((_, idx) => idx !== q.originalCorrectIndex);

        // Trộn ngẫu nhiên 3 phương án nhiễu
        const shuffledDistractors = shuffleArray(distractorOptions);

        const newOptions: string[] = new Array(4);
        newOptions[targetIndex] = correctOptionText;

        let dIdx = 0;
        for (let pos = 0; pos < 4; pos++) {
            if (pos !== targetIndex) {
                newOptions[pos] = shuffledDistractors[dIdx++];
            }
        }

        const formatted = [
            `Câu ${startNumber + i}: ${q.prompt}`,
            `A. ${newOptions[0]}`,
            `B. ${newOptions[1]}`,
            `C. ${newOptions[2]}`,
            `D. ${newOptions[3]}`,
            `Đáp án: ${targetLetter}`
        ].join('\n');

        formattedQuestions.push(formatted);
    }

    return {
        formattedQuestions,
        count: n,
        distribution
    };
}

/**
 * Tiện ích hoán vị và cân bằng 25% cho danh sách câu hỏi dạng văn bản
 */
export function balanceAndPermuteQuestionsText(
    text: string,
    startNumber: number = 1
): { formattedText: string; count: number; distribution: { A: number; B: number; C: number; D: number } } {
    const blocks = splitIntoQuestionBlocks(text);
    const result = balanceAndPermuteQuestions(blocks, undefined, startNumber);
    return {
        formattedText: result.formattedQuestions.join('\n\n'),
        count: result.count,
        distribution: result.distribution
    };
}

/**
 * Tạo câu hỏi bằng AI:
 * - Gửi prompt chất lượng cao
 * - Kiểm tra lại nội dung, phương án và đáp án đúng
 * - Hoán vị phương án và đáp án để đạt tỉ lệ 25% mỗi phương án A, B, C, D
 */
export const generateQuestions = async (
    topic: string, 
    count: number = 5, 
    startNumber: number = 1, 
    existingContext: string = ""
): Promise<string[]> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);
    
    if (!apiKey) {
        console.warn("API Key is missing for Gemini");
        return [];
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Yêu cầu AI tạo dư thêm một số câu để sau khi lọc câu hỏi chuẩn, luôn có đủ số lượng count yêu cầu
        const requestCount = Math.max(count + 5, Math.ceil(count * 1.15));

        const prompt = `Bạn là chuyên gia giáo dục phụ trách soạn đề trắc nghiệm chuẩn mực cho học sinh.
Hãy tạo danh sách gồm ĐÚNG ${requestCount} câu hỏi trắc nghiệm về chủ đề "${topic}".

YÊU CẦU KIỂM TRA CHẤT LƯỢNG NGHIÊM NGẶT TRƯỚC KHI XUẤT:
1. Nội dung câu hỏi: rõ ràng, ngắn gọn, chuẩn xác về mặt kiến thức, đúng thuần phong mỹ tục và sư phạm.
2. Phương án trả lời: mỗi câu hỏi BẮT BUỘC có ĐÚNG 4 phương án A, B, C, D riêng biệt, không được trùng lặp nội dung.
3. Đáp án đúng: mỗi câu hỏi CHỈ CÓ DUY NHẤT 1 phương án chính xác tuyệt đối. Ghi rõ ràng ở dòng đáp án.
4. Đảm bảo phân bổ đều các đáp án A, B, C, D.

Định dạng BẮT BUỘC cho mỗi câu hỏi như sau (không dùng định dạng Markdown, không in đậm, không thêm số lạ):

Câu [số]: [Nội dung câu hỏi]
A. [Phương án 1]
B. [Phương án 2]
C. [Phương án 3]
D. [Phương án 4]
Đáp án: [A hoặc B hoặc C hoặc D]

LƯU Ý QUAN TRỌNG:
- Bắt đầu đánh số thứ tự câu hỏi từ ${startNumber}.
- Mỗi câu hỏi cách nhau bởi đúng một dòng trống.
- Không thêm lời mở đầu hay kết luận, chỉ xuất các câu hỏi theo đúng định dạng.
- TUYỆT ĐỐI KHÔNG trùng lặp với các câu hỏi đã có dưới đây:
---
${existingContext || "Chưa có câu hỏi nào."}
---
Hãy tạo các câu hỏi chất lượng cao, đa dạng và sáng tạo!`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: prompt,
        });

        const text = response.text || "";
        const blocks = splitIntoQuestionBlocks(text);

        // Kiểm tra chất lượng, lọc câu đạt chuẩn và hoán vị phương án đảm bảo tỉ lệ 25%
        const result = balanceAndPermuteQuestions(blocks, count, startNumber);

        console.log(`[AI Question Generator] Generated & Validated ${result.count} questions. Distribution:`, result.distribution);

        return result.formattedQuestions;
    } catch (error) {
        console.error("Error generating questions:", error);
        return [];
    }
};
