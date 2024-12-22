import React, { useState, useRef, useEffect } from "react";
import MetaCard from "../chips/widgets/MetaCard";
import GoogleMapsCard from "../chips/widgets/googleMapsCard";
import DateTimeCard from "../chips/widgets/DateTime";
import Upvoted from "../../assets/icons/upvoted.svg";
import ImageList from "../chips/widgets/ImageList";
import RenderLink from "../chips/widgets/videoPlayer";
import useModal from "./../hooks/ModalHook";
import { useDispatch, useSelector } from "react-redux";
import DocumentPreview from "./widgets/DocumentPreview";
import Linkify from "react-linkify";

const NoActionChips = ({ item }) => {
  const { handleOpenModal } = useModal();
  const myData = useSelector((state) => state.myData);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link text-metaLink"
    >
      {text}
    </a>
  );

  return (
    <div className="container pl-4 pb-4 w-full pt-4 rounded-lg space-y-2.5 border border-borderColor bg-chipBackground ">
      <div className="flex flex-col space-y-2.5">
        {
          <Linkify componentDecorator={componentDecorator}>
            <p className="text-chipDesc pr-1 text-sm font-light font-inter whitespace-pre-wrap overflow-hidden overflow-wrap break-word">
              {isExpanded
                ? item.text
                : `${item.text.slice(0, maxLength)}${
                    item.text.length > maxLength ? "..." : ""
                  }`}
              {item.text.length > maxLength && (
                <span
                  onClick={toggleReadMore}
                  className="text-primary cursor-pointer ml-1"
                >
                  {isExpanded ? "<- Show Less" : "Read More ->"}
                </span>
              )}
            </p>
          </Linkify>
        }
        {item.date.date && item.date.event && <DateTimeCard item={item.date} />}
        {item.location.text && <GoogleMapsCard item={item.location} />}
        {item.document && item.document.url !== "" && (
          <div className="mr-3">
            <DocumentPreview document={item.document} />
          </div>
        )}
        {item.link && !item.metaLink?.ogTitle && <RenderLink url={item.link} />}
        {item.image_urls.length !== 0 && (
          <ImageList imageCards={item.image_urls} />
        )}
        {item.metaLink && item.metaLink?.ogTitle !== "" && (
          <MetaCard
            title={item.metaLink.ogTitle}
            description={item.metaLink.ogDescription}
            imageUrl={item.metaLink.ogImage}
            link={item.link}
          />
        )}
      </div>
    </div>
  );
};

export default NoActionChips;
