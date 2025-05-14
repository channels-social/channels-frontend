import { useEffect, useState } from "react";

const ThemeToggleButton = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-2 py-1.5 bg-theme-tertiaryBackground text-theme-primaryText rounded-md "
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggleButton;
