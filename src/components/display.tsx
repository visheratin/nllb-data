"use client";
import { createRef, useEffect, useState } from "react";
import { getCaptions } from "@/db/captions";
import { langMap } from "./languages";

interface DisplayComponentProps {
  id: string;
}

interface Caption {
  langCode: string;
  language: string;
  text: string;
}

export const DisplayComponent = (props: DisplayComponentProps) => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [langCode, setLangCode] = useState("");
  const selectRef = createRef<HTMLSelectElement>();

  const setValueFromSelect = () => {
    if (selectRef.current && selectRef.current.value !== "") {
      setLangCode(selectRef.current.value);
    }
  };

  useEffect(() => {
    if (!props.id || props.id === "") {
      return;
    }
    getCaptions(props.id).then((captions) => {
      const res: Caption[] = [];
      langMap.forEach((value, key) => {
        const caption = captions.find((caption) => caption.lang === key);
        if (caption) {
          res.push({
            langCode: key,
            language: value,
            text: caption.text,
          });
        } else {
          res.push({
            langCode: key,
            language: value,
            text: "",
          });
        }
      });
      res.sort((a, b) => a.language.localeCompare(b.language));
      setCaptions(res);
      setValueFromSelect();
    });
  }, [props.id]);

  return (
    <>
      {captions.length > 0 && (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-white">
          <img
            src={`https://nllb-data.com/${props.id}.jpg`}
            alt="Image"
            className="rounded-sm h-96"
          />
          <select
            ref={selectRef}
            onChange={() => setValueFromSelect()}
            className="w-full p-2 text-gray-700 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a language</option>
            {captions.map((caption, index) => (
              <option key={index} value={caption.langCode}>
                {caption.language}
              </option>
            ))}
          </select>
          <div className="w-full">
            <textarea
              dir="auto"
              defaultValue={
                captions.find((caption) => caption.langCode === langCode)?.text
              }
              className="w-full h-40 p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>
      )}
    </>
  );
};
