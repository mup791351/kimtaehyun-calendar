
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function usePinnedEvent() {
  const [pinnedEventId, setPinnedEventId] = useState(null);
  const [pinnedLoaded, setPinnedLoaded] = useState(false);

  // Firebase에서 고정된 공연 불러오기
  useEffect(() => {
    const loadPinnedEvent = async () => {
      try {
        const snapshot = await getDoc(
          doc(db, "settings", "main")
        );

        if (snapshot.exists()) {
          setPinnedEventId(
            snapshot.data().pinnedEventId || null
          );
        }
      } catch (error) {
        console.error(
          "NEXT SHOW 불러오기 오류:",
          error
        );
      } finally {
        setPinnedLoaded(true);
      }
    };

    loadPinnedEvent();
  }, []);

  // 공연 고정 또는 고정 해제
  const togglePin = async (eventId) => {
    try {
      const newPinnedId =
        pinnedEventId === eventId ? null : eventId;

      await setDoc(
        doc(db, "settings", "main"),
        { pinnedEventId: newPinnedId },
        { merge: true }
      );

      setPinnedEventId(newPinnedId);

      return {
        success: true,
        pinned: newPinnedId !== null,
      };
    } catch (error) {
      console.error(
        "NEXT SHOW 저장 오류:",
        error
      );

      return { success: false };
    }
  };

  // 삭제한 공연이 고정돼 있을 때 해제
  const clearPin = async () => {
    try {
      await setDoc(
        doc(db, "settings", "main"),
        { pinnedEventId: null },
        { merge: true }
      );

      setPinnedEventId(null);
      return true;
    } catch (error) {
      console.error(
        "NEXT SHOW 해제 오류:",
        error
      );

      return false;
    }
  };

  return {
    pinnedEventId,
    pinnedLoaded,
    togglePin,
    clearPin,
  };
}
