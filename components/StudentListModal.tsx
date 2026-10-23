import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Student } from '../types';
import { X, Search, Star, CheckSquare, Users, CheckCircle2, RotateCcw, SlidersHorizontal, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';

interface StudentListModalProps {
    isOpen: boolean;
    students: Student[];
    studentsPerGroup: number;
    onClose: () => void;
    onTogglePriority: (id: string) => void;
    onSetAllPriority: (priority: boolean, onlyAvailable?: boolean) => void;
}

const StudentListModal: React.FC<StudentListModalProps> = ({
    isOpen,
    students,
    studentsPerGroup,
    onClose,
    onTogglePriority,
    onSetAllPriority,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMode, setFilterMode] = useState<'all' | 'available' | 'prioritized'>('all');
    const [sliderValue, setSliderValue] = useState<number>(1);
    
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const prioritizedCount = useMemo(() => students.filter(s => s.priority).length, [students]);
    const availableCount = useMemo(() => students.filter(s => !s.selected).length, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
            if (!matchSearch) return false;

            if (filterMode === 'available') return !s.selected;
            if (filterMode === 'prioritized') return !!s.priority;
            return true;
        });
    }, [students, searchTerm, filterMode]);

    // Đồng bộ lại thanh trượt khi bộ lọc hoặc số lượng học sinh thay đổi
    useEffect(() => {
        setSliderValue(1);
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = 0;
        }
    }, [filterMode, searchTerm]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setSliderValue(val);

        if (tableContainerRef.current && filteredStudents.length > 1) {
            const maxScroll = tableContainerRef.current.scrollHeight - tableContainerRef.current.clientHeight;
            if (maxScroll > 0) {
                const scrollPercent = (val - 1) / (filteredStudents.length - 1);
                tableContainerRef.current.scrollTop = scrollPercent * maxScroll;
            }
        }
    };

    const handleTableScroll = () => {
        if (!tableContainerRef.current || filteredStudents.length <= 1) return;
        const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll <= 0) return;

        const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
        const idx = Math.round(ratio * (filteredStudents.length - 1)) + 1;
        setSliderValue(idx);
    };

    const scrollToTop = () => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const scrollToBottom = () => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTo({ 
                top: tableContainerRef.current.scrollHeight, 
                behavior: 'smooth' 
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-bounce-in flex flex-col max-h-[92vh] border-4 border-amber-400">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                            <Star className="w-7 h-7 text-yellow-200 fill-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                Danh Sách Học Sinh & Cột Ưu Tiên Quay
                            </h2>
                            <p className="text-amber-100 text-sm font-medium">
                                {studentsPerGroup === 1 
                                    ? 'Tick chọn học sinh ít được chọn trúng để tăng trọng số ưu tiên khi quay vòng ở Chế độ cá nhân'
                                    : `Tick chọn học sinh ít được chọn trúng để tăng trọng số ưu tiên khi quay vòng nhóm ${studentsPerGroup} bạn`
                                }
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar & Filters */}
                <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex flex-wrap gap-3 items-center justify-between shrink-0">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên học sinh..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-amber-200 shadow-sm text-xs font-bold">
                        <button
                            onClick={() => setFilterMode('all')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filterMode === 'all' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Tất cả ({students.length})
                        </button>
                        <button
                            onClick={() => setFilterMode('available')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filterMode === 'available' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Chưa quay ({availableCount})
                        </button>
                        <button
                            onClick={() => setFilterMode('prioritized')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filterMode === 'prioritized' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Ưu tiên ⭐ ({prioritizedCount})
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onSetAllPriority(true, true)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all shadow-sm"
                            title="Đánh dấu ưu tiên cho tất cả học sinh chưa được chọn"
                        >
                            <CheckSquare size={16} className="text-amber-600" />
                            Ưu tiên tất cả chưa quay
                        </button>
                        <button
                            onClick={() => onSetAllPriority(false)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm"
                            title="Xóa đánh dấu ưu tiên của tất cả"
                        >
                            <RotateCcw size={16} className="text-gray-500" />
                            Bỏ ưu tiên tất cả
                        </button>
                    </div>
                </div>

                {/* Thanh trượt duyệt nhanh danh sách học sinh */}
                {filteredStudents.length > 3 && (
                    <div className="px-5 py-2.5 bg-amber-100/70 border-b border-amber-200 flex flex-wrap items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 shrink-0">
                            <SlidersHorizontal size={15} className="text-amber-700" />
                            <span>Thanh trượt duyệt nhanh:</span>
                            <span className="bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full font-mono font-black shadow-inner">
                                {sliderValue} / {filteredStudents.length}
                            </span>
                            {filteredStudents[sliderValue - 1] && (
                                <span className="text-amber-900 font-bold bg-white/90 px-2 py-0.5 rounded-md border border-amber-300 truncate max-w-[160px]">
                                    {filteredStudents[sliderValue - 1].name}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 flex items-center gap-2 min-w-[220px]">
                            <button
                                onClick={scrollToTop}
                                className="p-1 hover:bg-amber-200 text-amber-900 rounded transition-colors"
                                title="Cuộn lên đầu danh sách"
                            >
                                <ArrowUpToLine size={16} />
                            </button>

                            <input
                                type="range"
                                min={1}
                                max={Math.max(1, filteredStudents.length)}
                                value={sliderValue}
                                onChange={handleSliderChange}
                                className="flex-1 h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600 shadow-inner"
                                title="Kéo thanh trượt để di chuyển nhanh danh sách học sinh"
                            />

                            <button
                                onClick={scrollToBottom}
                                className="p-1 hover:bg-amber-200 text-amber-900 rounded transition-colors"
                                title="Cuộn xuống cuối danh sách"
                            >
                                <ArrowDownToLine size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Student Table Container with prominent custom scrollbar */}
                <div 
                    ref={tableContainerRef}
                    onScroll={handleTableScroll}
                    className="flex-grow overflow-y-auto custom-scrollbar p-4 bg-gray-50 relative"
                >
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider sticky top-0 z-10 shadow-sm border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-center w-20 bg-gray-100">Ưu tiên</th>
                                    <th className="py-3 px-3 text-center w-14 bg-gray-100">STT</th>
                                    <th className="py-3 px-4 bg-gray-100">Tên học sinh</th>
                                    <th className="py-3 px-4 text-center w-36 bg-gray-100">Trạng thái</th>
                                    <th className="py-3 px-4 text-center w-36 bg-gray-100">Trọng số quay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                                            Không tìm thấy học sinh nào phù hợp.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((s, idx) => {
                                        const isPri = !!s.priority;
                                        const isHighlighted = idx + 1 === sliderValue;
                                        return (
                                            <tr 
                                                key={s.id}
                                                onClick={() => onTogglePriority(s.id)}
                                                className={`cursor-pointer transition-colors ${
                                                    isHighlighted
                                                        ? 'ring-2 ring-amber-400 bg-amber-100/90 font-bold'
                                                        : isPri 
                                                            ? 'bg-amber-50/70 hover:bg-amber-100/80 font-medium' 
                                                            : 'hover:bg-blue-50/50'
                                                }`}
                                            >
                                                {/* Checkbox Column */}
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isPri}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                onTogglePriority(s.id);
                                                            }}
                                                            className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer accent-amber-500"
                                                        />
                                                    </div>
                                                </td>

                                                {/* STT */}
                                                <td className="py-3 px-3 text-center text-gray-400 font-mono text-xs">
                                                    {idx + 1}
                                                </td>

                                                {/* Name */}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {isPri && (
                                                            <Star size={16} className="text-amber-500 fill-amber-400 shrink-0 animate-pulse" />
                                                        )}
                                                        <span className={`font-semibold ${isPri ? 'text-amber-900' : 'text-gray-800'}`}>
                                                            {s.name}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-3 px-4 text-center">
                                                    {s.selected ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                                                            <CheckCircle2 size={12} />
                                                            Đã trúng lượt
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                            Chưa quay
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Weight */}
                                                <td className="py-3 px-4 text-center">
                                                    {isPri ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-amber-200 text-amber-900 shadow-sm">
                                                            ⭐ Ưu tiên x5
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs font-medium">
                                                            Chuẩn x1
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Tip & Close */}
                <div className="p-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">💡 Mẹo sư phạm:</span>
                        <span>Những học sinh được tick (⭐) có xác suất trúng cao gấp 5 lần khi quay {studentsPerGroup === 1 ? 'cá nhân' : 'nhóm'} để các em ít được gọi có cơ hội tham gia.</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-8 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Hoàn tất & Quay tiếp
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StudentListModal;
