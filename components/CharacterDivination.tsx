import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DivinationResult {
    character: string;
    interpretation: string;
}

export function CharacterDivination() {
    const [results, setResults] = useState<DivinationResult[]>([]);
    const [input, setInput] = useState("");

    const handleDivine = () => {
        if (input.trim()) {
            // In a real application, you would call an API or use an algorithm here
            const mockInterpretation = `The character "${input}" signifies great fortune in your near future. It carries the energy of prosperity and harmony.`;
            setResults([
                ...results,
                { character: input, interpretation: mockInterpretation },
            ]);
            setInput("");
        }
    };

    return (
        <div className="flex h-screen w-full bg-amber-50 text-amber-900 font-serif">
            {/* Sidebar */}
            <div className="w-1/5 bg-amber-100 p-4 flex flex-col border-r border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-center">测字</h2>
                <Button className="mb-4 bg-red-800 hover:bg-red-700">
                    新的占卜
                </Button>
                <ScrollArea className="flex-grow mb-4">
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            历史记录
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            收藏解读
                        </Button>
                    </div>
                </ScrollArea>
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full border-amber-700 text-amber-900"
                    >
                        设置
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full border-amber-700 text-amber-900"
                            >
                                用户信息
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="bg-amber-50">
                            <h3 className="text-lg font-semibold">用户信息</h3>
                            <p>姓名：张三</p>
                            <p>生辰：1990年6月15日</p>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Divination Area */}
            <div className="flex flex-col w-4/5">
                <ScrollArea className="flex-grow p-4">
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className="mb-6 bg-amber-100 p-4 rounded-lg shadow"
                        >
                            <h3 className="text-2xl font-bold mb-2">
                                "{result.character}"
                            </h3>
                            <p className="text-lg">{result.interpretation}</p>
                        </div>
                    ))}
                </ScrollArea>
                <div className="p-4 border-t border-amber-200">
                    <div className="flex space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleDivine()
                            }
                            placeholder="输入一个汉字..."
                            className="flex-grow bg-amber-50 border-amber-300 text-amber-900"
                            maxLength={1}
                        />
                        <Button
                            onClick={handleDivine}
                            className="bg-red-800 hover:bg-red-700"
                        >
                            占卜
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
