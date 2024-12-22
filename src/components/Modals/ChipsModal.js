import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import Close from "../../assets/icons/Close.svg";
import { ReactComponent as LinkIcon } from "../../assets/icons/link_enable.svg";
import { ReactComponent as PhotoIcon } from "../../assets/icons/photograph.svg";
import { ReactComponent as LocationIcon } from "../../assets/icons/location-marker.svg";
import documentImage from "../../assets/images/Attachment.svg";
import { ReactComponent as DocumentIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { v4 as uuidv4 } from "uuid";
import { closeModal } from "../../redux/slices/modalSlice";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { createChip } from "../../redux/slices/profileItemsSlice";
import {
  setChipField,
  setDocumentField,
  setLocationField,
  setDateField,
  addImageUrl,
  removeImageUrl,
  clearChip,
} from "./../../redux/slices/chipSlice";
import ChipImages from "./../chips/widgets/ChipImages";
import MyTimePicker from "./widgets/TimePicker";
import { pdfjs } from "react-pdf";
import ChipsReservedModal from "./ChipsReservedModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const ChipsModal = () => {
  const dispatch = useDispatch();
  const chipData = useSelector((state) => state.chip);
  const [suggestions, setSuggestions] = useState([]);
  const [visibleFields, setVisibleFields] = useState({
    link: false,
    media: false,
    docs: false,
    location: false,
    calendar: false,
  });

  const Chipstatus = useSelector((state) => state.profileItems.chipstatus);
  const [fileData, setFileData] = useState(null);
  const [isReservedNotes, setIsReservedNotes] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const isOpen = useSelector((state) => state.modals.modalChipOpen);

  const toggleFieldVisibility = (field) => {
    if (field === "link" && visibleFields.link) {
      dispatch(setChipField({ field: field, value: "" }));
    } else if (field === "location" && visibleFields.location) {
      dispatch(setLocationField({ field: "text", value: "" }));
      setSuggestions([]);
    } else if (field === "calendar" && visibleFields.calendar) {
      dispatch(setDateField({ field: "date", value: "" }));
      dispatch(setDateField({ field: "event", value: "" }));
      dispatch(setDateField({ field: "start_time", value: "" }));
      dispatch(setDateField({ field: "end_time", value: "" }));
    }
    setVisibleFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleRemoveMedia = (index, id) => {
    dispatch(removeImageUrl(index));
    setFileObjects(fileObjects.filter((_, i) => i !== index));
  };

  const handleReserveNotes = () => {
    if (!isEmptyData) {
      setIsReservedNotes(!isReservedNotes);
    }
  };
  const clearChipData = () => {
    dispatch(clearChip());
    setFileObjects([]);
    setIsReservedNotes(false);
    setFileData(null);
    setSuggestions([]);
    setVisibleFields({
      link: false,
      media: false,
      docs: false,
      location: false,
      calendar: false,
    });
  };

  const handleClose = () => {
    clearChipData();
    setIsReservedNotes(false);
    dispatch(closeModal("modalChipOpen"));
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxFileSize = 16 * 1024 * 1024;

    if (files.length <= 5) {
      const newFiles = [];
      for (let file of files) {
        if (file.size > maxFileSize) {
          alert(
            `The file "${file.name}" exceeds the 16  MB size limit and will not be uploaded.`
          );
          continue;
        }
        const newFile = {
          id: uuidv4(),
          url: URL.createObjectURL(file),
          type: file.type.startsWith("video") ? "video" : "image",
          exclusive: false,
          source: "upload",
        };
        dispatch(addImageUrl(newFile));
        newFiles.push(file);
      }
      setFileObjects([...fileObjects, ...newFiles]);
    } else {
      alert("You can upload up to 5 files only.");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;
    const maxFileSize = 16 * 1024 * 1024;
    if (file.size > maxFileSize) {
      alert("File size exceeds 10 MB limit.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdf = await pdfjs.getDocument({ data: e.target.result })
            .promise;
          const pages = pdf.numPages;
          dispatch(setDocumentField({ field: "name", value: file.name }));
          dispatch(
            setDocumentField({ field: "pages", value: `${pages} pages` })
          );
          dispatch(setDocumentField({ field: "url", value: objectUrl }));
          setFileData(file); // Keep file in local state
        } catch (error) {
          console.error("Error reading PDF file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      dispatch(setDocumentField({ field: "name", value: file.name }));
      dispatch(setDocumentField({ field: "pages", value: "1 page" }));
      dispatch(setDocumentField({ field: "url", value: objectUrl }));
      setFileData(file);
    }
  };

  const handleFileClick = () => {
    if (chipData.document.url) {
      window.open(chipData.document.url, "_blank");
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    const apiKey = "AIzaSyA4giJjY94Cl2MJegYyp0NZYIUEOUTq9I0";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        throw new Error("Unable to fetch address");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unknown location";
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const address = await getAddressFromCoords(lat, lng);
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        dispatch(setLocationField({ field: "text", value: address }));
        dispatch(setLocationField({ field: "url", value: url }));
      },
      (error) => {
        alert("Unable to retrieve your location");
      }
    );
  };

  const fetchSuggestions = async (input) => {
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await postRequestUnAuthenticated(
        `/places/autocomplete?input=${encodeURIComponent(input)}`
      );
      const data = response;

      if (data.status === "OK" && data.predictions) {
        const descriptions = data.predictions.map((prediction) => {
          const description = prediction.description;
          const placeId = prediction.place_id;
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${description}&query_place_id=${placeId}`;
          return { description, mapsUrl };
        });

        setSuggestions(descriptions);
      } else {
        console.log("No predictions found or status not OK");
      }
    } catch (error) {
      console.log("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    fetchSuggestions(value);
    dispatch(setLocationField({ field: "text", value }));
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setLocationField({ field: "url", value: suggestion.mapsUrl }));
    dispatch(
      setLocationField({ field: "text", value: suggestion.description })
    );
    setSuggestions([]);
  };

  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setChipField({ field: name, value }));
  };

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const scrollTop = textarea.scrollTop;
      const currentHeight = textarea.offsetHeight;
      const newHeight = textarea.scrollHeight;
      if (currentHeight !== newHeight) {
        textarea.style.height = "auto"; // Reset height to auto
        textarea.style.height = `${newHeight}px`; // Set height to match scroll height
      }
      textarea.scrollTop = scrollTop;
    }
  };

  const handleDateChange = (date) => {
    const isoDate = date ? date.toISOString() : "";
    dispatch(setDateField({ field: "date", value: isoDate }));
  };
  const handleEventChange = (e) => {
    dispatch(setDateField({ field: "event", value: e.target.value }));
  };

  const handleStartTimeChange = (date) => {
    const isoString = date
      ? date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : "";
    dispatch(setDateField({ field: "start_time", value: isoString }));
  };

  const handleEndTimeChange = (date) => {
    const isoString = date
      ? date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : "";
    dispatch(setDateField({ field: "end_time", value: isoString }));
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("input", handleTextareaChange);
      return () => {
        textarea.removeEventListener("input", handleTextareaChange);
      };
    }
  }, []);

  const isDescEmpty = chipData.text.trim() === "";
  const isEmptyData = isDescEmpty;
  // &&
  // chipData.location.text === "" &&
  // chipData.link === "" &&
  // (chipData.date.date === "" || chipData.date.event === "") &&
  // Array.isArray(chipData.image_urls) &&
  // chipData.image_urls.length === 0 &&
  // chipData.document.url === "";

  const handleSave = async (e) => {
    // e.preventDefault();
    if (!isEmptyData) {
      const formDataToSend = new FormData();
      formDataToSend.append("text", chipData.text);
      formDataToSend.append("curation", chipData.curation);
      formDataToSend.append("category", chipData.category);
      formDataToSend.append("location", JSON.stringify(chipData.location));
      formDataToSend.append("link", chipData.link);
      formDataToSend.append("date", JSON.stringify(chipData.date));
      formDataToSend.append("image_urls", JSON.stringify(chipData.image_urls));
      formDataToSend.append("docFiles", JSON.stringify(chipData.document));
      formDataToSend.append("link_exclusive", chipData.link_exclusive);
      formDataToSend.append("text_exclusive", chipData.text_exclusive);
      formDataToSend.append("profile_category", chipData.profile_category);
      fileObjects.forEach((file, index) => {
        formDataToSend.append("files", file);
      });
      if (fileData) {
        formDataToSend.append("document", fileData);
      }

      dispatch(createChip(formDataToSend))
        .unwrap()
        .then(() => {
          handleClose();
          clearChipData();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const postButtonClass = isEmptyData
    ? "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
    : "dark:bg-secondaryText-dark dark:text-primaryBackground-dark";
  const reservedButtonClass = isEmptyData
    ? "border border-chipLinkBackground text-primaryGrey"
    : "border border-borderbtn text-primary";

  const ReadOnlyDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
      readOnly
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder="Date"
      className="w-[210%] py-1 text-sm pr-10 font-light rounded dark:bg-transparent
       border-b border-b-chatDivider-dark placeholder-font-light placeholder-text-sm 
       dark:text-secondaryText-dark focus:outline-none placeholder:text-emptyEvent-dark"
    />
  ));

  const handleDocClear = () => {
    setFileData(null);
    dispatch(setDocumentField({ field: "name", value: "" }));
    dispatch(setDocumentField({ field: "pages", value: "" }));
    dispatch(setDocumentField({ field: "url", value: "" }));
    dispatch(setDocumentField({ field: "exclusive", value: false }));
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content
            className="dark:bg-secondaryBackground-dark rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[80%] overflow-y-auto custom-scrollbar w-[90%] sm:w-max py-5 pl-5"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog.Title />
            {
              // isReservedNotes?<ChipsReservedModal onBack={handleReserveNotes} handleClose={handleClose}
              //  postButton={postButtonClass} handleSave={handleSave} Chipstatus={Chipstatus}
              // />:
              <div className="flex flex-col h-full">
                <div className="flex flex-row justify-between items-center mb-4 pr-4">
                  <h2 className="dark:text-secondaryText-dark text-lg font-normal font-inter">
                    New Chip
                  </h2>
                  <img
                    src={Close}
                    alt="Close"
                    className="w-4 h-4 cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
                <div className="flex justify-between space-x-3 items-center mb-5 pr-4 overflow-x-auto xs:overflow-x-hidden custom-scrollbar">
                  <div
                    className={`${
                      visibleFields.link
                        ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                        : "border dark:border-chatBackground-dark dark:text-chatBackground-dark"
                    } rounded-full px-2.5 py-1.5 cursor-pointer flex items-center`}
                    onClick={() => toggleFieldVisibility("link")}
                  >
                    <LinkIcon
                      className={`w-5 h-5 fill-current ${
                        visibleFields.link
                          ? "text-enabledTextColor"
                          : "text-primary"
                      }`}
                    />
                    <span className="ml-1 text-xs sm:text-sm font-inter font-normal">
                      Link
                    </span>
                  </div>
                  <div
                    className={`${
                      visibleFields.media || fileObjects.length > 0
                        ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                        : "border dark:border-chatBackground-dark dark:text-chatBackground-dark"
                    } relative rounded-full px-2.5 py-1.5 cursor-pointer flex items-center`}
                  >
                    <PhotoIcon
                      className={`w-5 h-5 fill-current ${
                        visibleFields.media || fileObjects.length > 0
                          ? "text-enabledTextColor"
                          : "text-primary"
                      }`}
                    />
                    <span className="ml-1 text-xs sm:text-sm font-inter font-normal">
                      Media
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleMediaUpload}
                    />
                  </div>
                  <div
                    className={`${
                      visibleFields.docs || fileData !== null
                        ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                        : "border dark:border-chatBackground-dark dark:text-chatBackground-dark"
                    } relative rounded-full px-2.5 py-1.5 cursor-pointer flex items-center`}
                  >
                    <DocumentIcon
                      className={`w-5 h-5 fill-current ${
                        visibleFields.docs || fileData !== null
                          ? "text-enabledTextColor"
                          : "text-primary"
                      }`}
                    />
                    <span className="ml-1 text-xs sm:text-sm font-inter font-normal">
                      Docs
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.xlsx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div
                    className={`${
                      visibleFields.location
                        ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                        : "border dark:border-chatBackground-dark dark:text-chatBackground-dark"
                    } rounded-full px-2.5 py-1.5 cursor-pointer flex items-center`}
                    onClick={() => toggleFieldVisibility("location")}
                  >
                    <LocationIcon
                      className={`w-5 h-5 fill-current ${
                        visibleFields.location
                          ? "text-enabledTextColor"
                          : "text-primary"
                      }`}
                    />
                    <span className="ml-1 text-xs sm:text-sm font-inter font-normal">
                      Map
                    </span>
                  </div>
                  <div
                    className={`${
                      visibleFields.calendar
                        ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                        : "border dark:border-chatBackground-dark dark:text-chatBackground-dark"
                    } rounded-full px-2.5 py-1.5 cursor-pointer flex items-center`}
                    onClick={() => toggleFieldVisibility("calendar")}
                  >
                    <CalendarIcon
                      className={`w-5 h-5 fill-current ${
                        visibleFields.calendar
                          ? "text-enabledTextColor"
                          : "text-primary"
                      }`}
                    />
                    <span className="ml-1 text-xs sm:text-sm font-inter font-normal">
                      Event
                    </span>
                  </div>
                </div>
                <div className="flex flex-col mr-4 ">
                  <p className="dark:text-secondaryText-dark text-sm font-light font-inter mb-1">
                    Description
                  </p>
                  <textarea
                    ref={textareaRef}
                    className="w-full py-1 mt-1 text-sm font-light rounded no-scrollbar 
                    dark:bg-transparent border-b dark:border-b-chatDivider-dark  dark:text-secondaryText-dark  placeholder:dark:text-emptyEvent-dark
                    placeholder-font-light placeholder-text-sm focus:outline-none
                    resize-none"
                    placeholder="What is this chip about"
                    rows={1}
                    onInput={handleTextareaChange}
                    value={chipData.text}
                    onChange={handleChange}
                    name="text"
                    autoComplete="off"
                  />
                  {visibleFields.location && (
                    <>
                      <div className="flex flex-row justify-between mt-4 pr-3">
                        <p className="dark:text-secondaryText-dark text-sm font-light font-inter">
                          Location
                        </p>
                        <p
                          className="dark:text-secondaryText-dark text-xs font-light underline p-1 font-inter cursor-pointer"
                          onClick={getCurrentLocation}
                        >
                          use current location
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          className="w-full py-1 mr-3 text-sm mt-1 pr-3 font-light rounded no-scrollbar dark:bg-transparent
                        border-b dark:border-b-chatDivider-dark placeholder-font-light placeholder-text-sm dark:text-secondaryText-dark
                        focus:outline-none placeholder:dark:text-emptyEvent-dark resize-none"
                          placeholder="Enter location"
                          name="location"
                          onChange={handleInputChange}
                          value={chipData.location.text}
                          autoComplete="off"
                        />
                        {suggestions.length > 0 && (
                          <img
                            src={Close}
                            alt="clear"
                            className="absolute right-1 top-4 w-3 h-3 cursor-pointer"
                            onClick={() => setSuggestions([])}
                          />
                        )}
                        {suggestions.length > 0 && (
                          <div className="absolute top-10  dark:bg-tertiaryBackground-dark text-white text-xs pr-1 mr-2 rounded-lg  w-[90%]">
                            <ul>
                              {suggestions.map((suggestion, index) => (
                                <li
                                  key={index}
                                  className="px-4 py-2  cursor-pointer"
                                  onClick={() =>
                                    handleSuggestionClick(suggestion)
                                  }
                                >
                                  <i className="text-white mr-2 fas fa-map-marker-alt"></i>
                                  {suggestion.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {chipData.document?.url && (
                    <>
                      <div className="relative mt-4 w-full rounded-lg dark:bg-chatDivider-dark cursor-pointer">
                        <div
                          className="flex flex-row items-center justify-start"
                          onClick={handleFileClick}
                        >
                          <img
                            src={documentImage}
                            alt="Document Icon"
                            className="h-14 "
                          />
                          <div className="flex flex-col ml-3">
                            <p className="dark:text-secondaryText-dark text-xs font-normal">
                              {chipData.document.name}
                            </p>
                            <p className="dark:text-emptyEvent-dark mt-1  text-xs font-light font-inter">
                              {chipData.document.pages}
                            </p>
                          </div>
                        </div>
                        <div className="absolute right-0 top-0 bg-dark rounded-full w-5 h-5 flex justify-center items-center border">
                          <img
                            src={Close}
                            alt="close"
                            className="w-4 h-4 cursor-pointer"
                            onClick={handleDocClear}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {visibleFields.link && (
                    <>
                      <p className="dark:text-secondaryText-dark text-sm font-light font-inter mt-4">
                        Link
                      </p>
                      <input
                        className="w-full py-1 mr-3 text-sm mt-1 pr-3 font-light rounded no-scrollbar dark:bg-transparent
                        border-b dark:border-b-chatDivider-dark placeholder-font-light placeholder-text-sm dark:text-secondaryText-dark
                        focus:outline-none placeholder:dark:text-emptyEvent-dark resize-none"
                        placeholder="https://"
                        name="link"
                        onChange={handleChange}
                        value={chipData.link}
                        autoComplete="off"
                      />
                    </>
                  )}
                  {visibleFields.calendar && (
                    <>
                      <p className="dark:text-secondaryText-dark text-sm font-light font-inter mt-4">
                        Calendar
                      </p>
                      <input
                        className="w-full py-1 mr-3 text-sm mt-1 pr-3 font-light rounded no-scrollbar dark:bg-transparent
                        border-b dark:border-b-chatDivider-dark placeholder-font-light placeholder-text-sm dark:text-secondaryText-dark
                        focus:outline-none placeholder:dark:text-emptyEvent-dark resize-none"
                        placeholder="Event Name"
                        name="event"
                        maxLength={30}
                        autoComplete="off"
                        onChange={handleEventChange}
                        value={chipData.date.event}
                      />
                      <div className="relative mt-3 w-full">
                        <DatePicker
                          selected={chipData.date.date}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          customInput={<ReadOnlyDateInput />}
                        />
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-primaryText-dark"
                        />
                      </div>

                      <MyTimePicker
                        chipData={chipData}
                        handleStartTimeChange={handleStartTimeChange}
                        handleEndTimeChange={handleEndTimeChange}
                      />
                    </>
                  )}
                  <div className="sm:w-[450px] w-full">
                    <ChipImages
                      imageCards={chipData.image_urls}
                      onRemoveImage={handleRemoveMedia}
                    />
                  </div>
                  <button
                    className={`w-full py-2.5 mt-5 rounded-lg ${postButtonClass} font-normal`}
                    onClick={handleSave}
                  >
                    {Chipstatus === "loading" ? "Please wait..." : "Post"}
                  </button>
                  {/* <button className={`w-full py-2.5 mt-4 rounded-full text-sm ${reservedButtonClass} font-light`} onClick={handleReserveNotes}>{Chipstatus==="loading"?"Please wait...":"Post with reserved notes"}</button> */}
                </div>
              </div>
            }
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChipsModal;