"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useMyContext } from "../../context/MyContext";
import Loader from "@/components/ui/loader";


// Sign In logic
const SignIn: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("test@test.com");
  const [password, setPassword] = React.useState<string>("123456");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const { localValueSetter } = useMyContext();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://short-me.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Access the response body
      const responseData = await response.json();

      if (responseData.status === 401) {
        setError(responseData.message);
        setLoading(false);
      } else if (responseData.status === 200) {
        localValueSetter({ token: responseData.token });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div
      className="container mx-auto py-5 max-w-lg"
      style={{ minHeight: "calc(100vh - 112px)" }}
    >
      <h1 className="text-center text-4xl font-bold text-orange-500">
        Get <span className="text-blue-500">Started</span> Today
      </h1>
      <p className="text-center mt-2">
        Hey 👋 buddy! Listen, login to your accound now so that you can manage
        all your shorten links more securly!
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-10  rounded-sm bg-gray-500 bg-opacity-30 shadow-sm p-5"
      >
        <div>
          <span className="text-sm">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full bg-gray-300 bg-opacity-30 border rounded-sm px-3 border-gray-500  text-white text-opacity-100 py-2 focus:outline-none"
            type="email"
            placeholder="Enter email"
          />
        </div>
        <div className="my-3">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full bg-gray-300 bg-opacity-30 border rounded-sm px-3 border-gray-500  text-white text-opacity-100 py-2 focus:outline-none"
            placeholder="Enter password"
          />
        </div>
        <span className="text-sm font-semibold text-blue-500 text-right block">
          Forgot password?
        </span>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={!email || !password}
          className=" w-full my-5 rounded-sm text-white bg-blue-500 hover:bg-blue-600 flex justify-center"
        >
          {loading ? <Loader /> : "Login"}
        </Button>

        <p className="text-sm text-center">
          <span className="op"> No account? </span>
          <Link href="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
