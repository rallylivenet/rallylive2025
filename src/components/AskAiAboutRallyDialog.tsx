
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, MessageCircleQuestion, Send, Sparkles, User, X, LogIn } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';

interface AskAiAboutRallyDialogProps {
  rid: string;
  stage_no: string;
  rallyName: string;
  stageName: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AskAiAboutRallyDialog({ rid, stage_no, rallyName, stageName }: AskAiAboutRallyDialogProps) {
  const { toast } = useToast();
  const [question, setQuestion] = React.useState('');
  const [isAsking, setIsAsking] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

  React.useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) {
        return;
    }
     if (!rallyName || !stageName) {
        toast({
            variant: 'destructive',
            title: 'Missing Rally Information',
            description: 'Could not determine the rally context. Please refresh the page and try again.',
        });
        return;
    }

    setIsAsking(true);
    setMessages(prev => [...prev, {role: 'user', content: question}]);
    
    try {
      const response = await fetch('/api/ask-rally-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, rid, stage_no, stageName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unexpected error occurred.');
      }

      if (result.answer) {
        setMessages(prev => [...prev, {role: 'assistant', content: result.answer!}]);
        setQuestion('');
      } else {
        throw new Error('Failed to get an answer from the AI.');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Query Failed',
        description: error.message,
      });
      setMessages(prev => prev.slice(0, -1)); // Remove the user's message on error
    } finally {
      setIsAsking(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setQuestion('');
  };

  const isReady = !!rallyName && !!stageName;

  if (!isLoggedIn) {
      return (
          <Button asChild variant="outline" size="sm" className="h-9 px-3">
            <Link href="/login">
                <LogIn className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Login to Ask AI</span>
            </Link>
          </Button>
      )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-3" disabled={!isReady}>
          <MessageCircleQuestion className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Ask AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Ask AI about {rallyName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center p-4">
                    <Sparkles className="h-10 w-10 mb-4 text-primary"/>
                    <p className="font-semibold">Ask anything about this rally!</p>
                    <p className="text-sm">For example: "Who is leading the rally?" or "Tell me about the top 3 drivers."</p>
                    <p className="text-xs mt-6 italic">This is an experimental feature, will be much better soon.</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                         {message.role === 'assistant' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                        <Card className={`max-w-[85%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            <CardContent className="p-3">
                                <ReactMarkdown className="prose prose-sm dark:prose-invert break-words">
                                    {message.content}
                                </ReactMarkdown>
                            </CardContent>
                        </Card>
                        {message.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                    </div>
                ))
            )}
            {isAsking && (
                 <div className="flex items-start gap-3">
                    <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                    <Card className="bg-secondary">
                        <CardContent className="p-3">
                            <Skeleton className="w-4 h-4 rounded-full animate-bounce" />
                        </CardContent>
                    </Card>
                 </div>
            )}
        </div>
        <DialogFooter className="p-4 border-t gap-2 sm:gap-2">
            {messages.length > 0 && (
                <Button variant="ghost" size="icon" onClick={handleClearChat} disabled={isAsking}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear Chat</span>
                </Button>
            )}
            <div className="relative flex-grow">
                <Textarea
                    placeholder="Ask a question about the rally..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAsk();
                        }
                    }}
                    className="pr-12 min-h-[40px] h-10"
                    rows={1}
                    disabled={isAsking}
                />
                <Button
                    type="submit"
                    size="icon"
                    onClick={handleAsk}
                    disabled={isAsking || !question.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
