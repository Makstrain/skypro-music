import { Header } from "@/components/Header/Header";
import { CenterBlock } from "@/components/CenterBlock/CenterBlock";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Player } from "@/components/Player/Player";
import "./globals.css";

export default function Home() {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Header />
          <CenterBlock />
          <Sidebar />
        </main>
        <Player />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
