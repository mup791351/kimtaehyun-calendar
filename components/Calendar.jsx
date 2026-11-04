"use client";

import React, { useState, useMemo } from "react";

import { VENUES } from "../lib/venues";
import { CATEGORY_COLORS } from "../lib/categoryColors";

const XMark = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function Legend({ catKey, cat, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(catKey)}
      className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${isActive
        ? `${cat.color} ${catKey === 'solo' ? 'text-neutral-950 ring-4 ring-amber-300' : 'text-white'} shadow-sm ring-2 ring-offset-1 ring-neutral-300 dark:ring-neutral-600 scale-105`
        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 active:bg-neutral-200 dark:active:bg-neutral-700"
        }`}
    >
      {catKey === "etc" ? (
        <span className="text-xs leading-none">
          🎸
        </span>
      ) : (
        <img
          src={cat.icon}
          alt=""
          className={`w-4 h-4 sm:w-5 sm:h-5 object-contain ${catKey === "solo"
            ? "animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]"
            : ""
            }`}
        />
      )}
      <span>{cat.label}</span>
    </button>
  );
}

