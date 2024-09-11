import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface UserProfileEditProps {
    userId: string;
    initialDisplayName: string;
    onUpdate: (newDisplayName: string) => void;
}

export function UserProfileEdit({
    userId,
    initialDisplayName,
    onUpdate,
}: UserProfileEditProps) {
    const [displayName, setDisplayName] = useState(initialDisplayName);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ display_name: displayName, updated_at: new Date() })
                .eq("id", userId);

            if (error) throw error;

            onUpdate(displayName);
            toast({
                title: "个人信息更新成功",
                description: "您的显示名称已更新。",
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
