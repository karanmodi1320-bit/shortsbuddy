/**
 * ShortsBuddy Creator Hub - Storage Management
 * Handles localStorage persistence, CRUD operations, starter mock data, and JSON backup/restore.
 */

const STORAGE_KEY = 'shortsbuddy_creator_data_v1';

// Initial sample data showing creators what great Shorts/Reels planning looks like
const INITIAL_STARTER_DATA = {
  creatorName: "Creator",
  weeklyGoal: 4,
  videos: [
    {
      id: "sb-sample-1",
      title: "3 Facts That Feel Illegal To Know 🧠",
      niche: "Facts",
      status: "Script Ready",
      targetPlatform: "Both",
      durationTarget: "45s",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      hook: "Here are 3 facts that will genuinely make you question reality before this video ends...",
      sceneScript: "Scene 1 (0-3s): Fast camera zoom on eye. On-screen caption: 'Wait till #3...'\nScene 2 (4-15s): Slow pan of old library/space background. Fact 1.\nScene 3 (16-30s): Quick cut sound effect 'woosh'. Fact 2 with animated graphic.\nScene 4 (31-45s): Mind-blown sound effect. Fact 3 reveal + loop transition.",
      narration: "Number one: You are not actually scared of being alone in the dark; you're terrified that you aren't alone. Number two: Sharks are older than trees and the rings of Saturn. And number three: If you sneeze too hard, you can fracture a rib, but trying to suppress a sneeze can rupture a blood vessel in your head. Which one shocked you the most?",
      ending: "Drop your favorite fact below! Follow for 1 crazy fact every day — loop starts now!",
      description: "3 facts that will completely break your brain! Which one blew your mind the most? 👇\n\nSubscribe for daily mind-expanding Shorts!\n#shorts #facts #didyouknow #mindblowing",
      hashtags: ["#shorts", "#facts", "#didyouknow", "#mindblowing", "#psychology", "#reels"],
      notes: "Use dark ambient synth music in the background. Keep captions bold with yellow highlights."
    },
    {
      id: "sb-sample-2",
      title: "The Unsolved Mystery Of The Flannan Isles 💀",
      niche: "Horror",
      status: "Idea",
      targetPlatform: "YouTube Shorts",
      durationTarget: "55s",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      hook: "In 1900, three lighthouse keepers vanished from an island without leaving a single trace...",
      sceneScript: "Scene 1: Stormy ocean b-roll, gloomy tint. Eerie violin cue.\nScene 2: Zoom on clock stopped at 8:45.\nScene 3: Unfinished dinner table recreation.",
      narration: "A supply ship arrived at the remote Scottish lighthouse after a massive storm, only to find the door unlocked, a coat still on its peg, and uneaten meals sitting on the table. But the logbook recorded something even more bone-chilling...",
      ending: "What do you think happened to them? Tell me your theory in the comments.",
      description: "The terrifying unsolved disappearance of the Flannan Isle keepers. Did they fall victim to the storm, or something far darker?\n\n#horror #unsolved #creepy #shorts",
      hashtags: ["#horror", "#scarystories", "#unsolved", "#mystery", "#creepy", "#shorts"],
      notes: "Record voiceover in low, calm, suspenseful tone. Add rain and thunder ambience."
    },
    {
      id: "sb-sample-3",
      title: "POV: Trying To Sneak Food At 2 AM 😭",
      niche: "Comedy",
      status: "Editing",
      targetPlatform: "Instagram Reels",
      durationTarget: "30s",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      hook: "Why is every snack bag louder than a jet engine at 2 AM?!",
      sceneScript: "Scene 1: Creeping through hallway on tiptoes in the dark.\nScene 2: Slow motion touch of chip bag with explosion sound effect.\nScene 3: Floorboard squeaks like a dinosaur roar.",
      narration: "During the day: gentle crinkle. At 2:15 AM: 180 decibel sonic boom. Then you freeze like a deer in headlights praying nobody woke up.",
      ending: "Tag someone whose floorboards betray them every single night!",
      description: "Why does the microwave beep sound like an air raid siren at 2 AM?! 😂 Tag your midnight snack partner!\n\n#comedy #relatable #funny #reels",
      hashtags: ["#comedy", "#relatable", "#funny", "#skit", "#humor", "#reels", "#memes"],
      notes: "Exaggerate the sound design. Fast comedic timing with freeze frame."
    },
    {
      id: "sb-sample-4",
      title: "Why Golden Retrievers Are Actually Angels 🐾",
      niche: "Animals",
      status: "Published",
      targetPlatform: "Both",
      durationTarget: "35s",
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
      hook: "Golden retrievers have a mouth so gentle they can carry an unbroken egg...",
      sceneScript: "Scene 1: Dog gently holding an egg without breaking it.\nScene 2: Heartwarming clips of puppy comforting family.\nScene 3: Tail wag slow-mo with happy acoustic guitar.",
      narration: "Bred originally as bird hunting retrievers, their jaws are capable of delicate precision. But what truly makes them special is their empathy — studies show they can detect a human's heartbeat changes.",
      ending: "Send this to someone who needs a puppy hug right now!",
      description: "Proof that we do not deserve dogs! ❤️ Share with a fellow dog lover!\n\n#animals #pets #dogsoftiktok #cuteanimals #shorts #reels",
      hashtags: ["#animals", "#cuteanimals", "#pets", "#wildlife", "#shorts", "#reels"],
      notes: "Published on YouTube Shorts and Instagram Reels. Gained 12k views in 24 hours."
    }
  ]
};

