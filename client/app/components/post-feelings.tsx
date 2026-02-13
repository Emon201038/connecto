"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ArrowLeft, ChevronRight, Search, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

const feelings = [
  { emoji: "😊", text: "happy" },
  { emoji: "😇", text: "blessed" },
  { emoji: "🥰", text: "loved" },
  { emoji: "😢", text: "sad" },
  { emoji: "😍", text: "lovely" },
  { emoji: "🙏", text: "thankful" },
  { emoji: "😆", text: "excited" },
  { emoji: "😘", text: "in love" },
  { emoji: "🤪", text: "crazy" },
  { emoji: "😊", text: "grateful" },
  { emoji: "😌", text: "blissful" },
  { emoji: "🤩", text: "fantastic" },
];

const activitiesData = {
  celebrating: {
    emoji: "🎉",
    text: "Celebrating",
    options: [
      "a birthday",
      "an anniversary",
      "a new job",
      "graduation",
      "friendship",
      "life",
      "love",
      "a special day",
      "success",
      "a milestone",
      "the weekend",
      "a holiday",
    ],
  },
  watching: {
    emoji: "📺",
    text: "Watching",
    options: [
      "a movie",
      "TV",
      "Netflix",
      "YouTube",
      "a documentary",
      "the news",
      "sports",
      "a series",
      "anime",
      "a live stream",
    ],
  },
  eating: {
    emoji: "🍽️",
    text: "Eating",
    options: [
      "breakfast",
      "lunch",
      "dinner",
      "a snack",
      "pizza",
      "ice cream",
      "chocolate",
      "healthy food",
      "fast food",
      "homemade food",
      "dessert",
      "fruit",
    ],
  },
  drinking: {
    emoji: "☕",
    text: "Drinking",
    options: [
      "coffee",
      "tea",
      "water",
      "juice",
      "smoothie",
      "wine",
      "beer",
      "cocktail",
      "soda",
      "energy drink",
    ],
  },
  attending: {
    emoji: "📅",
    text: "Attending",
    options: [
      "a meeting",
      "a conference",
      "a wedding",
      "a party",
      "a concert",
      "a class",
      "an event",
      "a workshop",
      "a seminar",
      "a festival",
    ],
  },
  traveling: {
    emoji: "✈️",
    text: "Traveling",
    options: [
      "to work",
      "home",
      "on vacation",
      "abroad",
      "by car",
      "by plane",
      "by train",
      "to the beach",
      "to the mountains",
      "to a new city",
    ],
  },
  playing: {
    emoji: "🎮",
    text: "Playing",
    options: [
      "video games",
      "sports",
      "music",
      "with friends",
      "guitar",
      "piano",
      "football",
      "basketball",
      "tennis",
      "board games",
    ],
  },
  reading: {
    emoji: "📚",
    text: "Reading",
    options: [
      "a book",
      "the news",
      "a magazine",
      "comics",
      "a novel",
      "poetry",
      "articles",
      "research",
      "blogs",
      "reviews",
    ],
  },
  working: {
    emoji: "💼",
    text: "Working",
    options: [
      "from home",
      "at the office",
      "on a project",
      "late",
      "hard",
      "remotely",
      "overtime",
      "on weekends",
      "with the team",
      "on something new",
    ],
  },
  exercising: {
    emoji: "💪",
    text: "Exercising",
    options: [
      "at the gym",
      "at home",
      "running",
      "cycling",
      "swimming",
      "yoga",
      "weightlifting",
      "cardio",
      "stretching",
      "dancing",
    ],
  },
};

interface IProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  selectedFeeling: {
    type: string;
    emoji: string;
    text: string;
  } | null;
  setSelectedFeeling: Dispatch<
    SetStateAction<{
      type: string;
      emoji: string;
      text: string;
    } | null>
  >;
}

const PostFeelings = ({
  selectedFeeling,
  setSelectedFeeling,
  showModal,
  setShowModal,
}: IProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeelingIndex, setSelectedFeelingIndex] = useState<
    number | null
  >(null);
  const [currentActivityView, setCurrentActivityView] = useState<
    "main" | string
  >("main");
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<
    string | null
  >(null);

  const filteredFeelings = feelings.filter((feeling) =>
    feeling.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const filteredActivities = Object.entries(activitiesData).filter(([key, activity]) =>
  //   activity.text.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  const handleFeelingSelect = (
    feeling: { emoji: string; text: string },
    index: number,
    type: string
  ) => {
    setSelectedFeeling({
      type,
      emoji: feeling.emoji,
      text: feeling.text,
    });
    setSelectedFeelingIndex(index);
    setShowModal(false);
    setSearchTerm("");
  };

  return (
    <div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-100 px-2 py-1 md:px-1 rounded-md">
            <div>
              <Smile className="h-6 w-6 text-yellow-500" />
            </div>
            <p>Feelings/Activities</p>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="p-4 pb-0">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
                onClick={() => setShowModal(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-lg font-semibold">
                How are you feeling?
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-4">
            <Tabs defaultValue="feelings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger
                  value="feelings"
                  className="text-blue-600 data-[state=active]:text-blue-600"
                >
                  Feelings
                </TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-muted/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <TabsContent value="feelings" className="mt-0">
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pb-4">
                  {filteredFeelings.map((feeling, index) => (
                    <Button
                      key={`feeling-${index}`}
                      variant="ghost"
                      className={`flex items-center justify-start gap-3 h-12 p-3 rounded-lg ${
                        selectedFeelingIndex === index &&
                        selectedFeeling?.type === "feeling"
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() =>
                        handleFeelingSelect(feeling, index, "feeling")
                      }
                    >
                      <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-lg">
                        {feeling.emoji}
                      </div>
                      <span className="text-sm">{feeling.text}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-0">
                {currentActivityView === "main" ? (
                  <div className="space-y-1 max-h-80 overflow-y-auto pb-4">
                    {Object.entries(activitiesData)
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      .filter(([key, activity]) =>
                        activity.text
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map(([key, activity]) => (
                        <Button
                          key={key}
                          variant="ghost"
                          className="flex items-center justify-between w-full h-12 p-3 rounded-lg hover:bg-muted/50"
                          onClick={() => {
                            setCurrentActivityView(key);
                            setSelectedActivityCategory(key);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-lg">
                              {activity.emoji}
                            </div>
                            <span className="text-sm">{activity.text}...</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-1 max-h-80 overflow-y-auto pb-4">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 mb-2 text-blue-600 hover:text-blue-700"
                      onClick={() => setCurrentActivityView("main")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to activities
                    </Button>
                    {selectedActivityCategory &&
                      activitiesData[
                        selectedActivityCategory as keyof typeof activitiesData
                      ]?.options
                        .filter((option) =>
                          option
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((option, index) => (
                          <Button
                            key={`${selectedActivityCategory}-${index}`}
                            variant="ghost"
                            className="flex items-center justify-start gap-3 w-full h-12 p-3 rounded-lg hover:bg-muted/50"
                            onClick={() =>
                              handleFeelingSelect(
                                {
                                  emoji:
                                    activitiesData[
                                      selectedActivityCategory as keyof typeof activitiesData
                                    ].emoji,
                                  text: option,
                                },
                                index,
                                selectedActivityCategory
                              )
                            }
                          >
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-lg">
                              {
                                activitiesData[
                                  selectedActivityCategory as keyof typeof activitiesData
                                ].emoji
                              }
                            </div>
                            <span className="text-sm">{option}</span>
                          </Button>
                        ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostFeelings;
