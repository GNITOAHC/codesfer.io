import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const defaultTheme: Theme = 'dark';

	const getInitialTheme = (): Theme => {
		if (!browser) return defaultTheme;

		const stored = localStorage.getItem('theme') as Theme | null;
		if (stored === 'light' || stored === 'dark') {
			return stored;
		}

		// Check system preference, but default to dark if no preference
		if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			return 'light';
		}

		return defaultTheme;
	};

	const { subscribe, set, update } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		toggle: () => {
			update((current) => {
				const next = current === 'dark' ? 'light' : 'dark';
				if (browser) {
					localStorage.setItem('theme', next);
					document.documentElement.classList.toggle('dark', next === 'dark');
				}
				return next;
			});
		},
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.classList.toggle('dark', theme === 'dark');
			}
			set(theme);
		},
		initialize: () => {
			if (browser) {
				const theme = getInitialTheme();
				localStorage.setItem('theme', theme);
				document.documentElement.classList.toggle('dark', theme === 'dark');
				set(theme);
			}
		}
	};
}

export const theme = createThemeStore();
