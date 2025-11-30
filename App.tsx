import React, { useState } from 'react';
import { MessageSquare, Settings as SettingsIcon, Server, Menu, Search, User, Bell, ChevronRight, Home } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import SettingsPanel from './components/SettingsPanel';
import MCPDashboard from './components/MCPDashboard';
import { AIModelConfig, ModelProvider, MCPService, MCPSettings } from './types';

// Mock Data Initialization
const DEFAULT_MODELS: AIModelConfig[] = [
  {
    id: '1',
    name: 'Gemini Pro',
    provider: ModelProvider.GEMINI,
    apiKey: '', // Uses process.env.API_KEY by default in service
    modelName: 'gemini-2.5-flash',
    isActive: true
  },
  {
    id: '2',
    name: 'DeepSeek Chat',
    provider: ModelProvider.DEEPSEEK,
    apiKey: '',
    baseUrl: 'https://api.deepseek.com',
    modelName: 'deepseek-chat',
    isActive: false
  },
  {
    id: '3',
    name: 'SiliconFlow Qwen',
    provider: ModelProvider.SILICONFLOW,
    apiKey: '',
    baseUrl: 'https://api.siliconflow.cn/v1',
    modelName: 'Qwen/Qwen2.5-7B-Instruct',
    isActive: false
  }
];

const DEFAULT_MCPS: MCPService[] = [
  {
    id: 'm1',
    name: 'FileSystem MCP',
    description: 'Allows safe access to local file system operations.',
    isEnabled: true,
    status: 'running',
    configPath: 'C:\\Users\\Admin\\.mcp\\filesystem.json'
  },
  {
    id: 'm2',
    name: 'Git Integration',
    description: 'Provides git command capabilities to the agent.',
    isEnabled: true,
    status: 'stopped',
    configPath: 'C:\\Users\\Admin\\.mcp\\git_config.json'
  },
  {
    id: 'm3',
    name: 'Database Connector',
    description: 'SQL Interface for local SQLite databases.',
    isEnabled: false,
    status: 'error',
    errorMessage: 'Missing driver dependency',
    configPath: 'C:\\Users\\Admin\\.mcp\\db_connect.json'
  }
];

const DEFAULT_MCP_SETTINGS: MCPSettings = {
  uvInstalled: true,
  pythonPath: 'C:\\Python311\\python.exe',
  mcpRegistryPath: 'C:\\Users\\Admin\\.mcp\\registry'
};

const MenuItem = ({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 relative
      ${active ? 'bg-[#18bc9c] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
      ${collapsed ? 'justify-center' : ''}
    `}
    title={collapsed ? label : undefined}
  >
    <span className="flex-shrink-0">{icon}</span>
    {!collapsed && <span className="font-medium truncate">{label}</span>}
    {active && !collapsed && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-20"></div>}
  </button>
);

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'config' | 'mcp'>('chat');
  const [modelConfigs, setModelConfigs] = useState<AIModelConfig[]>(DEFAULT_MODELS);
  const [mcpServices, setMcpServices] = useState<MCPService[]>(DEFAULT_MCPS);
  const [mcpSettings, setMcpSettings] = useState<MCPSettings>(DEFAULT_MCP_SETTINGS);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const activeModel = modelConfigs.find(c => c.isActive) || modelConfigs[0];

  const handleUpdateMCPService = (id: string, updates: Partial<MCPService>) => {
    setMcpServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleUpdateMCPSettings = (updates: Partial<MCPSettings>) => {
    setMcpSettings(prev => ({ ...prev, ...updates }));
  };

  const handleModelSelect = (id: string) => {
    setModelConfigs(prev => prev.map(c => ({
      ...c,
      isActive: c.id === id
    })));
  };

  return (
    <div className="flex h-screen bg-[#f1f4f6] font-sans text-sm overflow-hidden">
      {/* Sidebar - Simulating FastAdmin Menu */}
      <aside className={`${isSidebarOpen ? 'w-56' : 'w-16'} bg-[#2c3e50] text-white flex flex-col shadow-xl z-20 transition-all duration-300 flex-shrink-0`}>
        <div className="h-14 flex items-center justify-center bg-[#2c3e50] border-b border-[#1f2d3d] font-bold text-xl tracking-wide overflow-hidden whitespace-nowrap">
           {isSidebarOpen ? 
             <div className="flex items-center"><span className="text-[#18bc9c] mr-1">Fast</span>Admin</div> : 
             <span className="text-[#18bc9c]">FA</span>
           }
        </div>

        {/* User Info Mock */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-[#1f2d3d] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border-2 border-gray-500">
               <User size={24} className="text-gray-300" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold truncate">Super Admin</div>
              <div className="text-xs text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          <div className={`px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
            插件管理
          </div>
          
          <MenuItem 
            icon={<MessageSquare size={18}/>} 
            label="AI 智能助手" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            collapsed={!isSidebarOpen} 
          />
          <MenuItem 
            icon={<SettingsIcon size={18}/>} 
            label="模型参数设置" 
            active={activeTab === 'config'} 
            onClick={() => setActiveTab('config')} 
            collapsed={!isSidebarOpen} 
          />
          <MenuItem 
            icon={<Server size={18}/>} 
            label="MCP 服务列表" 
            active={activeTab === 'mcp'} 
            onClick={() => setActiveTab('mcp')} 
            collapsed={!isSidebarOpen} 
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-14 bg-white shadow-sm flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <nav className="hidden md:flex items-center text-xs text-gray-500 gap-2">
               <Home size={14} className="mb-0.5" />
               <span className="hover:text-gray-800 cursor-pointer">首页</span>
               <ChevronRight size={12} />
               <span className="hover:text-gray-800 cursor-pointer">插件中心</span>
               <ChevronRight size={12} />
               <span className="text-gray-800 font-medium">FastAdmin AI</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Search size={18} />
             </button>
             <button className="text-sm text-gray-600 hover:text-gray-900 ml-2">清除缓存</button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-hidden relative bg-[#f1f4f6]">
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <ChatInterface 
                activeConfig={activeModel} 
                allConfigs={modelConfigs}
                onModelSelect={handleModelSelect}
              />
            </div>
          )}
          
          {activeTab === 'config' && (
            <div className="h-full p-4 md:p-6 overflow-auto animate-fadeIn">
               <SettingsPanel configs={modelConfigs} setConfigs={setModelConfigs} />
            </div>
          )}
          
          {activeTab === 'mcp' && (
            <div className="h-full p-4 md:p-6 overflow-auto animate-fadeIn">
               <MCPDashboard 
                 services={mcpServices} 
                 settings={mcpSettings} 
                 onUpdateService={handleUpdateMCPService} 
                 onUpdateSettings={handleUpdateMCPSettings} 
               />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;