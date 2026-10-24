
export interface Student {
    id: string;
    name: string;
    selected: boolean;
    priority?: boolean; // Tăng trọng số ưu tiên khi quay (dành cho học sinh ít được chọn)
    weight?: number;    // Trọng số (mặc định 1 nếu không ưu tiên, 5 nếu ưu tiên)
}

export interface Question {
    id: string;
    text: string;
    used: boolean;
}

export interface HistoryRecord {
    id: string;
    studentName: string; // Sẽ lưu danh sách tên nhóm cách nhau bởi dấu phẩy
    score: number; // Điểm quy đổi theo thang điểm 10 (làm tròn đến 0.5)
    correctCount?: number; // Số câu trả lời đúng
    totalQuestions: number;
    timestamp: number;
}

export interface ClassData {
    id: string;
    name: string;
    students: string;
    questions: string;
    timePerQuestion: number;
    studentsPerGroup?: number;
    questionsPerTurn?: number;
    prioritizedStudents?: string[]; // Danh sách tên học sinh được ưu tiên
}

export enum GameState {
    IDLE = 'IDLE',
    SPINNING = 'SPINNING',
    ANNOUNCE = 'ANNOUNCE',
    RESULT = 'RESULT',
    CONFIG = 'CONFIG',
    GAME_OVER = 'GAME_OVER'
}

export const QUESTIONS_PER_TURN = 10;
export const POINTS_PER_QUESTION = 1; // Điều chỉnh điểm mỗi câu (10 câu = 10 điểm)

export const DEFAULT_STUDENTS = [];

export const DEFAULT_QUESTIONS = [];
