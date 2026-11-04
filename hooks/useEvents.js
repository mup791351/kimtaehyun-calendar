
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function useEvents(initialEvents) {
  const [events, setEvents] = useState(initialEvents);
  const [eventsLoaded, setEventsLoaded] = useState(false);

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

        const merged = initialEvents.filter(
          (event) => !deletedIds.has(event.id)
        );

        firebaseEventMap.forEach((firebaseEvent) => {
          const index = merged.findIndex(
            (event) => event.id === firebaseEvent.id
          );

          if (index !== -1) {
            merged[index] = firebaseEvent;
          } else {
            merged.push(firebaseEvent);
          }
        });

        setEvents(merged);
      } catch (error) {
        console.error("Firebase 일정 불러오기 오류:", error);

        const saved = localStorage.getItem("taehyun_events_final_v8");

        if (saved) {
          try {
            setEvents(JSON.parse(saved));
          } catch {
            setEvents(initialEvents);
          }
        } else {
          setEvents(initialEvents);
        }
      } finally {
        setEventsLoaded(true);
      }
    };

    loadEventsFromFirebase();
  }, [initialEvents]);

  useEffect(() => {
    if (!eventsLoaded) return;

    localStorage.setItem(
      "taehyun_events_final_v8",
      JSON.stringify(events)
    );
  }, [events, eventsLoaded]);

  return { events, setEvents, eventsLoaded };
}
