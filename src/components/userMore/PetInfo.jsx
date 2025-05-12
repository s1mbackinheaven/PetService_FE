import React from 'react';

// Component hiển thị thông tin thú cưng
const PetInfo = ({
    pets,
    selectedPet,
    isEditingPet,
    handlePetChange,
    handleEditPetChange,
    handleEditPetClick,
    handleUpdatePet,
    handleCancelPetEditClick,
    setShowAddPetModal
}) => {
    // Hàm xử lý format suggestion text
    const formatSuggestionText = (text) => {
        // Thay thế \n bằng thẻ br để xuống dòng
        return text.split('\\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div className="absolute w-[900px] h-[550px] top-[-130px] left-[300px] bg-white rounded-md p-4 z-10">
            <div>
                <div className='ml-[60px]'>
                    <div className="flex items-center mb-6">
                        <select
                            className="border border-gray-300 rounded px-3 py-2 w-[300px] mr-4"
                            onChange={handlePetChange}
                            value={selectedPet ? selectedPet.id : ''}
                        >
                            <option value="">Chọn pet của bạn ở đây</option>
                            {pets.map(pet => (
                                <option key={pet.id} value={pet.id}>{pet.nickName}</option>
                            ))}
                        </select>
                        <button
                            className="bg-[#273172] text-white px-4 py-1 rounded hover:bg-[#53a0e8] hover:cursor-pointer transition-colors duration-300"
                            onClick={() => setShowAddPetModal(true)}
                        >
                            Thêm Pet
                        </button>
                    </div>

                    {selectedPet && (
                        <div className="mt-6 max-h-[450px] overflow-y-auto pr-4">
                            <h3 className="text-[20px] font-semibold mb-6">Thông Tin Thú Cưng</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <span className="w-[150px] font-semibold block">Tên Gọi:</span>
                                    {isEditingPet ? (
                                        <input
                                            type="text"
                                            name="nickName"
                                            value={selectedPet.nickName}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        />
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.nickName}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="w-[150px] font-semibold block">Tên Loài:</span>
                                    {isEditingPet ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={selectedPet.name}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        />
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.name}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="w-[150px] font-semibold block">Loại:</span>
                                    {isEditingPet ? (
                                        <input
                                            type="text"
                                            name="type"
                                            value={selectedPet.type}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        />
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.type}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="w-[150px] font-semibold block">Giống:</span>
                                    {isEditingPet ? (
                                        <input
                                            type="text"
                                            name="breed"
                                            value={selectedPet.breed}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        />
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.breed}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="w-[150px] font-semibold block">Giới Tính:</span>
                                    {isEditingPet ? (
                                        <select
                                            name="gender"
                                            value={selectedPet.gender}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        >
                                            <option value="Male">Nam</option>
                                            <option value="Female">Nữ</option>
                                        </select>
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.gender}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="w-[150px] font-semibold block">Cân Nặng (kg):</span>
                                    {isEditingPet ? (
                                        <input
                                            type="number"
                                            name="weight"
                                            value={selectedPet.weight}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        />
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.weight}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="w-[150px] font-semibold block">Ngày Sinh:</span>
                                    {isEditingPet ? (
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={selectedPet.birthday}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        />
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.birthday}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="w-[200px] font-semibold block">Tình Trạng Sức Khỏe:</span>
                                    {isEditingPet ? (
                                        <input
                                            type="text"
                                            name="healthStatus"
                                            value={selectedPet.healthStatus}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-[300px] mt-1"
                                        />
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.healthStatus}</span>
                                    )}
                                </div>
                                <div className="mb-4 col-span-2">
                                    <span className="w-[150px] font-semibold block">Mô Tả:</span>
                                    {isEditingPet ? (
                                        <textarea
                                            name="description"
                                            value={selectedPet.description}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-full mt-1 h-24"
                                        ></textarea>
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.description}</span>
                                    )}
                                </div>
                                <div className="mb-4 col-span-2">
                                    <span className="w-[200px] font-semibold block">Lịch Sử Sức Khỏe:</span>
                                    {isEditingPet ? (
                                        <textarea
                                            name="healthHistory"
                                            value={selectedPet.healthHistory}
                                            onChange={handleEditPetChange}
                                            className="border border-gray-300 rounded px-2 py-1 w-full mt-1 h-24"
                                        ></textarea>
                                    ) : (
                                        <span className="text-gray-700 block mt-1">{selectedPet.healthHistory}</span>
                                    )}
                                </div>
                            </div>

                            {selectedPet.suggestion && (
                                <div className="mt-6">
                                    <h3 className="text-[20px] font-semibold mb-4">Đề Xuất</h3>
                                    <div className="bg-gray-100 p-4 rounded whitespace-pre-line">
                                        {formatSuggestionText(selectedPet.suggestion)}
                                    </div>
                                </div>
                            )}

                            <div className='flex items-center gap-4 mt-6 sticky bottom-0 bg-white py-2'>
                                {isEditingPet ? (
                                    <>
                                        <button
                                            className='bg-[#273172] text-white px-[30px] rounded-[5px] uppercase font-[500] text-[15px] hover:bg-[#53a0e8] hover:cursor-pointer transition-colors duration-300'
                                            onClick={handleUpdatePet}
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            className='bg-gray-500 text-white px-[30px] rounded-[5px] uppercase font-[500] text-[15px] hover:bg-gray-600 hover:cursor-pointer transition-colors duration-300'
                                            onClick={handleCancelPetEditClick}
                                        >
                                            Hủy
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className='bg-[#273172] text-white px-[30px] rounded-[5px] uppercase font-[500] text-[15px] hover:bg-[#53a0e8] hover:cursor-pointer transition-colors duration-300'
                                        onClick={handleEditPetClick}
                                    >
                                        Cập Nhật
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetInfo; 