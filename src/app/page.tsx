"use client";
import { DisplayComponent } from "@/components/display";
import GalleryComponent from "@/components/gallery";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IntroModal from "@/components/info";
import { ClerkProvider } from "@clerk/nextjs";

export const runtime = "edge";

const ChartComponent = dynamic(() => import("@/components/chart"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const [imageIDs, setImageIDs] = useState<string[]>([]);
  const [selectedID, setSelectedID] = useState<string>("");
  const [userAck, setUserAck] = useState<boolean>(false);

  const handleZoom = (ids: string[]) => {
    setImageIDs(ids);
  };

  const handleImageClick = (imageID: string) => {
    setSelectedID(imageID);
  };

  const handleAck = () => {
    localStorage.setItem("ack", "true");
    setUserAck(true);
  };

  useEffect(() => {
    const ack = localStorage.getItem("ack");
    if (ack) {
      setUserAck(true);
    }
  }, []);

  return (
    <>
      {userAck ? (
        <main className="min-h-screen flex bg-white">
          <div className="flex flex-col w-2/3">
            <div className="flex-1" style={{ maxHeight: "49vh" }}>
              <ChartComponent onZoom={handleZoom} />
            </div>
            <div className="flex-1 overflow-auto" style={{ maxHeight: "50vh" }}>
              <GalleryComponent
                imageIDs={imageIDs}
                onClick={handleImageClick}
              />
            </div>
          </div>
          <div className="w-1/3 flex-1">
            <DisplayComponent id={selectedID} />
          </div>
        </main>
      ) : (
        <IntroModal onConfirm={handleAck} />
      )}
    </>
  );
}
