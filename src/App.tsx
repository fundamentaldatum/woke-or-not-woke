import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import PhotoDescribeApp from "./PhotoDescribeApp";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useMemo } from "react";

export default function App() {
  const user = useQuery(api.auth.loggedInUser);

  // Randomize color assignment on mount
  const [wokeColor, notWokeColor] = useMemo(() => {
    // true: WOKE is red, NOT WOKE is blue; false: WOKE is blue, NOT WOKE is red
    const wokeIsRed = Math.random() < 0.5;
    return wokeIsRed
      ? ["#ff2d55", "#2d8cff"] // bright red, bright blue
      : ["#2d8cff", "#ff2d55"];
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #1b263b 0%, #0a1931 100%)",
      }}
    >
      {/* Header at the very top */}
      <header
        className="w-full py-6 flex flex-col items-center shadow-sm z-10"
        style={{
          background: "#0a1931",
        }}
      >
        <h1
          className="text-5xl font-bold tracking-wide"
          style={{
            fontFamily: "'Tagesschrift', sans-serif",
            letterSpacing: "0.08em",
            color: "#fff",
            textShadow: "0 2px 8px #1b263b88",
            display: "flex",
            gap: "0.5em",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span style={{ color: wokeColor, textShadow: "0 2px 8px #0008" }}>WOKE</span>
          <span style={{ color: "#fff" }}>OR</span>
          <span style={{ color: notWokeColor, textShadow: "0 2px 8px #0008" }}>NOT WOKE</span>
        </h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start w-full px-2">
        <div className="w-full max-w-2xl mx-auto mt-8">
          {!user ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <SignInForm />
            </div>
          ) : (
            <>
              <PhotoDescribeApp />
              <div className="flex justify-center mt-8">
                <SignOutButton />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
