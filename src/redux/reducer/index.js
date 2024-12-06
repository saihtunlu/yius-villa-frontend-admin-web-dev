import { combineReducers } from "redux";
import store from "./store";
import category from "./category";
import payment from "./payment";
import auth from "./auth";
import data from "./data";
import images from "./images";
import invoiceSetting from "./invoiceSetting";
import packingSlipSetting from "./packingSlipSetting";
import locations from "./locations";
import sidebar from "./sidebar";
import themeMode from "./themeMode";
import user from "./user";


export default combineReducers({
    store,
    category,
    payment,
    auth,
    data,
    images,
    invoiceSetting,
    packingSlipSetting,
    locations,
    sidebar,
    themeMode,
    user
});
