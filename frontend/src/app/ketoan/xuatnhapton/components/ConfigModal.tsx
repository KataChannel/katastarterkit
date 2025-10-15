import React from 'react';
import { UserConfig } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  currentConfig: UserConfig | null;
  onSave: (config: UserConfig) => void;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  currentConfig,
  onSave,
  onClose,
}) => {
  const [mst, setMst] = React.useState(currentConfig?.mst || '');
  const [companyName, setCompanyName] = React.useState(currentConfig?.companyName || '');
  
  React.useEffect(() => {
    if (currentConfig) {
      setMst(currentConfig.mst);
      setCompanyName(currentConfig.companyName);
    }
  }, [currentConfig]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mst.trim()) {
      onSave({ mst: mst.trim(), companyName: companyName.trim() });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Cấu Hình Mã Số Thuế</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã Số Thuế (MST) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={mst}
              onChange={(e) => setMst(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mã số thuế của bạn"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              MST dùng để phân loại hóa đơn bán/mua
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Công Ty
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên công ty"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
