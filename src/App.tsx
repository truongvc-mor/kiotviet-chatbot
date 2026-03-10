import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Package, Search, Loader2, Database, BookOpen, Plus, RefreshCw, LayoutDashboard, Copy, Check, MessageSquare, Lightbulb } from "lucide-react";
import { chatWithGemini } from "./services/gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "dual" | "knowledge" | "products">("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hệ thống hỗ trợ nội bộ sẵn sàng. Bạn cần truy xuất thông tin sản phẩm hay kiến thức bán hàng nào?",
      timestamp: new Date(),
    },
  ]);
  
  // Dual Chat State
  const [customerMessages, setCustomerMessages] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [customerInput, setCustomerInput] = useState("");
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [isCustomerMode, setIsCustomerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  
  // Knowledge Form
  const [newTopic, setNewTopic] = useState("");
  const [newContent, setNewContent] = useState("");
  
  // Smart Search State
  const [smartSearchQuery, setSmartSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const customerEndRef = useRef<HTMLDivElement>(null);
  const suggestionEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    customerEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [customerMessages]);

  useEffect(() => {
    suggestionEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiSuggestions]);

  const fetchData = async () => {
    const [pRes, kRes] = await Promise.all([
      fetch("/api/products").then(res => res.json()),
      fetch("/api/knowledge").then(res => res.json())
    ]);
    setProducts(pRes);
    setKnowledge(kRes);
  };

  const handleCustomerSend = async (role: "customer" | "sale") => {
    if (!customerInput.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      role,
      content: customerInput.trim(),
      timestamp: new Date()
    };

    setCustomerMessages(prev => [...prev, newMsg]);
    setCustomerInput("");

    if (role === "customer") {
      setIsCustomerTyping(true);
      try {
        const suggestion = await chatWithGemini(newMsg.content, true);
        setAiSuggestions(prev => [...prev, {
          id: Date.now().toString(),
          forMessageId: newMsg.id,
          content: suggestion,
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error("AI Error:", error);
      } finally {
        setIsCustomerTyping(false);
      }
    }
  };

  const handleSmartSearch = async () => {
    if (!smartSearchQuery.trim()) return;
    setIsSearching(true);
    try {
      const result = await chatWithGemini(smartSearchQuery, false);
      setSearchResult(result);
    } catch (error) {
      setSearchResult("Lỗi truy xuất thông tin.");
    } finally {
      setIsSearching(false);
    }
  };

  const renderStructuredContent = (content: string, isUser: boolean) => {
    if (isUser) return <div className="whitespace-pre-wrap">{content}</div>;
    
    const sections = content.split(/###\s+/).filter(Boolean);
    if (sections.length <= 1) return <div className="whitespace-pre-wrap">{content}</div>;

    return (
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const lines = section.trim().split("\n");
          const title = lines[0].trim();
          const body = lines.slice(1).join("\n").trim();
          
          const isProduct = title.toLowerCase().includes("sản phẩm");
          const isKnowledge = title.toLowerCase().includes("kiến thức");
          const isReply = title.toLowerCase().includes("gợi ý trả lời");

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2">
                {isProduct && <Package className="w-3.5 h-3.5 text-blue-500" />}
                {isKnowledge && <BookOpen className="w-3.5 h-3.5 text-amber-500" />}
                {isReply && <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />}
                <h4 className={`text-[10px] font-black uppercase tracking-widest ${
                  isProduct ? 'text-blue-600' : isKnowledge ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {title}
                </h4>
              </div>
              <div className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                isProduct ? 'bg-blue-50/50 border border-blue-100/50' : 
                isKnowledge ? 'bg-amber-50/50 border border-amber-100/50 italic' : 
                'bg-emerald-50/50 border border-emerald-100/50'
              }`}>
                {body}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithGemini(userMessage.content, isCustomerMode);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Lỗi hệ thống. Vui lòng thử lại.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addKnowledge = async () => {
    if (!newTopic || !newContent) return;
    await fetch("/api/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: newTopic, content: newContent })
    });
    setNewTopic("");
    setNewContent("");
    fetchData();
    alert("Đã thêm kiến thức mới!");
  };

  const syncKiotViet = async () => {
    setIsLoading(true);
    const res = await fetch("/api/sync-kiotviet", { method: "POST" });
    const data = await res.json();
    alert(data.message);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-stone-100 font-sans text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col">
        <div className="p-6 border-b border-stone-800 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">Sales Hub AI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "chat" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "hover:bg-stone-800"}`}
          >
            <Bot className="w-5 h-5" />
            <span className="text-sm font-medium">Trợ lý nội bộ</span>
          </button>
          <button 
            onClick={() => setActiveTab("dual")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "dual" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "hover:bg-stone-800"}`}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm font-medium">Dual Chat (Realtime)</span>
          </button>
          <button 
            onClick={() => setActiveTab("knowledge")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "knowledge" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "hover:bg-stone-800"}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Kho kiến thức</span>
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "products" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "hover:bg-stone-800"}`}
          >
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">Sản phẩm KiotViet</span>
          </button>
        </nav>

        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 px-4 py-2 bg-stone-800/50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Hệ thống: Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full">
            <header className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between shadow-sm">
              <h2 className="font-bold text-xl">Trợ lý truy xuất thông tin</h2>
              <div className="text-xs text-stone-500 font-medium uppercase tracking-widest">Dành cho nhân viên</div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-stone-200" : "bg-emerald-100"}`}>
                      {msg.role === "user" ? <User className="w-6 h-6 text-stone-600" /> : <Bot className="w-6 h-6 text-emerald-600" />}
                    </div>
                    <div className={`px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-emerald-600 text-white" : "bg-white border border-stone-200 text-stone-800"}`}>
                      {renderStructuredContent(msg.content, msg.role === "user")}
                      <div className={`text-[10px] mt-2 opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center gap-3 text-stone-500 italic text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang truy xuất dữ liệu...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-6 bg-white border-t border-stone-200">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsCustomerMode(false)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isCustomerMode ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                  >
                    TRUY XUẤT NỘI BỘ
                  </button>
                  <button 
                    onClick={() => setIsCustomerMode(true)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isCustomerMode ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                  >
                    HỎI CHO KHÁCH HÀNG
                  </button>
                  <div className="h-4 w-px bg-stone-200 mx-2" />
                  <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                    {isCustomerMode ? "AI sẽ gợi ý câu trả lời cho khách & hướng dẫn sale" : "AI sẽ báo cáo thông tin tồn kho & kiến thức"}
                  </span>
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={isCustomerMode ? "Dán câu hỏi của khách vào đây..." : "Nhập yêu cầu truy xuất (VD: Kiểm tra tồn kho áo sơ mi)..."}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button onClick={handleSend} className={`${isCustomerMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-stone-900 hover:bg-stone-800'} text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg`}>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </footer>
          </div>
        )}

        {activeTab === "dual" && (
          <div className="flex-1 flex h-full overflow-hidden bg-stone-200">
            {/* Left: Customer Chat */}
            <div className="flex-1 flex flex-col bg-white border-r border-stone-300">
              <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Khách hàng: Nguyễn Văn A</h3>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Đang kết nối</p>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
                {customerMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "customer" ? "justify-start" : "justify-end"}`}>
                    <div className="group relative max-w-[85%]">
                      <div className={`px-5 py-3.5 rounded-2xl text-sm shadow-sm transition-all ${
                        msg.role === "customer" 
                          ? "bg-white border border-stone-200 text-stone-800 rounded-tl-none" 
                          : "bg-blue-600 text-white rounded-tr-none shadow-blue-900/10"
                      }`}>
                        {msg.content}
                        <div className={`text-[9px] mt-1.5 font-medium opacity-40 ${msg.role === "customer" ? "text-stone-500" : "text-blue-100"}`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content);
                          setCopiedId(msg.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className={`absolute top-0 ${msg.role === "customer" ? "-right-10" : "-left-10"} p-2 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-stone-600`}
                        title="Copy tin nhắn"
                      >
                        {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <div ref={customerEndRef} />
              </div>

              <footer className="p-4 bg-white border-t border-stone-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customerInput}
                    onChange={(e) => setCustomerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCustomerSend("sale");
                    }}
                    placeholder="Nhập tin nhắn gửi khách..."
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                  <button 
                    onClick={() => handleCustomerSend("customer")}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-xl text-xs font-bold"
                    title="Giả lập tin nhắn từ khách"
                  >
                    Khách hỏi
                  </button>
                  <button 
                    onClick={() => handleCustomerSend("sale")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </footer>
            </div>

            {/* Right: AI Co-pilot */}
            <div className="w-[480px] flex flex-col bg-stone-100 border-l border-stone-300">
              <header className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between shadow-lg z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">AI Co-pilot Suggestions</h3>
                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">Real-time Assistance</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAiSuggestions([])}
                  className="text-stone-400 hover:text-white transition-colors"
                  title="Xóa gợi ý"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {aiSuggestions.length === 0 && !isCustomerTyping && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30">
                    <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-stone-400" />
                    </div>
                    <p className="text-sm font-medium text-stone-600">Chưa có hội thoại mới.<br/>AI sẽ tự động gợi ý khi khách hàng nhắn tin.</p>
                  </div>
                )}
                
                <AnimatePresence mode="popLayout">
                  {aiSuggestions.slice().reverse().map((sug) => {
                    // Split by markdown headers
                    const sections = sug.content.split(/###\s+/).filter(Boolean);
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={sug.id} 
                        className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden ring-1 ring-black/5"
                      >
                        <div className="bg-stone-900 px-4 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Gợi ý AI</span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">{sug.timestamp.toLocaleTimeString()}</span>
                        </div>
                        
                        <div className="p-5 space-y-6">
                          {sections.map((section: string, idx: number) => {
                            const lines = section.trim().split("\n");
                            const title = lines[0].trim();
                            const content = lines.slice(1).join("\n").trim();
                            
                            const isProductSection = title.toLowerCase().includes("sản phẩm");
                            const isReplySection = title.toLowerCase().includes("gợi ý trả lời");
                            const isGuideSection = title.toLowerCase().includes("kiến thức");

                            return (
                              <div key={idx} className="space-y-3">
                                <div className="flex items-center gap-2">
                                  {isReplySection && <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />}
                                  {isProductSection && <Package className="w-3.5 h-3.5 text-blue-500" />}
                                  {isGuideSection && <Lightbulb className="w-3.5 h-3.5 text-amber-500" />}
                                  <h4 className={`text-[11px] font-black uppercase tracking-widest ${
                                    isReplySection ? 'text-emerald-600' : 
                                    isProductSection ? 'text-blue-600' : 
                                    'text-amber-600'
                                  }`}>
                                    {title}
                                  </h4>
                                </div>
                                
                                <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap shadow-inner ${
                                  isReplySection ? 'bg-emerald-50/50 text-stone-800 border border-emerald-100/50' : 
                                  isProductSection ? 'bg-blue-50/50 text-stone-800 border border-blue-100/50 font-mono text-xs' : 
                                  'bg-amber-50/50 text-stone-700 border border-amber-100/50 italic'
                                }`}>
                                  {content}
                                </div>

                                {isReplySection && (
                                  <div className="flex gap-2 pt-1">
                                    <button 
                                      onClick={() => setCustomerInput(content)}
                                      className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 active:scale-95"
                                    >
                                      <Send className="w-3.5 h-3.5" /> SỬ DỤNG
                                    </button>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(content);
                                        setCopiedId(sug.id + idx);
                                        setTimeout(() => setCopiedId(null), 2000);
                                      }}
                                      className="bg-white border border-stone-200 text-stone-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                    >
                                      {copiedId === sug.id + idx ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                                          <span className="text-emerald-600">ĐÃ COPY</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>COPY</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {isCustomerTyping && (
                  <div className="flex items-center gap-3 text-emerald-600 italic text-xs font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" /> AI đang phân tích yêu cầu của khách...
                  </div>
                )}
                <div ref={suggestionEndRef} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="p-8 overflow-y-auto h-full bg-stone-50">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Kho kiến thức nội bộ</h2>
                  <p className="text-sm text-stone-500">Quản lý quy trình và chính sách bán hàng</p>
                </div>
                <div className="text-xs font-bold bg-stone-200 px-3 py-1 rounded-full text-stone-600 uppercase tracking-wider">{knowledge.length} mục</div>
              </div>

              {/* AI Smart Search for Knowledge */}
              <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-xl shadow-emerald-900/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <Search className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold">Truy xuất thông tin thông minh (AI)</h3>
                </div>
                <div className="flex gap-2">
                  <input 
                    placeholder="Nhập câu hỏi về chính sách, quy trình... (AI sẽ tìm cả trong sản phẩm)" 
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={smartSearchQuery}
                    onChange={e => setSmartSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSmartSearch()}
                  />
                  <button 
                    onClick={handleSmartSearch}
                    disabled={isSearching}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    TÌM KIẾM
                  </button>
                </div>
                {searchResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white text-stone-800 p-5 rounded-xl border border-emerald-500/30 shadow-inner"
                  >
                    {renderStructuredContent(searchResult, false)}
                    <button 
                      onClick={() => setSearchResult(null)}
                      className="mt-4 text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest"
                    >
                      Đóng kết quả
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Nạp thêm kiến thức mới</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    placeholder="Chủ đề (VD: Chính sách đổi trả)" 
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm"
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                  />
                  <textarea 
                    placeholder="Nội dung chi tiết..." 
                    rows={4} 
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm"
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                  />
                  <button onClick={addKnowledge} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-stone-800 transition-all">
                    Lưu vào hệ thống
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {knowledge.map((k: any) => (
                  <div key={k.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                    <h4 className="font-bold text-emerald-700 mb-2">{k.topic}</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">{k.content}</p>
                    <div className="mt-4 text-[10px] text-stone-400 uppercase font-bold tracking-widest">Cập nhật: {new Date(k.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="p-8 overflow-y-auto h-full bg-stone-50">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Danh mục sản phẩm KiotViet</h2>
                  <p className="text-sm text-stone-500">Dữ liệu tồn kho và giá bán thời gian thực</p>
                </div>
                <button 
                  onClick={syncKiotViet}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Đồng bộ KiotViet
                </button>
              </div>

              {/* AI Smart Search for Products */}
              <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold">Tìm kiếm sản phẩm thông minh (AI)</h3>
                </div>
                <div className="flex gap-2">
                  <input 
                    placeholder="Mô tả sản phẩm bạn cần tìm... (AI sẽ tìm cả trong kiến thức nội bộ)" 
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={smartSearchQuery}
                    onChange={e => setSmartSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSmartSearch()}
                  />
                  <button 
                    onClick={handleSmartSearch}
                    disabled={isSearching}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    PHÂN TÍCH
                  </button>
                </div>
                {searchResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white text-stone-800 p-5 rounded-xl border border-blue-500/30 shadow-inner"
                  >
                    {renderStructuredContent(searchResult, false)}
                    <button 
                      onClick={() => setSearchResult(null)}
                      className="mt-4 text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest"
                    >
                      Đóng kết quả
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-stone-500 uppercase tracking-wider text-[10px]">Mã SP</th>
                      <th className="px-6 py-4 font-bold text-stone-500 uppercase tracking-wider text-[10px]">Tên sản phẩm</th>
                      <th className="px-6 py-4 font-bold text-stone-500 uppercase tracking-wider text-[10px]">Danh mục</th>
                      <th className="px-6 py-4 font-bold text-stone-500 uppercase tracking-wider text-[10px]">Giá bán</th>
                      <th className="px-6 py-4 font-bold text-stone-500 uppercase tracking-wider text-[10px]">Tồn kho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p: any) => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-stone-500">{p.product_code}</td>
                        <td className="px-6 py-4 font-medium">{p.product_name}</td>
                        <td className="px-6 py-4 text-stone-500">{p.category}</td>
                        <td className="px-6 py-4 font-bold text-emerald-700">{p.price.toLocaleString()}đ</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {p.stock} SP
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
