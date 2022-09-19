export const darkTheme = `
		--surface-background: #12162a;
		--background: #080a14;
		--container-background: #1c2871;
		--border: #4b5274;
		--text-color: white;
		--header-background: #12162abd;
		--flashcard-background: white;
		--light-success: #30BB74;
		--dark-success: #017A54;
		--spinner-color: #f7f7f7;
		--drop-shadow-color: rgba(0, 0, 0, 0.1);
		--failure-light: #BA4345;
		--failure-dark: #640A24;
		--save-icon-color: #ffc014;
		--highlight: #75B8FA;
	`.trim();

export const lightTheme = `
		--surface-background: #FCEAF1;
		--background: white;
		--container-background: #F3B4CC;
		--border: #dba0b7;
		--text-color: #2F2538;
		--header-background: #FCEAF1bd;
		--flashcard-background: white;
		--light-success: #30BB74;
		--dark-success: #017A54;
		--spinner-color: #f7f7f7;
		--drop-shadow-color: rgba(0, 0, 0, 0.1);
		--failure-light: #BA4345;
		--failure-dark: #640A24;
		--save-icon-color: #ffc014;
		--highlight: #eb719f;
	`.trim();

export const oceanLight = `
		--surface-background: #e8eefc;
		--background: white;
		--container-background: #adcaf3;
		--container-text-color: white;
		--border: #99addb;
		--text-color: #223a2e;
		--header-background: #e8eefcbd;
		--flashcard-background: white;
		--light-success: #30BB74;
		--dark-success: #017A54;
		--spinner-color: #f7f7f7;
		--drop-shadow-color: rgba(0, 0, 0, 0.1);
		--failure-light: #BA4345;
		--failure-dark: #640A24;
		--save-icon-color: #323dd4;
		--highlight: #658aef;
	`.trim();

export const loading = `
		--surface-background: #12162a;
		--background: #080a14;
		--container-background: #1c2871;
		--border: #4b5274;
		--text-color: white;
		--header-background: #12162abd;
		--flashcard-background: white;
		--light-success: #30BB74;
		--dark-success: #017A54;
		--spinner-color: #f7f7f7;
		--drop-shadow-color: rgba(0, 0, 0, 0.1);
		--failure-light: #BA4345;
		--failure-dark: #640A24;
		--save-icon-color: #ffc014;
		--highlight: #75B8FA;
	`.trim();

export const themes = {
	dark: {
		theme: darkTheme,
		hueRotate: 70,
		background: '#080a14',
		textColor: 'white'
	},
	light: {
		theme: lightTheme,
		hueRotate: -70,
		background: 'white',
		textColor: '#2F2538'
	},
	oceanlight: {
		theme: oceanLight,
		hueRotate: -70,
		background: 'white',
		textColor: '#223a2e'
	},
	loading: {
		theme: darkTheme,
		hueRotate: 70,
		background: '#080a14',
		textColor: 'white'
	}
};
