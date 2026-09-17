
import React, { useState, useEffect, useRef } from 'react';
import { generateQuestions } from '../services/geminiService';
import { Loader2, Sparkles, Plus, Trash2, Edit2, Save, Users, Upload, Download, FileText, FolderInput, Clock } from 'lucide-react';
import { ClassData, DEFAULT_STUDENTS, DEFAULT_QUESTIONS } from '../types';

interface ConfigPanelProps {
    rawStudents: string;
    rawQuestions: string;
    onSave: (students: string, questions: string, timeLimit: number, studentsPerGroup: number, questionsPerTurn: number) => void;
    onCancel: () => void;
    initialTimeLimit: number;
    initialStudentsPerGroup: number;
    initialQuestionsPerTurn: number;
}

const CLASS_6A2_STUDENTS = ``;
const CLASS_6A3_STUDENTS = ``;
const CLASS_6A4_STUDENTS = ``;
const CLASS_6A5_STUDENTS = ``;
const CLASS_6A6_STUDENTS = ``;

const CLASS_7A1_STUDENTS = ``;
const CLASS_7A2_STUDENTS = ``;
const CLASS_7A3_STUDENTS = ``;
const CLASS_7A4_STUDENTS = ``;
const CLASS_7A5_STUDENTS = ``;
const CLASS_7A6_STUDENTS = ``;

const CLASS_8A1_STUDENTS = ``;
const CLASS_8A2_STUDENTS = ``;
const CLASS_8A3_STUDENTS = ``;
const CLASS_8A4_STUDENTS = ``;
const CLASS_8A5_STUDENTS = ``;
const CLASS_8A6_STUDENTS = ``;

const CLASS_9A1_STUDENTS = ``;
const CLASS_9A2_STUDENTS = ``;
const CLASS_9A3_STUDENTS = ``;
const CLASS_9A4_STUDENTS = ``;
const CLASS_9A5_STUDENTS = ``;
const CLASS_9A6_STUDENTS = ``;

const CLASS_6_QUESTIONS = ``;

const CLASS_7_QUESTIONS = ``;

const CLASS_8_QUESTIONS = ``;

const CLASS_9_QUESTIONS = ``;

