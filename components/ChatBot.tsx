import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Message {
    text: string;
    isUser: boolean;
}

export function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, isUser: true }]);
            // Here you would typically send the message to your backend and get a response
            // For this demo, we'll just echo the message back
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { text: `You said: ${input}`, isUser: false },
                ]);
            }, 1000);
            setInput("");
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <div className="w-1/5 bg-gray-100 p-4 flex flex-col">
                <Button className="mb-4">New Chat</Button>
                <ScrollArea className="flex-grow mb-4">
                    {/* Chat history list goes here */}
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            Chat 1
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            Chat 2
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            Chat 3
                        </Button>
                    </div>
                </ScrollArea>
                <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                        Settings
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                                User Info
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <h3 className="text-lg font-semibold">
                                User Information
                            </h3>
                            <p>Name: John Doe</p>
                            <p>Email: john@example.com</p>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col w-4/5">
                <ScrollArea className="flex-grow p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 ${
                                message.isUser ? "text-right" : "text-left"
                            }`}
                        >
                            <div
                                className={`inline-block p-2 rounded-lg ${
                                    message.isUser
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-black"
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
                <div className="p-4 border-t">
                    <div className="flex space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSend()
                            }
                            placeholder="Type a message..."
                            className="flex-grow"
                        />
                        <Button onClick={handleSend}>Send</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
