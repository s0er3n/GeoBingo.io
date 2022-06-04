
import { writable } from 'svelte/store';
export default class Timer {
	autoStart = true;
	isRunning = false;
	interval = [];
	constructor(callback, defaultTime) {
		this.makeThisWritable()
		this.defaultTime = defaultTime;
		this.remaining = this.defaultTime;
		this.callback = callback;
	}
	init() {
		this.interval.push(setInterval(() => this.currentFunction(), 1000))
	}
	destroy() {
		console.log("interval", this.interval)
        this.interval.forEach(
			interval => {
				clearInterval(interval);
			}
        )
	}

	makeThisWritable() {
		const P = writable(this);
		const { set, subscribe, update } = P;
		this.set = set;
		this.update = update;
		this.subscribe = subscribe;
	}
	currentFunction() {
		console.log(this.remaining)
		if (this.remaining === 0) {
			if(this.callback){
				
		
			this.callback();}
			this.remaining = this.defaultTime
			this.isRunning = false
			if (this.autoStart) {
				this.isRunning = true

			}
		this.set(this);
			return
		}
		if (this.isRunning) {
			this.remaining = this.remaining - 1
		}
		this.set(this)
	}
	startPause() {
		if (!this.interval) {
			this.init()
		}
		if (this.isRunning) {
			this.isRunning = false
		this.set(this);
			return;
		}
		this.isRunning = true
		this.set(this);
	}
	switchAutoStart() {
		this.autoStart = !this.autoStart
		this.set(this);
	}
	reset() {
		this.isRunning = false
		this.remaining = this.defaultTime
		this.set(this)
	}
	plus() {
		this.remaining = this.remaining + 1
		if (!this.isRunning) {
			this.defaultTime = this.remaining
		}
		this.set(this);
	}
	minus() {
		if (this.remaining >0)
		{
		this.remaining = this.remaining - 1
		if (!this.isRunning) {
			this.defaultTime = this.remaining
		}}
		this.set(this);
	}
}