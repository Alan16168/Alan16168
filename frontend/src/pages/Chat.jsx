import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { chatAPI } from '../services/api';
import { MessageSquare, Send, FileText, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setLoading(true);

    try {
      const response = await chatAPI.sendMessage({
        message: userMessage,
        sessionId,
        language: i18n.language
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message,
        sources: response.data.sources,
        isFromKnowledgeBase: response.data.isFromKnowledgeBase,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t('common.error') + ': ' + (error.response?.data?.message || error.message),
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary-600" />
          {t('chat.title')}
        </h1>
        <p className="text-gray-600 text-sm mt-1">{t('chat.subtitle')}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">{t('chat.subtitle')}</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-lg px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border shadow-sm'
              }`}
            >
              {msg.role === 'assistant' && msg.isFromKnowledgeBase && (
                <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-semibold">{t('chat.fromKnowledgeBase')}</span>
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <p className="text-xs font-semibold text-gray-600">{t('chat.sources')}:</p>
                  {msg.sources.map((source, i) => (
                    <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-medium text-gray-700">{source.documentName}</div>
                      <div className="text-gray-500 mt-1">{source.excerpt}</div>
                      <div className="text-gray-400 mt-1">
                        {t('chat.relevance')}: {(source.relevanceScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-3 flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-primary-600" />
              <span className="text-sm text-gray-600">{t('common.loading')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder')}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows="2"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {t('chat.send')}
          </button>
        </div>
      </div>
    </div>
  );
}
