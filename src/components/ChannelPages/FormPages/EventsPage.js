import React, { useState } from "react";
import ArrowDown from "../../../assets/icons/arrow_drop_down.svg";
import Emotion from "../../../assets/icons/emotion.svg";
import ArrowLeft from "../../../assets/icons/navigate_before.svg";
import ArrowRight from "../../../assets/icons/navigate_next.svg";

const EventsPage = () => {
  const today = new Date();
  const [selectedTab, setSelectedTab] = useState("Calendar");
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const months = Array.from({ length: 12 }, (v, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );
  const years = Array.from(
    new Array(4),
    (val, index) => index + today.getFullYear() - 3
  );

  const getDaysArray = (year, month) => {
    const monthIndex = month;
    const date = new Date(year, monthIndex, 1);
    const result = [];
    let firstDayOffset = (date.getDay() - 1) % 7;
    if (firstDayOffset < 0) firstDayOffset += 7;

    for (let i = 0; i < firstDayOffset; i++) {
      result.push(null);
    }

    while (date.getMonth() === monthIndex) {
      result.push(new Date(date)); // store each date
      date.setDate(date.getDate() + 1);
    }
    return result;
  };

  const days = getDaysArray(currentDate.getFullYear(), currentDate.getMonth());

  const handleMonthChange = (month) => {
    setCurrentDate(new Date(currentDate.getFullYear(), months.indexOf(month)));
    setMonthDropdownOpen(false);
  };

  const handleYearChange = (year) => {
    setCurrentDate(new Date(parseInt(year, 10), currentDate.getMonth()));
    setYearDropdownOpen(false);
  };

  const handlePrevMonth = () => {
    if (
      currentDate.getFullYear() === today.getFullYear() - 3 &&
      currentDate.getMonth() === 0
    ) {
      return;
    }
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    if (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() >= today.getMonth()
    ) {
      return;
    }
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(newDate);
  };

  const handlePrevYear = () => {
    if (currentDate.getFullYear() - 1 > today.getFullYear() - 4) {
      const newDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth()
      );
      setCurrentDate(newDate);
    }
  };

  const handleNextYear = () => {
    if (currentDate.getFullYear() + 1 <= today.getFullYear()) {
      const newDate = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth()
      );
      setCurrentDate(newDate);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-start space-x-4">
        <div
          className={`rounded-full text-xs border font-light dark:border-secondaryText-dark px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "Calendar"
              ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
              : "dark:text-secondaryText-dark"
          }`}
          onClick={() => setSelectedTab("Calendar")}
        >
          Calendar
        </div>
        <div
          className={`rounded-full text-xs border font-light dark:border-secondaryText-dark px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "All upcoming events"
              ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
              : "dark:text-secondaryText-dark"
          }`}
          onClick={() => setSelectedTab("All upcoming events")}
        >
          All upcoming events
        </div>
      </div>

      {selectedTab === "Calendar" && (
        <>
          <div className="flex flex-row justify-between items-center my-4">
            <div className="relative">
              <div className="flex flex-row">
                <img
                  src={ArrowLeft}
                  alt="arrow-left"
                  className="mr-2"
                  onClick={handlePrevMonth}
                />
                <div
                  className="bg-transparent dark:text-calendarMarkings-dark cursor-pointer"
                  onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                >
                  {months[currentDate.getMonth()]}{" "}
                  <img src={ArrowDown} className="inline w-4" alt="dropdown" />
                </div>
                <img
                  src={ArrowRight}
                  alt="arrow-right"
                  className=""
                  onClick={handleNextMonth}
                />
              </div>

              {monthDropdownOpen && (
                <div className="absolute z-10 max-h-90 overflow-y-auto custom-scrollbar dark:bg-tertiaryBackground-dark border dark:border-chatBackground-dark rounded-lg shadow-lg">
                  {months.map((month) => (
                    <div
                      key={month}
                      className="p-2 text-left text-sm dark:text-secondaryText-dark hover:bg-chatBackground-dark"
                      onClick={() => handleMonthChange(month)}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <div className="flex flex-row">
                <img
                  src={ArrowLeft}
                  alt="arrow-left"
                  className="mr-2"
                  onClick={handlePrevYear}
                />
                <div
                  className="bg-transparent  dark:text-calendarMarkings-dark cursor-pointer"
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                >
                  {currentDate.getFullYear()}{" "}
                  <img src={ArrowDown} className="inline w-4" alt="dropdown" />
                </div>
                <img
                  src={ArrowRight}
                  alt="arrow-right"
                  className="mr-2"
                  onClick={handleNextYear}
                />
              </div>

              {yearDropdownOpen && (
                <div className="absolute z-10 max-h-90 overflow-y-auto custom-scrollbar dark:bg-tertiaryBackground-dark border dark:border-chatBackground-dark rounded-lg shadow-lg">
                  {years.map((year) => (
                    <div
                      key={year}
                      className="p-2 text-left text-sm dark:text-secondaryText-dark hover:bg-chatBackground-dark"
                      onClick={() => handleYearChange(year.toString())}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-7 ml-2 space-x-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
              <div
                key={day}
                className="dark:text-primaryText-dark  font-light text-[10px]"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-3  ">
            {Array.from({
              length:
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1
                ).getDay() - 1,
            }).map((_, index) => (
              <div key={`empty-${index}`} className="h-6 w-6"></div>
            ))}
            {days.map(
              (day, index) =>
                day && (
                  <div
                    key={index}
                    className={`text-center rounded-full h-6 w-6 text-sm font-light cursor-pointer ${
                      selectedDate.toDateString() === day.toDateString()
                        ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark "
                        : "dark:text-primaryText-dark"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    {day.getDate() <= "9" ? "0" + day.getDate() : day.getDate()}
                  </div>
                )
            )}
          </div>
          <div className="flex flex-col w-full items-center mt-8">
            <img src={Emotion} alt="empty-event" className="w-16" />
            <p className="dark:text-emptyEvent-dark text-xs mt-2">
              No events yet..
            </p>
          </div>
        </>
      )}

      {selectedTab === "All upcoming events" && (
        <div className="mt-4 text-center text-xs">No events yet...</div>
      )}
    </div>
  );
};

export default EventsPage;
