import { getSentimentState, setBit, SentimentStateFlags } from "../stores/sentimentStateStore";

const applyTheme = (theme: SentimentStateFlags | null) => {
  if (null === theme) {
    return;
  }
  const root = document.documentElement;
  if (SentimentStateFlags.FLAG_NEGATIVE === theme) {
    root.style.setProperty("--color-text-color", "#f8f9fa");
    root.style.setProperty("--color-bg-color", "#212529");
    root.style.setProperty("--color-fg-color", "#495057");
    root.style.setProperty("--color-title-color", "#E9ECEF");
    root.style.setProperty("--color-primary", "#212529");
    root.style.setProperty("--color-secondary", "#343A40");
    root.style.setProperty("--color-secondary-shade", "#2D3237");
    root.style.setProperty("--color-tertiary", "#6C757D");
    root.style.setProperty("--color-extra1", "#ADB5BD");
    root.style.setProperty("--color-extra2", "#CED4DA");
    root.style.setProperty("--color-white", "#F8F9FA");
    root.style.setProperty("--color-white-shade", "#EFF0F1");
    root.style.setProperty("--color-yellow", "#000000");
    root.style.setProperty("--color-green", "#65A854");
    root.style.setProperty("--color-red", "#A85954");
    root.style.setProperty("--color-red-shade", "#A05550");
    root.style.setProperty("--color-transition1", "#3b4148");
    root.style.setProperty("--color-transition2", "#424850");
  } else if (SentimentStateFlags.FLAG_NEUTRAL === theme) {
    root.style.setProperty("--color-text-color", "#231942");
    root.style.setProperty("--color-bg-color", "#231942");
    root.style.setProperty("--color-fg-color", "#F7F5FB");
    root.style.setProperty("--color-title-color", "#5e548e ");
    root.style.setProperty("--color-primary", "#231942  ");
    root.style.setProperty("--color-secondary", "#5e548e");
    root.style.setProperty("--color-secondary-shade", "#423B64");
    root.style.setProperty("--color-tertiary", "#9F86C0");
    root.style.setProperty("--color-extra1", "#BE95C4");
    root.style.setProperty("--color-extra2", "#E0B1CB");
    root.style.setProperty("--color-white", "#F7F5FB");
    root.style.setProperty("--color-white-shade", "#CDCBCF");
    root.style.setProperty("--color-yellow", "#FFDD4A");
    root.style.setProperty("--color-green", "#558F54");
    root.style.setProperty("--color-red", "#AC3931");
    root.style.setProperty("--color-red-shade", "#802A24");
    root.style.setProperty("--color-transition1", "#918ab2");
    root.style.setProperty("--color-transition2", "#c4c0d6");
  }
};

// export const toggleThemes = () => {
//   const theme = getSentimentState();
//   if (null === theme) {
//     return;
//   }
//   let interval = 3000; // Start with a fast interval
//   const minInterval = 100; // Maximum interval before settling
//   let currentSentiment = theme; // Start with sentiment 0
//   const decayFactor = 0.8; // Decay factor for the interval
//   const intervalId = setInterval(() => {
//     applyTheme(currentSentiment);
//     currentSentiment = currentSentiment === SentimentStateFlags.FLAG_NEUTRAL ? theme : SentimentStateFlags.FLAG_NEUTRAL; // Toggle between 0 and sentiment
//     const jump = (interval - minInterval) * decayFactor; 
//     interval -= jump;
//     if (interval < minInterval) {
//       clearInterval(intervalId);
//       applyTheme(theme); // Apply the final theme based on sentiment
//       console.log("Theme applied");
//       setBit(SentimentStateFlags.FLAG_ACTIVE); // Indicate that the theme has been applied
//     }
//   }, interval);
// };

export const toggleThemes = () => {
  let intervalId: NodeJS.Timeout | null = null; // For tracking the interval
  let currentInterval = 2000; // Start with an initial interval of 1000ms (1 second)
  const minInterval = 100; // The minimum interval to settle at
  const decayFactor = 0.95; // Controls the rate of decay (closer to 1 = slower decay)
  const theme = getSentimentState();
  if (theme === null) {
    return;
  }
  let currentSentiment: SentimentStateFlags = theme; // Start with sentiment 0

  // Function to gradually decrease the interval
  function startDecayingInterval() {
    if (intervalId) clearInterval(intervalId); // Clear any previous intervals

    const adjustInterval = () => {
      applyTheme(currentSentiment);
      currentSentiment = currentSentiment === SentimentStateFlags.FLAG_NEUTRAL ? theme! : SentimentStateFlags.FLAG_NEUTRAL; // Toggle between 0 and sentiment
      console.log("Action triggered! Interval:", currentInterval);

      if (currentInterval > minInterval) {
        // Apply a non-linear decay
        const jump = (currentInterval - minInterval) * decayFactor;
        currentInterval -= jump;

        // Reset the interval with the updated time
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(adjustInterval, Math.max(currentInterval, minInterval));
      } else {
        console.log("Settled at minimum interval:", minInterval);
        if (intervalId !== null) clearInterval(intervalId); // Stop adjusting once the minimum interval is reached
        applyTheme(theme); // Apply the final theme based on sentiment
        console.log("Theme applied");
        setBit(SentimentStateFlags.FLAG_ACTIVE); // Indicate that the theme has been applied
      }
    };

    intervalId = setInterval(adjustInterval, currentInterval);
  }

  startDecayingInterval();
};
