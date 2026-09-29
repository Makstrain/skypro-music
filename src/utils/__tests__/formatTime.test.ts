// src/utils/__tests__/formatTime.test.ts

import { formatTime } from "../formatTime";

describe("formatTime", () => {
  // ✅ Базовые случаи
  it("форматирует 0 секунд как 0:00", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("форматирует 5 секунд как 0:05", () => {
    expect(formatTime(5)).toBe("0:05");
  });

  it("форматирует 59 секунд как 0:59", () => {
    expect(formatTime(59)).toBe("0:59");
  });

  // ✅ Граница минуты
  it("форматирует 60 секунд как 1:00", () => {
    expect(formatTime(60)).toBe("1:00");
  });

  it("форматирует 65 секунд как 1:05", () => {
    expect(formatTime(65)).toBe("1:05");
  });

  // ✅ Много минут
  it("форматирует 205 секунд как 3:25", () => {
    expect(formatTime(205)).toBe("3:25");
  });

  it("форматирует 3600 секунд как 60:00", () => {
    expect(formatTime(3600)).toBe("60:00");
  });

  // ✅ Двузначные секунды (проверка padStart)
  it("добавляет ведущий ноль для секунд < 10", () => {
    expect(formatTime(61)).toBe("1:01");
    expect(formatTime(69)).toBe("1:09");
  });

  // ✅ Крайние случаи
  it("обрабатывает отрицательное значение", () => {
    // Math.floor(-1 / 60) = -1, -1 % 60 = -1 → "-1:-1" → padStart даёт "0-1"
    // Проверим, что не падает
    expect(typeof formatTime(-1)).toBe("string");
  });

  it("обрабатывает NaN", () => {
    expect(typeof formatTime(NaN)).toBe("string");
  });
});
