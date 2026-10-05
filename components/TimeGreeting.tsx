"use client";

import { useEffect, useState } from "react";

type GreetingStyle = "male" | "female" | "neutral";

const greetings = {
  morning: {
    male: [
      "Hey champ, good morning!",
      "Good morning, champ. Let's make today count.",
      "Morning, legend. Let's get things moving.",
      "Good morning, boss. Time to make some progress.",
    ],

    female: [
      "Hey sunshine, good morning!",
      "Good morning, sunshine. Let's make today count.",
      "Morning, superstar. Let's get things moving.",
      "Good morning, queen. Time to make some progress.",
    ],

    neutral: [
      "Hey there, good morning!",
      "Good morning! Let's make today count.",
      "Morning! Let's get things moving.",
      "Good morning! Time to make some progress.",
    ],
  },

  afternoon: {
    male: [
      "Hey champ, keep the momentum going.",
      "Good afternoon, legend. Keep pushing forward.",
      "Hey boss, let's get a few more things done.",
      "Good afternoon, champ. You're making progress.",
    ],

    female: [
      "Hey sunshine, keep the momentum going.",
      "Good afternoon, superstar. Keep pushing forward.",
      "Hey queen, let's get a few more things done.",
      "Good afternoon, sunshine. You're making progress.",
    ],

    neutral: [
      "Hey there, keep the momentum going.",
      "Good afternoon! Keep pushing forward.",
      "Let's get a few more things done.",
      "Good afternoon! You're making progress.",
    ],
  },

  evening: {
    male: [
      "Hey champ, let's finish the day strong.",
      "Good evening, legend. One more step forward.",
      "Hey boss, let's end the day on a win.",
      "Good evening, champ. Keep building.",
    ],

    female: [
      "Hey sunshine, let's finish the day strong.",
      "Good evening, superstar. One more step forward.",
      "Hey queen, let's end the day on a win.",
      "Good evening, sunshine. Keep building.",
    ],

    neutral: [
      "Hey there, let's finish the day strong.",
      "Good evening! One more step forward.",
      "Let's end the day on a win.",
      "Good evening! Keep building.",
    ],
  },

  night: {
    male: [
      "Hey champ, you've done enough for today.",
      "Good night, legend. Recharge and come back stronger.",
      "Rest well, boss. Tomorrow is another opportunity.",
      "Good night, champ. Keep moving forward.",
    ],

    female: [
      "Hey sunshine, you've done enough for today.",
      "Good night, superstar. Recharge and come back stronger.",
      "Rest well, queen. Tomorrow is another opportunity.",
      "Good night, sunshine. Keep moving forward.",
    ],

    neutral: [
      "Hey there, you've done enough for today.",
      "Good night. Recharge and come back stronger.",
      "Rest well. Tomorrow is another opportunity.",
      "Good night. Keep moving forward.",
    ],
  },
};

function getTimePeriod(hour: number) {
  if (hour >= 5 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 21) {
    return "evening";
  }

  return "night";
}

function getRandomGreeting(
  period: keyof typeof greetings,
  style: GreetingStyle
) {
  const messages = greetings[period][style];

  return messages[
    Math.floor(Math.random() * messages.length)
  ];
}

export default function TimeGreeting({
  style = "neutral",
}: {
  style?: GreetingStyle;
}) {
  const [greeting, setGreeting] = useState(
    "Hey there, welcome back!"
  );

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      const period = getTimePeriod(hour);

      setGreeting(
        getRandomGreeting(period, style)
      );
    };

    updateGreeting();

    return () => {};
  }, [style]);

  return <>{greeting}</>;
}