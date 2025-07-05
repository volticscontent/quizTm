"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Trophy, DollarSign, Star } from "lucide-react"
import Image from "next/image"
import PriceAnchoring from "@/components/price-anchoring"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "How do you feel about Temu exiting the U.S. market?",
    options: [
      "It was expected — the prices were very aggressive",
      "Surprised — I actually liked shopping there",
      "It doesn't affect me — I rarely use the site",
      "It makes room for better and more reliable brands",
    ],
    correct: 0,
    explanation: "Many analysts predicted this outcome due to unsustainable pricing models.",
  },
  {
    id: 2,
    question: "Have you ever bought anything from Temu?",
    options: ["Yes, many times", "Just once or twice", "I've visited, but never purchased", "No, never tried it"],
    correct: 0,
    explanation: "Many customers had multiple experiences with the platform before its exit.",
  },
  {
    id: 3,
    question: "What do you think happens to high-quality products from undelivered Temu orders?",
    options: [
      "They get destroyed or forgotten",
      "Some are resold at deep discounts",
      "They're stored until reprocessed",
      "I'd buy them if the quality is guaranteed",
    ],
    correct: 0,
    explanation: "Unfortunately, many quality products from failed deliveries often go to waste.",
  },
  {
    id: 4,
    question: "If trusted stock from Temu is being liquidated with up to $100 OFF, would you try it?",
    options: [
      "Yes, that's a smart opportunity",
      "Only if it's sealed and original",
      "Maybe — depends on the fragrances",
      "I'm always open to trying something new",
    ],
    correct: 0,
    explanation: "Smart shoppers recognize genuine liquidation opportunities when they see them.",
  },
]

// Enhanced notification component
const SuccessNotification = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onClose()
        }, 500) // Wait for exit animation
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 border border-green-400">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center animate-pulse">
          <DollarSign className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="font-bold text-lg">Congratulations! 🎉</p>
          <p className="text-sm opacity-90">You earned $25 discount!</p>
        </div>
        <div className="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
      </div>
    </div>
  )
}

