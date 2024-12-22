import React, { useState } from "react";
import DropDown from "../../../assets/icons/arrow_drop_down.svg";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="dark:bg-tertiaryBackground-dark p-4 mt-6 rounded-lg flex flex-col cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-row justify-between">
        <button className="w-full text-left  dark:text-secondaryText-dark font-normal">
          {question}
        </button>
        <img src={DropDown} alt="drop-down" />
      </div>
      {isOpen && (
        <div className="dark:text-emptyEvent-dark text-xs  mt-1 font-light font-inter ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      )}
    </div>
  );
};

const FaqsTab = () => {
  const faqs = [
    {
      question: "Question 1 comes here",
      answer: "Answer to question 1 comes here.",
    },
    {
      question: "Question 2 comes here",
      answer: "Answer to question 2 comes here.",
    },
    {
      question: "Question 3 comes here",
      answer: "Answer to question 3 comes here.",
    },
  ];
  return (
    <div className="w-full border dark:border-chatDivider-dark p-4 rounded-xl">
      <div className="dark:text-secondaryText-dark text-xl font-medium font-familjen-grotesk ">
        FAQs
      </div>
      {faqs.map((faq, index) => (
        <FaqItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FaqsTab;
