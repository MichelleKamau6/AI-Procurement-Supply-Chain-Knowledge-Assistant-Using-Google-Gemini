import { useState, useRef, useEffect } from 'react';
import Auth from './Auth';
import { findAnswer } from './demoQA';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const systemInstruction = `You are a Procurement & Supply Chain Assistant.
You MUST answer strictly from the uploaded documents.
If the answer is not found in the documents, say:
'The document does not provide this information.'`;

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsConfigured(false);
    setMessages([]);
    setApiKey('');
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const textContents = [];

    for (const file of files) {
      const text = await file.text();
      textContents.push({ name: file.name, content: text });
    }

    setUploadedFiles(prev => [...prev, ...textContents]);
  };

  const initializeChat = async () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key');
      return;
    }
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] })
        }
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      chatRef.current = apiKey.trim();
      setIsConfigured(true);
    } catch (error) {
      console.error('Full error:', error);
      alert(`Failed: ${error.message}\n\nCheck that API is enabled and key is correct.`);
    }
  };

  const getDemoResponse = (question) => {
    // Try to find answer in Q&A database
    const answer = findAnswer(question);
    
    if (answer) {
      return answer;
    }

    // If no match found, provide helpful message
    return 'I can answer questions about: Tendering, Contract Management, Procurement Process, Supplier Management, Ethics, Supply Chain, Inventory, Logistics, Cost Management, Compliance, E-Procurement, Strategic Sourcing, Sustainability, Risk Management, and Negotiation. Please try rephrasing your question or ask about these topics.';
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatRef.current === 'demo') {
        // Demo mode
        setTimeout(() => {
          const response = getDemoResponse(input);
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
          setIsLoading(false);
        }, 1000);
      } else {
        // API mode
        const prompt = uploadedFiles.length > 0
          ? `${systemInstruction}\n\nContext from uploaded documents:\n${uploadedFiles.map(f => `[${f.name}]\n${f.content}`).join('\n\n')}\n\nUser question: ${input}`
          : `${systemInstruction}\n\nUser question: ${input}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${chatRef.current}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          }
        );
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        
        setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        setIsLoading(false);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}` 
      }]);
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const startDemoMode = () => {
    chatRef.current = 'demo';
    setIsConfigured(true);
  };

  if (!isConfigured) {
    return (
      <div className="config-screen">
        <h1>🤖 Procurement AI Assistant</h1>
        <p>Powered by Google Gemini</p>
        <input
          type="password"
          placeholder="Enter your Gemini API Key (Optional)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && initializeChat()}
        />
        <button onClick={initializeChat}>Start with API Key</button>
        <div className="divider">OR</div>
        <button className="demo-btn" onClick={startDemoMode}>Continue in Demo Mode</button>
        <small>Demo mode uses pre-defined responses. For AI-powered answers, use an API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></small>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <header>
        <div className="header-left">
          <h2>📦 Procurement Assistant</h2>
          <span className="user-name">Welcome, {user.name}</span>
        </div>
        <div className="header-right">
          <div className="file-upload">
          <label htmlFor="file-input">📄 Upload PDFs/Docs</label>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileUpload}
          />
          {uploadedFiles.length > 0 && (
            <span className="file-count">{uploadedFiles.length} file(s)</span>
          )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {isLoading && <div className="message assistant loading">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Ask about procurement, tendering, contracts..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
}

export default App;
