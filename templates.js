/**
 * ShortsBuddy Creator Hub - Niche Templates & Helpers
 * Contains pre-engineered viral hooks, title formulas, hashtag packs, and description structures
 * for Horror, Comedy, Animals, Facts, and Storytelling.
 */

const NICHE_TEMPLATES = {
  Horror: {
    name: "Horror & Mystery",
    icon: "💀",
    color: "#ff3366",
    badgeBg: "rgba(255, 51, 102, 0.15)",
    badgeColor: "#ff4d79",
    hooks: [
      "Do NOT watch this if you're alone in the dark tonight...",
      "In 1998, police found an audio recording that was never released to the public...",
      "3 terrifying rules you should NEVER break if you visit a forest...",
      "This true story will genuinely keep you awake tonight...",
      "If you ever hear someone calling your name outside at 3 AM, DO NOT look...",
      "The disturbing reason why this lighthouse was abandoned overnight..."
    ],
    titleFormulas: [
      "The [Topic] Police Still Cannot Explain 💀",
      "Never Do This If You Hear [Sound/Word] at Night 😱",
      "3 Real Unsolved Cases Caught on Camera ⚠️",
      "The Creepiest 60 Seconds Caught on a Trail Cam 🌲",
      "Why You Should NEVER Visit [Location] Alone 🛑"
    ],
    hashtags: [
      "#horror", "#scarystories", "#creepy", "#horrorcommunity",
      "#shorts", "#reels", "#scaryfacts", "#darktales", "#unsolved"
    ],
    descriptionTemplate: `⚠️ Warning: Disturbing content ahead.\n\nThis is the real story behind [Topic]. What would you have done in this situation? Let me know in the comments below! 👇\n\n🔔 Subscribe/Follow for daily spine-chilling stories.\n\n#horror #scarystories #shorts #reels #mystery`
  },

  Comedy: {
    name: "Comedy & Relatable",
    icon: "😂",
    color: "#ffb703",
    badgeBg: "rgba(255, 183, 3, 0.15)",
    badgeColor: "#ffc233",
    hooks: [
      "Tell me this isn't 100% accurate for every single person...",
      "Nobody prepared me for the most humiliating part of being an adult...",
      "Things that shouldn't be relatable, but definitely are...",
      "How I think I look doing [Action] vs how I actually look...",
      "Why does nobody talk about this awkward moment that happens every day?!",
      "POV: You're trying to sneak food at 2 AM without making a sound..."
    ],
    titleFormulas: [
      "When You Try To [Action] In Front Of People 😭",
      "POV: Your Brain At 3 AM Thinking About [Topic] 💀",
      "Types of People You Meet At [Place] (Part 1) 😂",
      "Tell Me You [Habit] Without Telling Me You [Habit] 👀",
      "Why Is This So Painfully Accurate?! 🤣"
    ],
    hashtags: [
      "#comedy", "#relatable", "#funny", "#skit", "#humor",
      "#shorts", "#reels", "#memes", "#pov", "#laugh"
    ],
    descriptionTemplate: `Tag that ONE friend who does this every single time! 😂\n\nDrop your funniest story in the comments below! 👇\n\nFollow for your daily dose of laughs.\n\n#comedy #relatable #funny #shorts #reels #humor`
  },

  Animals: {
    name: "Animals & Pets",
    icon: "🐾",
    color: "#06d6a0",
    badgeBg: "rgba(6, 214, 160, 0.15)",
    badgeColor: "#10e7b0",
    hooks: [
      "You won't believe what this animal does when it thinks nobody is watching...",
      "This is why you should NEVER underestimate a [Animal]...",
      "Scientists just discovered the most bizarre superpower in this tiny creature...",
      "The cutest animal in the world is also secretly the most dangerous...",
      "Watch what happens when this pet hears [Trigger Word]...",
      "Meet the animal that can literally survive in outer space..."
    ],
    titleFormulas: [
      "Why This [Animal] Is Smarter Than Most Humans 🐾",
      "What Happens When You Introduce A [Animal] To A [Thing] 🥺",
      "Top 3 Animals That Look Harmless But Are Deadly ⚠️",
      "This Golden Retriever's Reaction Broke The Internet ❤️",
      "The Most Bizarre Animal Behavior Ever Recorded 🤯"
    ],
    hashtags: [
      "#animals", "#wildlife", "#cuteanimals", "#nature", "#pets",
      "#animalfacts", "#shorts", "#reels", "#dogsoftiktok", "#catlife"
    ],
    descriptionTemplate: `Did you know this about [Animal]? Nature never ceases to amaze us! 🌿🐾\n\nWhich animal should we cover next? Let us know below!\n\nShare this with a fellow animal lover! ❤️\n\n#animals #wildlife #cuteanimals #nature #shorts #reels`
  },

  Facts: {
    name: "Facts & Mind-Benders",
    icon: "🧠",
    color: "#4361ee",
    badgeBg: "rgba(67, 97, 238, 0.15)",
    badgeColor: "#6c85f7",
    hooks: [
      "Here is a fact that will genuinely break your brain in 10 seconds...",
      "What school NEVER told you about [Historical Event / Science]...",
      "3 psychological tricks that actually work 100% of the time...",
      "If you think [Common Myth], you've been lied to your whole life...",
      "The human body does this bizarre thing that doctors can't explain...",
      "There is a planet in space where it literally rains diamonds..."
    ],
    titleFormulas: [
      "Facts That Feel Illegal To Know 🧠",
      "The 1 Thing School Lied To You About [Topic] 🤯",
      "3 Psychological Tricks That Work Every Time 🔥",
      "If You Notice This In Your Body, Here Is What It Means ⚠️",
      "Why [Common Item] Was Originally Invented For Something Else 💡"
    ],
    hashtags: [
      "#facts", "#didyouknow", "#mindblowing", "#psychology", "#knowledge",
      "#curiosity", "#shorts", "#reels", "#learnontiktok", "#education"
    ],
    descriptionTemplate: `Which of these facts surprised you the most? Drop your reaction in the comments! 🧠⚡\n\nHit Subscribe/Follow for 1 mind-bending fact every single day!\n\n#facts #didyouknow #mindblowing #knowledge #shorts #reels`
  },

  Storytelling: {
    name: "Storytelling & History",
    icon: "📖",
    color: "#9d4edd",
    badgeBg: "rgba(157, 78, 221, 0.15)",
    badgeColor: "#b76eff",
    hooks: [
      "This man lost everything, but 24 hours later, something impossible happened...",
      "The craziest heist in world history that almost nobody knows about...",
      "She thought she was buying a normal $5 painting at a flea market, until...",
      "This true story sounds like a Hollywood movie, but it's 100% real...",
      "In 1974, a man walked onto an airplane with an impossible secret...",
      "How one simple 5-second mistake changed the course of history forever..."
    ],
    titleFormulas: [
      "The Craziest Heist History Forgot About 🕵️",
      "How A $5 Thrift Find Made Someone A Millionaire 🎨",
      "The Impossible Survival Story Of [Person] ⏱️",
      "The Man Who Conned The Entire World With One Lie 🕶️",
      "The Secret History Behind [Famous Monument/Event] 📜"
    ],
    hashtags: [
      "#storytelling", "#truestory", "#history", "#mystery", "#documentary",
      "#shorts", "#reels", "#storytime", "#deepdive", "#epic"
    ],
    descriptionTemplate: `What would YOU have done in their shoes? Tell me in the comments! 👇\n\nMake sure to follow for more fascinating untold stories from history and beyond.\n\n#storytelling #truestory #history #mystery #shorts #reels`
  }
};
