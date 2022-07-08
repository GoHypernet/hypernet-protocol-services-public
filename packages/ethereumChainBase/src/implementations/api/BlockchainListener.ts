import {
	IChainTransactionService,
	IChainTransactionServiceType,
} from "@ethereumChainBase/interfaces/business";
import {
	IEthereumRepository,
	IEthereumRepositoryType,
} from "@ethereumChainBase/interfaces/data";
import {
	IConfigProvider,
	IConfigProviderType,
} from "@ethereumChainBase/interfaces/utils";
import { RedisError } from "@hypernetlabs/common-redis-provider";
import {
	IAuthenticationServiceRepository,
	IAuthenticationServiceRepositoryType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	DatabaseError,
	BlockchainUnavailableError,
	BlockNumber,
	ProcessBlockJob,
} from "@hypernetlabs/hypernet.id-objects";
import {
	IJobRepository,
	IJobRepositoryType,
} from "@hypernetlabs/hypernet.id-queues";
import { ChainId } from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBlockchainListener } from "@ethereumChainBase/interfaces/api";

@injectable()
export class BlockchainListener implements IBlockchainListener {
	protected latestKnownBlockNumber: BlockNumber = BlockNumber(-1);
	protected averageBlockTime = 4000;
	protected chainId: ChainId = ChainId(1337);

	public constructor(
		@inject(IChainTransactionServiceType)
		protected chainTransactionService: IChainTransactionService,
		@inject(IEthereumRepositoryType)
		protected ethereumRepository: IEthereumRepository,
		@inject(IAuthenticationServiceRepositoryType)
		protected authenticationServiceRepository: IAuthenticationServiceRepository,
		@inject(IJobRepositoryType) protected jobRepository: IJobRepository,
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
	) {}

	public initialize(): ResultAsync<void, never> {
		// TODO: replace this with cron job triggered by emitting a periodic event
		setInterval(() => {
			this.listenForBlockMinedEvent();
		}, this.averageBlockTime);

		return this.configProvider.getConfig().map((config) => {
			this.chainId = config.chainId;
		});
	}

	protected listenForBlockMinedEvent(): ResultAsync<
		void,
		BlockchainUnavailableError | DatabaseError | RedisError
	> {
		return ResultUtils.combine([
			this.ethereumRepository.getLatestBlock(),
			this.authenticationServiceRepository.getSystemUserContext(),
		]).andThen(([currentBlock, userContext]) => {
			const currentBlockNumber = BlockNumber(currentBlock.number);

			if (this.latestKnownBlockNumber < currentBlockNumber) {
				// Get transactions from chain transaction db and check if transaction has been mined
				this.latestKnownBlockNumber = currentBlockNumber;
				return this.jobRepository.sendProcessBlockJob(
					new ProcessBlockJob(
						userContext,
						this.chainId,
						currentBlockNumber,
					),
				);
			}

			return okAsync(undefined);
		});
	}
}
