<script>
	import { onMount } from 'svelte';

	export let emote;
	let ParticlesComponent;

	onMount(async () => {
		const module = await import('svelte-particles');

		ParticlesComponent = module.default;
	});

	// url example
	// let particlesUrl = "http://foo.bar/particles.json";

	let particlesConfig = {
		emitters: [
			{
				position: {
					x: 0,
					y: 30
				},
				rate: {
					quantity: 5,
					delay: 0.15
				},
				particles: {
					move: {
						direction: 'top-right',
						outModes: {
							top: 'none',
							left: 'none',
							default: 'destroy'
						}
					}
				}
			},
			{
				position: {
					x: 100,
					y: 30
				},
				rate: {
					quantity: 5,
					delay: 0.15
				},
				particles: {
					move: {
						direction: 'top-left',
						outModes: {
							top: 'none',
							right: 'none',
							default: 'destroy'
						}
					}
				}
			}
		],
		particles: {
			color: {
				value: ['#ffffff', '#FF0000']
			},
			move: {
				decay: 0.05,
				direction: 'top',
				enable: true,
				gravity: {
					enable: true
				},
				outModes: {
					top: 'none',
					default: 'destroy'
				},
				speed: {
					min: 10,
					max: 50
				}
			},
			number: {
				value: 0
			},
			opacity: {
				value: 1
			},
			rotate: {
				value: {
					min: 0,
					max: 360
				},
				direction: 'random',
				animation: {
					enable: true,
					speed: 30
				}
			},
			tilt: {
				direction: 'random',
				enable: false,
				value: {
					min: 0,
					max: 0
				},
				animation: {
					enable: true,
					speed: 30
				}
			},
			size: {
				value: {
					min: 0,
					max: 2
				},
				animation: {
					enable: true,
					startValue: 'min',
					count: 1,
					speed: 16,
					sync: true
				}
			},
			roll: {
				darken: {
					enable: true,
					value: 25
				},
				enable: true,
				speed: {
					min: 5,
					max: 15
				}
			},
			wobble: {
				distance: 30,
				enable: false,
				speed: {
					min: -7,
					max: 7
				}
			},
			shape: {
				type: 'image',
				options: {
					image: [
						{
							src: emote,
							width: 32,
							height: 32,
							particles: {
								size: {
									value: 24
								}
							}
						}
					]
				}
			}
		}
	};

	let onParticlesLoaded = (event) => {
		const particlesContainer = event.detail.particles;
		setTimeout(() => particlesContainer.stop(), 7000);

		// you can use particlesContainer to call all the Container class
		// (from the core library) methods like play, pause, refresh, start, stop
	};

	let onParticlesInit = (main) => {
		// you can use main to customize the tsParticles instance adding presets or custom shapes
	};
</script>

<svelte:component
	this={ParticlesComponent}
	id="tsparticles"
	options={particlesConfig}
	on:particlesLoaded={onParticlesLoaded}
	on:particlesInit={onParticlesInit} />
