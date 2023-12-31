"use client";
import { createRef, useEffect, useState } from "react";
import {
  editCaption,
  generateCaption,
  getCaptions,
  reportImage,
} from "@/db/actions";
import { langMap } from "./languages";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const selectRef = createRef<HTMLSelectElement>();
  const [captionValue, setCaptionValue] = useState("");
  const [reportValue, setReportValue] = useState("");
  const [processing, setProcessing] = useState(false);

  const setValueFromSelect = (items: Caption[]) => {
    if (selectRef.current && selectRef.current.value !== "") {
      const caption = items.find(
        (caption) => caption.langCode === selectRef.current?.value
      )?.text;
      setCaptionValue(caption || "");
    }
  };

  const getButtonClass = (baseClass: string) =>
    `${baseClass} ${processing ? "opacity-50 cursor-not-allowed" : ""}`;

  const getTextareaClass = (baseClass: string) =>
    `${baseClass} ${
      processing ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100"
    }`;

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
      setValueFromSelect(res);
    });
  }, [props.id]);

  const updateCaption = async () => {
    if (
      selectRef.current &&
      selectRef.current.value !== "" &&
      captionValue !== ""
    ) {
      setProcessing(true);
      const langCode = selectRef.current.value;
      const text = captionValue;
      try {
        await editCaption(props.id, langCode, text);
        toast.success("Suggestion was sent successfully!");
      } catch (e) {
        toast.error(e as string);
      }
      setProcessing(false);
    }
  };

  const submitReport = async () => {
    if (reportValue !== "") {
      setProcessing(true);
      try {
        await reportImage(props.id, reportValue);
        toast.success("Report submitted successfully!");
        setReportValue("");
      } catch (e) {
        toast.error(e as string);
      }
      setProcessing(false);
    }
  };

  const generateNewCaption = async () => {
    if (
      selectRef.current &&
      selectRef.current.value !== "" &&
      selectRef.current.value === "eng_Latn"
    ) {
      setProcessing(true);
      try {
        const caption = await generateCaption(props.id);
        if (caption !== "") {
          setCaptionValue(caption);
        }
      } catch (e) {
        toast.error(e as string);
      }
      setProcessing(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />
      {captions.length > 0 && (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-white">
          <img
            src={`https://nllb-data.com/${props.id}.jpg`}
            alt="Image"
            className="rounded-sm h-96"
          />
          <select
            disabled={processing}
            ref={selectRef}
            onChange={() => setValueFromSelect(captions)}
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
            <SignedIn>
              <textarea
                dir="auto"
                className={getTextareaClass(
                  "w-full p-2 text-gray-700 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                )}
                value={captionValue}
                onChange={(e) => setCaptionValue(e.target.value)}
                rows={3}
                disabled={processing}
              ></textarea>
              <div>
                <button
                  className={getButtonClass(
                    "w-full p-2 text-white bg-blue-500 rounded-sm"
                  )}
                  disabled={processing}
                  onClick={updateCaption}
                >
                  Suggest edits
                </button>
                <button
                  className={getButtonClass(
                    "w-full mt-2 p-2 text-white bg-green-500 rounded-sm"
                  )}
                  disabled={processing}
                  onClick={generateNewCaption}
                >
                  Generate caption
                </button>
                <textarea
                  dir="auto"
                  className={getTextareaClass(
                    "w-full mt-3 p-2 text-gray-700 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                  )}
                  placeholder="Report a problem with this image"
                  rows={2}
                  disabled={processing}
                  value={reportValue}
                  onChange={(e) => setReportValue(e.target.value)}
                ></textarea>
                <button
                  className={getButtonClass(
                    "w-full mt-2 p-2 text-white bg-red-500 rounded-sm"
                  )}
                  disabled={processing}
                  onClick={submitReport}
                >
                  Report
                </button>
              </div>
            </SignedIn>
            <SignedOut>
              <textarea
                disabled
                dir="auto"
                className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                value={captionValue}
                rows={3}
              ></textarea>
              <div>
                <SignInButton mode="modal">
                  <button className="w-full p-2 text-white bg-blue-500 rounded-sm">
                    Sign in to edit or report
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </>
  );
};
