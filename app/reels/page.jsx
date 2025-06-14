"use client";
import React from "react";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import ReelsModal from "../components/reelComponents/ReelsModel";
import { useSearchParams } from "next/navigation";

export default function ReelsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [menu, setMenu] = useState(false);

  return (
    <div className="bg-gray-100 min-h-auto pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />

      <div className="pt-14 md:pl-56 flex flex-col items-center justify-start w-full h-screen pb-14 md:pb-0 ">
        <ReelsModal id={id} />
      </div>
      <MobileNav />
    </div>
  );
}
