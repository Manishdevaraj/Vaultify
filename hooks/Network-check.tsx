"use client";
import { useEffect, useState } from "react";

const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(true);
  
    useEffect(() => {
      const updateOnlineStatus = () => {
        setIsOnline(navigator.onLine);
      };
  
      // Add event listeners for online/offline changes
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
  
      // Initial check
      updateOnlineStatus();
  
      // Cleanup listeners on unmount
      return () => {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      };
    }, []);
  
    return isOnline;
  };
  
  export default useNetworkStatus;