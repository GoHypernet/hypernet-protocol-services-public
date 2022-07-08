import { EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { EService } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";

export interface ISecurityConfig {
	serviceKey: EthereumPrivateKey;
	serviceType: EService;
	serviceAccountAddresses: Map<EService, EthereumAccountAddress>;
}