export default function PSGQuiz() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio system
  useEffect(() => {
    const initializeAudio = () => {
      try {
        // Create audio element
        const audio = new Audio(
          "https://cdn.shopify.com/s/files/1/0946/2290/8699/files/notifica_o-venda.mp3?v=1749150271",
        )
        audio.preload = "auto"
        audio.volume = 0.8
        audioRef.current = audio

        // Try to initialize audio context for mobile
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (AudioContext) {
          const audioContext = new AudioContext()
          if (audioContext.state === "suspended") {
            audioContext.resume()
          }
        }

        setAudioInitialized(true)
        console.log("Audio system initialized successfully")
      } catch (error) {
        console.log("Error initializing audio:", error)
      }
    }

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initializeAudio()
      document.removeEventListener("touchstart", handleFirstInteraction)
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    document.addEventListener("touchstart", handleFirstInteraction, { passive: true })
    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      document.removeEventListener("touchstart", handleFirstInteraction)
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }
  }, [])

  // Enhanced function to play notification sound
  const playNotificationSound = async () => {
    if (!audioRef.current) {
      console.log("Audio not initialized")
      return
    }

    try {
      // Reset audio to beginning
      audioRef.current.currentTime = 0

      // Multiple attempts for better compatibility
      const playAudio = async () => {
        try {
          await audioRef.current!.play()
          console.log("Notification sound played successfully!")
        } catch (error) {
          console.log("First attempt failed:", error)

          // Second attempt with new audio instance
          setTimeout(async () => {
            try {
              const newAudio = new Audio(
                "https://cdn.shopify.com/s/files/1/0946/2290/8699/files/notifica_o-venda.mp3?v=1749150271",
              )
              newAudio.volume = 0.8
              await newAudio.play()
              console.log("Second attempt successful!")
            } catch (secondError) {
              console.log("Second attempt failed:", secondError)

              // Third attempt with user interaction simulation
              setTimeout(() => {
                try {
                  const thirdAudio = new Audio(
                    "https://cdn.shopify.com/s/files/1/0946/2290/8699/files/notifica_o-venda.mp3?v=1749150271",
                  )
                  thirdAudio.volume = 0.8
                  thirdAudio.play()
                  console.log("Third attempt successful!")
                } catch (thirdError) {
                  console.log("All attempts failed:", thirdError)
                }
              }, 200)
            }
          }, 100)
        }
      }

      await playAudio()
    } catch (error) {
      console.log("General error playing notification sound:", error)
    }
  }

  const handleAnswer = () => {
    // Always count as correct since all correct answers are the first option
    setCorrectAnswers((prev) => prev + 1)
    setShowNotification(true)

    // Play sound immediately when answer is correct
    playNotificationSound()

    // Auto proceed to next question after a brief delay
    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer("")
    } else {
      setQuizCompleted(true)
    }
  }

  const discount = correctAnswers * 25
  const originalPrice = 150.0
  const finalPrice = Math.max(originalPrice - discount, 49.99)

  // Initial screen with Temu leaving US image
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-600 flex items-center justify-center p-4">
        {/* Hidden audio element for preloading */}
        <audio
          id="notification-sound"
          src="https://cdn.shopify.com/s/files/1/0946/2290/8699/files/notifica_o-venda.mp3?v=1749150271"
          preload="auto"
          style={{ display: "none" }}
        />

        <Card className="w-full max-w-3xl mx-2">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-orange-900 mb-6">Special Opportunity Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Temu leaving US image */}
            <div className="flex justify-center mb-6">
              <div className="w-64 h-48 md:w-80 md:h-60 rounded-lg overflow-hidden border-4 border-orange-300 bg-white p-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Jul%203%2C%202025%2C%2005_24_49%20AM-vwy7Fun2VyNjG3BiAUiUrhv4sZICiu.png"
                  alt="Temu is leaving the U.S."
                  width={320}
                  height={240}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
              <blockquote className="text-sm md:text-lg text-gray-800 italic text-center leading-relaxed">
                "💣 Temu is leaving the USA.
                <br />
                <br />
                That's right. The Chinese giant that sold everything for next to nothing is now going bankrupt on
                American soil - and the truth is that their model was never sustainable.
                <br />
                <br />
                The good news?
                <br />
                <br />
                We're selling a box of 3 original perfumes inspired by the world's biggest brands... and to celebrate
                this "end of an era", you'll pay the price of 1 and get 3.
                <br />
                <br />💸 <strong>US$100 discount automatically applied at the end of the quiz.</strong>
                <br />
                <br />
                Because real luxury doesn't have to cost a fortune. It just needs timing. And yours is now."
              </blockquote>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-center space-x-2 text-yellow-800">
                <Star className="h-5 w-5" />
                <span className="font-semibold">Maximum discount: $100 • Final price: $49.99</span>
                <Star className="h-5 w-5" />
              </div>
            </div>

            <Button
              onClick={() => setGameStarted(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-6"
              size="lg"
            >
              <Trophy className="mr-2 h-6 w-6" />
              Start the Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-orange-900">Congratulations! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Thanks for completing the quiz! Your answers have unlocked an exclusive offer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PriceAnchoring correctAnswers={correctAnswers} />

            <div className="flex flex-col gap-4">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                size="lg"
                onClick={() => window.open("https://nbathunderr.shop/", "_blank")}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-transparent border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={() => window.location.reload()}
              >
                Start Over
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>* Limited time liquidation offer</p>
              <p>** Special price: $49.99 (maximum discount applied)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-600 flex items-center justify-center p-4">
      <SuccessNotification show={showNotification} onClose={() => setShowNotification(false)} />

      <Card className="w-full max-w-2xl mx-2">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alexander.jpg-yJWzzHVbBOK22oRDWw59IGExKSePHQ.jpeg"
                  alt="Thunder Jersey"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-xl">Temu Liquidation Survey</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {questions.length}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current discount</p>
              <p className="text-2xl font-bold text-green-600">${correctAnswers * 25}</p>
            </div>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-orange-900">{questions[currentQuestion].question}</h3>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-orange-100 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={handleAnswer}
            disabled={!selectedAnswer}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            Confirm Answer
          </Button>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Discount progress:</span>
              <span className="font-semibold">${correctAnswers * 25} / $100</span>
            </div>
            <Progress value={(correctAnswers / 4) * 100} className="mt-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
