import React, { useState } from 'react';
import { AIModelConfig, ModelProvider } from '../types';
import { Save, Plus, Trash2, Key, Globe, Cpu } from 'lucide-react';

interface SettingsPanelProps {
  configs: AIModelConfig[];
  setConfigs: React.Dispatch<React.SetStateAction<AIModelConfig[]>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ configs, setConfigs }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = (id: string, field: keyof AIModelConfig, value: any) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const toggleActive = (id: string) => {
    setConfigs(prev => prev.map(c => ({
      ...c,
      isActive: c.id === id
    })));
  };

  const addNewModel = () => {
    const newModel: AIModelConfig = {
      id: Date.now().toString(),
      name: 'New Model',
      provider: ModelProvider.DEEPSEEK,
      apiKey: '',
      baseUrl: 'https://api.deepseek.com/v1',
      modelName: 'deepseek-chat',
      isActive: false
    };
    setConfigs([...configs, newModel]);
    setEditingId(newModel.id);
  };

  const removeModel = (id: string) => {
    setConfigs(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">大模型 API 设置</h2>
          <p className="text-sm text-gray-500">配置 Deepseek, SiliconFlow, Gemini 等模型的连接参数。</p>
        </div>
        <button
          onClick={addNewModel}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          添加模型
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <div 
            key={config.id} 
            className={`border rounded-xl p-5 relative transition-all duration-200 ${config.isActive ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${config.provider === ModelProvider.GEMINI ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                    <Cpu size={20} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900">{config.name}</h3>
                   <span className="text-xs uppercase font-mono text-gray-500 bg-gray-100 px-1 rounded">{config.provider}</span>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 <button 
                  onClick={() => toggleActive(config.id)}
                  className={`text-xs px-2 py-1 rounded-full border ${config.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                 >
                   {config.isActive ? '当前使用' : '设为默认'}
                 </button>
                 <button onClick={() => removeModel(config.id)} className="text-red-400 hover:text-red-600 p-1">
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">配置名称</label>
                <input 
                  type="text" 
                  value={config.name} 
                  onChange={(e) => handleUpdate(config.id, 'name', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">提供商</label>
                <select 
                  value={config.provider}
                  onChange={(e) => handleUpdate(config.id, 'provider', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white"
                >
                  {Object.values(ModelProvider).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                  <Globe size={12} /> API Base URL
                </label>
                <input 
                  type="text" 
                  value={config.baseUrl || ''} 
                  placeholder="https://api..."
                  onChange={(e) => handleUpdate(config.id, 'baseUrl', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">模型名称 (Model ID)</label>
                <input 
                  type="text" 
                  value={config.modelName} 
                  onChange={(e) => handleUpdate(config.id, 'modelName', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                   <Key size={12} /> API Key
                </label>
                <input 
                  type="password" 
                  value={config.apiKey} 
                  placeholder="sk-..."
                  onChange={(e) => handleUpdate(config.id, 'apiKey', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border font-mono"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
               <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                 <Save size={14} /> 保存配置
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPanel;
