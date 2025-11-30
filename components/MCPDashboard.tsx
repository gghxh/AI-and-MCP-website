import React, { useState } from 'react';
import { MCPService, MCPSettings } from '../types';
import { Settings, Play, Square, AlertCircle, FolderOpen, CheckCircle2, XCircle, Terminal, FileCode, Save, X } from 'lucide-react';

interface MCPDashboardProps {
  services: MCPService[];
  settings: MCPSettings;
  onUpdateService: (id: string, updates: Partial<MCPService>) => void;
  onUpdateSettings: (updates: Partial<MCPSettings>) => void;
}

const MCPDashboard: React.FC<MCPDashboardProps> = ({ services, settings, onUpdateService, onUpdateSettings }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editorData, setEditorData] = useState<{ path: string, content: string } | null>(null);

  const toggleServiceStatus = (id: string, currentStatus: string) => {
    // Simulate starting/stopping
    const newStatus = currentStatus === 'running' ? 'stopped' : 'running';
    onUpdateService(id, { status: newStatus as any });
  };

  const handleOpenConfig = (path: string) => {
    // Simulate windows open command
    // In a real Electron/Tauri app, this would use shell.openPath()
    alert(`[模拟 Windows 系统调用]\n\n正在打开文件: ${path}\n\n执行命令: explorer.exe /select,"${path}"`);
  };

  const handleOpenRegistryEditor = () => {
    // Mock reading the configuration file
    const mockContent = JSON.stringify({
      "registry_version": "1.0.2",
      "update_channel": "stable",
      "log_level": "info",
      "security": {
        "allow_remote_connections": false,
        "trusted_domains": ["github.com", "gitlab.com"]
      },
      "mcp_servers": {
         "filesystem": {
             "command": "npx",
             "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Users/Admin/Documents"]
         }
      }
    }, null, 4);

    setEditorData({
      path: `${settings.mcpRegistryPath}\\config.json`,
      content: mockContent
    });
  };

  const handleSaveEditor = () => {
    if (!editorData) return;
    // Simulate saving functionality
    alert(`[系统提示]\n\n配置文件已保存至:\n${editorData.path}\n\nMCP 服务将在重启后应用新配置。`);
    setEditorData(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">MCP 服务管理</h2>
          <p className="text-sm text-gray-500 mt-1">Model Context Protocol 插件列表及运行状态监控</p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#18bc9c] text-white rounded-md hover:bg-[#16a085] transition-colors shadow-sm text-sm"
        >
          <Settings size={16} />
          环境配置
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-6 bg-[#f9fafb]">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">MCP 名称 / 描述</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">运行状态</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">配置文件路径</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#18bc9c]/10 text-[#18bc9c] rounded-lg flex items-center justify-center font-bold border border-[#18bc9c]/20">
                        {service.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{service.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${service.status === 'running' ? 'bg-green-100 text-green-800 border-green-200' : 
                          service.status === 'error' ? 'bg-red-100 text-red-800 border-red-200' : 
                          'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {service.status === 'running' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>}
                        {service.status === 'running' ? 'Running' : service.status === 'error' ? 'Error' : 'Stopped'}
                      </span>
                      {service.status === 'error' && (
                          <div className="text-[10px] text-red-500 flex items-center gap-1 font-mono bg-red-50 px-1 py-0.5 rounded">
                              <AlertCircle size={10} /> {service.errorMessage}
                          </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 group">
                        <code className="text-xs bg-gray-100 px-2 py-1.5 rounded border border-gray-200 text-gray-600 font-mono truncate max-w-[200px] select-all">
                            {service.configPath}
                        </code>
                        <button 
                            onClick={() => handleOpenConfig(service.configPath)}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="在资源管理器中打开"
                        >
                            <FolderOpen size={16} />
                        </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => toggleServiceStatus(service.id, service.status)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 border
                            ${service.status === 'running' 
                                ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' 
                                : 'bg-[#18bc9c] border-transparent text-white hover:bg-[#16a085]'}`}
                        >
                            {service.status === 'running' ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                            {service.status === 'running' ? '停止服务' : '启动服务'}
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="p-10 text-center text-gray-400 text-sm">暂无 MCP 服务</div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-[40] flex items-center justify-center backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Settings size={20} className="text-gray-500" />
                MCP 环境设置
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 p-1 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Dependency Check */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Terminal size={16} /> 系统组件检测
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                        <span className="text-sm text-gray-700 font-medium">UV Package Manager</span>
                        {settings.uvInstalled ? (
                            <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded"><CheckCircle2 size={14} /> 已安装</span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded"><AlertCircle size={14} /> 未检测到</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                        <span className="text-sm text-gray-700 font-medium">Python Runtime</span>
                        <div className="flex items-center gap-2">
                             <code className="text-xs text-gray-500 bg-gray-100 px-1 rounded">3.11.0</code>
                             <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded"><CheckCircle2 size={14} /> Ready</span>
                        </div>
                    </div>
                </div>
              </div>

              {/* Paths */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">MCP Registry Path</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={settings.mcpRegistryPath} 
                            onChange={(e) => onUpdateSettings({ mcpRegistryPath: e.target.value })}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#18bc9c] focus:ring-[#18bc9c] text-sm border p-2 bg-gray-50 font-mono"
                        />
                        <button 
                          onClick={handleOpenRegistryEditor}
                          className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 text-gray-600 text-sm transition-colors flex items-center gap-1"
                          title="编辑配置文件"
                        >
                          <FileCode size={16} />
                          <span className="hidden sm:inline">打开</span>
                        </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Python Executable Path</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={settings.pythonPath} 
                            onChange={(e) => onUpdateSettings({ pythonPath: e.target.value })}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#18bc9c] focus:ring-[#18bc9c] text-sm border p-2 bg-gray-50 font-mono"
                        />
                         <button className="px-3 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-600 text-sm">...</button>
                    </div>
                  </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={() => {
                    // Logic to save
                    setIsSettingsOpen(false);
                }}
                className="px-4 py-2 bg-[#18bc9c] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#16a085] shadow-sm"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorData && (
        <div className="fixed inset-0 bg-black/60 z-[50] flex items-center justify-center backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
             {/* Editor Header */}
             <div className="flex justify-between items-center px-4 py-3 bg-[#2d3e50] text-white border-b border-gray-700">
               <div className="flex items-center gap-2 overflow-hidden">
                 <FileCode size={18} className="text-[#18bc9c]" />
                 <span className="font-mono text-sm truncate">{editorData.path}</span>
               </div>
               <button onClick={() => setEditorData(null)} className="text-gray-400 hover:text-white transition-colors">
                 <X size={20} />
               </button>
             </div>
             
             {/* Editor Toolbar */}
             <div className="flex items-center gap-2 px-4 py-2 bg-[#f8f9fa] border-b border-gray-200 text-xs">
                <span className="text-gray-500">Language: JSON</span>
                <div className="w-px h-3 bg-gray-300 mx-1"></div>
                <span className="text-gray-500">Encoding: UTF-8</span>
             </div>

             {/* Editor Content */}
             <div className="flex-1 relative bg-[#1e1e1e]">
               <textarea
                 value={editorData.content}
                 onChange={(e) => setEditorData({ ...editorData, content: e.target.value })}
                 className="absolute inset-0 w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none focus:outline-none leading-6"
                 spellCheck={false}
               />
             </div>

             {/* Editor Footer */}
             <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
               <span className="text-xs text-gray-500">Lines: {editorData.content.split('\n').length}</span>
               <div className="flex gap-2">
                 <button 
                   onClick={() => setEditorData(null)}
                   className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
                 >
                   取消
                 </button>
                 <button 
                   onClick={handleSaveEditor}
                   className="px-3 py-1.5 text-sm text-white bg-[#18bc9c] hover:bg-[#16a085] rounded shadow-sm flex items-center gap-1.5 transition-colors"
                 >
                   <Save size={14} />
                   保存文件
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPDashboard;