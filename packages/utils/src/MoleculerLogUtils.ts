import { ILogUtils } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";

@injectable()
export class MoleculerLogUtils implements ILogUtils {
	public constructor(@inject(LoggerType) protected logger: LoggerInstance) {}

	debug(message?: any, ...optionalParams: any[]): void {
		this.logger.debug(message, ...optionalParams);
	}
	info(message?: any, ...optionalParams: any[]): void {
		this.logger.info(message, ...optionalParams);
	}
	log(message?: any, ...optionalParams: any[]): void {
		this.logger.info(message, ...optionalParams);
	}
	warning(message?: any, ...optionalParams: any[]): void {
		this.logger.warn(message, ...optionalParams);
	}
	error(message?: any, ...optionalParams: any[]): void {
		this.logger.error(message, ...optionalParams);
	}
	getPino() {
		throw new Error("Method not implemented.");
	}
}
