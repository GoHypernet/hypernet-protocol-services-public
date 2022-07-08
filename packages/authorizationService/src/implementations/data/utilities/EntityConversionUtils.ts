import { injectable } from "inversify";

import { IEntityConversionUtils } from "@authorization/interfaces/data/utilities";

@injectable()
export class EntityConversionUtils implements IEntityConversionUtils {
	constructor() {}
}
