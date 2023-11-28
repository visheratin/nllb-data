import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryProps {
  imageIDs: string[];
  onClick: (imageID: string) => void;
}

const GalleryComponent = (props: GalleryProps) => {
  // State to keep track of currently displayed images
  const [displayedImages, setDisplayedImages] = useState<string[]>([]);
  const [lastIndex, setLastIndex] = useState(0);
  const chunkSize = 24; // Number of images to load per "chunk"

  const loadMoreImages = useCallback(
    (reset: boolean) => {
      if (reset) {
        const nextImages = props.imageIDs.slice(0, chunkSize);
        setDisplayedImages(nextImages);
        setLastIndex(chunkSize);
      } else {
        const nextImages = props.imageIDs.slice(
          lastIndex,
          lastIndex + chunkSize
        );
        setDisplayedImages((prev) => [...prev, ...nextImages]);
        setLastIndex(lastIndex + chunkSize);
      }
    },
    [lastIndex, props.imageIDs]
  );

  useEffect(() => {
    loadMoreImages(true);
  }, [props.imageIDs]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
      event.currentTarget.clientHeight;
    if (bottom) {
      loadMoreImages(false);
    }
  };

  return (
    <div
      className="grid grid-cols-8 gap-2 p-1 overflow-auto"
      onScroll={handleScroll}
      style={{ height: "50vh" }}
    >
      {displayedImages.map((imageID, index) => (
        <div key={index} className="relative w-full h-40">
          <Image
            layout="fill"
            objectFit="cover"
            loading="lazy"
            src={`https://nllb-data.com/${imageID}.jpg`}
            alt={`Image ${index}`}
            onClick={() => props.onClick(imageID)}
            className="cursor-pointer rounded-sm border-2"
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryComponent;
