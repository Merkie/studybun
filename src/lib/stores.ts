import { writable } from 'svelte/store';
import { browser } from '$app/environment';

//string
export const theme = writable((browser && localStorage.getItem('theme')) || 'light');
theme.subscribe((val) => browser && (localStorage.theme = val));
