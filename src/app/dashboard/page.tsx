"use client";
import InputComp from "@/components/inputComp";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { useMyContext } from "@/context/MyContext";
import Link from "next/link";
import React, { useEffect } from "react";
import { BsEye } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCopy } from "react-icons/io";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RequestBody = {
  _id: string | undefined;
};

const Dashboard: React.FC = () => {
  const { isCreated } = useMyContext();
  const [urlList, setUrlList] = React.useState<string[]>([]);
  const [loader, setLoader] = React.useState<boolean>(true);
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user) : null;
    setUser(user);
    setToken(token?.token);
  }, []);

  const getData = async () => {
    setLoader(true);
    if (token) {
      const response = await fetch(
        `https://short-me.onrender.com/api/all-url`,
        {
          method: "POST",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      setLoader(false);
      if (data.urls) {
        const revList = data.urls.reverse();
        setUrlList(revList);
      }
    } else {
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
  };

  useEffect(() => {
    getData();
  }, [user, isCreated]);

  const handleCopy = (id: string) => {
    const url = urlList.find((url) => (url as { _id?: string })._id === id) as {
      _id?: string;
      shortUrl?: string;
    };

    if (url && url.shortUrl) {
      navigator.clipboard
        .writeText(`https://short-me.onrender.com/${url.shortUrl}`)
        .then(() => {
          toast.success("URL copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying URL to clipboard: ", error);
        });
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const user = localStorage.getItem("user");
      const { _id: userId, token: userToken } = user
        ? JSON.parse(user)
        : { _id: "", token: "" };

      const requestBody: RequestBody = {
        _id: userId,
      };

      const response = await fetch(`https://short-me.onrender.com/api/${id}`, {
        method: "DELETE",
        headers: {
          authorization: userToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        toast.success("URL deleted successfully");
        getData();
      } else if (responseData.status === 400 || responseData.status === 403) {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function formatTimeAgo(timestamp: string): string {
    const currentDate: Date = new Date();
    const previousDate: Date = new Date(timestamp);

    const timeDifference: number =
      currentDate.getTime() - previousDate.getTime();
    const secondsDifference: number = Math.floor(timeDifference / 1000);
    const minutesDifference: number = Math.floor(secondsDifference / 60);
    const hoursDifference: number = Math.floor(minutesDifference / 60);
    const daysDifference: number = Math.floor(hoursDifference / 24);

    if (daysDifference > 0) {
      return daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
    } else if (hoursDifference > 0) {
      return hoursDifference === 1 ? "1 hr ago" : `${hoursDifference} hr ago`;
    } else if (minutesDifference > 0) {
      return minutesDifference === 1
        ? "1 min ago"
        : `${minutesDifference} min ago`;
    } else {
      return "just now";
    }
  }

  const expiryChecker = (url: string) => {
    const expiryDate =
      (url as { expirationDate?: string })?.expirationDate ?? null;
    const currentDate = new Date();
    const validatedDate = expiryDate
      ? new Date(expiryDate) < currentDate
        ? " expired"
        : null
      : null;
    return validatedDate;
  };

  const router = useRouter();
  const handleInfo = (url: string) => {
    const id: string = (url as { _id?: string })?._id || "";

    router.push(`/dashboard/details?id=${id}`);
  };

  return (
    <div className="py-5" style={{ minHeight: "calc(100vh - 112px)" }}>
      <div
        style={{ maxWidth: "700px" }}
        className="container mx-auto flex min-h-60  flex-col justify-center items-center"
      >
        <h1 className="text-center text-4xl font-bold text-orange-500">
          Shorten your <span className="text-blue-500">looooong</span> URLs like
          never before!
        </h1>
        <p className="mt-4 text-center text-gray-400">
          Copy your long boring url. Paste it below. Then 💥 You got it, right?
        </p>

        <InputComp />
      </div>
      <div className="container mt-20 mx-auto">
        <div className="flex flex-col items-center mb-5">
          {loader && <Loader />}
          {urlList.length === 0 && !loader ? <p>No URL found</p> : null}
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {urlList?.map((url, index) => (
            <Card
              key={index}
              className="w-full relative"
              style={{ maxWidth: "300px", transition: "all 0.3s ease" }}
            >
              <IoIosInformationCircleOutline
                onClick={() => handleInfo(url as string)}
                className="absolute top-2 right-2 size-5"
              />
              <CardHeader>
                <Link
                  target="_blank"
                  className="text-wrap"
                  href={(url as { originalUrl?: string })?.originalUrl || ""}
                >
                  {(url as { originalUrl?: string })?.originalUrl?.substring(
                    0,
                    25
                  )}
                  ...
                </Link>
              </CardHeader>
              <CardContent>
                <Link
                  target="_blank"
                  href={`https://short-me.onrender.com/${
                    (url as { shortUrl?: string })?.shortUrl || ""
                  }`}
                  className="flex items-center text-blue-300"
                  style={{ fontSize: "12px" }}
                >
                  {`https://short-me.onrender.com/${(
                    url as { shortUrl?: string }
                  )?.shortUrl?.substring(0, 28)}`}

                  <FaExternalLinkAlt
                    className="text-orange-500 ms-2"
                    style={{ fontSize: "14px" }}
                  />
                </Link>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center">
                  <BsEye className="text-orange-100 opacity-65" />
                  <span
                    className="opacity-65 ms-2 italic"
                    style={{ fontSize: "14px" }}
                  >
                    {(url as { totalVisit?: number }).totalVisit || 0}
                  </span>
                </div>
                <div className="flex">
                  <span className="opacity-10 mx-1">|</span>
                  <div className="mx-2 flex items-center">
                    <span className="opacity-65" style={{ fontSize: "14px" }}>
                      {formatTimeAgo(
                        (url as { createdAt?: string }).createdAt || ""
                      )}
                    </span>
                    <span
                      style={{ fontSize: "10px" }}
                      className="text-red-400 font-normal "
                    >
                      {expiryChecker(url) !== null ? (
                        <span className="bg-red-500 text-white rounded-sm px-1 ms-1">
                          Expired
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <span className="opacity-10 mx-1">|</span>
                </div>
                <div className="flex">
                  <IoIosCopy
                    onClick={() =>
                      handleCopy((url as { _id?: string })?._id || "")
                    }
                    className="text-lg text-blue-400 cursor-pointer"
                  />
                  <RiDeleteBin6Fill
                    onClick={() =>
                      handleDelete((url as { _id?: string })?._id || "")
                    }
                    className="text-lg text-red-400 cursor-pointer ms-3"
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
