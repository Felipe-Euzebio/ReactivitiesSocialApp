import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";

// Create a new interface for the stores
interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
}

// These are the stores that will be passed to the Provider via the value prop in the App.tsx file.
// The Provider will be used to wrap the entire application so that all components can access the store.
export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore()
};

// Create a new context for the store
// This will be used to access the store from any component
export const StoreContext = createContext(store);

// Create a custom hook to access the store
export function useStore() {
    return useContext(StoreContext);
}