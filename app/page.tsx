"use client";

import React from "react";
import { CharacterDivination } from "@/components/CharacterDivination";

export default function Home() {
    return (
        <main className="h-screen w-screen overflow-hidden bg-amber-50">
            <CharacterDivination />
        </main>
    );
}
