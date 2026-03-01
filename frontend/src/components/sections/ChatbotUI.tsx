import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, FlaskConical } from "lucide-react";

interface ChatbotUIProps {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatHistory: { role: string; content: string }[];
  chatInput: string;
  setChatInput: (input: string) => void;
  chatLoading: boolean;
  handleSendMessage: (e: React.FormEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatbotUI({
  isChatOpen,
  setIsChatOpen,
  chatHistory,
  chatInput,
  setChatInput,
  chatLoading,
  handleSendMessage,
  chatEndRef,
}: ChatbotUIProps) {
  return (
    <>
      {/* Floating Chatbot */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand-yellow" />
                <span className="font-display font-semibold text-white">Precast Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {chatHistory.length === 0 && (
                <div className="text-center text-white/40 text-sm mt-10">
                  <FlaskConical className="w-8 h-8 opacity-50 mx-auto mb-3" />
                  Ask me anything about precast optimization, concrete mix, or the application!
                </div>
              )}
              {chatHistory.map((msg: { role: string; content: string }, idx: number) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-yellow/10 border border-brand-yellow/20 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3">
                    <motion.div className="flex gap-1.5 items-center h-5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-brand-yellow/60"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/[0.02]">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-yellow/50 transition-colors"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-yellow text-lt-dark rounded-full shadow-[0_0_30px_rgba(254,192,15,0.3)] flex items-center justify-center z-50"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
