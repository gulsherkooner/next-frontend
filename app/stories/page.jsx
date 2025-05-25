"use client";
import React from "react";
import { useState } from "react";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import Stories from "../components/storiesComponents/Stories";

export default function ReelsPage() {

  
  const [menu, setMenu] = useState(false);

  return (
    <div className="bg-gray-100 min-h-auto pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      
      <div className="pt-14 flex flex-col items-center justify-start w-full h-screen pb-14 md:pb-0 ">
        <Stories />
      </div>
      <MobileNav />
    </div>
  );
}
