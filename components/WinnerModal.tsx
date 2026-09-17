
import React from 'react';
import { PartyPopper, Play, Star, XCircle, Users } from 'lucide-react';

interface WinnerModalProps {
    studentNames: string[];
    questionsCount: number;
    onStart: () => void;
    onSkip: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ studentNames, questionsCount, onStart, onSkip }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl p-10 text-center animate-bounce-in border-4 border-blue-400 overflow-hidden">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-20%] left-[-10%] w-60 h-60 bg-yellow-300 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6 bg-blue-100 p-6 rounded-full inline-flex items-center justify-center shadow-inner">
                        <Users className="w-16 h-16 text-blue-600 animate-bounce" />
                    </div>
                    
                    <h2 className="text-3xl font-black text-blue-900 mb-2 uppercase tracking-widest">Nhóm May Mắn</h2>
                    <p className="text-gray-500 mb-8 font-bold">{studentNames.length} học sinh sau đây sẽ cùng tham gia thử thách {questionsCount} câu hỏi!</p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-10 w-full">
                        {studentNames.map((name, index) => (
                            <div key={index} className="relative group min-w-[160px] max-w-[220px] flex-1">
                                <Star className="absolute -top-3 -right-3 w-6 h-6 text-yellow-400 fill-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-spin-slow" />
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all h-full flex items-center justify-center min-h-[80px]">
                                    <span className="text-xl font-bold text-blue-700">{name}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                        <button 
                            onClick={onSkip}
                            className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-bold text-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <XCircle size={24} />
                            Hủy lượt này
                        </button>
                        <button 
                            onClick={onStart}
                            className="flex-[2] group relative py-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all overflow-hidden active:scale-95"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
                            <span className="flex items-center justify-center gap-3 tracking-wider">
                                BẮT ĐẦU THỬ THÁCH
                                <Play className="w-8 h-8 fill-current" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WinnerModal;
