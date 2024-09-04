import { Palette } from "./utils";
import { Properties } from "./utils";
import { Random } from "./utils";
import p5Types from "p5";

export const rng: Random = new Random();
const p: p5Types = new p5Types((p) => {
    // p5 스케치 설정
    p.setup = () => {
        // 초기 설정 코드
    };
    p.draw = () => {
        // 그리기 코드
    };
});
export let frameCount: number = 0;
export const inputSeed: any = document.getElementById("seed")

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const width = canvas.width;
export const height = canvas.height;

export let planets: any
export let satellites: any
export let stars: any

export const palette = new Palette(Properties.Color.Analogous, p, rng); // 'p'와 'rng'는 적절한 p5 인스턴스와 Random 인스턴스를 사용해야 합니다.

// 생성된 인스턴스의 background 속성을 사용합니다.
// p5.prototype.background(palette.background);
p.background(palette.background);