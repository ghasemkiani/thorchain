import {Client, getChainIds, getDefaultClientUrl} from "@xchainjs/xchain-thorchain";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Util extends Obj {
	async toInit() {
		if (!this.chainIds) {
			this.chainIds = await getChainIds(getDefaultClientUrl());
		}
	}
	async toCreateClient(arg) {
		await this.toInit();
		let chainIds = this.chainIds;
		let network = this.network;
		let client = new Client({chainIds, network, ...arg});
		return client;
	}
}
cutil.extend(Util.prototype, {
	chainIds: null,
	network: "mainnet", // or "testnet"
});

const util = new Util();

export {Util, util};
