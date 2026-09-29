// src/components/LikeButton/__tests__/LikeButton.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeButton } from "../LikeButton";
import { useLikeTrack } from "@/hooks/useLikeTrack";
import { type Track } from "@/data/data";

// ============================================
// МОК хука useLikeTrack
// ============================================

jest.mock("@/hooks/useLikeTrack");

const mockUseLikeTrack = useLikeTrack as jest.MockedFunction<
  typeof useLikeTrack
>;

// ============================================
// МОК-трек
// ============================================

const mockTrack: Track = {
  _id: 1,
  name: "Test Track",
  author: "Test Author",
  release_date: "2020-01-01",
  genre: ["Рок"],
  duration_in_seconds: 200,
  album: "Test Album",
  logo: null,
  track_file: "test.mp3",
  stared_user: [],
};

// ============================================
// ТЕСТЫ
// ============================================

describe("LikeButton", () => {
  const defaultMock = {
    isLoading: false,
    errorMsg: null,
    toggleLike: jest.fn(),
    isLike: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLikeTrack.mockReturnValue(defaultMock);
  });

  it("рендерит кнопку", () => {
    render(<LikeButton track={mockTrack} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("не имеет класс liked, если лайк не поставлен", () => {
    render(<LikeButton track={mockTrack} />);
    const button = screen.getByRole("button");
    expect(button.className).not.toMatch(/liked/);
  });

  it("имеет класс liked, если лайк поставлен", () => {
    mockUseLikeTrack.mockReturnValue({
      ...defaultMock,
      isLike: true,
    });

    render(<LikeButton track={mockTrack} />);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/liked/);
  });

  it("вызывает toggleLike при клике", async () => {
    const toggleLike = jest.fn();
    mockUseLikeTrack.mockReturnValue({
      ...defaultMock,
      toggleLike,
    });

    render(<LikeButton track={mockTrack} />);
    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(toggleLike).toHaveBeenCalledTimes(1);
  });

  it("показывает тултип, если есть errorMsg", () => {
    mockUseLikeTrack.mockReturnValue({
      ...defaultMock,
      errorMsg: "Войдите, чтобы ставить лайки",
    });

    render(<LikeButton track={mockTrack} />);

    expect(
      screen.getByText("Войдите, чтобы ставить лайки"),
    ).toBeInTheDocument();
  });

  it("не показывает тултип, если errorMsg отсутствует", () => {
    render(<LikeButton track={mockTrack} />);
    expect(
      screen.queryByText("Войдите, чтобы ставить лайки"),
    ).not.toBeInTheDocument();
  });

  it("делает кнопку disabled при isLoading", () => {
    mockUseLikeTrack.mockReturnValue({
      ...defaultMock,
      isLoading: true,
    });

    render(<LikeButton track={mockTrack} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("не делает кнопку disabled, если не isLoading", () => {
    render(<LikeButton track={mockTrack} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("применяет класс small по умолчанию", () => {
    render(<LikeButton track={mockTrack} />);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/small/);
  });

  it("применяет класс large при size='large'", () => {
    render(<LikeButton track={mockTrack} size="large" />);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/large/);
  });
});