import { useEffect } from "react";
import Loader from "../HomeCompontent/Loader";

const LeadsGateway = () => {
  useEffect(() => {
    window.location.replace("/leads/");
  }, []);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </div>
  );
};

export default LeadsGateway;
