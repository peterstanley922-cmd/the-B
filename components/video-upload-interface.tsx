"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Video,
    Upload,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
    ImageIcon, // Added import for ImageIcon
    Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input";
import { StoryViewer, type Story } from "@/components/ui/story-viewer";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {props.onChange && (
          <div 
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export function VideoUploadInterface() {
    const [value, setValue] = useState("");
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string>("");
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");
    const [processingSteps, setProcessingSteps] = useState<Array<{id: number; title: string; status: 'pending' | 'processing' | 'complete'}>>(
        [
            { id: 1, title: 'Video Analysis', status: 'pending' },
            { id: 2, title: 'Scene Detection', status: 'pending' },
            { id: 3, title: 'Audio Processing', status: 'pending' },
            { id: 4, title: 'AI Enhancement', status: 'pending' }
        ]
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [chatValue, setChatValue] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [attachments, setAttachments] = useState<string[]>([]);
    const commandPaletteRef = useRef(null);
    const commandSuggestions = [
        { icon: <Video />, label: 'Upload Video', description: 'Upload a video file', prefix: '/upload' },
        { icon: <FileUp />, label: 'Add File', description: 'Add a file attachment', prefix: '/file' },
    ];
    const activeSuggestion = 0;
    const textareaRef = useRef(null);
    const { adjustHeight } = useAutoResizeTextarea({ minHeight: 60 });
    const handleKeyDown = useCallback((e) => {
        // Placeholder for keydown logic
    }, []);
    const selectCommandSuggestion = useCallback((index) => {
        // Placeholder for selecting command suggestion logic
    }, []);
    const handleSendMessage = useCallback(() => {
        // Placeholder for send message logic
    }, []);
    const removeAttachment = useCallback((index) => {
        setAttachments(prevAttachments => prevAttachments.filter((_, i) => i !== index));
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const storyUsers = [
        {
            username: "Iman Gadzhi",
            avatar: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Iman+Gadzhi",
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            stories: [
                { id: "iman-1", type: "image" as const, src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=1200&fit=crop" },
                { id: "iman-2", type: "image" as const, src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=1200&fit=crop" },
            ],
        },
        {
            username: "Joseph (Joey Edits)",
            avatar: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Joseph+Joey+Edits",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            stories: [
                { id: "joseph-1", type: "image" as const, src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1200&fit=crop" },
            ],
        },
        {
            username: "Dan Martel",
            avatar: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Dan+Martel",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            stories: [
                { id: "dan-1", type: "image" as const, src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop" },
                { id: "dan-2", type: "image" as const, src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1200&fit=crop" },
            ],
        },
        {
            username: "Mark Belga",
            avatar: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Mark+Belga",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            stories: [
                { id: "mark-1", type: "image" as const, src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1200&fit=crop" },
            ],
        },
        {
            username: "Mohamed Zerguini",
            avatar: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Mohamed+Zerguini",
            timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
            stories: [
                { id: "mohamed-1", type: "image" as const, src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1200&fit=crop" },
            ],
        },
    ];

    const handleChatSubmit = () => {
        // Placeholder for chat submission logic
    };

    const setRecentCommand = (label: string | null) => {
        // Placeholder for setting recent command logic
    };

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center bg-transparent text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
                <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
            </div>
            <div className="w-full max-w-2xl mx-auto relative">
                <motion.div 
                    className="relative z-10 space-y-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                            <h1 className="text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                                Upload Your Video
                            </h1>
                            <motion.div 
                                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p 
                            className="text-sm text-white/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Drag and drop your video or click to select
                        </motion.p>
                    </div>

                    <motion.div 
                        className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AnimatePresence>
                            {showCommandPalette && (
                                <motion.div 
                                    ref={commandPaletteRef}
                                    className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="py-1 bg-black/95">
                                        {commandSuggestions.map((suggestion, index) => (
                                            <motion.div
                                                key={suggestion.prefix}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                                                    activeSuggestion === index 
                                                        ? "bg-white/10 text-white" 
                                                        : "text-white/70 hover:bg-white/5"
                                                )}
                                                onClick={() => selectCommandSuggestion(index)}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <div className="w-5 h-5 flex items-center justify-center text-white/60">
                                                    {suggestion.icon}
                                                </div>
                                                <div className="font-medium">{suggestion.label}</div>
                                                <div className="text-white/40 text-xs ml-1">
                                                    {suggestion.prefix}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <div className="p-4">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            placeholder="Describe your video or add notes..."
                            containerClassName="w-full"
                            className={cn(
                                "w-full px-4 py-3",
                                "resize-none",
                                "bg-transparent",
                                "border-none",
                                "text-white/90 text-sm",
                                "focus:outline-none",
                                "placeholder:text-white/20",
                                "min-h-[60px]"
                            )}
                            style={{
                                overflow: "hidden",
                            }}
                            showRing={false}
                        />
                    </div>

                    <AnimatePresence>
                        {attachments.length > 0 && (
                            <motion.div 
                                className="px-4 pb-3 flex gap-2 flex-wrap"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {attachments.map((file, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <span>{file}</span>
                                        <button 
                                            onClick={() => removeAttachment(index)}
                                            className="text-white/40 hover:text-white transition-colors"
                                        >
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <motion.button
                                type="button"
                                onClick={() => setShowFileUploadModal(true)}
                                whileTap={{ scale: 0.94 }}
                                className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
                                title="Upload files"
                            >
                                <LinkIcon className="w-4 h-4" />
                                <motion.span
                                    className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    layoutId="button-highlight"
                                />
                            </motion.button>
                            <motion.button
                                type="button"
                                data-command-button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCommandPalette(prev => !prev);
                                }}
                                whileTap={{ scale: 0.94 }}
                                className={cn(
                                    "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group",
                                    showCommandPalette && "bg-white/10 text-white/90"
                                )}
                            >
                                <Command className="w-4 h-4" />
                                <motion.span
                                    className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    layoutId="button-highlight"
                                />
                            </motion.button>
                        </div>
                        
                        <motion.button
                            type="button"
                            onClick={handleSendMessage}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={inputFocused || !value.trim()}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                "flex items-center gap-2",
                                value.trim()
                                    ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                                    : "bg-white/[0.05] text-white/40"
                            )}
                        >
                            {inputFocused ? (
                                <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                            ) : (
                                <SendIcon className="w-4 h-4" />
                            )}
                            <span>Send</span>
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {inputFocused && (
                    <motion.div 
                        className="fixed bottom-8 mx-auto transform -translate-x-1/2 backdrop-blur-2xl bg-white/[0.02] rounded-full px-4 py-2 shadow-lg border border-white/[0.05]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-center">
                                <span className="text-xs font-medium text-white/90 mb-0.5">zap</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <span>Thinking</span>
                                <TypingDots />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {inputFocused && (
                <motion.div 
                    className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
                    animate={{
                        x: mousePosition.x - 400,
                        y: mousePosition.y - 400,
                    }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 150,
                        mass: 0.5,
                    }}
                />
            )}

            {/* PROCESSING MODAL */}
            <AnimatePresence>
                {showProcessingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        style={{ top: '96px', height: 'calc(100vh - 96px)' }}
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-[98%] h-[98%] bg-black/80 rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(139,92,246,0.2)] flex flex-col shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_80px_rgba(139,92,246,0.3)]"
                        >
                            {/* Close Button - Top Right */}
                            <button
                                onClick={() => setShowProcessingModal(false)}
                                className="absolute top-6 right-6 z-50 p-2 hover:bg-white/10 rounded-lg transition-colors group"
                            >
                                <XIcon className="w-6 h-6 text-white/60 group-hover:text-white" />
                            </button>

                            {/* Header */}
                            <div className="px-8 py-6 border-b border-white/10">
                                <h2 className="text-lg font-semibold text-white">
                                    PROMPT: <span className="text-white/60">{uploadedFileName}</span>
                                </h2>
                            </div>

                            {/* Stories Carousel */}
                            <div className="px-8 py-4 border-b border-white/10">
                                <div className="relative mb-3">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-xl"></div>
                                    <h3 className="relative text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">Editing Style</h3>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                                    {storyUsers.map((user) => (
                                        <StoryViewer
                                            key={user.username}
                                            stories={user.stories}
                                            username={user.username}
                                            avatar={user.avatar}
                                            timestamp={user.timestamp}
                                            onStoryView={() => {}}
                                            onAllStoriesViewed={() => {}}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Main content area */}
                            <div className="flex-1 overflow-auto flex flex-col gap-6 p-8">
                                {/* Video + Chat + Status Container */}
                                <div className="flex gap-8 h-full">
                                    {/* Left: Video + Chat */}
                                    <div className="flex-1 flex flex-col gap-6 min-w-0">
                                        {/* Video Player */}
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className="relative flex-1 rounded-2xl overflow-hidden bg-black border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(139,92,246,0.2)] min-h-0"
                                        >
                                            <video
                                                src={uploadedVideoUrl}
                                                controls
                                                className="w-full h-full object-contain"
                                                autoPlay
                                                muted
                                            />
                                        </motion.div>

                                        {/* Chat Input */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.2 }}
                                        >
                                            <ChatInput
                                                variant="default"
                                                value={chatValue}
                                                onChange={(e) => setChatValue(e.target.value)}
                                                onSubmit={handleChatSubmit}
                                                loading={chatLoading}
                                            >
                                                <ChatInputTextArea 
                                                    placeholder="Ask about your video..."
                                                    rows={1}
                                                />
                                                <ChatInputSubmit />
                                            </ChatInput>
                                        </motion.div>
                                    </div>

                                    {/* Right: Processing Steps */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        className="w-72 flex flex-col gap-4 bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-6 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_60px_rgba(139,92,246,0.15)] backdrop-blur-sm overflow-auto"
                                    >
                                        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Status</h3>
                                        <div className="space-y-3 flex-1">
                                            {processingSteps.map((step, index) => (
                                                <motion.div
                                                    key={step.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={cn(
                                                        "p-4 rounded-xl border transition-all shadow-lg",
                                                        step.status === 'complete' && "bg-green-500/15 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]",
                                                        step.status === 'processing' && "bg-blue-500/15 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]",
                                                        step.status === 'pending' && "bg-white/5 border-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {step.status === 'processing' && (
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                                className="w-4 h-4 border-2 border-blue-500/60 border-t-blue-500 rounded-full flex-shrink-0"
                                                            />
                                                        )}
                                                        {step.status === 'complete' && (
                                                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        {step.status === 'pending' && (
                                                            <div className="w-4 h-4 rounded-full border-2 border-white/20 flex-shrink-0" />
                                                        )}
                                                        <span className={cn(
                                                            "text-sm font-medium",
                                                            step.status === 'pending' && "text-white/60"
                                                        )}>
                                                            {step.title}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FILE UPLOAD MODAL */}
            <AnimatePresence>
                {showFileUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFileUploadModal(false)}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl"
                        >
                            <div className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
                                <div className="flex items-center justify-between p-6 border-b border-white/10">
                                    <h2 className="text-xl font-semibold text-white">Upload Files</h2>
                                    <button
                                        onClick={() => setShowFileUploadModal(false)}
                                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <XIcon className="w-5 h-5 text-white/60 hover:text-white/90" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <FileUpload onChange={(files) => {
                                        if (files.length > 0) {
                                            setUploadedFileName(files[0].name);
                                            const videoUrl = URL.createObjectURL(files[0]);
                                            setUploadedVideoUrl(videoUrl);
                                            setShowFileUploadModal(false);
                                            setProcessingSteps([
                                                { id: 1, title: 'Video Analysis', status: 'processing' },
                                                { id: 2, title: 'Scene Detection', status: 'pending' },
                                                { id: 3, title: 'Audio Processing', status: 'pending' },
                                                { id: 4, title: 'AI Enhancement', status: 'pending' }
                                            ]);
                                            setCurrentStep(0);
                                            setShowProcessingModal(true);
                                        }
                                    }} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)"
                    }}
                />
            ))}
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false);
    
    return (
        <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-all relative overflow-hidden group"
        >
            <div className="relative z-10 flex items-center gap-2">
                {icon}
                <span className="text-xs relative z-10">{label}</span>
            </div>
            
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>
            
            <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}

const rippleKeyframes = `
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
`;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = rippleKeyframes;
    document.head.appendChild(style);
}
