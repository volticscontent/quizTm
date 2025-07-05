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
import PixelManager from "@/components/pixel-manager"

// SVG Icons for audio control
const VolumeOffIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
    />
  </svg>
)

const VolumeOnIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
    />
  </svg>
)

declare global {
  interface Window {
    fbq: any
  }
}

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
  const [isProcessing, setIsProcessing] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)
  const [showAudioButton, setShowAudioButton] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Debug log
  console.log("PSGQuiz render - gameStarted:", gameStarted, "quizCompleted:", quizCompleted)

  // Reset processing state when question changes
  useEffect(() => {
    setIsProcessing(false)
  }, [currentQuestion])

  // Hide audio button after 5 seconds, show again on video interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAudioButton(false)
    }, 5000) // Hide after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  // Show audio button when user hovers over video area
  const handleVideoAreaInteraction = () => {
    setShowAudioButton(true)
    // Hide again after 3 seconds of showing
    setTimeout(() => {
      setShowAudioButton(false)
    }, 3000)
  }

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
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
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

  // Function to toggle video audio
  const toggleVideoAudio = () => {
    if (videoRef.current) {
      const newMutedState = !videoMuted
      setVideoMuted(newMutedState)
      videoRef.current.muted = newMutedState
      console.log("Video audio:", newMutedState ? "muted" : "unmuted")
    }
  }

  // Meta Pixel tracking functions
  const trackEvent = (eventName: string, parameters?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters)
      console.log(`Meta Pixel: ${eventName}`, parameters)
    }
  }

  const trackCustomEvent = (eventName: string, parameters?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, parameters)
      console.log(`Meta Pixel Custom: ${eventName}`, parameters)
    }
  }

  const trackQuizStart = () => {
    trackEvent('Lead', { content_name: 'Quiz Started' })
  }

  const trackQuestion = (questionNumber: number) => {
    trackCustomEvent(`Question${questionNumber}`, {
      content_name: `Question ${questionNumber} Answered`,
      question_id: questionNumber,
      total_questions: questions.length
    })
  }

  const trackQuizComplete = () => {
    trackEvent('CompleteRegistration', { 
      content_name: 'Quiz Completed',
      value: correctAnswers * 25,
      currency: 'USD'
    })
    trackCustomEvent('FinalPage', {
      content_name: 'Final Page Reached',
      total_discount: correctAnswers * 25,
      final_price: 49.99
    })
  }

  const trackPurchaseIntent = () => {
    trackEvent('InitiateCheckout', {
      content_name: 'Buy Now Clicked',
      value: 49.99,
      currency: 'USD'
    })
    trackCustomEvent('GoToStore', {
      content_name: 'Redirecting to Store',
      final_discount: correctAnswers * 25,
      conversion_step: 'purchase_intent'
    })
  }

  const handleAnswer = () => {
    // Prevenir múltiplos cliques
    if (isProcessing) return
    
    setIsProcessing(true)
    
    // Track the specific question being answered
    trackQuestion(currentQuestion + 1)
    
    // Sempre adicionar desconto independente da resposta
    setCorrectAnswers((prev) => prev + 1)
    setShowNotification(true)
    
    // Tocar som de sucesso
    playNotificationSound()

    // Auto proceed to next question after a brief delay
    setTimeout(() => {
      nextQuestion()
      setIsProcessing(false)
    }, 1500)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer("")
    } else {
      setQuizCompleted(true)
      setIsProcessing(false)
      // Track quiz completion
      trackQuizComplete()
    }
  }

  const discount = correctAnswers * 25
  const originalPrice = 150.0
  const finalPrice = Math.max(originalPrice - discount, 49.99)

  // Initial screen with Temu leaving US image
  if (!gameStarted) {
    return (
      <>
        <PixelManager />
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-600 flex items-center justify-center">
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
              {/* Temu leaving US VSL */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-full max-w-md md:max-w-lg rounded-lg overflow-hidden border-4 border-orange-300 bg-white relative"
                  onMouseEnter={handleVideoAreaInteraction}
                  onTouchStart={handleVideoAreaInteraction}
                >
                  {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded z-10">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">Carregando vídeo...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Audio Control Button - Centralizado sobre o vídeo com animação */}
                  <div className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all duration-500 ${
                    showAudioButton ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}>
                    <Button
                      onClick={toggleVideoAudio}
                      className={`w-16 h-16 rounded-full ${
                        videoMuted 
                          ? "bg-gray-500 hover:bg-gray-600" 
                          : "bg-green-500 hover:bg-green-600"
                      } text-white shadow-2xl border-4 border-white pointer-events-auto transform transition-all duration-300 hover:scale-110`}
                      size="lg"
                    >
                      {videoMuted ? (
                        <VolumeOffIcon className="w-6 h-6" />
                      ) : (
                        <VolumeOnIcon className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                  
                  <video
                    ref={videoRef}
                    src="https://pub-715e1058d62e45dca1d7229ecb1e7480.r2.dev/TEMU%20VSL%2001.mp4"
                    className="w-full h-auto aspect-video object-cover rounded"
                    controls={false}
                    autoPlay
                    muted={videoMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedData={() => {
                      setVideoLoaded(true)
                      console.log("Vídeo carregado com sucesso")
                    }}
                    onError={(e) => {
                      console.error("Erro ao carregar o vídeo:", e)
                      setVideoLoaded(true)
                    }}
                    style={{ minHeight: '200px' }}
                  >
                    <source src="https://pub-715e1058d62e45dca1d7229ecb1e7480.r2.dev/TEMU%20VSL%2001.mp4" type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                <blockquote className="text-sm md:text-lg text-gray-800 italic text-center leading-relaxed">
                  "💣 Temu is leaving the USA.
                  <br />
                  <br />
                  The Chinese giant is going bankrupt on American soil - their pricing model was never sustainable.
                  <br />
                  <br />
                  We're liquidating a box of 3 premium perfumes inspired by luxury brands.
                  <br />
                  <br />💸 <strong>Complete the quiz for up to $100 OFF - Final price: $49.99</strong>
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
                onClick={() => {
                  console.log("Start Quiz clicked!")
                  console.log("Current gameStarted state:", gameStarted)
                  
                  // Pausar o vídeo quando o quiz começar
                  if (videoRef.current) {
                    videoRef.current.pause()
                    console.log("Video paused")
                  }
                  
                  // Track quiz start
                  trackQuizStart()
                  
                  setGameStarted(true)
                  console.log("setGameStarted(true) called")
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-6"
                size="lg"
              >
                <Trophy className="mr-2 h-6 w-6" />
                Start the Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (quizCompleted) {
    return (
      <>
        <PixelManager />
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
                  onClick={() => {
                    trackPurchaseIntent()
                    window.open("https://www.temusales.shop/", "_blank")
                  }}
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
      </>
    )
  }

  return (
    <>
      <PixelManager />
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-600 flex items-center justify-center p-4">
        <SuccessNotification show={showNotification} onClose={() => setShowNotification(false)} />

        <Card className="w-full max-w-2xl mx-2">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded overflow-hidden">
                  <Image
                    src="box_temu.png"
                    alt="box_temu"
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
              disabled={!selectedAnswer || isProcessing}
              className={`w-full text-white ${
                isProcessing 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
              size="lg"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                "Confirm Answer"
              )}
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
    </>
  )
}
