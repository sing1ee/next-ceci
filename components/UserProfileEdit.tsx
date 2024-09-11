import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileEditProps {
    userId: string;
    initialDisplayName: string;
    initialAvatarUrl: string | null;
    onUpdate: (newDisplayName: string, newAvatarUrl: string | null) => void;
}

export function UserProfileEdit({
    userId,
    initialDisplayName,
    initialAvatarUrl,
    onUpdate,
}: UserProfileEditProps) {
    const [displayName, setDisplayName] = useState(initialDisplayName);
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleAvatarUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${userId}-${Math.random()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from("avatars")
                .upload(fileName, file);

            if (error) {
                toast({
                    title: "上传失败",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                const {
                    data: { publicUrl },
                } = supabase.storage.from("avatars").getPublicUrl(fileName);
                setAvatarUrl(publicUrl);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    display_name: displayName,
                    avatar_url: avatarUrl,
                    updated_at: new Date(),
                })
                .eq("id", userId);

            if (error) throw error;

            onUpdate(displayName, avatarUrl);
            toast({
                title: "个人信息更新成功",
                description: "您的显示名称和头像已更新。",
            });
        } catch (error) {
            toast({
                title: "更新失败",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage
                        src={avatarUrl || undefined}
                        alt={displayName}
                    />
                    <AvatarFallback>
                        {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-amber-600 hover:bg-amber-500"
                >
                    上传头像
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            <div>
                <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-amber-900"
                >
                    显示名称
                </label>
                <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 bg-amber-50 border-amber-300 text-amber-900"
                    required
                />
            </div>
            <Button type="submit" className="bg-red-800 hover:bg-red-700">
                保存
            </Button>
        </form>
    );
}
