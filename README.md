# FastAdmin AI Plugin Mock / FastAdmin AI 插件模拟器

[English Version](#english-version) | [中文介绍](#中文介绍)

---

<a name="english-version"></a>
## English Version

### Introduction
This project is a React-based simulation of a FastAdmin plugin designed to integrate advanced AI capabilities into the FastAdmin ecosystem. It demonstrates a modern interface for interacting with Large Language Models (LLMs), managing Model Context Protocol (MCP) services, and configuring multiple AI providers.

### Key Features

#### 1. AI Chat Functionality
A robust chat interface designed to mimic mainstream AI applications:
*   **Rich Media Support**: Upload and process images and documents, including `.txt`, `.doc`, `.docx`, `.xls`, `.xlsx`, and `.pdf`.
*   **Code Execution**: Automatically detects code blocks (Shell/Bash) in AI responses and provides a "Execute" button to simulate terminal command execution.
*   **User Experience**: 
    *   One-click copy for both user and AI messages.
    *   Markdown rendering with syntax highlighting.
    *   Real-time typing effect (streaming simulation).
    *   **Model Switching**: Convenient dropdown menu in the input area to switch between different AI models on the fly.

#### 2. Large Model API Settings
A centralized configuration panel to manage connections to various LLM providers:
*   **Multi-Model Support**: Pre-configured templates for popular providers like **DeepSeek**, **SiliconFlow**, and **Google Gemini**.
*   **Customization**: Add, edit, or delete model configurations (API Key, Base URL, Model Name).
*   **Active Model Management**: Set a default active model for the chat interface.

#### 3. MCP (Model Context Protocol) Management
A dedicated dashboard for managing MCP services, enabling the AI to interact with local or remote systems:
*   **Service Monitoring**: View a list of installed MCP services with real-time status indicators (Running, Stopped, Error).
*   **Control Panel**: Start or stop individual MCP services.
*   **Configuration Editor**:
    *   View the file path of MCP configurations.
    *   **Integrated Editor**: Click the "Open" button to launch a built-in JSON editor to modify MCP registry settings and configuration files directly within the app.
    *   System checks for required components like `uv` (Python package manager).

---

<a name="中文介绍"></a>
## 中文介绍

### 简介
本项目是一个基于 React 开发的 FastAdmin 插件模拟器，旨在展示如何将先进的 AI 能力集成到 FastAdmin 生态系统中。它提供了一个现代化的界面，用于与大语言模型 (LLM) 交互、管理模型上下文协议 (MCP) 服务以及配置多个 AI 供应商。

### 主要功能

#### 1. AI 聊天功能
参考主流 AI 产品设计的强大聊天界面：
*   **多媒体支持**：支持上传并处理图片及文档文件（包括 `.txt`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.pdf`）。
*   **终端命令执行**：自动识别 AI 回复中的代码块（Shell/Bash），并提供“执行”按钮以模拟终端命令的运行。
*   **用户体验**：
    *   支持发送和回复文字的一键复制功能。
    *   Markdown 渲染与代码高亮。
    *   实时打字机效果（流式传输模拟）。
    *   **模型切换**：输入框左下角提供便捷的下拉列表，支持在对话中即时切换不同的 AI 模型。

#### 2. 大模型 API 设置
集中化的配置面板，用于管理不同的大模型连接参数：
*   **多模型支持**：支持配置主流大模型（如 **DeepSeek (深度求索)**、**硅基流动 (SiliconFlow)**、**Google Gemini** 等）的对接参数。
*   **自定义配置**：支持添加、编辑或删除模型配置信息（API Key, Base URL, 模型名称）。
*   **默认模型管理**：可设置当前激活的模型，供聊天功能调用。

#### 3. MCP (模型上下文协议) 列表及设置
专门的管理仪表盘，用于管理 MCP 服务，赋予 AI 与本地或远程系统交互的能力：
*   **服务监控**：列表显示已安装的 MCP 名称、是否启用、运行状态及错误信息（如有）。
*   **控制面板**：支持启动或停止单个 MCP 服务。
*   **配置文件编辑**：
    *   显示 MCP 配置文件的存储路径。
    *   **内置编辑器**：点击设置中的“打开”按钮，会弹出内置的 JSON 编辑器，支持查看、编辑和保存 MCP 注册表及服务的配置文件内容。
    *   环境检测：自动检测 `uv` 等 MCP 运行必需组件的安装状态。
