"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Instant AI Tree Estimate
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Upload photos of your trees and get an instant professional estimate
          powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6">
            <Upload className="mr-2 h-6 w-6" />
            Upload Photos
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            View Demo
          </Button>
        </div>
        <div className="mt-12 text-gray-500 dark:text-gray-400">
          <p>No account needed. Get your estimate in seconds.</p>
        </div>
      </div>
    </div>
  );
}