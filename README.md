# 🌟 Lumo.AI - Advanced AI Chat Assistant

A cutting-edge, feature-rich AI-powered chat application built with Next.js 15, featuring Google Gemini AI integration, comprehensive file analysis, voice capabilities, and professional user experience.

![Lumo.AI](https://img.shields.io/badge/Lumo.AI-AI%20Chat%20Assistant-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Vision-4285F4?style=for-the-badge&logo=google&logoColor=white)

## ✨ Features

### 🤖 **Advanced AI Capabilities**
- **Google Gemini Pro Integration**: State-of-the-art AI with context awareness
- **Gemini Vision API**: Real image analysis and description
- **Real-time Conversations**: Instant AI responses with typing indicators
- **Conversation Management**: Save, load, and organize chat history
- **Context Memory**: AI remembers file uploads throughout conversations

### 📁 **Comprehensive File Analysis**
- **Image Analysis**: Upload and get detailed AI descriptions of images
- **PDF Processing**: Upload PDFs with smart text extraction guidance
- **Word Document Support**: Handle .doc and .docx files with copy-paste workflow
- **Code File Analysis**: Support for JavaScript, Python, Java, C++, and more
- **Text File Processing**: Full analysis of .txt, .md, .csv, .json files
- **Smart File Detection**: Automatic format recognition and processing

### 📥 **Advanced Download System**
- **Multiple Export Formats**: PDF, Word, Excel, Text, Markdown
- **Smart Format Detection**: AI suggests best formats based on content
- **One-Click Downloads**: Export AI responses in your preferred format
- **Professional Templates**: Clean, formatted documents with timestamps
- **Tabular Data Support**: Automatic Excel export for data tables

### 🎤 **Voice & Audio Features**
- **Speech-to-Text**: Voice input with real-time transcription
- **Text-to-Speech**: AI responses read aloud with natural voices
- **Voice Controls**: Complete hands-free interaction
- **Multiple Voice Options**: Choose from various AI voices
- **Mobile Optimized**: Full voice support on mobile devices

### 🎨 **Professional UI/UX**
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Responsive Layout**: Perfect experience on all devices
- **Interactive Landing Page**: Engaging homepage with feature showcase
- **Dark/Light Themes**: Automatic theme detection and switching
- **Mobile-First**: Touch-optimized with gesture support

### 📧 **Contact & Communication**
- **Real Email Sending**: Direct email delivery from contact form
- **Professional Templates**: HTML email formatting with branding
- **Smart Fallback**: Mailto backup if email service unavailable
- **Form Validation**: Real-time validation and error handling
- **Success Notifications**: Instant feedback for user actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/basavarajrevani/lumo-ai.git
cd lumo-ai
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

**Required Configuration:**
```env
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here
```

**Optional Email Configuration (for contact form):**
```env
# Email Service (Optional - enables direct email sending)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=recipient@gmail.com
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Type-safe development with strict mode
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, consistent icon library
- **React Hot Toast**: Elegant notification system

### **AI & APIs**
- **Google Gemini Pro**: Advanced language model for chat
- **Gemini Vision API**: Image analysis and description
- **Web Speech API**: Voice recognition and synthesis
- **File Processing APIs**: PDF.js, document parsing

### **File Processing**
- **PDF.js**: Client-side PDF text extraction
- **jsPDF**: PDF generation for downloads
- **XLSX**: Excel file generation and processing
- **File-Saver**: Client-side file downloads

### **Email & Communication**
- **Nodemailer**: Server-side email sending
- **SMTP Integration**: Professional email delivery
- **HTML Email Templates**: Branded email formatting

### **Development Tools**
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality control

## 📱 Mobile & Cross-Platform Support

Lumo.AI delivers a native-like experience across all platforms:

### **Mobile Features**
- **Touch Gestures**: Swipe to close modals and navigate
- **Responsive Design**: Adapts perfectly to all screen sizes
- **Mobile Navigation**: Touch-optimized interface elements
- **Voice Features**: Full speech recognition on mobile devices
- **File Upload**: Camera integration and file picker support

### **Cross-Platform Compatibility**
- **iOS Safari**: Full feature support including voice
- **Android Chrome**: Complete functionality with gestures
- **Desktop Browsers**: Enhanced experience with keyboard shortcuts
- **Progressive Web App**: Install as native app on mobile

## 📖 Usage Examples

### **File Analysis Workflow**
1. **Upload a file** using the clip button in the chat interface
2. **Get instant analysis** - AI describes images or provides file guidance
3. **Ask specific questions** about the file content
4. **Download responses** in your preferred format (PDF, Word, Excel)

### **Voice Interaction**
1. **Enable voice features** using the microphone and speaker buttons
2. **Speak your questions** - AI transcribes and responds
3. **Listen to responses** - AI reads answers aloud
4. **Hands-free operation** - Complete voice-controlled experience

### **Document Q&A**
```
User: *uploads business report PDF*
AI: "PDF uploaded successfully. Please copy-paste the content you'd like me to analyze."
User: *pastes financial data*
AI: "I can see quarterly revenue data showing 25% growth..."
User: "Create an Excel summary of this data"
AI: *provides analysis* → User downloads as Excel file
```

## 🔧 Advanced Configuration

### **Email Service Setup (Gmail)**
1. Enable 2-factor authentication on Gmail
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Add to `.env.local`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### **Custom Branding**
- Update logo and branding in `/src/components/ui/logo.tsx`
- Modify colors in `tailwind.config.js`
- Customize footer attribution in contact components

### **Performance Optimization**
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Built-in API route caching
- **Bundle Analysis**: Run `npm run analyze` to check bundle size

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### **Other Platforms**
- **Netlify**: Full support with serverless functions
- **Railway**: Easy deployment with database support
- **Docker**: Containerized deployment ready

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Add proper error handling
- Include tests for new features
- Update documentation

## 🔍 Key Features Showcase

### **🎯 Smart File Processing**
- **Automatic Format Detection**: Recognizes file types and suggests optimal processing
- **Context Preservation**: Files remain accessible throughout the conversation
- **Multi-Format Support**: Images, PDFs, Word docs, code files, and more
- **Error Handling**: Graceful fallbacks for unsupported or corrupted files

### **📊 Export & Download System**
- **Smart Suggestions**: AI recommends best export formats based on content
- **Professional Templates**: Clean, branded document formatting
- **Multiple Formats**: PDF, Word, Excel, Text, Markdown
- **One-Click Export**: Instant downloads with proper file naming

### **🎤 Voice Intelligence**
- **Natural Speech Recognition**: Accurate transcription in multiple languages
- **AI Voice Synthesis**: Natural-sounding text-to-speech responses
- **Hands-Free Operation**: Complete voice-controlled interaction
- **Mobile Optimized**: Full voice features on mobile devices

### **📧 Professional Communication**
- **Direct Email Delivery**: Real email sending from contact forms
- **HTML Templates**: Professional email formatting with branding
- **Smart Fallback**: Automatic mailto backup for reliability
- **Form Validation**: Real-time validation and user feedback

## 🌟 What Makes Lumo.AI Special

- **🚀 Performance**: Lightning-fast responses with optimized codebase
- **🎨 Design**: Beautiful, intuitive interface that users love
- **🔧 Reliability**: Robust error handling and graceful fallbacks
- **📱 Mobile-First**: Native-like experience on all devices
- **🔒 Privacy**: No permanent data storage, user privacy protected
- **⚡ Modern Stack**: Built with latest technologies and best practices

## 👨‍💻 Developer

**Basavaraj Revani** - *Full Stack Developer & AI Enthusiast*

- 📧 **Email**: [basavarajrevani123@gmail.com](mailto:basavarajrevani123@gmail.com)
- 💼 **LinkedIn**: [basavarajrevani](https://linkedin.com/in/basavarajrevani)
- 🐦 **X (Twitter)**: [@basavarajrevani](https://x.com/basavarajrevani)
- 💻 **GitHub**: [basavarajrevani](https://github.com/basavarajrevani)

### **About the Developer**
Passionate about creating innovative AI-powered applications that enhance user productivity and experience. Specializing in modern web technologies, AI integration, and user-centric design.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**🌟 Built with ❤️ by Basavaraj Revani 🌟**

*If you find this project helpful, please consider giving it a ⭐ on GitHub!*

</div>
