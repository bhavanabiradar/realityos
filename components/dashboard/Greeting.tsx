"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function Greeting() {
  const [userName, setUserName] = useState<string>("there");
  const [greetingText, setGreetingText] = useState<string>("Good day");
  const supabase = createClient();

  useEffect(() => {
    // 1. Calculate real time greeting based on system clock
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreetingText("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreetingText("Good afternoon");
    } else if (hour >= 17 && hour < 22) {
      setGreetingText("Good evening");
    } else {
      setGreetingText("Good night");
    }

    // 2. Fetch logged-in user details
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Extract display name or part before @ in email
        const metadataName = user.user_metadata?.full_name || user.user_metadata?.name;
        if (metadataName) {
          setUserName(metadataName);
        } else if (user.email) {
          const emailPrefix = user.email.split("@")[0];
          // Format capitalized name
          setUserName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
        }
      }
    };

    getUserData();
  }, [supabase]);

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        {greetingText}, <span className="text-cyan-400">{userName}</span>
      </h1>
      <p className="text-xs text-neutral-400">
        Your Reality is in sync. Welcome to your personalized workspace.
      </p>
    </div>
  );
}

export default Greeting;