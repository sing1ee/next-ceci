import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { UserProfileEdit } from "./UserProfileEdit";

interface DivinationResult {
    id?: string;
    character: string;
    interpretation: string;
    created_at?: string;
}

interface UserProfile {
    id: string;
    display_name: string;
}

export function CharacterDivination() {
    const [results, setResults] = useState<DivinationResult[]>([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const { toast } = useToast();

    useEffect(() => {
        const fetchSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchDivinations(session.user.id);
                fetchUserProfile(session.user.id);
            }
            setLoading(false);
        };
        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user;
                setUser(currentUser ?? null);
                if (currentUser) {
                    fetchDivinations(currentUser.id);
                    fetchUserProfile(currentUser.id);
                    if (event === "SIGNED_IN") {
                        toast({
                            title: "登录成功",
                            description: "欢迎回来！",
                        });
                    }
                } else {
                    setResults([]);
                    setUserProfile(null);
                    if (event === "SIGNED_OUT") {
                        toast({
                            title: "已退出登录",
                            description: "期待您的再次光临！",
                        });
                    }
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [toast]);

    const fetchUserProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching user profile:", error);
        } else if (data) {
            setUserProfile(data);
        }
    };

    const fetchDivinations = async (userId: string) => {
        const { data, error } = await supabase
            .from("divinations")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching divinations:", error);
        } else {
            setResults(data || []);
        }
    };

    const handleDivine = async () => {
        if (input.trim() && user) {
            const mockInterpretation = `The character "${input}" signifies great fortune in your near future. It carries the energy of prosperity and harmony.`;

            const newDivination: DivinationResult = {
                character: input,
                interpretation: mockInterpretation,
            };

            const { data, error } = await supabase
                .from("divinations")
                .insert([{ user_id: user.id, ...newDivination }])
                .select();

            if (error) {
                console.error("Error saving divination:", error);
            } else if (data) {
                setResults([data[0], ...results]);
            }

            setInput("");
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (authMode === "register") {
                // Check if the email already exists
                const { data, error } = await supabase
                    .from("profiles")
                    .select("email")
                    .eq("email", email)
                    .single();

                if (data) {
                    // Email already exists
                    toast({
                        title: "邮箱已注册",
                        description: "该邮箱已注册，您可以直接登录。",
                        variant: "default",
                    });
                    setAuthMode("login"); // Switch to login mode
                    return;
                }

                // If email doesn't exist, proceed with registration
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                toast({
                    title: "注册成功",
                    description: "请查收邮件进行确认。",
                });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Login success toast is handled in the onAuthStateChange listener
            }
        } catch (error) {
            toast({
                title: authMode === "register" ? "注册失败" : "登录失败",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            toast({
                title: "退出登录失败",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleProfileUpdate = async (newDisplayName: string) => {
        if (user) {
            try {
                // Fetch the existing profile
                const { data: existingProfile, error: fetchError } =
                    await supabase
                        .from("profiles")
                        .select("id")
                        .eq("id", user.id)
                        .single();

                if (fetchError && fetchError.code === "PGRST116") {
                    // If no profile exists, insert a new one
                    const { error: insertError } = await supabase
                        .from("profiles")
                        .insert({
                            id: user.id,
                            display_name: newDisplayName,
                            updated_at: new Date(),
                        });

                    if (insertError) throw insertError;

                    setUserProfile((prev) =>
                        prev ? { ...prev, display_name: newDisplayName } : null
                    );
                    toast({
                        title: "个人信息更新成功",
                        description: "您的显示名称已更新。",
                    });
                } else if (existingProfile) {
                    // If profile exists, update it
                    const { error: updateError } = await supabase
                        .from("profiles")
                        .update({
                            display_name: newDisplayName,
                            updated_at: new Date(),
                        })
                        .eq("id", user.id);

                    if (updateError) throw updateError;

                    setUserProfile((prev) =>
                        prev ? { ...prev, display_name: newDisplayName } : null
                    );
                    toast({
                        title: "个人信息更新成功",
                        description: "您的显示名称已更新。",
                    });
                } else {
                    throw new Error("无法获取或创建用户资料");
                }
            } catch (error) {
                toast({
                    title: "更新失败",
                    description: error.message,
                    variant: "destructive",
                });
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div className="flex h-screen w-full bg-amber-50 text-amber-900 font-serif justify-center items-center">
                <div className="w-full max-w-md">
                    <form
                        onSubmit={handleAuth}
                        className="bg-amber-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {authMode === "login" ? "登录" : "注册"}
                        </h2>
                        <div className="mb-4">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="电子邮箱"
                                className="bg-amber-50 border-amber-300 text-amber-900"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="密码"
                                className="bg-amber-50 border-amber-300 text-amber-900"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Button
                                type="submit"
                                className="bg-red-800 hover:bg-red-700"
                            >
                                {authMode === "login" ? "登录" : "注册"}
                            </Button>
                            <Button
                                type="button"
                                onClick={() =>
                                    setAuthMode(
                                        authMode === "login"
                                            ? "register"
                                            : "login"
                                    )
                                }
                                variant="link"
                                className="text-amber-900"
                            >
                                {authMode === "login"
                                    ? "切换到注册"
                                    : "切换到登录"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

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
                            <h3 className="text-lg font-semibold mb-4">
                                用户信息
                            </h3>
                            <p className="mb-2">邮箱：{user.email}</p>
                            <p className="mb-4">
                                显示名称：{userProfile?.display_name}
                            </p>
                            <UserProfileEdit
                                userId={user.id}
                                initialDisplayName={
                                    userProfile?.display_name || ""
                                }
                                onUpdate={handleProfileUpdate}
                            />
                            <Button
                                onClick={handleLogout}
                                className="mt-4 bg-red-800 hover:bg-red-700"
                            >
                                登出
                            </Button>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Divination Area */}
            <div className="flex flex-col w-4/5">
                <ScrollArea className="flex-grow p-4">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className="mb-6 bg-amber-100 p-4 rounded-lg shadow"
                        >
                            <h3 className="text-2xl font-bold mb-2">
                                "{result.character}"
                            </h3>
                            <p className="text-lg">{result.interpretation}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(result.created_at).toLocaleString()}
                            </p>
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
