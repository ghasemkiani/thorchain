import {Client} from "@xchainjs/xchain-thorchain";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Util extends Obj {
	createClient(arg) {
		let util = this;
		let {network} = util;
		let {urlNode: node} = util;
		let {urlRpc: rpc} = util;
		let client = new Client({
			network,
			clientUrl: {
				[network]: {node, rpc},
			},
			...arg,
		});
		return client;
	}
}
cutil.extend(Util.prototype, {
	network: "mainnet", // or "stagenet"
	urlNode: "https://thornode.ninerealms.com",
	urlRpc: "https://rpc.ninerealms.com",
});

const util = new Util();

export {Util, util};
