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
  "/1.png", // J'adore Dior
  "/2.png", // Chanel No. 5
  "/3.png", // Miss Dior
  "/4.png", // YSL Libre
  "/5.png", // Lancôme La vie est belle
  "/6.png", // Jean Paul Gaultier Le Male
  "/7.png", // Gentleman Givenchy
  "/8.png", // Bleu de Chanel
  "/9.png", // 1 Million Paco Rabanne
  "/10.png", // Invictus Rabanne
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

// Bonus items array
const bonusItems: PriceItem[] = [
  {
    id: 1,
    text: "3 Premium Perfumes (50ml each)",
    originalValue: "$149.99",
    currentValue: "FREE",
    emoji: "🎁",
  },
  {
    id: 2,
    text: "temu box",
    originalValue: "$89.99",
    currentValue: "FREE",
    emoji: "🏀",
  },
  {
    id: 3,
    text: "Express Shipping",
    originalValue: "$19.99",
    currentValue: "FREE",
    emoji: "🚚",
  },
  {
    id: 4,
    text: "Satisfaction Guarantee",
    originalValue: "$29.99",
    currentValue: "FREE",
    emoji: "✅",
  },
]

// Carousel Component
const PerfumeCarousel = () => {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        const newPosition = prev - 0.5 // Reduzido de 1 para 0.5 para velocidade mais lenta
        const resetPoint = -(200 + 12) * perfumeImages.length // width + margin
        return newPosition <= resetPoint ? 0 : newPosition
      })
    }

    const animationFrame = setInterval(animate, 16) // Aumentado de 12 para 16ms (~60fps)
    return () => clearInterval(animationFrame)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-gray-100 py-8 mb-6">
      <div className="relative">
        <div
          className="flex transition-none"
          style={{
            transform: `translateX(${position}px)`,
            width: `${(200 + 12) * perfumeImages.length * 3}px`, // Triplicado para movimento mais suave
          }}
        >
          {/* Primeira sequência de imagens */}
          {perfumeImages.map((src, index) => (
            <div key={`first-${index}`} className="flex-shrink-0 mr-3">
              <div className="w-[200px] h-[200px] md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={perfumeNames[index]}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
          {/* Segunda sequência para loop infinito */}
          {perfumeImages.map((src, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 mr-3">
              <div className="w-[200px] h-[200px] md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${perfumeNames[index]} duplicate`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
          {/* Terceira sequência para movimento ainda mais suave */}
          {perfumeImages.map((src, index) => (
            <div key={`third-${index}`} className="flex-shrink-0 mr-3">
              <div className="w-[200px] h-[200px] md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${perfumeNames[index]} triple`}
                  width={200}
                  height={200}
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
            src="box_temu.png"
            alt="temu box"
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

      {/* Perfume Carousel - aparece instantaneamente */}
      <div className="border-t-2 border-blue-200 pt-6">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">perfumes that are still in stock:</h3>
        <PerfumeCarousel />
      </div>

      {/* Bonus items section - aparece com delay */}
      {showBonusItems && (
        <div className="pt-6">
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
                        src="box_temu.png"
                        alt="box_temu"
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
                  <span className="font-bold text-green-600 text-lg ml-2"><br></br>{item.currentValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
