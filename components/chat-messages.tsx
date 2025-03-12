"use client";

import { Companion } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  companion: Companion;
}

export const ChatMessages = ({
  messages = [],
  isLoading,
  companion,
}: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // Used to scroll to the last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        src={companion.src}
        role="system"
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
      {messages.map((message, index) => (
        <ChatMessage
          role={message.role}
          key={`message-${index}`}
          content={message.content}
          src={message.role === "system" ? companion.src : message.src}
        />
      ))}
      {isLoading && <ChatMessage role="system" src={companion.src} isLoading />}
      {/* 
      This is used so the window is automatically sent to the 
      last div. It is using useRef from React and it starts working
      with a useEffect
      */}
      <div ref={scrollRef} />
    </div>
  );
};