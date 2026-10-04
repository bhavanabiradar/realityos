# RealityOS — Your Life, Integrated 🧠

RealityOS is an AI-powered personal productivity workspace designed to bring planning, tasks, habits, memory, documents, decisions, and AI assistance into one integrated system.

Instead of using separate tools for different parts of daily life, RealityOS provides a single workspace where users can organize their work, interact with AI, manage information, and make better decisions.

> Built as a personal full-stack project to explore AI application development, productivity systems, and user-centered software design.

---

## ✨ Features

### 🤖 Reality AI Assistant

An AI-powered workspace assistant integrated with Gemini.

- Conversational AI chat
- Persistent conversation history
- Document-aware conversations
- PDF/document analysis
- Image and file input
- Mathematical and coding queries
- Workspace assistance
- Context-aware responses

---

### ✅ To-Do List & Habit Tracker

A productivity module for managing daily priorities and building consistent habits.

- Create and manage tasks
- Priority-based task management
- Daily priorities
- Habit tracking
- Daily, weekly, and monthly views
- Habit streak tracking
- Completion percentage
- Dynamic Life Score

---

### 🧠 Memory Center

A dedicated space for storing important information, ideas, and personal memories.

- Save memories
- Organize stored information
- Persistent database storage
- User-specific memory isolation

---

### 📄 Smart Documents

A document workspace designed to make working with study and project material easier.

- Upload documents
- Store documents in the workspace
- Access uploaded files through the AI assistant
- Ask questions about documents
- Summarize and analyze document content
- Useful for assignments, research papers, project documents, and reference material

---

### 📅 Predictive Planner

A scheduling workspace for organizing time around different types of activities.

- Create scheduled events
- Time-based planning
- Study/work scheduling
- Location and event type tracking
- Structured daily planning

---

### ⚖️ Decision Engine

A structured system for recording and evaluating important decisions.

- Log decisions
- Record decision outcomes
- Review previous decisions
- Track decision-making patterns
- Evaluate decision accuracy over time

---

### 🚨 Emergency Protocol Hub

An emergency-oriented module designed to provide quick access to predefined emergency workflows.

- SOS functionality
- Emergency contact workflows
- Emergency alerts
- Priority-based emergency actions

---

### 🔐 Authentication & User Isolation

RealityOS supports user-specific workspaces through authentication and database-level user management.

- Sign up
- Sign in
- Password authentication
- Forgot-password flow
- User-specific data
- Isolated workspace data
- Authenticated sessions

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend & Data

- Supabase
- Supabase Authentication
- Supabase Database

### AI

- Google Gemini API
- AI application development
- Document-aware AI interactions

### Development & Deployment

- Git
- GitHub
- Vercel

---

## 🏗️ Architecture

RealityOS follows a modern full-stack web application architecture.

```text
User
 │
 ▼
Next.js / React Interface
 │
 ├── Productivity Modules
 │    ├── To-Do & Habits
 │    ├── Planner
 │    ├── Decisions
 │    └── Emergency
 │
 ├── AI Layer
 │    └── Gemini API
 │
 ├── Document Layer
 │    └── Document Upload & Analysis
 │
 └── Supabase
      ├── Authentication
      ├── User Data
      ├── Memories
      ├── Tasks
      └── Workspace Data
