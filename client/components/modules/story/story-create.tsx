"use client";

import React, { useState } from "react";
import StoryBackgroundPicker from "./story-background-picker";

export default function StoryEditor() {
  const [backgroundId, setBackgroundId] = useState("sunset");

  return (
    <div className="space-y-4">
      <StoryBackgroundPicker
        selected={backgroundId}
        onChange={setBackgroundId}
      />

      <p className="text-sm">Selected background: {backgroundId}</p>
    </div>
  );
}
