import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Util extends Obj {
	//
}
cutil.extend(Util.prototype, {
	network: "mainnet", // or "testnet"
});

const util = new Util();

export {Util, util};
