import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { userContext } from "../../providers/UserProvider";
import { CircularProgress } from "@mui/material";

export default function Auth() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { getUser, user } = useContext(userContext);

  useEffect(() => {
    window.localStorage.setItem("token", token);
    token && getUser();
  }, []);

  useEffect(() => {
    user && navigate("/");
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "90vh",
        alignItems: "center",
      }}
    >
      <CircularProgress size="100px" />
    </div>
  );
}
