/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBackground: {
          dark: "#202020",
        },
        secondaryBackground: {
          dark: "#252525",
        },
        tertiaryBackground: {
          dark: "#2c2c2c",
        },
        chatBackground: {
          dark: "#5a5a5a",
        },
        primaryText: {
          dark: "#c4c4c4",
        },
        secondaryText: {
          dark: "#e4e4e4",
        },
        chatDivider: {
          dark: "#3c3c3c",
        },
        modalBorder: {
          dark: "#333333",
        },
        calendarMarkings: {
          dark: "#cac4d0",
        },
        emptyEvent: {
          dark: "#898989",
        },
        footerBackground: {
          dark: "#101010",
        },
        buttonDisable: {
          dark: "#e6e0e9",
        },
        buttonEnable: {
          dark: "#1e69ea",
        },
        error: {
          dark: "#F2B8B5",
        },
        welcomeColor: {
          dark: "#363636",
        },
        sidebarColor: {
          dark: "#ff8c4e",
        },
        placeholder: {
          dark: "#969696",
        },
        subtitle: {
          dark: "#a3a3a3",
        },
        dropdown: {
          dark: "#28262b",
        },
        description: {
          dark: "#bbbbbb",
        },
        profileColor: {
          dark: "#7b7b7c",
        },
      },
      fontFamily: {
        inter: ["Inter"],
        "familjen-grotesk": ['"Familjen Grotesk"', "sans-serif"],
      },
      screens: {
        xs: "470px",
        xl: "1150px",
        xxl: "1400px",
      },
      fontWeight: {
        extralight: 100,
        light: 200,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      spacing: {
        "full-minus-60": "calc(100hw - 120px)",
        "left-banner-width": "calc(100vw - 88px)",
        "full-minus-120": "calc(100vw - 72px)",
        "full-minus-12": "calc(100% - 13px)",
        "full-minus-80": "calc(100vw - 80px)",
        "full-height-30": "calc(100vh - 80px)",
        "full-height-70": "calc(100vh - 70px)",
        "full-height-160": "calc(100vh - 170px)",
        "full-minus-64": "calc(100vw - 72px)",
        "full-minus-68": "calc(100% - 68px)",
        76: "305px",
        "72px": "72px",
        "88px": "350px",
        90: "360px",
        "90%": "90%",
        "bottom-sheet": "27%",
        "30%": "30%",
        xxs: "0.7rem",
        "20px": "80px",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".custom-checkbox": {
          "@apply relative flex-shrink-0 h-4 w-4 appearance-none rounded-sm border-2 border-solid dark:border-primaryText-dark cursor-pointer":
            {},
          "&:checked": {
            borderColor: "var(--tw-dark-border-primaryText-dark)",
            backgroundColor: "var(--tw-dark-tertiaryBackground-dark)",
          },
          "&:checked::after": {
            content: '""',
            position: "absolute",
            left: "4px",
            bottom: "3px",
            height: "10px",
            width: "6px",
            transform: "rotate(45deg)",
            border: "2px solid",
            borderColor:
              "transparent transparent var(--tw-dark-tertiaryBackground-dark) var(--tw-dark-tertiaryBackground-dark)",
            borderLeft: "none",
            borderTop: "none",
          },
        },
      });
    },
  ],
};
