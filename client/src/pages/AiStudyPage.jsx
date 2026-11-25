import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import {
  Bot,
  Sparkles,
  Send,
  Plus,
  Trash2,
  Search,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  FileText,
  Bookmark,
  Download,
  BookOpen,
  ArrowRight,
  Zap,
  ListOrdered
} from 'lucide-react';

export const AiStudyPage = () => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'notes'
  
  // Chat state
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [copiedMsgIndex, setCopiedMsgIndex] = useState(null);
  const messagesEndRef = useRef(null);

  // Notes state
  const [noteTopic, setNoteTopic] = useState('');
  const [noteInputType, setNoteInputType] = useState('topic'); // 'topic' | 'text'
  const [noteContentInput, setNoteContentInput] = useState('');
  const [noteFormat, setNoteFormat] = useState('Detailed notes');
  const [generatedNotes, setGeneratedNotes] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [noteSaveSuccess, setNoteSaveSuccess] = useState(false);
  const [noteCopied, setNoteCopied] = useState(false);

  const noteFormats = [
    'Detailed notes',
    'Short notes',
    'Exam-oriented notes',
    'Revision notes',
    'Important definitions',
    'Key points',
    'MCQs',
    'Flashcards'
  ];

  useEffect(() => {
    loadConversations();
    loadSavedNotes();
    fetchAIStatus();
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeTab]);

  const fetchAIStatus = async () => {
    try {
      const res = await api.getAIStatus();
      if (res.success) setAiStatus(res.status);
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await api.getConversations();
      if (res.success) setConversations(res.conversations);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSavedNotes = async () => {
    try {
      const res = await api.getNotes();
      if (res.success) setSavedNotes(res.notes);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      setLoading(true);
      const res = await api.getConversationById(id);
      if (res.success) {
        setActiveConversationId(id);
        setMessages(res.conversation.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputQuery('');
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation from database?')) return;
    try {
      await api.deleteConversation(id);
      if (activeConversationId === id) handleNewChat();
      loadConversations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (textToSend = null, promptModifier = null) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || loading) return;

    const newUserMsg = {
      role: 'user',
      content: promptModifier ? `[Action: ${promptModifier}]\n\n${text}` : text,
      timestamp: new Date()
    };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        conversationId: activeConversationId,
        message: text,
        promptModifier
      });

      if (res.success) {
        setActiveConversationId(res.conversationId);
        setMessages([...updatedMessages, res.message]);
        loadConversations();
      }
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `⚠️ **Unable to complete response:** ${err.message}. Please check your connection.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Turn active conversation into revision notes
  const handleConvertChatToNotes = async (topicTitle, contentSnippet) => {
    setActiveTab('notes');
    setNoteTopic(topicTitle || 'Discussion Topic');
    setNoteInputType('text');
    setNoteContentInput(contentSnippet || messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n'));
    setGeneratingNotes(true);

    try {
      const res = await api.generateAiNotes({
        topic: topicTitle || 'Discussion Topic',
        inputType: 'text',
        noteFormat: 'Exam-oriented notes',
        content: contentSnippet || messages.map(m => m.content).join('\n\n')
      });
      if (res.success) {
        setGeneratedNotes(res.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleGenerateNotes = async (e) => {
    e.preventDefault();
    if (!noteTopic && !noteContentInput) return;

    setGeneratingNotes(true);
    setNoteSaveSuccess(false);

    try {
      const res = await api.generateAiNotes({
        topic: noteTopic || 'Academic Subject',
        inputType: noteInputType,
        noteFormat,
        content: noteContentInput
      });
      if (res.success) {
        setGeneratedNotes(res.notes);
      }
    } catch (err) {
      console.error('Notes generation error:', err);
    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!generatedNotes) return;
    try {
      const res = await api.saveNote(generatedNotes);
      if (res.success) {
        setNoteSaveSuccess(true);
        loadSavedNotes();
        setTimeout(() => setNoteSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyNotes = () => {
    if (!generatedNotes) return;
    navigator.clipboard.writeText(generatedNotes.content);
    setNoteCopied(true);
    setTimeout(() => setNoteCopied(false), 2000);
  };

  const handleDownloadNotes = () => {
    if (!generatedNotes) return;
    const blob = new Blob([generatedNotes.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedNotes.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col space-y-3">
      {/* Top Switcher: Chat Tutor vs. Notes & Flashcards */}
      <div className="flex items-center justify-between border-b border-[#F1E6EE] pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'chat'
                ? 'bg-[#E879A9] text-white shadow-glow'
                : 'bg-[#FFF9FC] text-[#817487] hover:text-[#30263A] border border-[#F1E6EE]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Tutor & Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'notes'
                ? 'bg-[#E879A9] text-white shadow-glow'
                : 'bg-[#FFF9FC] text-[#817487] hover:text-[#30263A] border border-[#F1E6EE]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes & Flashcards Synthesizer</span>
            {savedNotes.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#FFFFFF] text-[#C65B89] text-[10px]">
                {savedNotes.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#817487]">
          <Cpu className="w-3.5 h-3.5 text-[#E879A9]" />
          <span>{aiStatus?.ollamaAvailable ? 'Local Llama 3.2' : 'PrepAI Engine Active'}</span>
        </div>
      </div>

      {/* VIEW 1: CHAT TUTOR */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-72 bg-[#FFFFFF] border border-[#F1E6EE] rounded-2xl flex flex-col overflow-hidden hidden md:flex">
            <div className="p-3 border-b border-[#F1E6EE]">
              <button
                onClick={handleNewChat}
                className="w-full py-2.5 px-3 rounded-xl bg-[#E879A9] hover:from-[#C65B89] text-[#30263A] text-xs font-bold shadow-glow flex items-center justify-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Discussion</span>
              </button>
            </div>

            <div className="px-3 py-2 border-b border-[#F1E6EE]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#817487] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter topics..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg glass-input"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
              {filteredConversations.map(c => (
                <div
                  key={c._id}
                  onClick={() => handleSelectConversation(c._id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer group transition-all ${
                    activeConversationId === c._id
                      ? 'bg-[#E879A9]/20 text-[#C65B89] border border-[#E879A9]/40'
                      : 'text-[#817487] hover:text-[#30263A] hover:bg-[#FFF9FC]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-[#E879A9]" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, c._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#817487] hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {conversations.length === 0 && (
                <p className="text-center py-6 text-xs text-[#817487]">No discussions yet.</p>
              )}
            </div>
          </div>

          {/* Main Chat Workspace */}
          <div className="flex-1 bg-[#FFFFFF] border border-[#F1E6EE] rounded-2xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="h-12 px-4 border-b border-[#F1E6EE] flex items-center justify-between bg-[#FFF9FC]/60 text-xs">
              <span className="font-bold text-[#30263A] truncate max-w-sm">
                {activeConversationId
                  ? conversations.find(c => c._id === activeConversationId)?.title || 'Current Discussion'
                  : 'New AI Study Session'}
              </span>

              {messages.length > 0 && (
                <button
                  onClick={() => handleConvertChatToNotes(
                    conversations.find(c => c._id === activeConversationId)?.title,
                    messages.map(m => m.content).join('\n\n')
                  )}
                  className="px-2.5 py-1 rounded-lg bg-[#E879A9]/15 hover:bg-[#E879A9]/30 text-[#C65B89] border border-[#E879A9]/30 font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Synthesize into Revision Notes</span>
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#E879A9]/20 border border-[#E879A9]/40 flex items-center justify-center text-[#C65B89] mb-4">
                    <Bot className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#30263A]">Ask Anything About Computer Science</h3>
                  <p className="text-xs text-[#817487] mt-1.5 leading-relaxed">
                    Clear your doubts in DBMS, Operating Systems, Computer Networks, or Algorithms with context-aware explanations.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-6">
                    {[
                      'Explain DBMS 2NF with a real-world example',
                      'How does Floyd’s cycle detection algorithm work?',
                      'Explain Coffman conditions for deadlocks',
                      'Compare TCP and UDP header differences'
                    ].map((text, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(text)}
                        className="p-2.5 text-left rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] hover:border-[#E879A9]/50 text-xs text-[#30263A] transition-colors"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={index}
                      className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                    >
                      {isAssistant && (
                        <div className="w-8 h-8 rounded-lg bg-[#E879A9]/20 border border-[#E879A9]/30 flex-shrink-0 flex items-center justify-center text-[#C65B89] mt-1">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-3xl rounded-2xl p-4 text-xs relative ${
                          isAssistant
                            ? 'bg-[#FFF9FC] border border-[#F1E6EE] text-[#30263A]'
                            : 'bg-[#E879A9] text-white'
                        }`}
                      >
                        {isAssistant ? (
                          <div>
                            <MarkdownRenderer content={msg.content} />
                            <div className="flex items-center justify-between pt-2.5 mt-3 border-t border-[#F1E6EE] text-[10px] text-[#817487]">
                              <span>PrepAI Academic Engine</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleConvertChatToNotes('Concept Notes', msg.content)}
                                  className="hover:text-[#30263A] flex items-center space-x-1"
                                >
                                  <FileText className="w-3 h-3 text-[#C65B89]" />
                                  <span>Make Note</span>
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(msg.content);
                                    setCopiedMsgIndex(index);
                                    setTimeout(() => setCopiedMsgIndex(null), 2000);
                                  }}
                                  className="hover:text-[#30263A] flex items-center space-x-1"
                                >
                                  {copiedMsgIndex === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedMsgIndex === index ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              {loading && (
                <div className="flex items-center space-x-2 text-xs text-[#817487]">
                  <span className="w-2 h-2 rounded-full bg-[#E879A9] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#C65B89] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#C65B89] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">Synthesizing pedagogical explanation...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#FFFFFF] border-t border-[#F1E6EE]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder="Ask a doubt or follow-up question (e.g. 'I did not understand 2NF')..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl glass-input text-xs"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || loading}
                  className="absolute right-2 p-2 rounded-lg bg-[#E879A9] text-white disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: NOTES & FLASHCARDS SYNTHESIZER */}
      {activeTab === 'notes' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Left Form: Topic / Text configuration */}
          <div className="space-y-4 overflow-y-auto">
            <div className="glass-panel p-5 rounded-2xl border border-[#F1E6EE]">
              <h3 className="text-sm font-bold text-[#30263A] mb-3">Generate Study Notes</h3>
              <form onSubmit={handleGenerateNotes} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#817487] font-semibold mb-1">Input Source</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNoteInputType('topic')}
                      className={`py-1.5 rounded-lg border font-semibold ${
                        noteInputType === 'topic' ? 'bg-[#E879A9]/20 border-[#E879A9] text-[#30263A]' : 'bg-[#FFF9FC] border-[#F1E6EE] text-[#817487]'
                      }`}
                    >
                      Topic Name
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteInputType('text')}
                      className={`py-1.5 rounded-lg border font-semibold ${
                        noteInputType === 'text' ? 'bg-[#E879A9]/20 border-[#E879A9] text-[#30263A]' : 'bg-[#FFF9FC] border-[#F1E6EE] text-[#817487]'
                      }`}
                    >
                      Paste Text
                    </button>
                  </div>
                </div>

                {noteInputType === 'topic' ? (
                  <div>
                    <label className="block text-[#817487] font-semibold mb-1">Concept Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dynamic Programming & Knapsack"
                      value={noteTopic}
                      onChange={(e) => setNoteTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[#817487] font-semibold mb-1">Learning Text</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Paste text from lecture slides or articles..."
                      value={noteContentInput}
                      onChange={(e) => setNoteContentInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl glass-input leading-relaxed"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[#817487] font-semibold mb-1">Format</label>
                  <select
                    value={noteFormat}
                    onChange={(e) => setNoteFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input bg-[#FFFFFF]"
                  >
                    {noteFormats.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generatingNotes}
                  className="w-full py-2.5 rounded-xl font-bold text-[#30263A] bg-[#E879A9] hover:from-[#C65B89] shadow-glow flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{generatingNotes ? 'Generating...' : 'Synthesize Notes & Flashcards'}</span>
                </button>
              </form>
            </div>

            {/* Saved Notes Archive */}
            <div className="glass-panel p-4 rounded-2xl border border-[#F1E6EE]">
              <h4 className="text-xs font-bold text-[#30263A] uppercase mb-2">Saved Library ({savedNotes.length})</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
                {savedNotes.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => setGeneratedNotes(n)}
                    className="p-2 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] hover:border-[#E879A9]/50 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="truncate text-[#30263A] font-medium">{n.title}</span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm('Delete note?')) return;
                        await api.deleteNote(n._id);
                        loadSavedNotes();
                      }}
                      className="p-1 text-[#817487] hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {savedNotes.length === 0 && (
                  <p className="text-[#817487] text-[11px] text-center py-2">No notes saved yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Preview & Flashcards */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#F1E6EE] overflow-y-auto">
            {generatedNotes ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#F1E6EE] pb-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E879A9]/20 text-[#C65B89]">
                      {generatedNotes.noteFormat}
                    </span>
                    <h2 className="text-base font-bold text-[#30263A] mt-1">{generatedNotes.title}</h2>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      onClick={handleCopyNotes}
                      className="p-2 rounded-xl border border-[#F1E6EE] text-[#817487] hover:text-[#30263A] flex items-center space-x-1"
                    >
                      {noteCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{noteCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadNotes}
                      className="p-2 rounded-xl border border-[#F1E6EE] text-[#817487] hover:text-[#30263A] flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-2 rounded-xl bg-[#E879A9] text-white font-semibold flex items-center space-x-1 shadow-sm"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      <span>{noteSaveSuccess ? 'Saved!' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs">
                  <MarkdownRenderer content={generatedNotes.content} />
                </div>

                {generatedNotes.flashcards?.length > 0 && (
                  <div className="border-t border-[#F1E6EE] pt-4">
                    <h4 className="text-xs font-bold text-[#30263A] uppercase mb-3">Generated Flashcards</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {generatedNotes.flashcards.map((fc, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
                          <span className="text-[10px] font-bold text-[#C65B89] uppercase block mb-1">Prompt:</span>
                          <p className="text-[#30263A] mb-2">{fc.front}</p>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Recall Key:</span>
                          <p className="text-[#817487]">{fc.back}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 text-[#817487]">
                <FileText className="w-10 h-10 mb-2 opacity-40 text-[#E879A9]" />
                <p className="text-sm font-semibold text-[#30263A]">No Notes Generated Yet</p>
                <p className="text-xs mt-1 max-w-sm">
                  Enter a topic on the left or use "Synthesize into Revision Notes" from any live discussion with the AI Tutor.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
