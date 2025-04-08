"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const Anonymous = () => {
  const params = useParams<{ username: string }>();
  const { username } = params;
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<string[]>([
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
  ]);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const startStreaming = () => {
    setQuestions([]);
    setLoading(true);
    let buffer = "";

    try {
      const event = new EventSource("/api/suggest-message");
      event.onmessage = (e) => {
        const char: string = e.data;
        buffer += char;
        if (buffer.endsWith("||")) {
          setQuestions((prev) => [...prev, ""]);
        } else {
          setQuestions((prev) => {
            const updated = [...prev];
            if (prev.length === 0) {
              updated.push(char);
            } else if (char !== "|") {
              updated[updated.length - 1] += char;
            }
            return updated;
          });
        }
      };
      event.addEventListener("end", () => {
        event.close();
      });

      event.onerror = () => {
        event.close();
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setError(
        axiosError.response?.data?.message ?? "Failed to suggest messages"
      );
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const content = form.watch("content");
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      toast(response?.data?.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error("Failed to send the message", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  return (
    <div className="container lg:max-w-3xl mx-auto">
      <div className="my-10">
        <h1 className="text-center text-4xl font-bold">Public Profile Link</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Write your anonymous message here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="my-5">
                  {" "}
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="my-5"
                  disabled={isLoading || !content}
                >
                  Send it
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      <div>
        <Button
          className="font-semibold  px-4 py-5"
          disabled={loading}
          onClick={startStreaming}
        >
          Suggest Messages
        </Button>

        <p className="my-5 text-lg">Click on any message below to select it.</p>

        <div className="py-5 flex flex-col gap-5  border border-gray-900 px-10 rounded-lg">
          <h3 className="font-bold text-xl">Messages</h3>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="flex flex-col gap-4">

            {questions.map((message, index) => (
              <li
                className="outline rounded-xl text-center hover:bg-gray-100 hover:cursor-pointer transition-colors duration-150 ease-in"
                key={index}
                onClick={() => handleMessageClick(message)}
              >
                <p className="p-4">{message}</p>
              </li>
            ))}
          </ul>
          )}

        </div>
        <Separator />

        <div className="text-center my-10  gap-5">
          <p>Get Your Message Board</p>
          <Button className="font-semibold my-5  px-4 py-5">
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Anonymous;
