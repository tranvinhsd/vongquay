
import { GoogleGenAI } from "@google/genai";

export const generateQuestions = async (topic: string, count: number = 5, startNumber: number = 1, existingContext: string = "") => {
    if (!process.env.API_KEY) {
        console.warn("API Key is missing for Gemini");
        return [];
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Tạo prompt yêu cầu AI tạo câu hỏi không trùng lặp
        const prompt = `Tạo danh sách gồm ĐÚNG ${count} câu hỏi trắc nghiệm về chủ đề "${topic}" dành cho học sinh.
        Định dạng BẮT BUỘC cho mỗi câu hỏi như sau (không dùng định dạng Markdown, không in đậm):
        
        Câu [số thứ tự]: [Nội dung câu hỏi]
        A. [Lựa chọn 1]
        B. [Lựa chọn 2]
        C. [Lựa chọn 3]
        D. [Lựa chọn 4]
        Đáp án: [Đáp án đúng]

        LƯU Ý QUAN TRỌNG: 
        1. Bắt đầu đánh số thứ tự câu hỏi từ số ${startNumber}. Ví dụ: Câu ${startNumber}: ..., Câu ${startNumber + 1}: ...
        2. Mỗi câu hỏi cách nhau bởi một dòng trống. 
        3. Không thêm lời dẫn, chỉ xuất danh sách câu hỏi. 
        4. Đảm bảo số lượng câu hỏi là chính xác ${count} câu.
        5. TUYỆT ĐỐI KHÔNG trùng lặp với các câu hỏi hiện có sau đây:
        ---
        ${existingContext || "Chưa có câu hỏi nào."}
        ---
        Hãy tạo các câu hỏi mới lạ, sáng tạo và đa dạng về nội dung trong chủ đề "${topic}".`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: prompt,
        });

        const text = response.text || "";
        // Tách theo dòng trống để lấy từng khối câu hỏi
        return text.split(/\n\s*\n/).map(q => q.trim()).filter(q => q.length > 0);
    } catch (error) {
        console.error("Error generating questions:", error);
        return [];
    }
};
