
import React from 'react';
import { X } from 'lucide-react';
import { CustomVideoPlayer } from './CustomVideoPlayer';

interface VideoModalProps {
    videoUrl: string;
    title: string;
    onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, title, onClose }) => {
    const handleClose = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 p-3 sm:p-4 bg-white border-b border-gray-100 absolute top-0 left-0 right-0 z-10 opacity-90 hover:opacity-100 transition-opacity">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 pr-2 leading-6 break-words">{title}</h3>
                    <button 
                        onClick={handleClose}
                        className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Video Container (16:9 Aspect Ratio) */}
                <div className="relative w-full pt-[56.25%] bg-black">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <CustomVideoPlayer url={videoUrl} title={title} />
                    </div>
                </div>
                
                {/* Footer Info */}
                <div className="bg-gray-50 p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-500">
                    شرح تفصيلي مقدم من منصة المئة التعليمية
                </div>
            </div>
        </div>
    );
};