const StorageManager = {
  /**
   * Fetch current dataset from localStorage or initialize with starter data
   */
  getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveData(INITIAL_STARTER_DATA);
        return INITIAL_STARTER_DATA;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("ShortsBuddy: Error loading data from storage", e);
      return INITIAL_STARTER_DATA;
    }
  },

  /**
   * Save complete data object into localStorage
   */
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("ShortsBuddy: Error saving data to storage", e);
      return false;
    }
  },

  /**
   * Get all video items
   */
  getVideos() {
    return this.getData().videos || [];
  },

  /**
   * Get single video by ID
   */
  getVideoById(id) {
    const videos = this.getVideos();
    return videos.find(v => v.id === id) || null;
  },

  /**
   * Add a new video idea / plan
   */
  addVideo(video) {
    const data = this.getData();
    const newVideo = {
      ...video,
      id: 'sb-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.videos.unshift(newVideo);
    this.saveData(data);
    return newVideo;
  },

  /**
   * Update an existing video
   */
  updateVideo(id, updatedFields) {
    const data = this.getData();
    const index = data.videos.findIndex(v => v.id === id);
    if (index === -1) return null;

    data.videos[index] = {
      ...data.videos[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    this.saveData(data);
    return data.videos[index];
  },

  /**
   * Update only the status of a video
   */
  updateStatus(id, newStatus) {
    return this.updateVideo(id, { status: newStatus });
  },

  /**
   * Delete a video
   */
  deleteVideo(id) {
    const data = this.getData();
    const initialCount = data.videos.length;
    data.videos = data.videos.filter(v => v.id !== id);
    if (data.videos.length !== initialCount) {
      this.saveData(data);
      return true;
    }
    return false;
  },

  /**
   * Export all user data as formatted JSON string
   */
  exportDataJSON() {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  },

  /**
   * Import data from JSON string
   */
  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.videos)) {
        throw new Error("Invalid format: 'videos' array missing.");
      }
      this.saveData(parsed);
      return { success: true, count: parsed.videos.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Reset data to initial starter pack
   */
  resetDefaults() {
    this.saveData(INITIAL_STARTER_DATA);
    return INITIAL_STARTER_DATA;
  }
};
