
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

export const DEFAULT_STUDENTS = [
    "Nguyễn Bảo An", "Bùi Hoàng Anh", "Lã Vũ Diệp Anh", "Vũ Quỳnh Anh", "Ngô Hoàng Bách",
    "Hoàng Kim Chi", "Bùi Chí Công", "Hoàng Chí Công", "Đàm Ngọc Diệp", "Đàm Ái Dung",
    "Đỗ Đại Dương", "Lương Thị Thùy Dương", "Giáp Lộc Linh Đan", "Hoàng Tuyết Giang", "Hoàng Mai Hân",
    "Hoàng Mạnh Hùng", "Dương Gia Khánh", "Nông Bảo Khánh", "Hoàng Minh Khôi", "Đỗ Trung Kiên",
    "Trần Hoàng Lâm", "Lê Ngọc Gia Linh", "Tạ Hoàng Long", "Nông Thi Thảo Ly", "Phạm Thảo Ly",
    "Tạ Thị Thảo Ly", "Ngọc Thiên Mỹ", "Giáp Anh Ngọc", "Ngụy Hải Phong", "Nguyễn Diệp Phương",
    "Hoàng Phương Thảo", "Trần Xuân Thắng", "Luyện Yến Trang", "Vy Thi Bảo Trâm", "Nguyễn Phương Tú",
    "Vũ An Tường", "Nguyễn Thảo Uyên", "Hoàng Cẩm Vân", "Vũ Thế Vinh", "Nguyễn Hoàng Vy"
];

export const DEFAULT_QUESTIONS = [];
