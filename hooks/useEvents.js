
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  // Firebase에서 일정 불러오기
  useEffect(() => {
    const loadEventsFromFirebase = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));

        const deletedIds = new Set(
          snapshot.docs
            .filter((docSnap) => docSnap.data().deleted === true)
            .map((docSnap) => docSnap.data().id || docSnap.id)
        );

        const firebaseEventMap = new Map();

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const logicalId = data.id || docSnap.id;

          if (!data.date || deletedIds.has(logicalId)) return;

          const event = { ...data, id: logicalId };
          const existing = firebaseEventMap.get(logicalId);

          if (!existing || docSnap.id === logicalId) {
            firebaseEventMap.set(logicalId, event);
          }
        });

        setEvents(Array.from(firebaseEventMap.values()));
      } catch (error) {
        console.error("Firebase 일정 불러오기 오류:", error);

        // Firebase 오류 시 기존 캐시 사용
        const saved = localStorage.getItem("taehyun_events_final_v8");

        if (saved) {
          try {
            setEvents(JSON.parse(saved));
          } catch {
            setEvents([]);
          }
        } else {
          setEvents([]);
        }
      } finally {
        setEventsLoaded(true);
      }
    };

    loadEventsFromFirebase();
  }, []);

  // 일정 캐시 저장
  useEffect(() => {
    if (!eventsLoaded) return;

    localStorage.setItem(
      "taehyun_events_final_v8",
      JSON.stringify(events)
    );
  }, [events, eventsLoaded]);

  // 일정 추가
  const addEvent = async (newEvt) => {
    try {
      await setDoc(doc(db, "events", newEvt.id), newEvt);

      setEvents((prev) => {
        const exists = prev.some((e) => e.id === newEvt.id);

        if (exists) {
          return prev.map((e) =>
            e.id === newEvt.id ? newEvt : e
          );
        }

        return [newEvt, ...prev];
      });

      return true;
    } catch (error) {
      console.error("Firebase 저장 오류:", error);
      return false;
    }
  };

  // 일정 수정
  const updateEvent = async (updatedEvt) => {
    try {
      await setDoc(
        doc(db, "events", updatedEvt.id),
        updatedEvt
      );

      setEvents((prev) =>
        prev.map((e) =>
          e.id === updatedEvt.id ? updatedEvt : e
        )
      );

      return true;
    } catch (error) {
      console.error("Firebase 수정 오류:", error);
      return false;
    }
  };

  // 일정 삭제
  const deleteEvent = async (eventId) => {
    try {
      const q = query(
        collection(db, "events"),
        where("id", "==", eventId)
      );

      const snapshot = await getDocs(q);

      for (const document of snapshot.docs) {
        if (document.id !== eventId) {
          await deleteDoc(document.ref);
        }
      }

      await setDoc(doc(db, "events", eventId), {
        id: eventId,
        deleted: true,
        deletedAt: new Date().toISOString(),
      });

      setEvents((prev) =>
        prev.filter((e) => e.id !== eventId)
      );

      return true;
    } catch (error) {
      console.error("Firebase 삭제 오류:", error);
      return false;
    }
  };

  return {
    events,
    setEvents,
    eventsLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