const ConfigPanel: React.FC<ConfigPanelProps> = ({ rawStudents, rawQuestions, initialTimeLimit, initialStudentsPerGroup, initialQuestionsPerTurn, onSave, onCancel }) => {
    // Load classes from LocalStorage or init with specific classes
    const [classes, setClasses] = useState<ClassData[]>(() => {
        const saved = localStorage.getItem('wheel_classes');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved classes", e);
            }
        }
        
        // Define the requested default classes
        const defaultClassNames = [
            "Lớp 6A1", "Lớp 6A2", "Lớp 6A3", "Lớp 6A4", "Lớp 6A5", "Lớp 6A6",
            "Lớp 7A1", "Lớp 7A2", "Lớp 7A3", "Lớp 7A4", "Lớp 7A5", "Lớp 7A6",
            "Lớp 8A1", "Lớp 8A2", "Lớp 8A3", "Lớp 8A4", "Lớp 8A5", "Lớp 8A6",
            "Lớp 9A1", "Lớp 9A2", "Lớp 9A3", "Lớp 9A4", "Lớp 9A5", "Lớp 9A6"
        ];

        return defaultClassNames.map((name, index) => {
            let students = DEFAULT_STUDENTS.join('\n');
            let questions = DEFAULT_QUESTIONS.join('\n\n');

            // Override with specific data if available
            if (name === "Lớp 6A1") {
                 questions = CLASS_6_QUESTIONS;
            } else if (name === "Lớp 6A2") {
                students = CLASS_6A2_STUDENTS;
                questions = CLASS_6_QUESTIONS;
            } else if (name === "Lớp 6A3") {
                students = CLASS_6A3_STUDENTS;
                questions = CLASS_6_QUESTIONS;
            } else if (name === "Lớp 6A4") {
                students = CLASS_6A4_STUDENTS;
                questions = CLASS_6_QUESTIONS;
            } else if (name === "Lớp 6A5") {
                students = CLASS_6A5_STUDENTS;
                questions = CLASS_6_QUESTIONS;
            } else if (name === "Lớp 6A6") {
                students = CLASS_6A6_STUDENTS;
                questions = CLASS_6_QUESTIONS;
            } else if (name === "Lớp 7A1") {
                students = CLASS_7A1_STUDENTS;
                questions = CLASS_7_QUESTIONS;
            } else if (name === "Lớp 7A2") {
                students = CLASS_7A2_STUDENTS;
                questions = CLASS_7_QUESTIONS;
            } else if (name === "Lớp 7A3") {
                students = CLASS_7A3_STUDENTS;
                questions = CLASS_7_QUESTIONS;
            } else if (name === "Lớp 7A4") {
                students = CLASS_7A4_STUDENTS;
                questions = CLASS_7_QUESTIONS;
            } else if (name === "Lớp 7A5") {
                students = CLASS_7A5_STUDENTS;
                questions = CLASS_7_QUESTIONS;                
            } else if (name === "Lớp 7A6") {
                students = CLASS_7A6_STUDENTS;
                questions = CLASS_7_QUESTIONS;
            } else if (name === "Lớp 8A1") {
                students = CLASS_8A1_STUDENTS;
                questions = CLASS_8_QUESTIONS;
            } else if (name === "Lớp 8A2") {
                students = CLASS_8A2_STUDENTS;
                questions = CLASS_8_QUESTIONS;
            } else if (name === "Lớp 8A3") {
                students = CLASS_8A3_STUDENTS;
                questions = CLASS_8_QUESTIONS;
            } else if (name === "Lớp 8A4") {
                students = CLASS_8A4_STUDENTS;
                questions = CLASS_8_QUESTIONS;
            } else if (name === "Lớp 8A5") {
                students = CLASS_8A5_STUDENTS;
                questions = CLASS_8_QUESTIONS;
            } else if (name === "Lớp 8A6") {
                students = CLASS_8A6_STUDENTS;
                questions = CLASS_8_QUESTIONS;
            } else if (name === "Lớp 9A1") {
                students = CLASS_9A1_STUDENTS;
                questions = CLASS_9_QUESTIONS;
            } else if (name === "Lớp 9A2") {
                students = CLASS_9A2_STUDENTS;
                questions = CLASS_9_QUESTIONS;
            } else if (name === "Lớp 9A3") {
                students = CLASS_9A3_STUDENTS;
                questions = CLASS_9_QUESTIONS;
            } else if (name === "Lớp 9A4") {
                students = CLASS_9A4_STUDENTS;
                questions = CLASS_9_QUESTIONS;
            } else if (name === "Lớp 9A5") {
                students = CLASS_9A5_STUDENTS;
                questions = CLASS_9_QUESTIONS;
            } else if (name === "Lớp 9A6") {
                students = CLASS_9A6_STUDENTS;
                questions = CLASS_9_QUESTIONS;
            }

            return {
                id: `class-${index}`,
                name: name,
                students: students,
                questions: questions,
                timePerQuestion: 30,
                studentsPerGroup: 5,
                questionsPerTurn: 10
            };
        });
    });

    const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || "");
    const [tempStudents, setTempStudents] = useState(rawStudents);
    const [tempQuestions, setTempQuestions] = useState(rawQuestions);
    const [tempTimeLimit, setTempTimeLimit] = useState(initialTimeLimit);
    const [tempStudentsPerGroup, setTempStudentsPerGroup] = useState(initialStudentsPerGroup);
    const [tempQuestionsPerTurn, setTempQuestionsPerTurn] = useState(initialQuestionsPerTurn);
    const [aiTopic, setAiTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showNewClassInput, setShowNewClassInput] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    
    // Hidden input ref for folder upload
    const folderInputRef = useRef<HTMLInputElement>(null);

    // Sync temp state when selected class changes
    useEffect(() => {
        const currentClass = classes.find(c => c.id === selectedClassId);
        if (currentClass) {
            setTempStudents(currentClass.students);
            setTempQuestions(currentClass.questions);
            setTempTimeLimit(currentClass.timePerQuestion || 30);
            setTempStudentsPerGroup(currentClass.studentsPerGroup || 5);
            setTempQuestionsPerTurn(currentClass.questionsPerTurn || 10);
        }
    }, [selectedClassId, classes]);

    // Save to local storage whenever classes update
    useEffect(() => {
        localStorage.setItem('wheel_classes', JSON.stringify(classes));
    }, [classes]);

    const handleUpdateCurrentClass = (field: 'students' | 'questions' | 'timePerQuestion' | 'studentsPerGroup' | 'questionsPerTurn', value: any) => {
        if (field === 'students') setTempStudents(value);
        if (field === 'questions') setTempQuestions(value);
        if (field === 'timePerQuestion') setTempTimeLimit(value);
        if (field === 'studentsPerGroup') setTempStudentsPerGroup(value);
        if (field === 'questionsPerTurn') setTempQuestionsPerTurn(value);
        
        setClasses(prev => prev.map(c => 
            c.id === selectedClassId ? { ...c, [field]: value } : c
        ));
    };

    const handleGenerateAI = async () => {
        if (!aiTopic) return;
        setIsGenerating(true);

        // Tìm số thứ tự câu hỏi lớn nhất hiện tại bằng Regex
        const questionMatches = [...tempQuestions.matchAll(/Câu\s*(\d+)/gi)];
        const lastNumber = questionMatches.length > 0 
            ? Math.max(...questionMatches.map(m => parseInt(m[1]))) 
            : 0;

        const startFrom = lastNumber + 1;
        
        // Gửi nội dung câu hỏi hiện tại làm ngữ cảnh để tránh trùng lặp
        const currentContext = tempQuestions.trim();
        const newQuestions = await generateQuestions(aiTopic, 40, startFrom, currentContext);
        
        if (newQuestions.length > 0) {
            const formattedNewQuestions = newQuestions.join('\n\n');
            const updatedQuestions = currentContext 
                ? `${currentContext}\n\n${formattedNewQuestions}`
                : formattedNewQuestions;

            handleUpdateCurrentClass('questions', updatedQuestions);
        } else {
            alert("Không thể tạo câu hỏi. Vui lòng kiểm tra lại API Key hoặc thử lại sau.");
        }
        setIsGenerating(false);
    };

    const handleAddClass = () => {
        if (!newClassName.trim()) return;
        const newClass: ClassData = {
            id: `class-${Date.now()}`,
            name: newClassName,
            students: "",
            questions: "",
            timePerQuestion: 30,
            studentsPerGroup: 5,
            questionsPerTurn: 10
        };
        setClasses(prev => [...prev, newClass]);
        setSelectedClassId(newClass.id);
        setNewClassName("");
        setShowNewClassInput(false);
    };

    const handleDeleteClass = () => {
        if (classes.length <= 1) {
            alert("Phải giữ lại ít nhất một lớp học!");
            return;
        }
        if (confirm("Bạn có chắc chắn muốn xóa lớp này?")) {
            const newClasses = classes.filter(c => c.id !== selectedClassId);
            setClasses(newClasses);
            setSelectedClassId(newClasses[0].id);
        }
    };

    const handleRenameClass = () => {
        const currentClass = classes.find(c => c.id === selectedClassId);
        if (!currentClass) return;
        const newName = prompt("Nhập tên mới cho lớp:", currentClass.name);
        if (newName && newName.trim()) {
            setClasses(prev => prev.map(c => c.id === selectedClassId ? { ...c, name: newName } : c));
        }
    };

    const handleSave = () => {
        onSave(tempStudents, tempQuestions, tempTimeLimit, tempStudentsPerGroup, tempQuestionsPerTurn);
    };

    const handleImportWord = async (e: React.ChangeEvent<HTMLInputElement>, field: 'students' | 'questions') => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        
        try {
            // @ts-ignore
            const mammoth = await import('mammoth');
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            
            let text = result.value;
            
            if (field === 'questions') {
                 const lines = text.split(/\r?\n/).map((l: string) => l.trim()).filter((l: string) => l);
                 let cleanText = "";
                 let forceDoubleNewline = false;

                 lines.forEach((line: string) => {
                    if (/^Câu\s/i.test(line) || forceDoubleNewline) {
                         if (cleanText) cleanText += "\n\n";
                         cleanText += line;
                         forceDoubleNewline = false;
                    } else {
                         if (cleanText) cleanText += "\n";
                         cleanText += line;
                    }

                    if (/^Đáp án/i.test(line)) {
                        forceDoubleNewline = true;
                    }
                 });
                 text = cleanText;
            } else {
                text = text.split(/\r?\n/).map((l: string) => l.trim()).filter((l: string) => l).join('\n');
            }
    
            handleUpdateCurrentClass(field, text);
            e.target.value = '';
        } catch (error) {
            console.error("Import error", error);
            alert("Lỗi khi đọc file Word");
        }
    };

    const handleFolderImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const files = Array.from(e.target.files) as File[];
        const newClasses: ClassData[] = [];
        let importedCount = 0;

        // @ts-ignore
        const mammoth = await import('mammoth');

        for (const file of files) {
            const isDocx = file.name.endsWith('.docx');
            const isTxt = file.name.endsWith('.txt');
            
            if (!isDocx && !isTxt) continue;

            const className = file.name.replace(/\.[^/.]+$/, "");
            let studentContent = "";

            try {
                if (isDocx) {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    studentContent = result.value;
                } else if (isTxt) {
                    studentContent = await file.text();
                }

                studentContent = studentContent.split(/\r?\n/).map(l => l.trim()).filter(l => l).join('\n');

                if (studentContent) {
                    newClasses.push({
                        id: `class-imported-${Date.now()}-${Math.random()}`,
                        name: className,
                        students: studentContent,
                        questions: "",
                        timePerQuestion: 30,
                        studentsPerGroup: 5,
                        questionsPerTurn: 10
                    });
                    importedCount++;
                }
            } catch (err) {
                console.error(`Failed to read file ${file.name}`, err);
            }
        }

        if (newClasses.length > 0) {
            setClasses(prev => [...prev, ...newClasses]);
            setSelectedClassId(newClasses[0].id);
            alert(`Đã nhập thành công ${importedCount} lớp từ thư mục!`);
        } else {
            alert("Không tìm thấy file .docx hoặc .txt hợp lệ trong thư mục.");
        }

        e.target.value = '';
    };

    const handleExportWord = async (content: string, filename: string) => {
        try {
            // @ts-ignore
            const { Document, Packer, Paragraph, TextRun } = await import('docx');
            // @ts-ignore
            const { default: saveAs } = await import('file-saver');

            const lines = content.split('\n');
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: lines.map((line: string) => {
                        const isBold = line.startsWith("Câu") || line.startsWith("Đáp án");
                        return new Paragraph({
                            children: [
                                new TextRun({
                                    text: line,
                                    bold: isBold,
                                    size: 24
                                }),
                            ],
                            spacing: { after: 100 }
                        });
                    }),
                }],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${filename}.docx`);
        } catch (error) {
            console.error("Export error", error);
            alert("Lỗi khi xuất file Word");
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col animate-bounce-in">
            {/* Header with Class Management */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-2">
                    <Users className="text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-800">Cấu hình</h2>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-xl">
                    <span className="text-sm font-bold text-gray-500 px-2">Lớp học:</span>
                    <select 
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
                    >
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    
                    <button onClick={() => setShowNewClassInput(true)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg" title="Thêm lớp mới">
                        <Plus size={20} />
                    </button>
                    <button onClick={handleRenameClass} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg" title="Đổi tên lớp">
                        <Edit2 size={20} />
                    </button>
                    <button onClick={handleDeleteClass} className="p-2 text-red-600 hover:bg-red-100 rounded-lg" title="Xóa lớp">
                        <Trash2 size={20} />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    
                    {/* Time Limit Setting */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                        <Clock size={18} />
                        <span className="text-xs font-bold uppercase">TG/Câu:</span>
                        <input 
                            type="number"
                            min="5"
                            max="300"
                            value={tempTimeLimit}
                            onChange={(e) => handleUpdateCurrentClass('timePerQuestion', parseInt(e.target.value) || 30)}
                            className="w-14 p-1 rounded border-blue-200 text-center font-bold text-blue-800 bg-white"
                        />
                        <span className="text-xs font-bold">s</span>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Students Per Group Setting */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100">
                        <Users size={18} />
                        <span className="text-xs font-bold uppercase">HS/Nhóm:</span>
                        <input 
                            type="number"
                            min="1"
                            max="20"
                            value={tempStudentsPerGroup}
                            onChange={(e) => handleUpdateCurrentClass('studentsPerGroup', parseInt(e.target.value) || 5)}
                            className="w-14 p-1 rounded border-green-200 text-center font-bold text-green-800 bg-white"
                        />
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Questions Per Turn Setting */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100">
                        <FileText size={18} />
                        <span className="text-xs font-bold uppercase">Câu/Lượt:</span>
                        <input 
                            type="number"
                            min="1"
                            max="50"
                            value={tempQuestionsPerTurn}
                            onChange={(e) => handleUpdateCurrentClass('questionsPerTurn', parseInt(e.target.value) || 10)}
                            className="w-14 p-1 rounded border-purple-200 text-center font-bold text-purple-800 bg-white"
                        />
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Folder Import Button */}
                    <button 
                        onClick={() => folderInputRef.current?.click()}
                        className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors"
                        title="Nhập nhiều lớp từ thư mục (Tên file = Tên lớp)"
                    >
                        <FolderInput size={18} />
                        Nhập từ thư mục
                    </button>
                    <input 
                        type="file" 
                        ref={folderInputRef}
                        className="hidden" 
                        {...({ webkitdirectory: "", directory: "" } as any)}
                        multiple
                        onChange={handleFolderImport} 
                    />
                </div>
            </div>

            {/* Add New Class Modal Input */}
            {showNewClassInput && (
                <div className="mb-6 flex gap-2 animate-fade-in bg-blue-50 p-4 rounded-xl">
                    <input 
                        type="text" 
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="Nhập tên lớp mới (VD: Lớp 9A1)..."
                        className="flex-1 p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        onClick={handleAddClass}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                    >
                        Thêm
                    </button>
                    <button 
                        onClick={() => setShowNewClassInput(false)}
                        className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-xl"
                    >
                        Hủy
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow overflow-hidden">
                {/* Students Column */}
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <Users size={20} />
                            Danh sách học sinh
                            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {tempStudents.split('\n').filter(s => s.trim()).length}
                            </span>
                        </label>
                        <div className="flex gap-2">
                            <label className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer" title="Nhập từ Word">
                                <Upload size={18} />
                                <input type="file" accept=".docx" className="hidden" onChange={(e) => handleImportWord(e, 'students')} />
                            </label>
                            <button 
                                onClick={() => handleExportWord(tempStudents, `Danh_sach_hoc_sinh_${classes.find(c => c.id === selectedClassId)?.name}`)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Xuất ra Word"
                            >
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                    <textarea
                        className="flex-grow w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono text-sm resize-none shadow-inner bg-gray-50"
                        value={tempStudents}
                        onChange={(e) => handleUpdateCurrentClass('students', e.target.value)}
                        placeholder="Nhập tên học sinh, mỗi người một dòng..."
                    />
                </div>

                {/* Questions Column */}
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <FileText size={20} />
                            Danh sách câu hỏi
                            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {tempQuestions.split(/\n\s*\n/).filter(q => q.trim()).length}
                            </span>
                        </label>
                         <div className="flex gap-2">
                            <button 
                                onClick={() => {
                                    if (confirm("Bạn có chắc chắn muốn xóa TẤT CẢ câu hỏi của lớp này? Hành động này không thể hoàn tác.")) {
                                        handleUpdateCurrentClass('questions', '');
                                    }
                                }}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg" 
                                title="Xóa tất cả câu hỏi"
                            >
                                <Trash2 size={18} />
                            </button>
                            <label className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer" title="Nhập từ Word">
                                <Upload size={18} />
                                <input type="file" accept=".docx" className="hidden" onChange={(e) => handleImportWord(e, 'questions')} />
                            </label>
                            <button 
                                onClick={() => handleExportWord(tempQuestions, `Danh_sach_cau_hoi_${classes.find(c => c.id === selectedClassId)?.name}`)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Xuất ra Word"
                            >
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* AI Generator */}
                    <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="Nhập chủ đề (VD: Lịch sử Việt Nam, Toán lớp 5)..."
                                className="flex-1 p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                            <button
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !aiTopic}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all shadow-md
                                    ${isGenerating || !aiTopic 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5'}
                                `}
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                {isGenerating ? 'Đang tạo...' : 'Tạo 40 câu'}
                            </button>
                        </div>
                    </div>

                    <textarea
                        className="flex-grow w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono text-sm resize-none shadow-inner bg-gray-50"
                        value={tempQuestions}
                        onChange={(e) => handleUpdateCurrentClass('questions', e.target.value)}
                        placeholder={`Nhập câu hỏi, các câu cách nhau bởi dòng trống. Ví dụ:
Câu 1: 1 + 1 = ?
A. 1
B. 2
Đáp án: B

Câu 2: ...`}
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                <button
                    onClick={onCancel}
                    className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    Hủy bỏ
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <Save size={20} />
                    Áp dụng & Lưu
                </button>
            </div>
        </div>
    );
};

export default ConfigPanel;
