import Capture from "./Capture"

export default class Score {
    capturesNew: Capture[] = []
    capturesOld: Capture[]= []
    constructor() {

    }
    set captures(captures: Capture[]) {
        this.capturesOld.push(...this.capturesNew)
        if (captures) {
            this.capturesNew = captures
        }
        else {
            this.capturesNew = []
        }
    }
    calculateScore(captures: Capture[]) {
        const score: { [key: string]: { points: number,id: string}} = {}
        captures.forEach((capture) => {
            if (!capture.removed) {
                if (!score[capture.player.id]) {
                    score[capture.player.id] = {
                        points: 0,
                        id: capture.player.id,
                    };
                }
                score[capture.player.id].points =
                    score[capture.player.id].points + (capture.extrapoint ? 2 : 1);
            }
        })
        return score
    }
    revert(captures:Capture[]) {
        this.capturesOld = this.capturesOld.filter((old) => !captures.includes(old))
        this.capturesNew = []
    }
    old() {
        return this.calculateScore(this.capturesOld)
    }
    new() {
        return this.calculateScore([...this.capturesNew,... this.capturesOld ])
    }
}