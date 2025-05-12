/**
 * Định dạng ngày giờ ISO thành dạng ngày tháng dễ đọc
 * @param {string} isoDate - Chuỗi ngày giờ định dạng ISO
 * @returns {string} Ngày tháng đã được định dạng
 */
export const formatDate = (isoDate) => {
    if (!isoDate) return 'Không xác định';

    const date = new Date(isoDate);

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
    }

    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
    const year = date.getFullYear();

    // Định dạng DD/MM/YYYY
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
};

/**
 * Định dạng ngày giờ ISO thành chuỗi "X thời gian trước"
 * @param {string} isoDate - Chuỗi ngày giờ định dạng ISO
 * @returns {string} Thời gian tương đối
 */
export const formatRelativeTime = (isoDate) => {
    if (!isoDate) return 'Không xác định';

    const date = new Date(isoDate);
    const now = new Date();

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
    }

    const diffInSeconds = Math.floor((now - date) / 1000);

    // Các khoảng thời gian tính bằng giây
    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (diffInSeconds < minute) {
        return 'Vừa xong';
    } else if (diffInSeconds < hour) {
        const minutes = Math.floor(diffInSeconds / minute);
        return `${minutes} phút trước`;
    } else if (diffInSeconds < day) {
        const hours = Math.floor(diffInSeconds / hour);
        return `${hours} giờ trước`;
    } else if (diffInSeconds < week) {
        const days = Math.floor(diffInSeconds / day);
        return `${days} ngày trước`;
    } else if (diffInSeconds < month) {
        const weeks = Math.floor(diffInSeconds / week);
        return `${weeks} tuần trước`;
    } else if (diffInSeconds < year) {
        const months = Math.floor(diffInSeconds / month);
        return `${months} tháng trước`;
    } else {
        const years = Math.floor(diffInSeconds / year);
        return `${years} năm trước`;
    }
}; 