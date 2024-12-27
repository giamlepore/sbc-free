import { useState } from "react";
import { ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  basicQuestions,
  intermediateQuestions,
  advancedQuestions,
  feedbackDatabase,
} from "@/data/api-test";

type APITestProps = {
  level: "basic" | "intermediate" | "advanced";
};

export function APITest({ level }: APITestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const questions =
    level === "basic"
      ? basicQuestions
      : level === "intermediate"
        ? intermediateQuestions
        : level === "advanced"
          ? advancedQuestions
          : [];

  const handleAnswer = (value: string) => {
    setSelectedValue(value);
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = parseInt(value);
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedValue("");
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    const wrongAnswers = answers
      .map((answer, index) => ({
        questionIndex: index,
        isWrong: answer !== questions[index].correctAnswer,
      }))
      .filter((item) => item.isWrong);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-1 h-[600px]"
      >
        <Card className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700 h-full overflow-y-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-l font-bold mb-4 text-indigo-400">
                Resultado do Teste de APIs - {level}
              </h2>
              <p className="text-xl font-bold text-gray-200 mb-6">
                Você acertou {score} de {questions.length} questões!
              </p>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-l font-semibold text-gray-200 border-b border-gray-700 pb-2">
                  Sugestões de como você pode melhorar:
                </h3>

                {wrongAnswers.map(({ questionIndex }) => {
                  const question = questions[questionIndex];
                  const feedback = feedbackDatabase[level][questionIndex + 1];

                  return (
                    <div
                      key={questionIndex}
                      className="bg-gray-700/50 p-6 rounded-lg space-y-4"
                    >
                      <div className="space-y-2">
                        <h4 className="text-lg font-medium text-white">
                          {question.question}
                        </h4>
                        <div className="flex gap-2 text-sm">
                          <span className="text-red-400">Sua resposta:</span>
                          <span className="text-gray-300">
                            {question.options[answers[questionIndex]]}
                          </span>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="text-green-400">
                            Resposta correta:
                          </span>
                          <span className="text-gray-300">
                            {question.options[question.correctAnswer]}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        <div>
                          <h5 className="text-indigo-400 font-medium mb-2">
                            Por que é importante saber?
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.whyImportant.map((item, i) => (
                              <li key={i} className="text-gray-300 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-indigo-400 font-medium mb-2">
                            O que estudar para melhorar?
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.studyRecommendation.map((item, i) => (
                              <li key={i} className="text-gray-300 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers([]);
                setShowResults(false);
                setSelectedValue("");
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 
                       py-6 text-lg font-medium shadow-lg hover:shadow-indigo-500/20"
            >
              Fazer o teste novamente
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-1"
    >
      <Card className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="bg-green-500/50 h-2 rounded-full"
          />
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-indigo-400 mb-3">
            <span className="text-sm font-medium bg-indigo-400/10 px-2 py-1 rounded-md">
              {currentQuestion + 1}/{questions.length}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/50" />
            <span className="text-sm font-medium text-indigo-400/50">
              Questão
            </span>
          </div>
          <p className="text-gray-200 text-base leading-relaxed">
            {questions[currentQuestion].question}
          </p>
        </motion.div>

        <RadioGroup
          value={selectedValue}
          onValueChange={handleAnswer}
          className="space-y-1 mb-4"
        >
          {questions[currentQuestion].options.map((option, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={index}
              className="relative"
            >
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 border ${
                  selectedValue === index.toString()
                    ? "bg-green-700/20 border-green-500/50"
                    : "hover:bg-gray-700/50 border-gray-700/50 hover:border-indigo-500/50"
                }`}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`text-gray-200 cursor-pointer flex-1 text-sm leading-relaxed ${
                    selectedValue === index.toString() ? "text-green-100" : ""
                  }`}
                >
                  {option}
                </Label>
              </div>
            </motion.div>
          ))}
        </RadioGroup>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleNext}
            disabled={!selectedValue}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed py-6 text-lg font-medium
                     shadow-lg hover:shadow-indigo-500/20"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Próxima pergunta
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Ver resultado
                <Flag className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
