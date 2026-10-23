import React, { useState, useMemo } from 'react';
import Wheel from './components/Wheel';
import ConfigPanel from './components/ConfigPanel';
import QuestionModal from './components/QuestionModal';
import HistoryModal from './components/HistoryModal';
import WinnerModal from './components/WinnerModal';
import StudentListModal from './components/StudentListModal';
import { Student, Question, GameState, HistoryRecord, DEFAULT_STUDENTS, DEFAULT_QUESTIONS, QUESTIONS_PER_TURN } from './types';
import { Settings, RefreshCw, Trophy, History, Users, User, Star } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);

  // Khởi tạo danh sách học sinh từ localStorage nếu đã có
  const [allStudents, setAllStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('wheel_classes');
      const activeClassId = localStorage.getItem('wheel_active_class_id');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cls = (activeClassId && parsed.find((c: any) => c.id === activeClassId)) || parsed[0];
          if (cls && cls.students) {
            const names = cls.students.split('\n').map((s: string) => s.trim()).filter(Boolean);
            const prioSet = new Set(cls.prioritizedStudents || []);
            return names.map((name: string, i: number) => ({
              id: `s-${i}`,
              name,
              selected: false,
              priority: prioSet.has(name)
            }));
          }
        }
      }
    } catch (e) {}
    return DEFAULT_STUDENTS.map((name, i) => ({ id: `s-${i}`, name, selected: false, priority: false }));
  });

  // Khởi tạo danh sách câu hỏi từ localStorage nếu đã có
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('wheel_classes');
      const activeClassId = localStorage.getItem('wheel_active_class_id');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cls = (activeClassId && parsed.find((c: any) => c.id === activeClassId)) || parsed[0];
          if (cls && cls.questions) {
            const qList = cls.questions.split(/\n\s*\n/).map((q: string) => q.trim()).filter(Boolean);
            return qList.map((text: string, i: number) => ({ id: `q-${i}`, text, used: false }));
          }
        }
      }
    } catch (e) {}
    return DEFAULT_QUESTIONS.map((text, i) => ({ id: `q-${i}`, text, used: false }));
  });

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState<boolean>(false);
  
  const [prizeIndex, setPrizeIndex] = useState<number>(0);
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [currentWinners, setCurrentWinners] = useState<Student[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [studentsPerGroup, setStudentsPerGroup] = useState<number>(5);
  const [questionsPerTurn, setQuestionsPerTurn] = useState<number>(10);
  
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  const availableStudents = useMemo(() => allStudents.filter(s => !s.selected), [allStudents]);
  const availableQuestions = useMemo(() => allQuestions.filter(q => !q.used), [allQuestions]);
  const prioritizedCount = useMemo(() => allStudents.filter(s => s.priority).length, [allStudents]);
  const prioritizedAvailableCount = useMemo(() => availableStudents.filter(s => s.priority).length, [availableStudents]);

  /**
   * Thuật toán chọn mẫu ngẫu nhiên có trọng số không hoàn lại (Efraimidis - Spirakis)
   * Học sinh được tick ưu tiên sẽ có trọng số cao gấp 5 lần (x5)
   */
  const weightedSample = (students: Student[], count: number): Student[] => {
    if (students.length <= count) return [...students];
    
    const scored = students.map(s => {
      // Học sinh ưu tiên có trọng số = 5, học sinh thường = 1
      const weight = s.priority ? 5 : 1;
      const u = Math.max(1e-9, Math.random());
      const key = Math.pow(u, 1 / weight);
      return { student: s, key };
    });
    
    // Sắp xếp giảm dần theo khóa ngẫu nhiên có trọng số
    scored.sort((a, b) => b.key - a.key);
    return scored.slice(0, count).map(item => item.student);
  };

  const handleSpin = () => {
    if (gameState !== GameState.IDLE || availableStudents.length < studentsPerGroup) {
        if (availableStudents.length < studentsPerGroup && availableStudents.length > 0) {
            alert(studentsPerGroup === 1 
                ? 'Không còn học sinh nào để quay. Vui lòng reset danh sách.' 
                : `Chỉ còn ${availableStudents.length} học sinh, không đủ tạo nhóm ${studentsPerGroup} người. Vui lòng reset.`
            );
        }
        return;
    }
    
    // Chọn n học sinh ngẫu nhiên có trọng số ưu tiên
    const winners = weightedSample(availableStudents, studentsPerGroup);
    
    // Wheel sẽ dừng ở học sinh đầu tiên trong nhóm để mang tính biểu tượng
    const firstWinnerIndex = availableStudents.findIndex(s => s.id === winners[0].id);
    
    setPrizeIndex(firstWinnerIndex >= 0 ? firstWinnerIndex : 0);
    setMustSpin(true);
    setGameState(GameState.SPINNING);
    setCurrentWinners(winners);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    
    if (availableQuestions.length >= questionsPerTurn) {
        const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, questionsPerTurn);
        
        setCurrentQuestions(selected);
        setGameState(GameState.ANNOUNCE);
    } else {
        alert(`Không đủ ${questionsPerTurn} câu hỏi! Vui lòng thêm câu hỏi mới.`);
        setCurrentQuestions([]);
        setGameState(GameState.IDLE); 
    }
  };

  const handleStartQuiz = () => {
    setGameState(GameState.RESULT);
  };

  const handleSkipWinner = () => {
    setGameState(GameState.IDLE);
    setCurrentWinners([]);
    setCurrentQuestions([]);
  };

  const handleModalResult = (score: number) => {
    if (currentWinners.length > 0) {
        const groupNames = currentWinners.map(s => s.name).join(', ');
        const newRecord: HistoryRecord = {
            id: Date.now().toString(),
            studentName: groupNames,
            score: score,
            totalQuestions: currentQuestions.length,
            timestamp: Date.now()
        };
        setHistory(prev => [newRecord, ...prev]);

        // Đánh dấu tất cả n học sinh đã được chọn
        const winnerIds = new Set(currentWinners.map(s => s.id));
        setAllStudents(prev => prev.map(s => winnerIds.has(s.id) ? { ...s, selected: true } : s));
    }

    const usedIds = new Set(currentQuestions.map(q => q.id));
    setAllQuestions(prev => prev.map(q => usedIds.has(q.id) ? { ...q, used: true } : q));

    setGameState(GameState.IDLE);
    setCurrentWinners([]);
    setCurrentQuestions([]);
  };

  const handleSaveConfig = (
    studentsStr: string, 
    questionsStr: string, 
    newTimeLimit: number, 
    newStudentsPerGroup: number, 
    newQuestionsPerTurn: number,
    prioritizedList?: string[]
  ) => {
    const sList = studentsStr.split('\n').map(s => s.trim()).filter(s => s);
    const qList = questionsStr.split(/\n\s*\n/).map(q => q.trim()).filter(q => q);

    const prioSet = new Set(prioritizedList || []);

    setAllStudents(sList.map((name, i) => ({ 
      id: `s-${Date.now()}-${i}`, 
      name, 
      selected: false,
      priority: prioSet.has(name)
    })));
    setAllQuestions(qList.map((text, i) => ({ id: `q-${Date.now()}-${i}`, text, used: false })));
    setTimeLimit(newTimeLimit);
    setStudentsPerGroup(newStudentsPerGroup);
    setQuestionsPerTurn(newQuestionsPerTurn);
    
    setGameState(GameState.IDLE);
  };

  const handleTogglePriority = (studentId: string) => {
    setAllStudents(prev => {
      const updated = prev.map(s => s.id === studentId ? { ...s, priority: !s.priority } : s);
      try {
        const saved = localStorage.getItem('wheel_classes');
        const activeClassId = localStorage.getItem('wheel_active_class_id');
        if (saved) {
          const parsed = JSON.parse(saved);
          const prioNames = updated.filter(s => s.priority).map(s => s.name);
          const next = parsed.map((c: any) => 
            (!activeClassId || c.id === activeClassId) ? { ...c, prioritizedStudents: prioNames } : c
          );
          localStorage.setItem('wheel_classes', JSON.stringify(next));
        }
      } catch (e) {}
      return updated;
    });
  };

  const handleSetAllPriority = (priority: boolean, onlyAvailable: boolean = false) => {
    setAllStudents(prev => {
      const updated = prev.map(s => {
        if (onlyAvailable && s.selected) return s;
        return { ...s, priority };
      });
      try {
        const saved = localStorage.getItem('wheel_classes');
        const activeClassId = localStorage.getItem('wheel_active_class_id');
        if (saved) {
          const parsed = JSON.parse(saved);
          const prioNames = updated.filter(s => s.priority).map(s => s.name);
          const next = parsed.map((c: any) => 
            (!activeClassId || c.id === activeClassId) ? { ...c, prioritizedStudents: prioNames } : c
          );
          localStorage.setItem('wheel_classes', JSON.stringify(next));
        }
      } catch (e) {}
      return updated;
    });
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn đặt lại trạng thái đã quay của tất cả học sinh và câu hỏi?")) {
        setAllStudents(prev => prev.map(s => ({ ...s, selected: false })));
        setAllQuestions(prev => prev.map(q => ({ ...q, used: false })));
    }
  };

  if (gameState === GameState.CONFIG) {
    const rawStudents = allStudents.map(s => s.name).join('\n');
    const rawQuestions = allQuestions.map(q => q.text).join('\n\n');
    const initialPrioritized = allStudents.filter(s => s.priority).map(s => s.name);

    return (
        <div className="min-h-screen bg-blue-50 p-8 flex items-center justify-center">
            <ConfigPanel 
                rawStudents={rawStudents} 
                rawQuestions={rawQuestions} 
                initialTimeLimit={timeLimit}
                initialStudentsPerGroup={studentsPerGroup}
                initialQuestionsPerTurn={questionsPerTurn}
                initialPrioritizedStudents={initialPrioritized}
                onSave={handleSaveConfig} 
                onCancel={() => setGameState(GameState.IDLE)} 
            />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blue-50 text-gray-800 flex flex-col overflow-hidden font-sans">
      
      <header className="p-4 flex justify-between items-center bg-white shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                <Trophy size={20} />
            </div>
            <h1 className="text-2xl font-bold text-blue-900 tracking-tight hidden sm:block">Vòng Quay Tri Thức</h1>
        </div>
        <div className="flex items-center gap-2">
            {/* Nút Xem & Cài đặt Ưu tiên học sinh */}
            <button 
                onClick={() => setShowStudentModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full font-bold transition-all border border-amber-200 shadow-sm"
                title="Xem danh sách học sinh & chọn tick ưu tiên quay"
            >
                <Star size={18} className="fill-amber-400 text-amber-500" />
                <span className="hidden sm:inline">Ưu tiên ({prioritizedCount})</span>
            </button>

            <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full font-bold transition-colors"
            >
                <History size={18} />
                <span className="hidden sm:inline">Lịch sử</span>
            </button>
            <div className="w-px h-8 bg-gray-300 mx-1"></div>
            <button 
                onClick={handleReset}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Reset danh sách"
            >
                <RefreshCw size={24} />
            </button>
            <button 
                onClick={() => setGameState(GameState.CONFIG)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-bold transition-colors"
            >
                <Settings size={18} />
                <span className="hidden sm:inline">Cấu hình</span>
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 relative w-full">
        
        {availableStudents.length < studentsPerGroup ? (
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl border-4 border-dashed border-gray-300 animate-fade-in z-20 max-w-lg">
                {studentsPerGroup === 1 ? (
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                ) : (
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                )}
                <p className="text-2xl text-gray-500 mb-4 font-bold">
                    {studentsPerGroup === 1 
                        ? 'Đã quay hết học sinh! Vui lòng làm mới danh sách.' 
                        : `Cần ít nhất ${studentsPerGroup} học sinh để tiếp tục lượt quay nhóm!`}
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleReset}
                        className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                    >
                        Làm mới danh sách (Reset)
                    </button>
                    <button 
                        onClick={() => setGameState(GameState.CONFIG)}
                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200"
                    >
                        Thêm học sinh mới
                    </button>
                </div>
            </div>
        ) : (
            <div className="w-full max-w-[90vw] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 z-10 relative md:pl-40">
                <div className="flex-1 w-full flex justify-center md:justify-end">
                    <Wheel 
                        students={availableStudents}
                        mustSpin={mustSpin}
                        prizeNumber={prizeIndex}
                        onStopSpinning={handleStopSpinning}
                    />
                </div>

                <div className="flex-1 w-full flex flex-col items-center md:items-start justify-center gap-6">
                    <div className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow-xl border-2 border-blue-100 text-center md:text-left animate-float">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                            {studentsPerGroup === 1 ? (
                                <User size={22} className="text-blue-700" />
                            ) : (
                                <Users size={22} className="text-blue-700" />
                            )}
                            <h3 className="text-blue-900 font-bold text-xl">
                                {studentsPerGroup === 1 ? 'Chế độ cá nhân' : 'Chế độ Nhóm'}
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {studentsPerGroup === 1 ? (
                                <>Hệ thống sẽ chọn ngẫu nhiên <span className="font-bold text-red-500 text-lg">1 bạn</span> và <span className="font-bold text-blue-600 text-lg">{questionsPerTurn} câu hỏi</span></>
                            ) : (
                                <>Hệ thống sẽ chọn ngẫu nhiên <span className="font-bold text-red-500 text-lg">{studentsPerGroup} bạn</span> và <span className="font-bold text-blue-600 text-lg">{questionsPerTurn} câu hỏi</span></>
                            )}
                        </p>
                        {prioritizedAvailableCount > 0 && (
                          <p className="text-amber-800 text-xs font-semibold mt-1 flex items-center gap-1 justify-center md:justify-start">
                            <Star size={13} className="fill-amber-500 text-amber-500" />
                            Đang ưu tiên {prioritizedAvailableCount} bạn có dấu ⭐ (x5 cơ hội trúng)
                          </p>
                        )}
                    </div>
                    <button
                        onClick={handleSpin}
                        disabled={mustSpin}
                        className={`
                            px-12 py-8 rounded-full text-2xl md:text-3xl font-black text-white shadow-[0_10px_0_rgb(0,0,0,0.2)] 
                            active:shadow-none active:translate-y-[10px] transition-all transform hover:scale-105
                            uppercase tracking-wider min-w-[300px]
                            ${mustSpin 
                                ? 'bg-gray-400 cursor-not-allowed shadow-none translate-y-[10px]' 
                                : 'bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600'}
                        `}
                    >
                        {mustSpin 
                            ? (studentsPerGroup === 1 ? 'Đang chọn học sinh...' : 'Đang chọn nhóm...') 
                            : (studentsPerGroup === 1 ? 'QUAY CÁ NHÂN' : `QUAY NHÓM ${studentsPerGroup}`)}
                    </button>
                    <div className="text-gray-500 text-sm font-bold italic opacity-70 bg-white/50 px-10 py-1 rounded-full backdrop-blur-sm shadow-sm">
                        Được chia sẻ bởi TRANVINHSD
                    </div>
                </div>
            </div>
        )}

        {/* Info card top-left */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-md border border-white z-20 min-w-[210px]">
            <p className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Học sinh chưa chọn:</span> 
                <strong className="text-gray-900">{availableStudents.length}</strong>
            </p>
            <p className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600 flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-500" /> Ưu tiên:
                </span> 
                <strong className="text-amber-600">{prioritizedAvailableCount} bạn</strong>
            </p>
            <p className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Câu hỏi khả dụng:</span> 
                <strong className="text-gray-900">{availableQuestions.length}</strong>
            </p>
            <p className="mt-2 text-blue-600 font-bold text-xs">Thời gian/câu: {timeLimit}s</p>
            <button 
                onClick={() => setShowStudentModal(true)}
                className="mt-3 w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
                <Star size={14} className="fill-amber-400 text-amber-500" />
                Cài đặt ưu tiên học sinh
            </button>
        </div>

      </main>

      {/* Modal chỉnh ưu tiên học sinh trực tiếp */}
      <StudentListModal
          isOpen={showStudentModal}
          students={allStudents}
          studentsPerGroup={studentsPerGroup}
          onClose={() => setShowStudentModal(false)}
          onTogglePriority={handleTogglePriority}
          onSetAllPriority={handleSetAllPriority}
      />

      {gameState === GameState.ANNOUNCE && currentWinners.length > 0 && (
        <WinnerModal 
            studentNames={currentWinners.map(s => s.name)}
            questionsCount={currentQuestions.length}
            onStart={handleStartQuiz}
            onSkip={handleSkipWinner}
        />
      )}

      {gameState === GameState.RESULT && currentWinners.length > 0 && currentQuestions.length > 0 && (
        <QuestionModal 
            studentName={currentWinners.map(s => s.name).join(', ')}
            questions={currentQuestions}
            timeLimit={timeLimit}
            onFinish={handleModalResult}
        />
      )}

      {showHistory && (
        <HistoryModal 
            history={history} 
            onClose={() => setShowHistory(false)} 
        />
      )}

    </div>
  );
};

export default App;
