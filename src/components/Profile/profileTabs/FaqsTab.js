import React, { useState, useEffect, useRef } from "react";
import DropDown from "../../../assets/icons/arrow_drop_down.svg";
import DropUp from "../../../assets/icons/arrow_drop_up.svg";
import FAQCover from "../../../assets/images/Faq_empty_state.svg";
import AddIcon from "../../../assets/icons/addIcon.svg";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragDrop from "../../../assets/icons/dragdrop.png";
import Dots from "../../../assets/icons/three_dots.svg";
import Edit from "../../../assets/icons/Edit.svg";
import Delete from "../../../assets/icons/Delete.svg";

import {
  setFaqData,
  createFaq,
  clearFaqData,
  fetchFaqs,
  updateFaqsOrder,
  updateReorderItems,
  clearReorderItems,
  updateFaq,
} from "../../../redux/slices/faqsSlice";
import { useDispatch, useSelector } from "react-redux";
import useModal from "./../../hooks/ModalHook";

const FaqItem = ({
  id,
  question,
  answer,
  index,
  isReorder,
  provided,
  toggleEditFaq,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  const toggleDropdown = (id) => {
    // if (isDropdownOpen === id) {
    //   setIsDropdownOpen(null);
    // } else {
    setIsDropdownOpen(id);
    // }
  };
  const handleDeleteFaq = (id) => {
    dispatch(setFaqData({ field: "faq_id", value: id }));
    handleOpenModal("modalFaqDeleteOpen");
  };
  const handleEditFaq = (id, question, answer) => {
    setIsDropdownOpen(!isDropdownOpen);

    dispatch(setFaqData({ field: "question", value: question }));
    dispatch(setFaqData({ field: "answer", value: answer }));
    dispatch(setFaqData({ field: "faq_id", value: id }));
    toggleEditFaq();
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="flex flex-row items-center"
    >
      {isReorder && (
        <img
          src={DragDrop}
          alt="drag-drop"
          className="w-6 h-5 flex-shrink-0 mr-3 mt-3"
          {...provided.dragHandleProps}
        />
      )}
      <div
        className="dark:bg-tertiaryBackground-dark p-4 mt-6 rounded-lg flex flex-col cursor-pointer w-full"
        onClick={handleClickOutside}
      >
        <div className="flex flex-row relative  items-center justify-start">
          <img
            src={Dots}
            alt="dots"
            className="w-6 h-6 mr-2"
            onClick={() => toggleDropdown(id)}
          />
          {isDropdownOpen === id && (
            <div
              ref={dropdownRef}
              className="absolute top-6 left-0 mt-1 ml-3 w-28 rounded-md shadow-lg border  dark:border-chatDivider-dark
             dark:bg-tertiaryBackground-dark ring-1 ring-black ring-opacity-5 z-50"
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="flex flex-row px-3 items-center">
                  <img src={Edit} alt="edit" className="w-4 h-4" />
                  <p
                    className="block font-light px-2 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                    role="menuitem"
                    onClick={() => handleEditFaq(id, question, answer)}
                  >
                    Edit
                  </p>
                </div>
                <div
                  className="flex flex-row px-3 items-center"
                  onClick={() => handleDeleteFaq(id)}
                >
                  <img src={Delete} alt="edit" className="w-4 h-4" />
                  <p
                    className="block px-2 py-2 font-light text-sm   dark:text-secondaryText-dark cursor-pointer"
                    role="menuitem"
                  >
                    Delete
                  </p>
                </div>
              </div>
            </div>
          )}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-row justify-between w-full"
          >
            <button className="w-full text-left dark:text-secondaryText-dark font-normal">
              {question}
            </button>
            <img src={isOpen ? DropUp : DropDown} alt="drop-down" />
          </div>
        </div>
        {isOpen && (
          <div className="dark:text-emptyEvent-dark text-sm mt-2 font-light font-inter ml-8">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};

const FaqsTab = ({ username }) => {
  const [isCreateFaq, setIsCreateFaq] = useState(false);
  const [isReorder, setIsReorder] = useState(false);
  const [isEditFaq, setIsEditFaq] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const Faq = useSelector((state) => state.faqs);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const { faqs: initialFaqs, status } = useSelector((state) => state.faqs);
  const [items, setItems] = useState(initialFaqs);

  // useEffect(() => {
  //   dispatch(fetchFaqs(username));
  // }, [dispatch, username]);

  useEffect(() => {
    if (initialFaqs.length === 0) {
      dispatch(fetchFaqs(username));
    }
  }, [dispatch, username, initialFaqs.length]);

  useEffect(() => {
    if (items.length !== initialFaqs.length) {
      setItems(initialFaqs);
    }
  }, [initialFaqs, items.length]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    dispatch(updateReorderItems(newItems));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFaqData({ field: name, value: value }));
  };

  const handleResizeChange = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    handleChange(event);
  };

  const toggleCreateFaq = () => {
    setIsCreateFaq(true);
  };
  const toggleEditFaq = () => {
    setIsEditFaq(true);
  };
  const closeFaq = () => {
    setIsCreateFaq(false);
    setIsEditFaq(false);
    dispatch(setFaqData({ field: "question", value: "" }));
    dispatch(setFaqData({ field: "", value: "" }));
  };
  const handleSaveReorder = () => {
    const items = Faq.reorderItems;
    if (items.length > 0) {
      dispatch(updateFaqsOrder(items))
        .unwrap()
        .then(() => {
          setIsReorder(false);
          dispatch(clearReorderItems());
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      setIsReorder(false);
    }
  };

  const handleCreateFaq = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("question", Faq.question);
    formDataToSend.append("answer", Faq.answer);
    dispatch(createFaq(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearFaqData());
        closeFaq();
      })
      .catch((error) => {
        alert(error);
      });
  };
  const handleEditFaq = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("question", Faq.question);
    formDataToSend.append("answer", Faq.answer);
    formDataToSend.append("_id", Faq.faq_id);
    dispatch(updateFaq(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearFaqData());
        closeFaq();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const postButtonClass =
    Faq.question === "" || Faq.answer === ""
      ? "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
      : "dark:bg-buttonEnable-dark dark:text-secondaryText-dark";

  if (status === "loading") {
    return (
      <div className="dark:text-primaryText-dark text-md font-normal mt-12 items-center flex justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col" onClick={handleClickOutside}>
      {items.length > 0 &&
        isReorder === false &&
        isEditFaq === false &&
        isLoggedIn &&
        !isCreateFaq && (
          <div className="flex flex-row justify-between items-center mt-2 mb-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleCreateFaq}
            >
              <div className="rounded-lg mr-1 flex dark:bg-tertiaryBackground-dark p-1  justify-center items-center">
                <img
                  src={AddIcon}
                  alt="Add"
                  className="w-4 h-4 dark:text-secondaryText-dark"
                />
              </div>
              <p className="dark:text-emptyEvent-dark font-light text-sm ">
                Create new
              </p>
            </div>
            <div
              className="flex flex-col space-y-1 cursor-pointer text-sm font-light dark:text-emptyEvent-dark"
              onClick={() => setIsReorder(true)}
            >
              Reorder
            </div>
          </div>
        )}
      {isReorder && (
        <div className="flex flex-row justify-between items-center mt-2 mb-4">
          <div
            className="rounded-md text-sm  dark:bg-buttonEnable-dark cursor-pointer dark:text-secondaryText-dark px-4 py-1"
            onClick={handleSaveReorder}
          >
            Save
          </div>
          <div
            className="space-y-1 cursor-pointer underline text-sm font-light dark:text-emptyEvent-dark"
            onClick={() => setIsReorder(false)}
          >
            Cancel
          </div>
        </div>
      )}
      <div className="w-full border dark:border-chatDivider-dark p-4 rounded-xl ">
        <div className="dark:text-secondaryText-dark text-xl font-medium font-familjen-grotesk ">
          FAQs
        </div>
        {items.length === 0 && isLoggedIn ? (
          <div className="rounded-lg dark:bg-chatDivider-dark p-4 flex flex-row mt-2">
            <img src={FAQCover} alt="faq_cover" className="h-28 w-auto" />
            <div className="flex flex-col ml-3 justify-between">
              <p className="dark:text-secondaryText-dark text-xs font-light font-inter">
                Everyone could use a little more clarity!
                <br />
                Add a set of Frequently Asked Questions (FAQs) about your brand
                or community to provide quick, straightforward answers to common
                queries. Whether it's about what you do, who you are, or how
                people can engage, FAQs are a great way to help others
                understand and connect with your vision effortlessly.
              </p>
              <div
                className="mt-2 border dark:border-primaryText-dark dark:text-secondaryText-dark  w-max rounded-md
           px-2 py-1.5 text-xs font-light cursor-pointer"
                onClick={toggleCreateFaq}
              >
                Create first FAQ
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center dark:text-secondaryText-dark">
            No Faqs Found.
          </div>
        ) : null}
        {(isCreateFaq || isEditFaq) && (
          <div className="dark:bg-tertiaryBackground-dark rounded-lg px-5 py-3 flex flex-col mt-6">
            <input
              id="question"
              className="w-full mt-3 p-1 rounded bg-chipBackground 
                   placeholder:font-light placeholder:text-sm text-sm font-light
                   focus:outline-none dark:bg-transparent border-b dark:border-b-chatDivider-dark  dark:text-secondaryText-dark  placeholder:dark:text-emptyEvent-dark"
              type="text"
              name="question"
              value={Faq.question}
              onChange={handleChange}
              placeholder="Enter question here"
              autoComplete="off"
            />
            <textarea
              id="answer"
              className="w-full mt-4 p-1 rounded bg-chipBackground 
                   placeholder:font-light placeholder:text-sm text-sm font-light
                   focus:outline-none dark:bg-transparent border-b dark:border-b-chatDivider-dark  dark:text-secondaryText-dark  placeholder:dark:text-emptyEvent-dark"
              type="text"
              name="answer"
              value={Faq.answer}
              rows="1"
              onChange={handleResizeChange}
              placeholder="Write the answer"
              autoComplete="off"
            />
            <div className="justify-end flex flex-row mt-6 space-x-6">
              <div
                className={`${postButtonClass} 
          text-sm font-normal py-2 px-10 rounded-md cursor-pointer`}
                onClick={isEditFaq ? handleEditFaq : handleCreateFaq}
              >
                Save
              </div>
              <div
                className="border rounded-md dark:border-primaryText-dark dark:text-secondaryText-dark cursor-pointer
              text-sm font-normal py-2 px-6"
                onClick={closeFaq}
              >
                Discard
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="faqs">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((faq, index) => (
                    <Draggable
                      key={faq._id}
                      draggableId={faq._id}
                      index={index}
                    >
                      {(provided) => (
                        <FaqItem
                          id={faq._id}
                          question={faq.question}
                          answer={faq.answer}
                          index={index}
                          isReorder={isReorder}
                          provided={provided}
                          toggleEditFaq={toggleEditFaq}
                          dropdownRef={dropdownRef}
                          isDropdownOpen={isDropdownOpen}
                          setIsDropdownOpen={setIsDropdownOpen}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default FaqsTab;
