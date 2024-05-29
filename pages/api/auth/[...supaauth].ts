export default function deprecatedComp() {
  console.warn("NextAuth는 더 이상 사용되지 않습니다. 적절한 대체 방법을 사용해주세요.");
  throw new Error("NextAuth는 더 이상 지원되지 않습니다.");
}
