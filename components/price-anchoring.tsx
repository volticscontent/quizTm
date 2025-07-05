"use client"

import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

interface PriceItem {
  id: number
  text: string
  originalValue: string
  currentValue: string
  emoji: string
}


// Real perfume images
const perfumeImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-jxKK2YQECnReLbOx0sufzha02lOJeH.png", // J'adore Dior
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-rvGz5Kl2Ndc0Cc841BUHhW89w3YpIF.png", // Chanel No. 5
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-uPBPXxRA0qJaUlzt6SESND5ynYpxls.png", // Miss Dior
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-ZDzmaNN4HDBnxDvQHXAYPj48FHbm2n.png", // YSL Libre
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-zBoC2xMzLPj3Pf6p7e3VPpmGeNgEqg.png", // Lancôme La vie est belle
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-mvbj8PdaMwQAAUHFYSuH1N22XQCdwv.png", // Jean Paul Gaultier Le Male
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-XiVHgxJyL89tkSDzAD56lvISHBxukm.png", // Gentleman Givenchy
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-br81fJbMGqvE0d8JufAxu1zk6U0CNK.png", // Bleu de Chanel
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-yBeq3F4Ev6dKI0YTftSc0vauqDw2sX.png", // 1 Million Paco Rabanne
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-dOKb1p29LvMHgOjSiACItkrrPblFCY.png", // Invictus Rabanne
]

// Perfume names for alt text
const perfumeNames = [
  "J'adore by Dior",
  "Chanel No. 5",
  "Miss Dior",
  "YSL Libre",
  "Lancôme La vie est belle",
  "Jean Paul Gaultier Le Male",
  "Gentleman Givenchy",
  "Bleu de Chanel",
  "1 Million by Paco Rabanne",
  "Invictus by Rabanne",
]

// Carousel Component
const PerfumeCarousel = () => {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        const newPosition = prev - 0.5
        const resetPoint = -(270 + 12) * perfumeImages.length // width + margin
        return newPosition <= resetPoint ? 0 : newPosition
      })
    }

    const animationFrame = setInterval(animate, 16) // ~60fps
    return () => clearInterval(animationFrame)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-gray-100 py-8 mb-6">
      <div className="relative">
        <div
          className="flex transition-none"
          style={{
            transform: `translateX(${position}px)`,
            width: `${(270 + 12) * perfumeImages.length * 2}px`, // Double for seamless loop
          }}
        >
          {/* First set of images */}
          {perfumeImages.map((src, index) => (
            <div key={`first-${index}`} className="flex-shrink-0 mr-3">
              <div className="w-[1080px] h-[650px] md:w-[1080px] md:h-[650px] sm:w-[36-px] sm:h-[216px]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={perfumeNames[index]}
                  width={360}
                  height={216}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {perfumeImages.map((src, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 mr-3">
              <div className="w-[1080px] h-[650px] md:w-[1080px] md:h-[650px] sm:w-[36-px] sm:h-[216px]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${perfumeNames[index]} duplicate`}
                  width={360}
                  height={216}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface PriceAnchoringProps {
  correctAnswers: number
}

export default function PriceAnchoring({ correctAnswers }: PriceAnchoringProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [showBonusItems, setShowBonusItems] = useState(false)

  useEffect(() => {
    // Show bonus items after a short delay
    const timer = setTimeout(() => {
      setShowBonusItems(true)

      // Then show each item with 1 second delay
      const showItems = async () => {
        for (let i = 0; i < bonusItems.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Changed to 1 second
          setVisibleItems((prev) => [...prev, i])
        }
      }

      showItems()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const discount = correctAnswers * 25
  const finalPrice = 50

  return (
    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
      {/* Original interface section */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frente%20e%20verso-sUTCLMCHhzEVPG9AcAP3dWBtEOD5np.png"
            alt="Thunder Jersey Front and Back"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Original Price</p>
          <p className="text-lg line-through text-gray-500">$149.99</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span>Discount earned:</span>
          <span className="font-bold text-green-600">-$100.00</span>
        </div>
        <div className="flex justify-between text-xl font-bold">
          <span>Your final price:</span>
          <span className="text-blue-600">$49.99</span>
        </div>
      </div>

      {/* Perfumes section - now integrated in the same block */}
      {showBonusItems && (
        <div className="border-t-2 border-blue-200 pt-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">perfumes that are still in stock:</h3>

          {/* Perfume Carousel */}
          <PerfumeCarousel />

          <div className="space-y-4">
            {bonusItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-500 ${
                  visibleItems.includes(index)
                    ? "opacity-100 transform translate-x-0 bg-white border border-blue-200 shadow-sm"
                    : "opacity-0 transform translate-x-4"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {visibleItems.includes(index) && <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />}
                  {item.id === 2 ? (
                    <div className="w-8 h-8 rounded overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alexander.jpg-I0Ev7PVvxp63Ho3GNDl9AlIfSirESs.jpeg"
                        alt="Thunder Jersey"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-lg">{item.emoji}</span>
                  )}
                  <span className="font-medium text-gray-800">{item.text}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-400 line-through text-sm">{item.originalValue}</span>
                  <span className="font-bold text-green-600 text-lg ml-2">{item.currentValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
