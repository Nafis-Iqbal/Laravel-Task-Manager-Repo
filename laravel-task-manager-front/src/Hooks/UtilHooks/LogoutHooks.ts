import { useAuthDispatch } from "../StateHooks";
import { logout } from "../../ContextAPIs/AuthSlice";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const dispatch = useAuthDispatch(); // ✅ Call inside another hook
    const navigate = useNavigate();

    return () => {
      dispatch(logout());
      navigate("/");
    };
};

export default useLogout;