import { useLocation, useNavigate } from "react-router-dom";
import type { LocationState } from "./locationState";

export function useLocationState() {
    const location = useLocation();
    const navigate = useNavigate();
    const typedState = location.state as LocationState | null;
    
    const navigateWithState = (to: string,  nextState?: LocationState) => {
        navigate(to, { state: nextState || typedState });
    }

    return { typedState, 
            pathname: location.pathname,
            navigateWithState
     };
}