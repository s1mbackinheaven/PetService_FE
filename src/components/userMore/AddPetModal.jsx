import React from 'react';

// Component hiển thị modal thêm thú cưng mới
const AddPetModal = ({
    showAddPetModal,
    setShowAddPetModal,
    newPet,
    handleNewPetChange,
    handleAddPet
}) => {
    if (!showAddPetModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
                <h3 className="text-[20px] font-semibold mb-6">Thêm Thú Cưng Mới</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tên Gọi:</label>
                        <input
                            type="text"
                            name="nickName"
                            value={newPet.nickName}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tên Loài:</label>
                        <input
                            type="text"
                            name="name"
                            value={newPet.name}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Loại:</label>
                        <input
                            type="text"
                            name="type"
                            value={newPet.type}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Giống:</label>
                        <input
                            type="text"
                            name="breed"
                            value={newPet.breed}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Giới Tính:</label>
                        <select
                            name="gender"
                            value={newPet.gender}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Cân Nặng (kg):</label>
                        <input
                            type="number"
                            name="weight"
                            value={newPet.weight}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Ngày Sinh:</label>
                        <input
                            type="date"
                            name="birthday"
                            value={newPet.birthday}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tình Trạng Sức Khỏe:</label>
                        <input
                            type="text"
                            name="healthStatus"
                            value={newPet.healthStatus}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Mô Tả:</label>
                        <textarea
                            name="description"
                            value={newPet.description}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full h-24"
                        ></textarea>
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Lịch Sử Sức Khỏe:</label>
                        <textarea
                            name="healthHistory"
                            value={newPet.healthHistory}
                            onChange={handleNewPetChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full h-24"
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                        onClick={() => setShowAddPetModal(false)}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-[#273172] text-white px-6 py-2 rounded hover:bg-[#53a0e8]"
                        onClick={handleAddPet}
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPetModal; 