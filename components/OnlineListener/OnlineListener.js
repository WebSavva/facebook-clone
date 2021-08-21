import { useSession } from "next-auth/client";
import { useEffect, useCallback } from "react";

function OnlineListener({children}) {
  const [{
    user: { userId: selfId },
  }] = useSession();

  const sendStatusRequest = useCallback(
    (statusValue) =>
      navigator.sendBeacon(
        `${window.location.origin}/api/users/status?user_id=${selfId}&online=${statusValue}`
      ),
    [selfId]
  );

  useEffect(() => {
    sendStatusRequest(true);
    let updateOnlineStatusTimer = setInterval(() => sendStatusRequest(true), 2 * 60 * 1e3);
    window.onunload = () => sendStatusRequest(false);
    return () => {
      window.onunload = null;
      clearInterval(updateOnlineStatusTimer);
    };
  }, [sendStatusRequest]);

  return children;
}

export default OnlineListener;
