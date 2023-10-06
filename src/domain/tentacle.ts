import { Segment } from "./segment";

export interface coord {
    x: number
    y: number
    errx?: number
    erry?: number
}

export class Tentacle {

    x: number
    y: number
    l: number
    n: number
    a: number
    t: coord
    rand: number
    segments: Segment[]
    angle: number = 0
    dt: number = 0
    c: CanvasRenderingContext2D


    constructor(x: number, y: number, l: number, n: number, a: number, c: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.n = n;
        this.t = { x: 0, y: 0 };
        this.rand = Math.random();
        this.a = a
        this.segments = [new Segment(undefined, this.l / this.n, 0, true, c, { x: this.x, y: this.y })];
        this.c = c
        for (let i = 1; i < this.n; i++) {
            this.segments.push(
                new Segment(this.segments[i - 1], this.l / this.n, 0, false, c)
            );
        }
    }
    move(last_target: coord, target: coord) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x);
        this.dt = this.dist(last_target.x, last_target.y, target.x, target.y) + 5;
        this.t = {
            x: target.x - 0.8 * this.dt * Math.cos(this.angle),
            y: target.y - 0.8 * this.dt * Math.sin(this.angle)
        };
        if (this.t.x) {
            this.segments[this.n - 1].update(this.t);
        } else {
            this.segments[this.n - 1].update(target);
        }
        for (let i = this.n - 2; i >= 0; i--) {
            this.segments[i].update(this.segments[i + 1].pos);
        }
        if (
            this.dist(this.x, this.y, target.x, target.y) <=
            this.l + this.dist(last_target.x, last_target.y, target.x, target.y)
        ) {
            this.segments[0].fallback({ x: this.x, y: this.y });
            for (let i = 1; i < this.n; i++) {
                this.segments[i].fallback(this.segments[i - 1].nextPos);
            }
        }
    }
    show(target: coord) {
        if (this.dist(this.x, this.y, target.x, target.y) <= this.l) {
            this.c.globalCompositeOperation = "lighter";
            this.c.beginPath();
            this.c.lineTo(this.x, this.y);
            for (let i = 0; i < this.n; i++) {
                this.segments[i].show();
            }
            this.c.strokeStyle =
                "hsl(" +
                (this.rand * 60 + 180) +
                ",100%," +
                (this.rand * 60 + 25) +
                "%)";
            this.c.lineWidth = this.rand * 2;
            this.c.lineCap = "round";
            this.c.lineJoin = "round";
            this.c.stroke();
            this.c.globalCompositeOperation = "source-over";
        }
    }
    show2(target: coord) {
        this.c.beginPath();
        if (this.dist(this.x, this.y, target.x, target.y) <= this.l) {
            this.c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
            this.c.fillStyle = "white";
        } else {
            this.c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
            this.c.fillStyle = "darkcyan";
        }
        this.c.fill();
    }

    dist(p1x: number, p1y: number, p2x: number, p2y: number) {
        return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
    }
}