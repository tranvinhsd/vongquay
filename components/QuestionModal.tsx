
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { soundFX } from '../utils/sound';
import { Check, X, ArrowRight, Trophy, Clock, Users } from 'lucide-react';
import { Question, POINTS_PER_QUESTION, QUESTIONS_PER_TURN } from '../types';

interface QuestionModalProps {
    studentName: string; // Tên của cả nhóm
    questions: Question[];
    timeLimit: number;
    onFinish: (score: number) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ studentName, questions, timeLimit, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentQuestionText = questions[currentIndex]?.text || "";

    const { mainQuestion, options, correctLetter } = useMemo(() => {
        const lines = currentQuestionText.split('\n').map(l => l.trim()).filter(l => l);
        const answerIndex = lines.findIndex(l => l.toLowerCase().startsWith('đáp án') || l.toLowerCase().startsWith('answer'));
        
        let correctLetter = "";
        let contentLines = lines;

        if (answerIndex !== -1) {
            const answerLine = lines[answerIndex];
            const match = answerLine.match(/:\s*([A-D])/i);
            if (match && match[1]) {
                correctLetter = match[1].toUpperCase();
            }
            contentLines = lines.filter((_, i) => i !== answerIndex);
        }

        let mainQuestion = "";
        let options: string[] = [];

        if (contentLines.length > 1) {
            mainQuestion = contentLines[0];
            options = contentLines.slice(1);
        } else {
            mainQuestion = contentLines[0] || "";
        }

        return { mainQuestion, options, correctLetter };
    }, [currentQuestionText]);

    useEffect(() => {
        if (!isChecked && !isQuizFinished) {
            setTimeLeft(timeLimit);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        handleCheck(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex, isChecked, isQuizFinished, timeLimit]);
    
    const handleOptionClick = (optText: string) => {
        if (isChecked) return;
        const match = optText.match(/^([A-D])\./i);
        if (match && match[1]) setSelectedOption(match[1].toUpperCase());
        else setSelectedOption(optText); 
    };

    const handleCheck = (isAuto = false) => {
        if (isChecked) return;
        if (timerRef.current) clearInterval(timerRef.current);
        
        const isCorrect = selectedOption === correctLetter;
        if (isCorrect) {
            soundFX.playCorrectSound();
            setScore(prev => prev + POINTS_PER_QUESTION);
        } else {
            soundFX.playWrongSound();
        }
        setIsChecked(true);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsChecked(false);
        } else {
            soundFX.playWinSound();
            setIsQuizFinished(true);
        }
    };

    const handleClose = () => onFinish(score);

    const getOptionStyle = (optText: string) => {
        const match = optText.match(/^([A-D])\./i);
        const optLetter = match ? match[1].toUpperCase() : "";
        let baseStyle = "p-4 border-2 rounded-xl text-2xl md:text-3xl font-medium cursor-pointer transition-all shadow-sm leading-normal ";
        
        if (isChecked) {
            if (optLetter === correctLetter) return baseStyle + "bg-green-100 border-green-500 text-green-800 shadow-md ring-4 ring-green-200";
            if (selectedOption === optLetter && optLetter !== correctLetter) return baseStyle + "bg-red-100 border-red-500 text-red-800 opacity-80";
            return baseStyle + "bg-gray-50 border-gray-200 text-gray-400 opacity-50";
        } else {
            if (selectedOption === optLetter) return baseStyle + "bg-blue-100 border-blue-500 text-blue-900 shadow-md transform scale-[1.01]";
            return baseStyle + "bg-white border-blue-100 hover:border-blue-300 hover:bg-blue-50 text-gray-800";
        }
    };

    const progressPercentage = (timeLeft / timeLimit) * 100;

    if (isQuizFinished) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-bounce-in border-4 border-blue-500 p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Trophy size={48} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Hoàn thành thử thách nhóm!</h2>
                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                        <p className="text-gray-500 text-sm uppercase font-bold mb-2">Thành viên nhóm:</p>
                        <p className="font-bold text-blue-700">{studentName}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl mb-8 shadow-lg">
                        <p className="text-sm uppercase font-bold opacity-80 mb-1">Điểm nhóm đạt được</p>
                        <p className="text-7xl font-black">{score} <span className="text-3xl font-normal">/ {questions.length}</span></p>
                    </div>

                    <button 
                        onClick={handleClose}
                        className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-3xl hover:bg-green-600 transition-colors shadow-lg active:scale-95"
                    >
                        Lưu kết quả & Tiếp tục
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-3xl w-full max-w-6xl overflow-hidden animate-bounce-in flex flex-col max-h-[97vh]">
                {!isChecked && (
                    <div className="w-full h-2 bg-gray-100">
                        <div 
                            className={`h-full transition-all duration-1000 ease-linear ${
                                progressPercentage < 25 ? 'bg-red-500' : progressPercentage < 50 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                )}

                <div className="bg-blue-700 p-4 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 px-4 py-2 rounded-lg font-bold">
                            Câu {currentIndex + 1} / {questions.length}
                        </div>
                        <div className="flex items-center gap-2 text-xl font-medium opacity-90 truncate max-w-md">
                            <Users size={20} />
                            Nhóm: {studentName}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isChecked && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-2xl font-black shadow-inner ${
                                timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white/20 text-white'
                            }`}>
                                <Clock size={24} />
                                {timeLeft}s
                            </div>
                        )}
                        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold shadow-sm">
                            Điểm: {score}
                        </div>
                    </div>
                </div>
                
                <div className="p-8 overflow-y-auto flex-grow bg-gray-50">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 mb-6">
                        <p className="text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed italic">"{mainQuestion}"</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {options.map((opt, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleOptionClick(opt)}
                                className={getOptionStyle(opt)}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>

                    {isChecked && selectedOption === null && timeLeft === 0 && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center font-bold text-xl">
                            Hết thời gian! Nhóm đã bỏ lỡ câu hỏi này.
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border-t border-gray-200 shrink-0 flex justify-end gap-4">
                    {!isChecked ? (
                        <button 
                            onClick={() => handleCheck()}
                            disabled={!selectedOption}
                            className={`flex items-center gap-2 px-10 py-5 rounded-xl font-bold text-2xl transition-all ${
                                selectedOption 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Check className="w-8 h-8" />
                            XÁC NHẬN ĐÁP ÁN
                        </button>
                    ) : (
                        <button 
                            onClick={handleNext}
                            className="flex items-center gap-2 px-10 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-2xl shadow-lg animate-pulse-soft"
                        >
                            {currentIndex < questions.length - 1 ? "CÂU TIẾP THEO" : "XEM KẾT QUẢ CUỐI CÙNG"}
                            <ArrowRight className="w-8 h-8" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionModal;
