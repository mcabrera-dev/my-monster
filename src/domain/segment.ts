import { Tentacle, coord } from "./tentacle"

export class Segment {

    l: number
    ang: number = 0
    first: boolean
    pos: coord
    nextPos: coord
    c: CanvasRenderingContext2D

    constructor(parent: Segment | undefined, l: number, a: number, first: boolean, c: CanvasRenderingContext2D, firstcoord?: coord) {
        this.first = first;
        this.c = c
        if (first) {
            this.pos = {
                x: firstcoord!.x,
                y: firstcoord!.y
            };
        } else {
            this.pos = {
                x: parent?.nextPos.x || 0,
                y: parent?.nextPos.y || 0
            };
        }
        this.l = l;
        this.ang = a;
        this.nextPos = {
            x: this.pos.x + this.l * Math.cos(this.ang),
            y: this.pos.y + this.l * Math.sin(this.ang)
        };
    }
    update(t: coord) {
        this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
        this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
        this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }
    fallback(t: coord) {
        this.pos.x = t.x;
        this.pos.y = t.y;
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }
    show() {
        this.c.lineTo(this.nextPos.x, this.nextPos.y);
    }
}