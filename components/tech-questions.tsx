"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questions } from "@/data/tech-questions";

// Add these type definitions at the top of the file, after the imports
type Stage = "early" | "mid" | "late";

export default function TechQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stage, setStage] = useState<Stage>("early");
  const [showTopics, setShowTopics] = useState(false); // Add this state

  // Add this handler function for topic selection
  const handleTopicSelect = (index: number) => {
    setCurrentQuestion(index);
  };

  // Add this handler function
  const handleStageChange = (value: string) => {
    setStage(value as Stage);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentQuestion((prev) =>
      prev < questions.length - 1 ? prev + 1 : prev,
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 space-y-4">
      {/* Topics Section */}
      <div className="w-full max-w-4xl">
        <Button
          onClick={() => setShowTopics(!showTopics)}
          className="w-full bg-gray-700 hover:bg-gray-600 mb-2 flex items-center justify-between"
        >
          <span>Navegue pelas perguntas ou escolha uma</span>
          {showTopics ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>

        {showTopics && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="grid gap-2 md:grid-cols-2">
              {questions.map((q, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "secondary"}
                  className={`text-left h-auto py-2 px-3 whitespace-normal ${
                    currentQuestion === index
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  onClick={() => {
                    handleTopicSelect(index);
                    setShowTopics(false);
                  }}
                >
                  <span className="text-sm line-clamp-2">
                    {index + 1}. {q.question}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Questionnaire Section */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-400">
            Tech Stack Questionnaire
          </h2>
          <Select value={stage} onValueChange={handleStageChange}>
            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="early">Early Stage</SelectItem>
              <SelectItem value="mid">Mid Stage</SelectItem>
              <SelectItem value="late">Late Stage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {questions[currentQuestion].question}
          </h3>
          <p className="text-gray-400 text-sm">
            {questions[currentQuestion].objective}
          </p>
          <div className="space-y-3">
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Flag className="text-green-400" />
                <span className="font-medium">Green Flag</span>
              </div>
              <p className="mt-2">
                {questions[currentQuestion].responses[stage].green}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Flag className="text-yellow-400" />
                <span className="font-medium">Yellow Flag</span>
              </div>
              <p className="mt-2">
                {questions[currentQuestion].responses[stage].yellow}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Flag className="text-red-400" />
                <span className="font-medium">Red Flag</span>
              </div>
              <p className="mt-2">
                {questions[currentQuestion].responses[stage].red}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
            className="bg-green-600 hover:bg-green-500"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="text-center text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}
