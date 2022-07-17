import {getChainIds, getDefaultClientUrl} from "@xchainjs/xchain-thorchain";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Util extends Obj {
	async toInit() {
		this.chainIds = await getChainIds(getDefaultClientUrl());
	}
}
cutil.extend(Util.prototype, {
	chainIds: null,
	network: "mainnet", // or "testnet"
});

const util = new Util();

export {Util, util};
