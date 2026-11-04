
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AdminModal from "../../components/AdminModal";
import useEvents from "../../hooks/useEvents";
import usePinnedEvent from "../../hooks/usePinnedEvent";

export default function AdminPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const {
    events,
    eventsLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const {
    pinnedEventId,
    togglePin,
    clearPin,
  } = usePinnedEvent();

  const showMessage = (text) => {
    setMessage(text);
  };

  const handleAddEvent = async (event) => {
    const success = await addEvent(event);

    showMessage(
      success
        ? "일정이 추가되었습니다."
        : "일정 추가에 실패했습니다."
    );
  };

  const handleUpdateEvent = async (event) => {
    const success = await updateEvent(event);

    showMessage(
      success
        ? "일정이 수정되었습니다."
        : "일정 수정에 실패했습니다."
    );
  };

  const handleDeleteEvent = async (eventId) => {
    const success = await deleteEvent(eventId);

    if (!success) {
      showMessage("일정 삭제에 실패했습니다.");
      return;
    }

    if (pinnedEventId === eventId) {
      const cleared = await clearPin();

      if (!cleared) {
        showMessage(
          "일정은 삭제됐지만 NEXT SHOW 고정 해제에 실패했습니다."
        );
        return;
      }
    }

    showMessage("일정이 삭제되었습니다.");
  };

  const handleTogglePin = async (eventId) => {
    const result = await togglePin(eventId);

    showMessage(
      result.success
        ? result.pinned
          ? "NEXT SHOW로 고정했습니다."
          : "NEXT SHOW 고정을 해제했습니다."
        : "NEXT SHOW 변경에 실패했습니다."
    );
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white p-4">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-neutral-400 mb-1">
              KIM TAEHYUN
            </p>
            <h1 className="text-2xl font-bold">
              일정 관리
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-neutral-400 hover:text-white"
          >
            사이트로 돌아가기
          </button>
        </div>

        {message && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-neutral-700 p-3 text-sm"
          >
            {message}
          </p>
        )}

        {!eventsLoaded && (
          <p className="text-sm text-neutral-400">
            일정 불러오는 중...
          </p>
        )}

        <AdminModal
          standalone
          isOpen={eventsLoaded}
          onClose={() => router.push("/")}
          events={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          pinnedEventId={pinnedEventId}
          onTogglePin={handleTogglePin}
        />
      </div>
    </main>
  );
}
