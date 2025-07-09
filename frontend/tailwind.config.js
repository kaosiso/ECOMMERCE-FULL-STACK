/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        vibes: ['"Great Vibes"', "cursive"],
        island: ['"Island Moments"', "cursive"],
      },
      animation: {
        fadeInLeft: "fadeInLeft 1s ease-out",
        bounceIn: "bounceIn 0.8s ease-out",
        zoomIn: "zoomIn 0.8s ease-out",
        fadeSlideDown: "fadeSlideDown 0.6s ease-out", // 👈 Your requested animation
      },
      keyframes: {
        fadeInLeft: {
          "0%": { opacity: 0, transform: "translateX(-50px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        bounceIn: {
          "0%, 20%, 40%, 60%, 80%, 100%": {
            transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
          },
          "0%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3)",
          },
          "20%": {
            transform: "scale3d(1.1, 1.1, 1.1)",
          },
          "40%": {
            transform: "scale3d(0.9, 0.9, 0.9)",
          },
          "60%": {
            opacity: 1,
            transform: "scale3d(1.03, 1.03, 1.03)",
          },
          "80%": {
            transform: "scale3d(0.97, 0.97, 0.97)",
          },
          "100%": {
            opacity: 1,
            transform: "scale3d(1, 1, 1)",
          },
        },
        zoomIn: {
          "0%": {
            opacity: 0,
            transform: "scale(0.3)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
        fadeSlideDown: {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
