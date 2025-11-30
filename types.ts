export enum ModelProvider {
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  SILICONFLOW = 'siliconflow',
  OPENAI = 'openai'
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  apiKey: string;
  baseUrl?: string;
  modelName: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  attachments?: AttachedFile[];
}

export interface AttachedFile {
  name: string;
  type: string;
  data: string; // Base64
}

export interface MCPService {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  status: 'running' | 'stopped' | 'error';
  errorMessage?: string;
  configPath: string;
}

export interface MCPSettings {
  uvInstalled: boolean;
  pythonPath: string;
  mcpRegistryPath: string;
}
