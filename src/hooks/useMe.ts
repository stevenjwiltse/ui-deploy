import { useContext } from "react";
import { MeContext } from "../context/MeContext";

export const useMe = () => {
    const context = useContext(MeContext);
    if (!context) {
        throw new Error("useMe must be used within a MeProvider");
    }

    return context;
}
