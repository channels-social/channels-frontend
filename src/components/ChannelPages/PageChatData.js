import React, { useState, useEffect, useRef } from "react";
import Shape from "../../assets/icons/Shape.png";
import Test from "../../assets/icons/test.png";
import Smiley from "../../assets/icons/smiley.svg";

const PageChatData = () => {
  const [showReactionsSmiley, setShowReactionsSmiley] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState({});
  const reactionRef = useRef(null);
  const reactionsData = ["❤️", "😂", "👍", "🎉", "😢"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setShowReactionPicker(false);
        setShowReactionsSmiley(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseLeave = () => {
    if (showReactionPicker === false) {
      setShowReactionsSmiley(false);
    }
  };

  const handleshowReaction = () => {
    setShowReactionPicker(true);
  };

  const handleReactionClick = (reaction) => {
    setReactions((prevReactions) => {
      const newReactions = { ...prevReactions };
      if (newReactions[reaction]) {
        delete newReactions[reaction];
      } else {
        newReactions[reaction] = 1;
      }
      return newReactions;
    });
    setShowReactionPicker(false);
  };
  return (
    <div
      className="flex flex-col relative w-max"
      onMouseEnter={() => setShowReactionsSmiley(true)}
      onMouseLeave={handleMouseLeave}
      ref={reactionRef}
    >
      <div className="flex flex-row">
        <img src={Shape} alt="logo" className="rounded-full w-8 h-8" />
        <div className="flex flex-col ml-2">
          <p className="dark:text-emptyEvent-dark font-medium text-xs">
            Frog Planet <span className="font-light">12/12/24 9:01 PM</span>
          </p>
          <p className="dark:text-secondaryText-dark text-sm font-light">
            Ladies and gentlemen, we have liftoff
          </p>
          <div className="flex flex-row overflow-x-auto w-3/4">
            <img
              src={Test}
              alt="img"
              className="h-32 mt-1 rounded-md object-cover"
            />
          </div>
          <div className="flex flex-row space-x-1">
            {Object.entries(reactions).map(([reaction, count], index) => (
              <div
                key={index}
                className="flex items-center dark:bg-chatBackground-dark rounded-full p-0.5 space-x-1"
              >
                <span className="text-sm">{reaction}</span>
                {count > 1 && (
                  <span className="text-xs dark:text-secondaryText-dark pr-1">
                    {count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          {showReactionsSmiley && (
            <img
              src={Smiley}
              alt="emoji"
              className="ml-2 cursor-pointer w-6 h-6"
              onClick={handleshowReaction}
            />
          )}
          {showReactionPicker && (
            <div className="flex absolute top-6 ml-1 space-x-2 p-1  dark:bg-tertiaryBackground-dark rounded-full z-10">
              {reactionsData.map((reaction, index) => (
                <div
                  key={index}
                  onClick={() => handleReactionClick(reaction)}
                  className="flex items-center w-8 h-8 rounded-full hover:dark:bg-chatBackground-dark cursor-pointer"
                >
                  <span className="text-lg">{reaction}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <div className="flex items-center w-full my-2">
        <div className="flex-grow border border-[1] dark:border-chatDivider-dark"></div>
        <span className="mx-2 dark:text-emptyEvent-dark text-xs font-extralight">
          November 17, 2024
        </span>
        <div className="flex-grow border border-[1] dark:border-chatDivider-dark"></div>
      </div> */}
    </div>
  );
};

export default PageChatData;
