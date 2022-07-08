import { ContainerModule, interfaces } from "inversify";

import { EventRepository } from "@events/EventRepository";
import {
	IEventRepository,
	IEventRepositoryType,
} from "@events/IEventRepository";

export const eventModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IEventRepository>(IEventRepositoryType)
			.to(EventRepository)
			.inSingletonScope();
	},
);
