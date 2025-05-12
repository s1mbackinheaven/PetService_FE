import React, { useEffect } from 'react';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

// Component Toast đơn giản để hiển thị thông báo
const Toast = ({ message, duration = 3000, onClose, type = 'success' }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    // Xác định màu sắc dựa trên loại thông báo
    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-[#273171]';
            case 'error':
                return 'bg-red-600';
            default:
                return 'bg-[#273171]';
        }
    };

    return (
        <div
            className={`fixed bottom-8 right-8 z-[9999] max-w-xs ${getBackgroundColor()} text-white p-4 rounded-md shadow-lg flex items-center animate-slide-up`}
        >
            <div className="mr-3">
                {type === 'success' ? (
                    <CheckCircleFilled className="text-lg" />
                ) : (
                    <CloseCircleFilled className="text-lg" />
                )}
            </div>
            <div className="flex-1">{message}</div>
        </div>
    );
};

export default Toast; 