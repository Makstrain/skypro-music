// src/components/CenterBlock/__tests__/CenterBlock.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { CenterBlock } from "../CenterBlock";
import { type Track } from "@/data/data";

// ============================================
// МОКИ
// ============================================

// ✅ Мок tracksSlice — сохраняем reducer, мокаем thunk'и
jest.mock("@/store/slices/tracksSlice", () => {
  const actual = jest.requireActual("@/store/slices/tracksSlice");
  return {
    ...actual,
    __esModule: true,
    default: actual.default,
    fetchTracks: jest.fn(() => ({ type: "mock/fetchTracks" })),
    fetchFavorites: jest.fn(() => ({ type: "mock/fetchFavorites" })),
  };
});

// ✅ Импорты reducer'ов ПОСЛЕ мока
import tracksReducer from "@/store/slices/tracksSlice";
import authReducer from "@/store/slices/authSlice";
import playerReducer from "@/store/slices/playerSlice";

// Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/music/main",
}));

// API
jest.mock("@/api/tracks", () => ({
  getTracks: jest.fn(() => Promise.resolve([])),
}));

jest.mock("@/api/favorites", () => ({
  getFavorites: jest.fn(() => Promise.resolve([])),
}));

// withReauth
jest.mock("@/utils/withReauth", () => ({
  withReauth: jest.fn((fn) => fn("")),
}));

// LikeButton
jest.mock("@/components/LikeButton/LikeButton", () => ({
  LikeButton: () => <button data-testid="like-button">Like</button>,
}));

// ============================================
// МОК-ТРЕКИ
// ============================================

const mockTrack1: Track = {
  _id: 1,
  name: "Guilt",
  author: "Nero",
  release_date: "2020-01-01",
  genre: ["Рок"],
  duration_in_seconds: 200,
  album: "Welcome Reality",
  logo: null,
  track_file: "test1.mp3",
  stared_user: [],
};

const mockTrack2: Track = {
  _id: 2,
  name: "Elektro",
  author: "Dynoro",
  release_date: "2019-01-01",
  genre: ["Электро"],
  duration_in_seconds: 150,
  album: "Elektro",
  logo: null,
  track_file: "test2.mp3",
  stared_user: [],
};

// ============================================
// ХЕЛПЕРЫ
// ============================================

const createTestStore = (preloadedState?: any) =>
  configureStore({
    reducer: {
      tracks: tracksReducer,
      auth: authReducer,
      player: playerReducer,
    },
    preloadedState: {
      tracks: {
        items: [],
        loading: false,
        error: null,
        searchQuery: "",
        favoriteTracks: [],
        favoritesLoading: false,
        favoritesError: null,
        favoritesLoaded: true,
        selectedAuthors: [],
        selectedGenres: [],
        sortBy: "default",
        ...preloadedState?.tracks,
      },
      auth: {
        user: null,
        access: null,
        refresh: null,
        loading: false,
        error: null,
        ...preloadedState?.auth,
      },
      player: {
        currentTrack: null,
        isPlaying: false,
        volume: 50,
        currentTime: 0,
        duration: 0,
        playlist: [],
        currentIndex: -1,
        isShuffle: false,
        isRepeat: false,
        ...preloadedState?.player,
      },
    },
  });

const renderWithStore = (ui: React.ReactElement, preloadedState?: any) => {
  const store = createTestStore(preloadedState);
  return render(<Provider store={store}>{ui}</Provider>);
};

// ============================================
// ТЕСТЫ
// ============================================

describe("CenterBlock", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит заголовок "Треки" по умолчанию', () => {
    renderWithStore(<CenterBlock initialTracks={[mockTrack1]} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Треки",
    );
  });

  it("рендерит заголовок из props", () => {
    renderWithStore(
      <CenterBlock initialTracks={[mockTrack1]} title="Мои треки" />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Мои треки",
    );
  });

  it("рендерит список треков", () => {
    renderWithStore(<CenterBlock initialTracks={[mockTrack1, mockTrack2]} />);

    expect(screen.getByText("Guilt")).toBeInTheDocument();
    expect(screen.getByText("Nero")).toBeInTheDocument();
    expect(screen.getAllByText("Elektro").length).toBeGreaterThan(0);
    expect(screen.getByText("Dynoro")).toBeInTheDocument();
  });

  it("рендерит правильное количество LikeButton", () => {
    renderWithStore(<CenterBlock initialTracks={[mockTrack1, mockTrack2]} />);

    expect(screen.getAllByTestId("like-button")).toHaveLength(2);
  });

  it("показывает 'Нет подходящих треков' при пустом результате", () => {
    renderWithStore(<CenterBlock initialTracks={[]} />);

    expect(screen.getByText("Нет подходящих треков")).toBeInTheDocument();
  });

  it("рендерит скелетон при isLoading", () => {
    const { container } = renderWithStore(
      <CenterBlock initialTracks={[]} isLoading={true} />,
    );

    const skeletons = container.querySelectorAll('[class*="skeletonItem"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("не рендерит список при isLoading", () => {
    renderWithStore(
      <CenterBlock initialTracks={[mockTrack1]} isLoading={true} />,
    );

    expect(screen.queryByText("Guilt")).not.toBeInTheDocument();
  });

  it("рендерит ошибку при error из Redux", () => {
    renderWithStore(<CenterBlock />, {
      tracks: {
        error: "Ошибка загрузки",
      },
    });

    expect(screen.getByText("Что-то пошло не так")).toBeInTheDocument();
    expect(screen.getByText("Ошибка загрузки")).toBeInTheDocument();
  });

  it("клик по треку меняет состояние player", async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CenterBlock initialTracks={[mockTrack1]} />
      </Provider>,
    );

    await userEvent.click(screen.getByText("Guilt"));

    const state = store.getState();
    expect(state.player.currentTrack).toEqual(mockTrack1);
    expect(state.player.isPlaying).toBe(true);
  });
});
