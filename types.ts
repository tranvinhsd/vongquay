
export interface Student {
    id: string;
    name: string;
    selected: boolean;
}

export interface Question {
    id: string;
    text: string;
    used: boolean;
}

export interface HistoryRecord {
    id: string;
    studentName: string; // Sẽ lưu danh sách tên nhóm cách nhau bởi dấu phẩy
    score: number;
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
