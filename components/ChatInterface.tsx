import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AIModelConfig, AttachedFile } from '../types';
import { generateAIResponse } from '../services/aiService';
import { Send, Paperclip, Copy, Terminal, User, Bot, Loader2, X, FileText, Image as ImageIcon, Check, ChevronUp } from 'lucide-react';

interface ChatInterfaceProps {
  activeConfig: AIModelConfig;
  allConfigs: AIModelConfig[];
  onModelSelect: (id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeConfig, allConfigs, onModelSelect }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: `Welcome! You are currently connected to **${activeConfig.name}** (${activeConfig.modelName}). How can I help you today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((item) => {
        const file = item as File;
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setAttachments(prev => [...prev, {
              name: file.name,
              type: file.type,
              data: ev.target!.result as string
            }]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const executeCommand = (cmd: string) => {
    alert(`[模拟终端执行]\nCommand: ${cmd}\n\nExecuting in Plugin Environment...\n> Done.`);
  };

  const sendMessage = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const responseText = await generateAIResponse([...messages, userMsg], activeConfig);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple formatter for message content
  const renderContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, idx) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const lang = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={idx} className="my-3 rounded-md overflow-hidden bg-[#282c34] border border-gray-700 shadow-sm group/code">
            <div className="flex justify-between items-center px-4 py-2 bg-[#21252b] border-b border-gray-700">
              <span className="text-xs text-gray-400 font-mono">{lang || 'Code'}</span>
              <div className="flex gap-2">
                 <button onClick={() => copyToClipboard(code)} className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors">
                   <Copy size={12} /> Copy
                 </button>
                 {(lang === 'bash' || lang === 'sh' || lang === 'cmd' || lang === 'powershell') && (
                   <button onClick={() => executeCommand(code)} className="text-green-500 hover:text-green-400 text-xs flex items-center gap-1 font-bold transition-colors">
                     <Terminal size={12} /> Exec
                   </button>
                 )}
              </div>
            </div>
            <pre className="p-4 text-sm text-[#abb2bf] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {code}
            </pre>
          </div>
        );
      }
      // Basic text formatting (bold only for simplicity)
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return <span key={idx} className="whitespace-pre-wrap">{boldParts.map((p, i) => 
        p.startsWith('**') && p.endsWith('**') ? <strong key={i} className="font-bold text-gray-900">{p.slice(2, -2)}</strong> : p
      )}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f1f4f6] relative">
      {/* Top Bar - Minimal inside chat as App has header */}
      <div className="h-10 border-b border-gray-200 flex items-center px-6 justify-center bg-white shadow-sm z-10 text-xs text-gray-500">
          <span className="mr-1">当前模型:</span>
          <span className="font-semibold text-blue-600 flex items-center gap-1">
             {activeConfig.name} 
             <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 text-[10px]">{activeConfig.modelName}</span>
          </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-default">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role !== 'user' && (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md border-2 border-white">
                <Bot size={20} />
              </div>
            )}
            
            <div className={`max-w-[85%] md:max-w-[75%] space-y-1`}>
               {/* User Attachments Preview inside bubble */}
               {msg.attachments && msg.attachments.length > 0 && (
                 <div className={`flex gap-2 flex-wrap mb-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                   {msg.attachments.map((att, i) => (
                      <div key={i} className="p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                         {att.type.startsWith('image/') ? (
                           <img src={att.data} alt={att.name} className="h-24 w-auto rounded object-cover" />
                         ) : (
                           <div className="flex items-center gap-2 text-xs text-gray-600 px-2 py-1">
                             <FileText size={16} className="text-blue-500" /> 
                             <span className="max-w-[150px] truncate">{att.name}</span>
                           </div>
                         )}
                      </div>
                   ))}
                 </div>
               )}

               {/* Message Bubble */}
               <div className={`group relative p-3 md:p-4 shadow-sm text-sm leading-7 transition-all
                 ${msg.role === 'user' 
                   ? 'bg-[#18bc9c] text-white rounded-2xl rounded-tr-none hover:bg-[#16a085]' 
                   : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none hover:shadow-md'}`}>
                 
                 {renderContent(msg.content)}

                 {/* Copy Button for Message Text */}
                 <button 
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className={`absolute bottom-1 ${msg.role === 'user' ? '-left-8 text-gray-400' : '-right-8 text-gray-400'} p-1.5 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all`}
                    title="复制内容"
                 >
                    {copiedId === msg.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                 </button>
               </div>
               
               <div className={`text-[10px] text-gray-400 ${msg.role === 'user' ? 'text-right pr-1' : 'pl-1'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#18bc9c] flex items-center justify-center flex-shrink-0 text-white shadow-md border-2 border-white">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md border-2 border-white">
                <Bot size={20} />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-indigo-600" />
                 <span className="text-sm text-gray-500">正在思考中...</span>
              </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        {attachments.length > 0 && (
          <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group flex-shrink-0 animate-fadeIn">
                <div className="h-16 w-16 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                   {att.type.startsWith('image/') ? (
                     <img src={att.data} alt="preview" className="w-full h-full object-cover" />
                   ) : (
                     <FileText className="text-gray-400" size={24} />
                   )}
                </div>
                <button 
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                >
                  <X size={10} />
                </button>
                <span className="text-[10px] text-gray-500 truncate w-16 block mt-1 text-center">{att.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Backdrop for closing dropdown */}
        {isModelDropdownOpen && (
           <div 
             className="fixed inset-0 z-10" 
             onClick={() => setIsModelDropdownOpen(false)}
           />
        )}

        <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-[#18bc9c]/20 focus-within:border-[#18bc9c] transition-all">
           
           {/* Model Switcher Dropdown Trigger */}
           <div className="relative z-20">
               <button 
                 onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                 className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isModelDropdownOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-200'}`}
                 title="切换 AI 模型"
               >
                 <Bot size={20} />
                 {isModelDropdownOpen && <ChevronUp size={12} />}
               </button>

               {isModelDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-3 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-fadeIn origin-bottom-left">
                     <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500">
                       选择模型
                     </div>
                     <div className="max-h-60 overflow-y-auto">
                        {allConfigs.map(config => (
                          <button
                            key={config.id}
                            onClick={() => {
                              onModelSelect(config.id);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors
                              ${config.id === activeConfig.id ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-gray-700'}
                            `}
                          >
                            <span className="truncate">{config.name}</span>
                            {config.id === activeConfig.id && <Check size={14} className="flex-shrink-0" />}
                          </button>
                        ))}
                     </div>
                     <div className="px-3 py-2 bg-gray-50 text-[10px] text-gray-400 text-center">
                        当前使用: {activeConfig.provider}
                     </div>
                  </div>
               )}
           </div>
           
           <div className="w-px h-6 bg-gray-200 mb-2 mx-0.5"></div>

           <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
             title="上传图片或文件"
           >
             <Paperclip size={20} />
           </button>
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             multiple 
             accept=".txt,.doc,.docx,.pdf,.xls,.xlsx,image/*"
             onChange={handleFileUpload}
           />
           
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => {
               if(e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 sendMessage();
               }
             }}
             placeholder={`发送给 ${activeConfig.name}... (Ctrl+Enter 发送)`}
             className="flex-1 bg-transparent border-none focus:ring-0 text-sm max-h-32 min-h-[44px] py-3 resize-none text-gray-800 placeholder-gray-400"
             rows={1}
             style={{ minHeight: '44px' }}
           />
           
           <button 
             onClick={sendMessage}
             disabled={isLoading || (!input.trim() && attachments.length === 0)}
             className={`p-2 rounded-lg mb-0.5 transition-all duration-200
               ${(input.trim() || attachments.length > 0) && !isLoading
                 ? 'bg-[#18bc9c] text-white hover:bg-[#16a085] shadow-md transform hover:-translate-y-0.5' 
                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
           >
             {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
           </button>
        </div>
        <div className="text-center mt-2 text-xs text-gray-400 select-none flex justify-center gap-4">
           <span>当前模型: {activeConfig.modelName}</span>
           <span>·</span>
           <span>支持 DeepSeek, Gemini, SiliconFlow</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;