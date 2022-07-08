export enum EChainStatus {
	Error, // if we have a serious error in chain
	Unhealthy, // if escrow wallet is not found
	Healthy, // if everything is all good
}
