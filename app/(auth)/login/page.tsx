"use client"
// import { ReactElement } from "react";
import Image from 'next/image';

export default function Login() {
  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
        </div>
        <div className="fixed md:sticky top-36 h-[calc(100vh-3.5rem)] z-30">
          <Image
              src="/turnOnTheMusic.gif"
              alt="로그인 해주세요"
              width={125}
              height={75}
              style={{
                width: '100%',
                height: 'auto',
                border: '1px solid #FFD700',
              }}
            />
        </div>
      </main>
    </div>
  );
}