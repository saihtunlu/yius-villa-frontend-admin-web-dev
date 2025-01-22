import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from './slices/auth';
import imagesReducer from './slices/images';
import badgeReducer from './slices/badge';
import paymentMethodReducer from './slices/paymentMethod';
import storeReducer from './slices/store';
import websitePaymentMethodReducer from './slices/websitePaymentMethod';
import websiteContactReducer from './slices/websiteContact';
import deliveryReducer from './slices/delivery';
import deliveryPickupReducer from './slices/deliveryPickup';
import couponReducer from './slices/coupon';
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,
  images: imagesReducer,
  badge: badgeReducer,
  paymentMethod: paymentMethodReducer,
  store: storeReducer,
  websitePaymentMethod: websitePaymentMethodReducer,
  websiteContact: websiteContactReducer,
  delivery: deliveryReducer,
  deliveryPickup: deliveryPickupReducer,
  coupon: couponReducer,
});

export { rootPersistConfig, rootReducer };
