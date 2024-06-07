import * as React from "react"
import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { WelcomeNewbies } from "@/components/WelcomeNewbies"
import { CryptoPriceTable } from "@/components/CryptoPriceTable"

export const BulletinBoard = () => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    return (
        <Carousel
        opts={{
            align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
        >
        <CarouselContent className="h-[360px]">
            <CarouselItem>
                <WelcomeNewbies/>
            </CarouselItem>
            <CarouselItem>
                <CryptoPriceTable/>
            </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        </Carousel>
    )
}


