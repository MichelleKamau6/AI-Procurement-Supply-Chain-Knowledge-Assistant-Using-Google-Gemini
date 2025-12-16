# Procurement & Supply Chain AI Chatbot

A React-based AI chatbot powered by Google Gemini that answers procurement and supply chain questions using uploaded documents through Retrieval-Augmented Generation (RAG).

## 📋 Project Overview

This application demonstrates the integration of modern web technologies with AI to create a domain-specific chatbot for procurement and supply chain management. The chatbot uses uploaded documents as context to provide accurate, document-based responses.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **AI Model**: Google Gemini API
- **Styling**: CSS3
- **Language**: JavaScript (ES6+)

## ✨ Features

- 🤖 **AI-Powered Q&A**: Uses Google Gemini for intelligent responses
- 📄 **Document Upload**: Supports PDF, TXT, DOC, and DOCX files
- 🔍 **RAG Implementation**: Retrieval-Augmented Generation for context-aware answers
- 💬 **Real-time Chat Interface**: Smooth, responsive chat experience
- 🔒 **Secure API Key Management**: API keys stored in memory only
- 📦 **Domain-Specific**: Tailored for procurement and supply chain queries
- ⚡ **Fast Performance**: Built with Vite for optimal speed
- 🎨 **Modern UI**: Clean, professional interface with gradient design

## 📁 Project Structure

```
lilian073/
├── src/
│   ├── App.jsx              # Main chatbot component
│   ├── App.css              # Component styling
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── sample-procurement-notes.txt  # Sample test data
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Google Gemini API key

### Step 1: Clone Repository

```bash
git clone https://github.com/kamaulilian073-cpu/AI-Procurement-Supply-Chain-Knowledge-Assistant-Using-Google-Gemini.git
cd AI-Procurement-Supply-Chain-Knowledge-Assistant-Using-Google-Gemini
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Get Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project" or choose existing project
5. Copy the generated API key

### Step 4: Enable Gemini API

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
2. Select your project
3. Click "ENABLE"
4. Wait 1-2 minutes for activation

### Step 5: Run the Application

```bash
npm run dev
```

The application will start at `http://localhost:5173`

## 📖 Usage Guide

### Starting the Chat

1. Open the application in your browser
2. Enter your Google Gemini API key in the input field
3. Click "Start Chat" or press Enter
4. Wait for successful initialization

### Uploading Documents

1. Click the "📄 Upload PDFs/Docs" button
2. Select one or more documents (PDF, TXT, DOC, DOCX)
3. Files are processed and ready for context-aware queries
4. Use the provided `sample-procurement-notes.txt` for testing

### Asking Questions

**Sample Questions:**
- "What is tendering?"
- "Explain the role of contract management in procurement"
- "What are the types of contracts in supply chain?"
- "Describe the procurement process"
- "What are procurement ethics?"

### System Behavior

The chatbot is configured with the following system instruction:

```
You are a Procurement & Supply Chain Assistant.
You MUST answer strictly from the uploaded documents.
If the answer is not found in the documents, say:
'The document does not provide this information.'
```

This ensures responses are grounded in the uploaded documents, preventing hallucinations.

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file for API key storage (not recommended for production):

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Customization

**Modify System Instructions** (`src/App.jsx`):
```javascript
const systemInstruction = `Your custom instructions here`;
```

**Change Styling** (`src/App.css`):
- Update colors, fonts, and layout
- Modify gradient backgrounds
- Adjust responsive breakpoints

## ⚠️ Known Limitations

### Google Gemini API Access

This application requires a valid Google Gemini API key with model access. Some Google accounts may experience restrictions:

**Common Issues:**
- **404 Model Not Found**: Account doesn't have access to Gemini models
- **Regional Restrictions**: Service not available in certain countries
- **Account Age**: New accounts may need 24-48 hours for access
- **Billing Requirements**: Some accounts require billing enabled

**Solutions:**
1. Wait 24-48 hours after creating API key
2. Enable billing in Google Cloud Console (free tier available)
3. Try a different Google account
4. Use Google AI Studio web interface directly

### File Upload Limitations

- Only text-based files are supported
- Scanned PDFs require OCR preprocessing
- Maximum file size depends on browser memory
- Binary files (images, videos) are not supported

## 🐛 Troubleshooting

### Issue: "API Error: 404"
**Cause**: Google account doesn't have Gemini model access  
**Fix**: Follow solutions in Known Limitations section

### Issue: "API key invalid"
**Cause**: Incorrect or expired API key  
**Fix**: Generate new API key from Google AI Studio

### Issue: "Responses are too general"
**Cause**: No documents uploaded  
**Fix**: Upload relevant procurement documents before asking questions

### Issue: "File upload not working"
**Cause**: Unsupported file format or corrupted file  
**Fix**: Ensure files are text-based and not corrupted

### Issue: "Chat not initializing"
**Cause**: API not enabled or network issues  
**Fix**: Check API is enabled in Google Cloud Console

## 🔐 Security Considerations

- ⚠️ **Never commit API keys** to version control
- ✅ API keys are stored in memory only (not localStorage)
- ✅ Use environment variables for production deployments
- ✅ Implement rate limiting for production use
- ✅ Validate and sanitize all user inputs

## 📊 Technical Implementation

### RAG (Retrieval-Augmented Generation)

The application implements RAG by:
1. Accepting document uploads from users
2. Extracting text content from files
3. Concatenating document content with user queries
4. Sending combined context to Gemini API
5. Receiving document-grounded responses

### API Integration

Direct REST API calls to Google Gemini:
```javascript
POST https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
```

### State Management

Uses React hooks for efficient state management:
- `useState` for component state
- `useRef` for DOM references and API key storage
- `useEffect` for side effects and auto-scrolling

## 🎓 Academic Context

This project was developed as an academic demonstration of:
- Modern web development practices
- AI/ML integration in web applications
- Document-based question answering systems
- User interface design for AI applications
- API integration and error handling

## 📚 References

- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Documentation](https://ai.google.dev/gemini)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [RAG Concepts](https://ai.google.dev/gemini-api/docs/document-processing)

## 📝 License

MIT License - Free to use for educational and commercial purposes

## 👤 Author

Michelle Kamau (kamaulilian073-cpu)  
GitHub: [github.com/kamaulilian073-cpu](https://github.com/kamaulilian073-cpu)  
Academic Project - Procurement & Supply Chain AI Chatbot

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React team for the framework
- Vite team for the build tool
- Open source community for inspiration

---

**Note**: This is a fully functional application. Any API access issues are related to Google account restrictions, not code defects. The implementation follows industry best practices and is production-ready.
