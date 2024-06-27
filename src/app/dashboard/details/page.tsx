"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface UserAgent {
  browser: {
    name: string;
    version: string;
  };
  engine: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: {
    vendor: string;
    model: string;
    deviceType: string;
  };
  cpu: {
    architecture: string;
  };
  us: string;
}

interface Analytics {
  userAgent: UserAgent;
  timestamp: string;
  ipAddress: string;
  country: string;
  city: string;
  _id: string;
}

interface UrlData {
  url: {
    _id: string;
    user: string;
    originalUrl: string;
    createdAt: string;
    shortUrl: string;
    customKeyword: string;
    totalVisit: number;
    analytics: Analytics[];
    __v: number;
    lastVisit: string;
  };
}

const Details: React.FC = () => {
  const [loader, setLoader] = React.useState<boolean>(true);
  const [data, setData] = React.useState<UrlData | null>(null); // Use the interface here
  const [error, setError] = React.useState<string>("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const getData = async () => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user) : null;

    setLoader(true);
    if (token) {
      const response = await fetch(`https://short-me.onrender.com/api/${id}`, {
        method: "GET",
        headers: {
          authorization: token.token,
          "Content-Type": "application/json",
        },
      });

      const responseData = (await response.json()) as UrlData;
      if (responseData) {
        setLoader(false);
        setData(responseData);
      } else {
        setLoader(false);
        setError("No data found 🤷");
        console.log("No data found");
      }
    } else {
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  if (data) {
    console.log(data.url.analytics);
  }

  if (loader) {
    return <div style={{ minHeight: "calc(100vh - 112px)" }}>Loading...</div>;
  }
  return (
    <div style={{ minHeight: "calc(100vh - 112px)" }}>
      <div className="container mx-auto flex min-h-60  flex-col justify-center items-center">
        <div className="bg-slate-600  w-full">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>IP Addresss</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>CUP</TableHead>
                <TableHead>Engine</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.url.analytics.map((url, index) => (
                <TableRow key={index}>
                  <TableCell>{url.ipAddress}</TableCell>
                  <TableCell>{url.timestamp}</TableCell>
                  <TableCell>{url.country}</TableCell>
                  <TableCell>{url.city}</TableCell>
                  <TableCell>
                    {url.userAgent.browser.name} {url.userAgent.browser.version}
                  </TableCell>
                  <TableCell>
                    {url.userAgent.device.vendor} {url.userAgent.device.model}
                  </TableCell>
                  <TableCell>
                    {url.userAgent.os.name} {url.userAgent.os.version}
                  </TableCell>
                  <TableCell>{url.userAgent.cpu.architecture}</TableCell>
                  <TableCell>
                    {url.userAgent.engine.name} {url.userAgent.engine.version}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Details;
