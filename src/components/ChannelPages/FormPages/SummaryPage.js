import React, { useState, useEffect } from "react";
import ArrowUp from "../../../assets/icons/up-arrow.svg";
import ArrowDown from "../../../assets/icons/arrow_drop_down.svg";

const SummaryPage = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dates, setDates] = useState([]);

  const generateMonthYearOptions = () => {
    const options = [];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    options.push({ month: currentMonth, year: currentYear });
    if (currentMonth === 0) {
      options.push({ month: 11, year: currentYear - 1 });
    } else {
      options.push({ month: currentMonth - 1, year: currentYear });
    }

    return options;
  };

  const dayInitials = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((day) => (
      <div key={day} className="flex justify-center items-center w-7 h-7">
        {day[0]} {/* Taking the first letter of each day */}
      </div>
    ));
  };

  const generateDates = (month, year) => {
    const dates = [];
    let startDate;
    let endDate;

    if (month === today.getMonth() && year === today.getFullYear()) {
      startDate = new Date(year, month, 1);
      endDate = new Date(today);
    } else {
      startDate = new Date(year, month, today.getDate());
      endDate = new Date(year, month + 1, 0);
    }

    while (startDate <= endDate) {
      dates.push({
        day: startDate.toDateString().split(" ")[0],
        date: new Date(startDate),
      });
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  };

  useEffect(() => {
    setDates(generateDates(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedDate(new Date(year, month, 1));
    setIsDropdownOpen(false);
  };

  const monthYearOptions = generateMonthYearOptions();

  return (
    <div className="dark:bg-tertiaryBackground-dark  flex flex-col h-full">
      <div className="relative mb-2">
        <div
          className="flex flex-row items-center ml-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <button className="w-max px-2 py-1 rounded-lg dark:bg-tertiaryBackground-dark dark:text-secondaryText-dark ">
            {new Date(selectedYear, selectedMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </button>
          <img
            src={isDropdownOpen ? ArrowUp : ArrowDown}
            alt={isDropdownOpen ? "up-arrow" : "down-arrow"}
            className="h-6 w-6"
          />
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10  w-full h-max dark:bg-tertiaryBackground-dark border dark:border-chatBackground-dark rounded-lg shadow-lg">
            {monthYearOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMonthChange(option.month, option.year)}
                className={`w-full px-4 py-2 text-left text-sm dark:text-secondaryText-dark hover:bg-chatBackground-dark ${
                  selectedMonth === option.month && selectedYear === option.year
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                {new Date(option.year, option.month).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row w-full flex-shrink-0 overflow-x-auto custom-scrollbar space-x-4 items-center pb-2">
        {dates.map(({ day, date }) => (
          <div key={date.toISOString()} className="flex flex-col ">
            <button
              onClick={() => setSelectedDate(date)}
              className={`flex items-center dark:text-secondaryText-dark justify-center w-6 h-7 rounded-3xl text-xs font-light flex-shrink-0 ${
                selectedDate.toDateString() === date.toDateString()
                  ? "border border-secondaryText-dark"
                  : ""
              }`}
            >
              {day[0]}
            </button>
            <button
              onClick={() => setSelectedDate(date)}
              className={`flex items-center mt-3 justify-center w-7 h-7 rounded-full text-sm font-light flex-shrink-0 ${
                selectedDate.toDateString() === date.toDateString()
                  ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                  : "dark:text-secondaryText-dark"
              }`}
            >
              {date.getDate() <= "9" ? "0" + date.getDate() : date.getDate()}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-20 dark:text-secondaryText-dark text-center mx-auto">
        Coming soon...
      </div>
    </div>
  );
};

export default SummaryPage;
