
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { generateQuestions, balanceAndPermuteQuestionsText } from '../services/geminiService';
import { Loader2, Sparkles, Plus, Trash2, Edit2, Save, Users, User, Upload, Download, FileText, FolderInput, Clock, Shuffle, CheckCircle2, Star, List, Search, SlidersHorizontal, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { ClassData, DEFAULT_STUDENTS, DEFAULT_QUESTIONS } from '../types';

interface ConfigPanelProps {
    rawStudents: string;
    rawQuestions: string;
    onSave: (students: string, questions: string, timeLimit: number, studentsPerGroup: number, questionsPerTurn: number, prioritizedStudents?: string[]) => void;
    onCancel: () => void;
    initialTimeLimit: number;
    initialStudentsPerGroup: number;
    initialQuestionsPerTurn: number;
    initialPrioritizedStudents?: string[];
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

const ConfigPanel: React.FC<ConfigPanelProps> = ({ rawStudents, rawQuestions, initialTimeLimit, initialStudentsPerGroup, initialQuestionsPerTurn, initialPrioritizedStudents, onSave, onCancel }) => {
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
                questionsPerTurn: 10,
                prioritizedStudents: []
            };
        });
    });

    const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || "");
    const [tempStudents, setTempStudents] = useState(rawStudents);
    const [tempQuestions, setTempQuestions] = useState(rawQuestions);
    const [tempTimeLimit, setTempTimeLimit] = useState(initialTimeLimit);
    const [tempStudentsPerGroup, setTempStudentsPerGroup] = useState(initialStudentsPerGroup);
    const [tempQuestionsPerTurn, setTempQuestionsPerTurn] = useState(initialQuestionsPerTurn);
    const [tempPrioritizedStudents, setTempPrioritizedStudents] = useState<string[]>(() => {
        const currentClass = classes.find(c => c.id === (classes[0]?.id || ""));
        return currentClass?.prioritizedStudents || initialPrioritizedStudents || [];
    });
    const [studentViewMode, setStudentViewMode] = useState<'table' | 'text'>('table');
    const [studentSearch, setStudentSearch] = useState<string>('');
    const [newStudentName, setNewStudentName] = useState<string>('');
    const [configSliderIndex, setConfigSliderIndex] = useState<number>(1);
    const configTableRef = useRef<HTMLDivElement>(null);

    const filteredConfigStudents = useMemo(() => {
        return tempStudents.split('\n').map(s => s.trim()).filter(Boolean)
            .map((name, idx) => ({ name, originalIndex: idx }))
            .filter(item => item.name.toLowerCase().includes(studentSearch.toLowerCase().trim()));
    }, [tempStudents, studentSearch]);

    const handleConfigSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setConfigSliderIndex(val);
        if (configTableRef.current && filteredConfigStudents.length > 1) {
            const maxScroll = configTableRef.current.scrollHeight - configTableRef.current.clientHeight;
            if (maxScroll > 0) {
                const scrollPercent = (val - 1) / (filteredConfigStudents.length - 1);
                configTableRef.current.scrollTop = scrollPercent * maxScroll;
            }
        }
    };

    const handleConfigTableScroll = () => {
        if (!configTableRef.current || filteredConfigStudents.length <= 1) return;
        const { scrollTop, scrollHeight, clientHeight } = configTableRef.current;
        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll <= 0) return;
        const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
        const idx = Math.round(ratio * (filteredConfigStudents.length - 1)) + 1;
        setConfigSliderIndex(idx);
    };

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
            setTempPrioritizedStudents(currentClass.prioritizedStudents || []);
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

    const handleToggleStudentPriority = (name: string) => {
        setTempPrioritizedStudents(prev => {
            const next = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
            setClasses(clsList => clsList.map(c => c.id === selectedClassId ? { ...c, prioritizedStudents: next } : c));
            return next;
        });
    };

    const handleSetAllPriorities = (priority: boolean) => {
        const sList = tempStudents.split('\n').map(s => s.trim()).filter(Boolean);
        const next = priority ? [...sList] : [];
        setTempPrioritizedStudents(next);
        setClasses(clsList => clsList.map(c => c.id === selectedClassId ? { ...c, prioritizedStudents: next } : c));
    };

    const handleAddStudent = () => {
        if (!newStudentName.trim()) return;
        const name = newStudentName.trim();
        const updated = tempStudents.trim() ? `${tempStudents.trim()}\n${name}` : name;
        handleUpdateCurrentClass('students', updated);
        setNewStudentName('');
    };

    const handleDeleteStudent = (indexToDelete: number) => {
        const sList = tempStudents.split('\n').map(s => s.trim()).filter(Boolean);
        const toDelete = sList[indexToDelete];
        const updatedList = sList.filter((_, idx) => idx !== indexToDelete);
        handleUpdateCurrentClass('students', updatedList.join('\n'));
        if (toDelete && tempPrioritizedStudents.includes(toDelete)) {
            setTempPrioritizedStudents(prev => prev.filter(n => n !== toDelete));
            setClasses(clsList => clsList.map(c => c.id === selectedClassId ? { 
                ...c, 
                prioritizedStudents: (c.prioritizedStudents || []).filter(n => n !== toDelete) 
            } : c));
        }
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
            alert(`Đã kiểm tra chất lượng và tạo thành công ${newQuestions.length} câu hỏi mới!\n\n✓ Đã kiểm tra lại nội dung câu hỏi, 4 phương án trả lời và đáp án đúng.\n✓ Đã hoán vị ngẫu nhiên các phương án và đáp án để đảm bảo mỗi phương án đúng A, B, C, D đều đạt tỉ lệ 25%.`);
        } else {
            alert("Không thể tạo câu hỏi. Vui lòng kiểm tra lại API Key hoặc thử lại sau.");
        }
        setIsGenerating(false);
    };

    const handleBalanceQuestions = () => {
        if (!tempQuestions.trim()) {
            alert("Chưa có câu hỏi nào để hoán vị!");
            return;
        }
        const res = balanceAndPermuteQuestionsText(tempQuestions);
        if (res.count === 0) {
            alert("Không tìm thấy câu hỏi hợp lệ để hoán vị. Vui lòng kiểm tra định dạng câu hỏi (mỗi câu cần có nội dung, 4 phương án A, B, C, D và dòng Đáp án).");
            return;
        }
        handleUpdateCurrentClass('questions', res.formattedText);
        alert(`Đã kiểm tra chất lượng và hoán vị thành công ${res.count} câu hỏi!\nTỉ lệ đáp án sau khi cân bằng:\n- A: ${res.distribution.A} (${Math.round((res.distribution.A / res.count) * 100)}%)\n- B: ${res.distribution.B} (${Math.round((res.distribution.B / res.count) * 100)}%)\n- C: ${res.distribution.C} (${Math.round((res.distribution.C / res.count) * 100)}%)\n- D: ${res.distribution.D} (${Math.round((res.distribution.D / res.count) * 100)}%)`);
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
            questionsPerTurn: 10,
            prioritizedStudents: []
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
        try {
            localStorage.setItem('wheel_active_class_id', selectedClassId);
        } catch (e) {}
        onSave(tempStudents, tempQuestions, tempTimeLimit, tempStudentsPerGroup, tempQuestionsPerTurn, tempPrioritizedStudents);
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
                        {tempStudentsPerGroup === 1 ? <User size={18} /> : <Users size={18} />}
                        <span className="text-xs font-bold uppercase">{tempStudentsPerGroup === 1 ? 'Chế độ cá nhân (1 HS):' : 'HS/Nhóm:'}</span>
                        <input 
                            type="number"
                            min="1"
                            max="20"
                            value={tempStudentsPerGroup}
                            onChange={(e) => handleUpdateCurrentClass('studentsPerGroup', parseInt(e.target.value) || 1)}
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
                        <div className="flex items-center gap-2">
                            <label className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                <Users size={20} />
                                Danh sách học sinh
                                <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {tempStudents.split('\n').filter(s => s.trim()).length}
                                </span>
                            </label>
                            {tempPrioritizedStudents.length > 0 && (
                                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                                    <Star size={12} className="fill-amber-500 text-amber-500" />
                                    {tempPrioritizedStudents.length} ưu tiên
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5">
                            {/* Toggle Table / Text Mode */}
                            <button
                                onClick={() => setStudentViewMode(m => m === 'table' ? 'text' : 'table')}
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                                title={studentViewMode === 'table' ? 'Chuyển sang dạng soạn văn bản (Textarea)' : 'Chuyển sang dạng bảng có cột tick ưu tiên'}
                            >
                                {studentViewMode === 'table' ? (
                                    <>
                                        <FileText size={15} />
                                        <span>Soạn nhanh</span>
                                    </>
                                ) : (
                                    <>
                                        <List size={15} />
                                        <span>Bảng & Cột tick</span>
                                    </>
                                )}
                            </button>

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

                    {studentViewMode === 'table' ? (
                        <div className="flex-grow flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                            {/* Sub toolbar */}
                            <div className="p-2.5 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between gap-2 text-xs">
                                <div className="relative flex-1">
                                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text"
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        placeholder="Tìm học sinh..."
                                        className="w-full pl-8 pr-2 py-1 bg-white border border-amber-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    <button 
                                        onClick={() => handleSetAllPriorities(true)}
                                        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-bold"
                                        title="Ưu tiên tất cả học sinh trong danh sách"
                                    >
                                        Tick tất cả
                                    </button>
                                    <button 
                                        onClick={() => handleSetAllPriorities(false)}
                                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded font-bold"
                                        title="Bỏ tick tất cả"
                                    >
                                        Bỏ tick
                                    </button>
                                </div>
                            </div>

                            {/* Thanh trượt duyệt nhanh danh sách học sinh */}
                            {filteredConfigStudents.length > 3 && (
                                <div className="px-3 py-1.5 bg-amber-100/70 border-b border-amber-200 flex items-center gap-2 text-xs shrink-0">
                                    <SlidersHorizontal size={14} className="text-amber-700 shrink-0" />
                                    <span className="font-bold text-amber-950 shrink-0 text-[11px]">
                                        Trượt nhanh:
                                    </span>
                                    <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-mono font-black text-[10px] shadow-inner">
                                        {configSliderIndex} / {filteredConfigStudents.length}
                                    </span>
                                    {filteredConfigStudents[configSliderIndex - 1] && (
                                        <span className="text-amber-900 font-bold bg-white/90 px-1.5 py-0.5 rounded border border-amber-300 text-[11px] truncate max-w-[120px]">
                                            {filteredConfigStudents[configSliderIndex - 1].name}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => configTableRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="p-1 hover:bg-amber-200 text-amber-900 rounded transition-colors ml-auto"
                                        title="Lên đầu danh sách"
                                    >
                                        <ArrowUpToLine size={13} />
                                    </button>
                                    <input 
                                        type="range"
                                        min={1}
                                        max={Math.max(1, filteredConfigStudents.length)}
                                        value={configSliderIndex}
                                        onChange={handleConfigSliderChange}
                                        className="w-28 sm:w-36 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600 shadow-inner"
                                        title="Kéo thanh trượt để di chuyển nhanh danh sách học sinh"
                                    />
                                    <button
                                        onClick={() => {
                                            if (configTableRef.current) {
                                                configTableRef.current.scrollTo({ top: configTableRef.current.scrollHeight, behavior: 'smooth' });
                                            }
                                        }}
                                        className="p-1 hover:bg-amber-200 text-amber-900 rounded transition-colors"
                                        title="Xuống cuối danh sách"
                                    >
                                        <ArrowDownToLine size={13} />
                                    </button>
                                </div>
                            )}

                            {/* Table with custom-scrollbar */}
                            <div 
                                ref={configTableRef}
                                onScroll={handleConfigTableScroll}
                                className="flex-grow overflow-y-auto custom-scrollbar relative"
                            >
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                                        <tr>
                                            <th className="py-2 px-3 text-center w-14 bg-gray-100">Ưu tiên</th>
                                            <th className="py-2 px-2 text-center w-10 bg-gray-100">STT</th>
                                            <th className="py-2 px-3 bg-gray-100">Tên học sinh</th>
                                            <th className="py-2 px-2 text-center w-24 bg-gray-100">Trọng số</th>
                                            <th className="py-2 px-2 text-center w-10 bg-gray-100"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredConfigStudents.map((item, idx) => {
                                            const isPri = tempPrioritizedStudents.includes(item.name);
                                            const isHighlighted = idx + 1 === configSliderIndex;
                                            return (
                                                <tr 
                                                    key={item.originalIndex} 
                                                    onClick={() => handleToggleStudentPriority(item.name)}
                                                    className={`cursor-pointer transition-colors ${
                                                        isHighlighted 
                                                            ? 'ring-2 ring-amber-400 bg-amber-100/90 font-bold' 
                                                            : isPri 
                                                                ? 'bg-amber-50 hover:bg-amber-100/70 font-medium' 
                                                                : 'hover:bg-blue-50/50'
                                                    }`}
                                                >
                                                        <td className="py-2 px-3 text-center">
                                                            <input 
                                                                type="checkbox"
                                                                checked={isPri}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleStudentPriority(item.name);
                                                                }}
                                                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-2 text-center text-gray-400 font-mono">
                                                            {item.originalIndex + 1}
                                                        </td>
                                                        <td className="py-2 px-3 text-gray-800 font-semibold">
                                                            <div className="flex items-center gap-1.5">
                                                                {isPri && <Star size={13} className="text-amber-500 fill-amber-400 shrink-0" />}
                                                                <span>{item.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 px-2 text-center">
                                                            {isPri ? (
                                                                <span className="bg-amber-200 text-amber-900 font-black px-1.5 py-0.5 rounded text-[10px]">
                                                                    Ưu tiên x5 ⭐
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 text-[11px]">
                                                                    Chuẩn x1
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-2 px-2 text-center">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteStudent(item.originalIndex);
                                                                }}
                                                                className="text-gray-400 hover:text-red-600 p-1 rounded"
                                                                title="Xóa học sinh này"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {/* Add student row */}
                            <div className="p-2 border-t border-gray-200 bg-gray-50 flex gap-2">
                                <input 
                                    type="text"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddStudent(); }}
                                    placeholder="Thêm học sinh mới..."
                                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                />
                                <button 
                                    onClick={handleAddStudent}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    ) : (
                        <textarea
                            className="flex-grow w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono text-sm resize-none shadow-inner bg-gray-50"
                            value={tempStudents}
                            onChange={(e) => handleUpdateCurrentClass('students', e.target.value)}
                            placeholder="Nhập tên học sinh, mỗi người một dòng..."
                        />
                    )}
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
                                onClick={handleBalanceQuestions}
                                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors" 
                                title="Kiểm tra & Hoán vị phương án để tỉ lệ đáp án A, B, C, D đạt 25%"
                            >
                                <Shuffle size={18} />
                            </button>
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
                    <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="Nhập chủ đề (VD: Lịch sử Việt Nam, Toán lớp 5)..."
                                className="flex-1 p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
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
                        <div className="mt-2.5 text-xs text-indigo-700 flex items-center gap-1.5 font-medium bg-white/70 px-3 py-1.5 rounded-lg border border-purple-100">
                            <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                            <span>Tự động kiểm tra chất lượng & hoán vị phương án đảm bảo đáp án đúng A, B, C, D đạt tỉ lệ đều 25%.</span>
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
