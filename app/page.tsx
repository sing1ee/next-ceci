"use client";

import React from "react";
import { CharacterDivination } from "@/components/CharacterDivination";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
    return (
        <main className="h-screen w-screen overflow-hidden bg-amber-50">
            <CharacterDivination />
            <Toaster />
        </main>
    );
}
