import React, { useState, useEffect, useRef } from "react";
import ArrowDown from "../../../assets/icons/arrow_drop_down.svg";
import Emotion from "../../../assets/icons/emotion.svg";
import ArrowLeft from "../../../assets/icons/navigate_before.svg";
import ArrowRight from "../../../assets/icons/navigate_next.svg";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "./../widgets/EventCard";
import { setEventField } from "../../../redux/slices/eventSlice";
import AddIcon from "../../../assets/icons/addIcon.svg";
import useModal from "./../../hooks/ModalHook";

const EventsPage = ({ topicId }) => {
  const today = new Date();
  const [selectedTab, setSelectedTab] = useState("Calendar");
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const Chats = useSelector((state) => state.chat.chats);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownContainerRef = useRef(null);
  const months = Array.from({ length: 12 }, (v, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );
  const { handleOpenModal } = useModal();
  const years = Array.from(
    new Array(6),
    (val, index) => index + today.getFullYear() - 1
  );

  const getDaysArray = (year, month) => {
    const monthIndex = month;
    const date = new Date(year, monthIndex, 1);
    const result = [];
    const firstDayOffset = date.getDay();

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
      currentDate.getFullYear() === today.getFullYear() - 1 &&
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
      currentDate.getFullYear() === today.getFullYear() + 5 &&
      currentDate.getMonth() === 11
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
    if (currentDate.getFullYear() - 1 > today.getFullYear() - 1) {
      const newDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth()
      );
      setCurrentDate(newDate);
    }
  };

  const handleNextYear = () => {
    if (currentDate.getFullYear() + 1 <= today.getFullYear() + 5) {
      const newDate = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth()
      );
      setCurrentDate(newDate);
    }
  };

  const handleToggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target)
      ) {
        setOpenDropdownId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const upcomingEvents = Chats.filter(
    (chat) =>
      chat.event &&
      new Date(chat.event.startDate) >= new Date(today.toDateString())
  );

  const eventsForSelectedDate = Chats.filter(
    (chat) =>
      chat.event &&
      new Date(chat.event.startDate).toDateString() ===
        selectedDate.toDateString()
  );

  const handleCreateEvent = () => {
    dispatch(setEventField({ field: "topic", value: topicId }));
    handleOpenModal("modalEventOpen");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-start space-x-4">
        <div
          className={`text-xs border font-light dark:border-secondaryText-dark px-1.5 py-1 rounded-full cursor-pointer 
            dark:text-secondaryText-dark flex flex-row items-center
          `}
          onClick={handleCreateEvent}
        >
          <img src={AddIcon} alt="add-icon" className="w-4 h-4 mr-0.5" />
          Create
        </div>
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
                        ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark p-0.5"
                        : "dark:text-primaryText-dark"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    {day.getDate() <= "9" ? "0" + day.getDate() : day.getDate()}
                  </div>
                )
            )}
          </div>

          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((chat) => (
              <div key={chat._id} className="w-full my-3 ">
                <EventCard
                  width="w-full"
                  imageHeight="h-32"
                  chatId={chat._id}
                  event={chat.event}
                  color="dark:bg-[#353535]"
                  openDropdownId={openDropdownId}
                  handleToggleDropdown={handleToggleDropdown}
                  btnPadding="px-1"
                  spacing="space-x-2"
                  topSpacing="mt-3"
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col w-full items-center mt-8">
              <img src={Emotion} alt="empty-event" className="w-16" />
              <p className="dark:text-emptyEvent-dark text-xs mt-2">
                No events yet..
              </p>
            </div>
          )}
        </>
      )}

      {selectedTab === "All upcoming events" && (
        <div className="mt-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((chat) => (
              <div key={chat._id} className="w-full my-3">
                <EventCard
                  width="w-full"
                  imageHeight="h-32"
                  chatId={chat._id}
                  event={chat.event}
                  color="dark:bg-[#353535]"
                  openDropdownId={openDropdownId}
                  handleToggleDropdown={handleToggleDropdown}
                  btnPadding="px-1"
                  spacing="space-x-2"
                  topSpacing="mt-3"
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col w-full items-center mt-8">
              <img src={Emotion} alt="empty-event" className="w-16" />
              <p className="dark:text-emptyEvent-dark text-xs mt-2">
                No upcoming events..
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
