import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const sendMessage = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
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
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="config-screen">
        <h1>🤖 Procurement AI Assistant</h1>
        <p>Powered by Google Gemini</p>
        <input
          type="password"
          placeholder="Enter your Gemini API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && initializeChat()}
        />
        <button onClick={initializeChat}>Start Chat</button>
        <small>Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></small>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <header>
        <h2>📦 Procurement & Supply Chain Assistant</h2>
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
