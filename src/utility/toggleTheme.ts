import { getSentimentState, setBit, SentimentStateFlags } from "../stores/sentimentStateStore";

enum Themes {
  FLAG_ORIGINAL = 0,
  FLAG_NEGATIVE = SentimentStateFlags.FLAG_NEGATIVE,
  FLAG_NEUTRAL = SentimentStateFlags.FLAG_NEUTRAL,
  FLAG_POSITIVE = SentimentStateFlags.FLAG_POSITIVE,
}

const applyTheme = (theme: Themes | null) => {
  if (null === theme) {
    return;
  }
  const root = document.documentElement;
  if (Themes.FLAG_NEGATIVE === theme) {
    root.style.setProperty("--color-text-color", "#f8f9fa");
    root.style.setProperty("--color-bg-color", "#212529");
    root.style.setProperty("--color-fg-color", "#495057");
    root.style.setProperty("--color-title-color", "#E9ECEF");
    root.style.setProperty("--color-baloon1", "#AC3931");
    root.style.setProperty("--color-baloon1-shade", "#802A24");
    root.style.setProperty("--color-baloon2", "#5e548e");
    root.style.setProperty("--color-baloon2-shade", "#423B64");
    root.style.setProperty("--color-baloon3", "#558F54");
    root.style.setProperty("--color-baloon3-shade", "#3C643B");
    root.style.setProperty("--color-primary", "#212529");
    root.style.setProperty("--color-secondary", "#343A40");
    root.style.setProperty("--color-secondary-shade", "#2D3237");
    root.style.setProperty("--color-tertiary", "#6C757D");
    root.style.setProperty("--color-extra1", "#ADB5BD");
    root.style.setProperty("--color-extra2", "#CED4DA");
    root.style.setProperty("--color-white", "#F8F9FA");
    root.style.setProperty("--color-white-shade", "#EFF0F1");
    root.style.setProperty("--color-yellow", "#FFDD4A");
    root.style.setProperty("--color-yellow-shade", "#FFC84A");
    root.style.setProperty("--color-green", "#558F54");
    root.style.setProperty("--color-green-shade", "#50864F");
    root.style.setProperty("--color-red", "#AC3931");
    root.style.setProperty("--color-red-shade", "#802A24");
    root.style.setProperty("--color-transition1", "#3b4148");
    root.style.setProperty("--color-transition2", "#424850");
  } else if (Themes.FLAG_NEUTRAL === theme) {
    root.style.setProperty("--color-text-color", "#1D3557");
    root.style.setProperty("--color-bg-color", "#1D3557");
    root.style.setProperty("--color-fg-color", "#F1FAEE");
    root.style.setProperty("--color-fg-color-shade", "#c8cfc5");
    root.style.setProperty("--color-title-color", "#457B9D");
    root.style.setProperty("--color-baloon1", "#e63946");
    root.style.setProperty("--color-baloon1-shade", "#bb2f3a");
    root.style.setProperty("--color-baloon2", "#457b9d");
    root.style.setProperty("--color-baloon2-shade", "#335B74");
    root.style.setProperty("--color-baloon3", "#018e42");
    root.style.setProperty("--color-baloon3-shade", "#01642f");
    root.style.setProperty("--color-primary", "#1D3557  ");
    root.style.setProperty("--color-secondary", "#457b9d");
    root.style.setProperty("--color-secondary-shade", "#427596");
    root.style.setProperty("--color-tertiary", "#a8dadc");
    root.style.setProperty("--color-extra1", "#9b8c77");
    root.style.setProperty("--color-extra2", "#f09d51");
    root.style.setProperty("--color-white", "#f1faee");
    root.style.setProperty("--color-white-shade", "#c8cfc5");
    root.style.setProperty("--color-yellow", "#f09d51");
    root.style.setProperty("--color-yellow-shade", "#c58243");
    root.style.setProperty("--color-green", "#018e42");
    root.style.setProperty("--color-green-shade", "#01642f");
    root.style.setProperty("--color-red", "#e63946");
    root.style.setProperty("--color-red-shade", "#bb2f3a");
    root.style.setProperty("--color-transition1", "#7ea5b8");
    root.style.setProperty("--color-transition2", "#b7cfd3");
  } else if (Themes.FLAG_POSITIVE === theme) {
    root.style.setProperty("--color-text-color", "#FAF3DD");
    root.style.setProperty("--color-bg-color", "#461220");
    root.style.setProperty("--color-fg-color", "#b23a48");
    root.style.setProperty("--color-fg-color-shade", "#882D38");
    root.style.setProperty("--color-title-color", "#FAF3DD");
    root.style.setProperty("--color-baloon1", "#8c2f39");
    root.style.setProperty("--color-baloon1-shade", "#622128");
    root.style.setProperty("--color-baloon2", "#547AA5");
    root.style.setProperty("--color-baloon2-shade", "#3F5B7B");
    root.style.setProperty("--color-baloon3", "#1B998B");
    root.style.setProperty("--color-baloon3-shade", "#146F64");
    root.style.setProperty("--color-primary", "#461220");
    root.style.setProperty("--color-secondary", "#8c2f39");
    root.style.setProperty("--color-secondary-shade", "#622128");
    root.style.setProperty("--color-tertiary", "#EA4F5F");
    root.style.setProperty("--color-extra1", "#546462");
    root.style.setProperty("--color-extra2", "#1B998B");
    root.style.setProperty("--color-white", "#FAF3DD");
    root.style.setProperty("--color-white-shade", "#CFCAB7");
    root.style.setProperty("--color-yellow", "#FFD23F");
    root.style.setProperty("--color-yellow-shade", "#D4AF35");
    root.style.setProperty("--color-green", "#1B998B");
    root.style.setProperty("--color-green-shade", "#146F64");
    root.style.setProperty("--color-red", "#547AA5");
    root.style.setProperty("--color-red-shade", "#3F5B7B");
    root.style.setProperty("--color-transition1", "#99333e");
    root.style.setProperty("--color-transition2", "#a63743");
  } else if (Themes.FLAG_ORIGINAL === theme) {
    root.style.setProperty("--color-text-color", "#231942");
    root.style.setProperty("--color-bg-color", "#231942");
    root.style.setProperty("--color-fg-color", "#F7F5FB");
    root.style.setProperty("--color-fg-color-shade", "#CDCBCF");
    root.style.setProperty("--color-title-color", "#5e548e ");
    root.style.setProperty("--color-baloon1", "#AC3931");
    root.style.setProperty("--color-baloon1-shade", "#802A24");
    root.style.setProperty("--color-baloon2", "#5e548e");
    root.style.setProperty("--color-baloon2-shade", "#423B64");
    root.style.setProperty("--color-baloon3", "#558F54");
    root.style.setProperty("--color-baloon3-shade", "#3C643B");
    root.style.setProperty("--color-primary", "#231942  ");
    root.style.setProperty("--color-secondary", "#5e548e");
    root.style.setProperty("--color-secondary-shade", "#423B64");
    root.style.setProperty("--color-tertiary", "#9F86C0");
    root.style.setProperty("--color-extra1", "#BE95C4");
    root.style.setProperty("--color-extra2", "#E0B1CB");
    root.style.setProperty("--color-white", "#F7F5FB");
    root.style.setProperty("--color-white-shade", "#CDCBCF");
    root.style.setProperty("--color-yellow", "#FFDD4A");
    root.style.setProperty("--color-yellow-shade", "#FFC84A");
    root.style.setProperty("--color-green", "#558F54");
    root.style.setProperty("--color-green-shade", "#50864F");
    root.style.setProperty("--color-red", "#AC3931");
    root.style.setProperty("--color-red-shade", "#802A24");
    root.style.setProperty("--color-transition1", "#918ab2");
    root.style.setProperty("--color-transition2", "#c4c0d6");
  }
};


