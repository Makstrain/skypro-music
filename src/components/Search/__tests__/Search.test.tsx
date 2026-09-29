// src/components/Search/__tests__/Search.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "../Search";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/tracksSlice";

// ============================================
// МОК Redux хуков
// ============================================

jest.mock("@/store/hooks");

const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>;
const mockUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;

// ============================================
// ТЕСТЫ
// ============================================

describe("Search", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseAppSelector.mockReturnValue("");
  });

  // ============================================
  // 1. Рендер
  // ============================================

  it("рендерит input с placeholder 'Поиск'", () => {
    render(<Search />);
    expect(screen.getByPlaceholderText("Поиск")).toBeInTheDocument();
  });

  it("рендерит иконку поиска (svg)", () => {
    const { container } = render(<Search />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  // ============================================
  // 2. Значение из Redux
  // ============================================

  it("отображает значение из Redux", () => {
    mockUseAppSelector.mockReturnValue("test query");

    render(<Search />);
    const input = screen.getByPlaceholderText("Поиск") as HTMLInputElement;
    expect(input.value).toBe("test query");
  });

  it("отображает пустое значение, если Redux пустой", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Поиск") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  // ============================================
  // 3. Ввод → dispatch
  // ============================================

  it("вызывает dispatch с setSearchQuery при вводе", async () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Поиск");

    await userEvent.type(input, "abc");

    // dispatch вызывается 3 раза (по букве)
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery("a"));
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery("b"));
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery("c"));
  });

  // ============================================
  // 4. Крестик появляется / исчезает
  // ============================================

  it("не показывает крестик при пустом значении", () => {
    render(<Search />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("показывает крестик при непустом значении", () => {
    mockUseAppSelector.mockReturnValue("text");

    render(<Search />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // ============================================
  // 5. Клик по крестику → очистка
  // ============================================

  it("вызывает dispatch с пустой строкой при клике на крестик", async () => {
    mockUseAppSelector.mockReturnValue("text");

    render(<Search />);
    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery(""));
  });
});
