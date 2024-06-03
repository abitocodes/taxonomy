src/app
├── layout.tsx  // _app.tsx의 내용을 이 파일로 이동
├── document.tsx  // _document.tsx의 내용을 이 파일로 이동
├── page.tsx  // index.tsx의 내용을 이 파일로 이동
├── api
│   └── hello.ts  // API 라우트는 동일하게 유지
└── r
    ├── [channel]
    │   ├── page.tsx  // r/[channel]/index.tsx의 내용을 이 파일로 이동
    │   ├── comments
    │   │   └── [pid].tsx  // 내용 변경 없음
    │   └── submit
    │       └── page.tsx  // r/[channel]/submit.tsx의 내용을 이 파일로 이동