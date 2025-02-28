import React from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Upload from "../../../assets/icons/Upload.svg";
import Unsplash from "../../../assets/icons/Unsplash.svg";
import Close from "../../../assets/icons/Close.svg";
import DragDrop from "../../../assets/icons/dragdrop.png";

const DisplayCards = ({
  onUnsplashClick,
  handleImagesUpload,
  handleRemoveImageCard,
  onReorderImageCards,
}) => {
  const imageCards = useSelector((state) => state.imageCards);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedCards = Array.from(imageCards);
    const [reorderedItem] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, reorderedItem);
    onReorderImageCards(reorderedCards);
  };

  return (
    <div className="flex flex-col -ml-3 mt-3 -mr-2">
      <p className="text-sm font-normal font-inter dark:text-secondaryText-dark">
        Add hero image to your webpage
      </p>
      <p className="dark:text-emptyEvent-dark text-xs font-inter mt-1">
        You can add up-to 5 images
      </p>

      <div className="flex flex-row mt-3">
        <div className="relative  dark:bg-chatDivider-dark px-6 py-5 rounded-xl cursor-pointer z-10">
          <div className="flex flex-row items-center">
            <img src={Upload} alt="Upload" className="w-5 h-5 mr-1" />
            <p className="dark:text-secondaryText-dark text-xs font-light font-inter">
              Upload image
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImagesUpload}
          />
        </div>

        <div
          className="relative dark:bg-chatDivider-dark px-4 py-5 rounded-xl ml-4 cursor-pointer z-20"
          onClick={onUnsplashClick}
        >
          <div className="flex flex-row items-center">
            <img src={Unsplash} alt="Unsplash" className="w-5 h-5 mr-2" />
            <p className="dark:text-secondaryText-dark text-xs font-light font-inter">
              Select from Unsplash
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow h-full mt-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="imageCards">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {imageCards.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative flex items-center space-x-2"
                      >
                        <img
                          src={DragDrop}
                          alt={image.url}
                          className="w-6 h-6 cursor-pointer"
                          {...provided.dragHandleProps}
                        />
                        <img
                          src={image.url}
                          alt={`Uploaded ${index}`}
                          className="w-full h-44 object-cover rounded-lg"
                        />
                        <div
                          className="absolute top-1 right-1 py-1 px-1 text-white bg-dark rounded-full"
                          onClick={() => handleRemoveImageCard(image.id)}
                        >
                          <img
                            src={Close}
                            alt="close-icon"
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                      </div>
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
  );
};

export default DisplayCards;
