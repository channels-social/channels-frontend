import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import embedAuthReducer from "../../components/EmbedChannels/embedSlices/embedAuthSlice";

const embedReducer = {
  ...rootReducer,
  auth: embedAuthReducer,
};

const embedStore = configureStore({
  reducer: embedReducer,
});

export default embedStore;