export const toggleThemes = () => {
  let intervalId: NodeJS.Timeout | null = null; // For tracking the interval
  let currentInterval = 3000; // Start with an initial interval of 1000ms (1 second)
  const minInterval = 150; // The minimum interval to settle at
  const decayFactor = 0.98; // Controls the rate of decay (closer to 1 = slower decay)
  const sentimentState = getSentimentState();
  if (sentimentState === null) {
    return;
  }
  const selectedTheme: Themes = sentimentState as unknown as Themes;
  let currentTheme: Themes = selectedTheme; // Start with sentiment 0

  // Function to gradually decrease the interval
  function startDecayingInterval() {
    if (intervalId) clearInterval(intervalId); // Clear any previous intervals

    const adjustInterval = () => {
      applyTheme(currentTheme);
      currentTheme = currentTheme === Themes.FLAG_ORIGINAL ? selectedTheme! : Themes.FLAG_ORIGINAL; // Toggle between 0 and sentiment
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
        applyTheme(selectedTheme); // Apply the final theme based on sentiment
        console.log("Theme applied");
        setBit(SentimentStateFlags.FLAG_ACTIVE); // Indicate that the theme has been applied
      }
    };

    intervalId = setInterval(adjustInterval, currentInterval);
  }

  startDecayingInterval();
};
