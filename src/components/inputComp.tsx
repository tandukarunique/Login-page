"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { MdContentCopy } from "react-icons/md";
import { Toaster, toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Loader from "./ui/loader";
import { useMyContext } from "@/context/MyContext";

const InputComp: React.FC = () => {
  const [show, setShow] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date>();
  const [originalUrl, setOriginalUrl] = React.useState<string>("");
  const [keyword, setKeyword] = React.useState<string>("");
  const [loader, setLoader] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const { url, setUrl, setIsCreated, isCreated } = useMyContext();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  type RequestBody = {
    originalUrl: string;
    user: {
      _id: string | undefined;
    };
    customKeyword?: string;
    expirationDate?: string;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoader(true);

    const dateObject = date ? new Date(date) : undefined;
    const formattedDate = dateObject?.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    try {
      const user = localStorage.getItem("user");
      const { _id: userId } = user ? JSON.parse(user) : { _id: "" };
      const { token: userToken } = user ? JSON.parse(user) : { token: "" };

      const requestBody: RequestBody = {
        originalUrl,
        user: {
          _id: userId,
        },
      };

      if (keyword) {
        requestBody.customKeyword = keyword;
      }
      if (formattedDate) {
        requestBody.expirationDate = formattedDate;
      }

      const response = await fetch(
        `https://short-me.onrender.com/api/shorten/new`,
        {
          method: "POST",
          headers: {
            authorization: userToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Access the response body
      const responseData = await response.json();

      if (responseData.status === 201) {
        setUrl(responseData.newUrl.shortUrl);
        setIsCreated(!isCreated);
        setOriginalUrl("");
        setKeyword("");
        setDate(undefined);
        setLoader(false);
        setError("");
      } else if (responseData.status === 400) {
        setError(responseData.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error posting data:", error);
    }
  };

  const handleCopy = () => {
    if (url) {
      navigator.clipboard
        .writeText(`https://short-me.onrender.com/${url}`)
        .then(() => {
          toast.success("URL copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying URL to clipboard: ", error);
        });
    }
  };

  return (
    <div className="w-full mt-10">
      <span className="text-sm">Your long Url</span>
      <div className="flex items-start mt-1">
        <div className="w-full">
          <input
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className=" bg-gray-100 bg-opacity-30 border rounded-sm px-3 border-gray-500 block  w-full text-white text-opacity-100 py-2 focus:outline-none"
            type="text"
            placeholder="https://example.com/this-is-a-very-long-url-that-needs-to-be-shortened"
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
          {url && (
            <div className="flex items-center mt-2">
              <a
                href={`https://short-me.onrender.com/${url}`}
                target="_blank"
                className="text-green-500 text-sm font-semibold"
              >{`https://short-me.onrender.com/${url}`}</a>
              <MdContentCopy
                className="ms-2 cursor-pointer"
                onClick={handleCopy}
              />
            </div>
          )}
        </div>
        <Button
          disabled={!originalUrl}
          onClick={handleSubmit}
          style={{ minWidth: "82.3px" }}
          className="bg-orange-500 text-white rounded-sm py-5 ml-2 hover:bg-orange-400"
        >
          {loader ? <Loader /> : "Shorten"}
        </Button>
      </div>
      <div className="flex items-center justify-center mt-8">
        <Checkbox id="customProperties" onClick={() => setShow(!show)} />
        <label
          htmlFor="customProperties"
          className="ms-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Custom Options
        </label>
      </div>
      {show && (
        <div className="flex items-end flex-col md:flex-row  mt-4">
          <div className="w-full">
            <span className="text-sm">Custom Keyword</span>
            <input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="mt-2 block w-full bg-gray-100 bg-opacity-30 border rounded-sm px-3 border-gray-500  text-white text-opacity-100 py-2 focus:outline-none"
              type="text"
              placeholder="portfolio"
            />
          </div>
          <div
            className="ms-2 mt-3 md:mt-0 flex flex-col w-full"
            style={{ height: "100%" }}
          >
            <span className="text-sm mb-2">Expiration Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  style={{ minHeight: "41.6px" }}
                  className="bg-gray-100 bg-opacity-30 text-white rounded-sm py-5 flex justify-start hover:bg-gray-100 hover:bg-opacity-40 focus:outline-none w-full text-left px-3 border border-gray-500 text-opacity-100"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  disabled={(date) =>
                    date <= new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputComp;
