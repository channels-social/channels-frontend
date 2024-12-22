import { React, useState } from "react";

import { useSelector } from "react-redux";
import Profile from "../../../assets/icons/profile.svg";
import ProfileTextField from "../../widgets/ProfileTextField";

const DetailsForm = ({ formData, onFieldChange, handleImageUpload }) => {
  const [charCount, setCharCount] = useState(
    formData.description ? formData.description.length : 0
  );
  const maxChars = 500;
  const isUsernameError = useSelector(
    (state) => state.profileData.usernameError
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setCharCount(value.length);
      onFieldChange(name, value);
    } else if (name === "username") {
      const regex = /^[a-z0-9]*$/;
      if (regex.test(value)) {
        onFieldChange(name, value);
      }
    } else {
      onFieldChange(name, value);
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="flex justify-start items-center">
        <div className="mt-2 w-16 h-16 relative">
          <img
            src={formData.logo ? formData.logo : Profile}
            alt=""
            className="rounded-full w-full h-full   object-cover "
            style={{ borderWidth: "2px" }}
          />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-800 bg-opacity-50 flex justify-center items-center rounded-b-full cursor-pointer">
            <span className="text-white text-sm  cursor-pointer">Add</span>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
      <form className="space-y-6 mt-5">
        <ProfileTextField
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          name="name"
        />
        <div className="flex flex-col">
          <div className="relative">
            <label className="absolute left-4 -top-2 text-xs font-light font-inter dark:bg-tertiaryBackground-dark dark:text-secondaryText-dark">
              User name
            </label>
            <input
              type="text"
              value={formData.username}
              maxLength={40}
              onChange={handleChange}
              name="username"
              className="w-full pt-3 pb-4 pl-4 pr-3  rounded-md border font-light font-inter border-profileBorder dark:bg-transparent dark:text-secondaryText-dark focus:border-primary focus:ring-0 focus:outline-none"
              placeholder=""
            />
          </div>
          {isUsernameError && (
            <p
              className={`dark:text-error-dark  font-light ml-1 font-inter text-xs`}
            >
              {formData.username === ""
                ? "Username can't be empty"
                : "Username already exist."}
            </p>
          )}
        </div>

        <ProfileTextField
          label="Contact"
          value={formData.contact}
          onChange={handleChange}
          name="contact"
        />
        <ProfileTextField
          label="Location"
          value={formData.location}
          onChange={handleChange}
          name="location"
        />

        <div className="relative">
          <label
            className="absolute left-4 -top-2 text-xs font-light font-inter
           dark:bg-tertiaryBackground-dark dark:text-secondaryText-dark"
          >
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange}
            name="description"
            maxLength={maxChars}
            className="w-full text-sm pt-4 font-inter pb-4 pl-4 pr-3 rounded-lg 
            border font-light dark:border-primaryText-dark dark:bg-transparent dark:text-secondaryText-dark focus:border-primary focus:ring-0 focus:outline-none"
            rows="4"
            placeholder=""
          />
          <div className="text-right absolute right-2 bottom-3 text-xs dark:text-primaryText-dark">
            {charCount}/{maxChars}
          </div>
        </div>
        <ProfileTextField
          label="Custom button display text"
          value={formData.customText}
          onChange={handleChange}
          name="customText"
        />
        <ProfileTextField
          label="Custom button link"
          value={formData.customUrl}
          onChange={handleChange}
          name="customUrl"
        />
        <div className="mt-1"></div>
      </form>
    </div>
  );
};

export default DetailsForm;
