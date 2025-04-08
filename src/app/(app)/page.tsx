"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { messages } from "@/constants";
import AutoPlay from "embla-carousel-autoplay";
import { Mail } from "lucide-react";
const page = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 bg-gray-800 text-white py-12 ">
      <section className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous conversation
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore Mystery Message - where your identity remains a secret.
        </p>
      </section>
      <Carousel
        plugins={[AutoPlay({ delay: 2000 })]}
        className="w-full max-w-lg md:max-w-xl"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className="p-4">
              <Card>
                <CardHeader className="font-bold title-fit">
                  {message.title}
                </CardHeader>

                <CardContent className="text-base">
                  <Mail className="flex-shrink-0" />

                  <p className="mt-2">{message.content}</p>
                  <p className="text-sm text-gray-600">{message.received}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </main>
  );
};

export default page;
