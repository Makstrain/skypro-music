// src/app/music/layout.tsx
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Player } from "@/components/Player/Player";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Header />
          {children}
          <Sidebar />
        </main>
        <Player />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
