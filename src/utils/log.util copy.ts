import chalk from "chalk";
import dayjs from "dayjs";


export default class LogUtil {


	static conserror(...text: string[]): void {
		console.error(`${dayjs().format()} |`, chalk.bgRed.white(`${text.join(' ')}`));
	}


	static consinfo(...text: string[]): void {
		console.info(`${dayjs().format()} |`, chalk.bgWhite.black(` ${text.join(' ')} `));
	}


	static conslog(...text: string[]): void {
		console.info(`${dayjs().format()} |`, chalk.cyan.italic(text.join(' ')));
	}


	static conssuccess(...text: string[]): void {
		console.log(`${dayjs().format()} |`, chalk.bgGreen.white(`${text.join(' ')}`));
	}


	static conswarn(...text: string[]): void {
		console.warn(`${dayjs().format()} |`, chalk.yellow(text.join(' ')));
	}
}
