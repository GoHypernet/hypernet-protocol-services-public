import {
	IRedisConfigProvider,
	IRedisConfigProviderType,
} from "@hypernetlabs/common-redis-provider";
import {
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	EventRepository,
	IEventRepository,
	IEventRepositoryType,
} from "@hypernetlabs/hypernet.id-events";
import {
	IJobRepository,
	IJobRepositoryType,
	JobRepository,
} from "@hypernetlabs/hypernet.id-queues";
import { FileService } from "@ipfs/implementations/business";
import {
	FileRepository,
	IPFSRepository,
	GoogleBucketRepository,
	UploadLocationRepository,
} from "@ipfs/implementations/data";
import { PrismaProvider } from "@ipfs/implementations/data/utilities";
import { ConfigProvider, FileUtils } from "@ipfs/implementations/utils";
import { IGoogleListener, IGoogleListenerType } from "@ipfs/interfaces/api";
import { IFileService, IFileServiceType } from "@ipfs/interfaces/business";
import {
	IFileRepository,
	IFileRepositoryType,
	IUploadLocationRepository,
	IUploadLocationRepositoryType,
	IIPFSRepository,
	IIPFSRepositoryType,
	IBucketRepository,
	IBucketRepositoryType,
} from "@ipfs/interfaces/data";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ipfs/interfaces/data/utilities";
import {
	IConfigProvider,
	IConfigProviderType,
	IFileUtils,
	IFileUtilsType,
} from "@ipfs/interfaces/utils";
import { ContainerModule, interfaces } from "inversify";

import { GoogleListener } from "@ipfs/implementations/api/GoogleListener";

export const ipfsModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IFileService>(IFileServiceType).to(FileService).inSingletonScope();

		bind<IEventRepository>(IEventRepositoryType)
			.to(EventRepository)
			.inSingletonScope();
		bind<IFileRepository>(IFileRepositoryType)
			.to(FileRepository)
			.inSingletonScope();
		bind<IUploadLocationRepository>(IUploadLocationRepositoryType)
			.to(UploadLocationRepository)
			.inSingletonScope();
		bind<IBucketRepository>(IBucketRepositoryType)
			.to(GoogleBucketRepository)
			.inSingletonScope();
		bind<IIPFSRepository>(IIPFSRepositoryType)
			.to(IPFSRepository)
			.inSingletonScope();

		bind<IPrismaProvider>(IPrismaProviderType)
			.to(PrismaProvider)
			.inSingletonScope();
		bind<IConfigProvider>(IConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<IRedisConfigProvider>(IRedisConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<ISecurityConfigProvider>(ISecurityConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<IJobRepository>(IJobRepositoryType)
			.to(JobRepository)
			.inSingletonScope();
		bind<IFileUtils>(IFileUtilsType).to(FileUtils).inSingletonScope();

		bind<IGoogleListener>(IGoogleListenerType)
			.to(GoogleListener)
			.inSingletonScope();
	},
);
