
import React from 'react';
import { HistoryRecord, QUESTIONS_PER_TURN, POINTS_PER_QUESTION } from '../types';
import { X, Clock, Trophy, Download } from 'lucide-react';

interface HistoryModalProps {
    history: HistoryRecord[];
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose }) => {

    const handleExportExcel = async () => {
        if (history.length === 0) {
            alert("Chưa có dữ liệu lịch sử để xuất.");
            return;
        }

        try {
            // Loading XLSX with a fallback for various module formats
            const xlsxModule = await import('xlsx');
            // Some CDNs/versions might put everything in 'default'
            const XLSX = xlsxModule.default || xlsxModule;
            
            const fileSaverModule = await import('file-saver');
            const saveAs = fileSaverModule.saveAs || fileSaverModule.default?.saveAs || fileSaverModule.default;

            if (!XLSX || !XLSX.utils) {
                throw new Error("Không thể tải thư viện XLSX. Vui lòng thử lại.");
            }

            // 1. Prepare data
            const dataToExport = history.map((record, index) => {
                const score10 = record.score;
                let rating = "Cần cố gắng";
                if (score10 >= 9) rating = "Xuất sắc";
                else if (score10 >= 8) rating = "Giỏi";
                else if (score10 >= 6.5) rating = "Khá";
                else if (score10 >= 5) rating = "Đạt";
                
                const correct = record.correctCount !== undefined 
                    ? record.correctCount 
                    : Math.round((record.score / 10) * record.totalQuestions);

                return {
                    "STT": index + 1,
                    "Thời gian": new Date(record.timestamp).toLocaleString('vi-VN'),
                    "Học sinh / Nhóm": record.studentName,
                    "Điểm (Thang 10)": record.score,
                    "Số câu đúng": `${correct}/${record.totalQuestions}`,
                    "Thang điểm": 10,
                    "Đánh giá": rating
                };
            });

            // 2. Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);

            // Adjust column width
            const wscols = [
                { wch: 5 },  // STT
                { wch: 20 }, // Time
                { wch: 28 }, // Name
                { wch: 16 }, // Score
                { wch: 14 }, // Correct count
                { wch: 12 }, // Max scale
                { wch: 15 }  // Rating
            ];
            worksheet['!cols'] = wscols;

            // 3. Create workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch sử trò chơi");

            // 4. Write and save
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            const fileName = `Lich_su_Vong_Quay_${new Date().toISOString().slice(0,10)}.xlsx`;
            
            if (typeof saveAs === 'function') {
                saveAs(blob, fileName);
            } else {
                // Fallback download if saveAs is not available
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.error("Lỗi xuất Excel:", error);
            alert("Có lỗi xảy ra khi tạo file Excel. Vui lòng kiểm tra kết nối mạng và thử lại.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[80vh] animate-bounce-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Lịch sử trò chơi
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-grow p-6">
                    {history.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            <p className="text-lg">Chưa có lượt chơi nào được ghi lại.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Học sinh / Nhóm</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Điểm (Thang 10)</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Số câu đúng</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {history.map((record) => {
                                        const score10 = record.score;
                                        const correct = record.correctCount !== undefined 
                                            ? record.correctCount 
                                            : Math.round((record.score / 10) * record.totalQuestions);
                                        
                                        return (
                                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(record.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {record.studentName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="text-2xl font-black text-blue-700">{score10}</span>
                                                    <span className="text-xs text-gray-400 font-bold"> / 10</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
                                                        {correct} / {record.totalQuestions} câu
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {score10 >= 9 ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                            <Trophy size={14} className="fill-yellow-500 text-yellow-600" /> Xuất sắc
                                                        </span>
                                                    ) : score10 >= 8 ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                            Giỏi
                                                        </span>
                                                    ) : score10 >= 6.5 ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                                            Khá
                                                        </span>
                                                    ) : score10 >= 5 ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                                            Đạt
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                                            Cần cố gắng
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleExportExcel}
                        disabled={history.length === 0}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all shadow-sm ${
                            history.length === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-0.5'
                        }`}
                    >
                        <Download size={18} />
                        Xuất Excel
                    </button>

                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
