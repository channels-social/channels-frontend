import { React, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";
import { postRequestUnAuthenticated } from "./../../services/rest";
import ProfileIcon from "../../assets/icons/profile.svg";
import { useNavigate } from "react-router-dom";

const MySubscribersModal = () => {
  const isOpen = useSelector((state) => state.modals.modalMySubscribersOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileId = useSelector((state) => state.modals.profileId);

  const [error, setError] = useState();
  const [subscribers, setSubscribers] = useState([]);

  const handleClose = () => {
    setSubscribers([]);
    dispatch(closeModal("modalMySubscribersOpen"));
  };

  useEffect(() => {
    if (isOpen) {
      fetchMySubscribers();
    }
  }, [isOpen]);

  const fetchMySubscribers = async () => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/my/subscribers",
        { user_id: profileId }
      );
      if (response.success) {
        setSubscribers(response.subscribers);
      } else {
        setError("No Subscribers found!.");
      }
    } catch (error) {
      setError("No Subscribers found!.");
    }
  };

  const handleNavigateSubscribers = (username) => {
    navigate(`/profile/${username}`);
    dispatch(closeModal("modalMySubscribersOpen"));
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-chipBackground rounded-xl overflow-hidden shadow-xl custom-scrollbar overflow-y-auto transform transition-all min-h-[20%] max-h-[60%]  w-[85%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-lg font-normal font-inter">
                  My Subscribers
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mt-4">
                {subscribers?.map((subs, index) => (
                  <div key={index} className="flex flex-col mb-4">
                    <div
                      className={`flex flex-row items-center cursor-pointer `}
                      onClick={() => handleNavigateSubscribers(subs.username)}
                    >
                      <img
                        src={
                          !subs.logo || subs.logo === "" || subs.logo === null
                            ? ProfileIcon
                            : subs.logo
                        }
                        alt="logo"
                        className="w-12 h-12 rounded-full"
                      />
                      <p className="md:ml-3 ml-2 text-white text-sm font-normal xs:tracking-wide">
                        {subs.name}
                      </p>
                    </div>
                    <div className="w-full mt-2 border-t border-borderColor"></div>
                  </div>
                ))}
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MySubscribersModal;
