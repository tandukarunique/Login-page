import React from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-100">
        <div className="container mx-auto px-4 py-12">
          <section className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ShortME
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Your ultimate URL shortening tool.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow-md transition duration-300 ease-in-out">
              Get Started
            </Button>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon="🚀"
                title="Fast and Reliable"
                description="Shorten URLs quickly with high reliability."
              />
              <FeatureCard
                icon="🔒"
                title="Secure"
                description="Keep your URLs secure and private."
              />
              <FeatureCard
                icon="📈"
                title="Analytics"
                description="Track your shortened URLs with detailed analytics."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 text-center">{description}</p>
    </div>
  );
}
