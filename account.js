import BigNumber from "bignumber.js";
import {Client} from "@xchainjs/xchain-thorchain";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {util} from "./util.js";

class Account extends Obj {
	get util() {
		if (!this._util) {
			this._util = util;
		}
		return this._util;
	}
	set util(util) {
		this._util = util;
	}
	get client() {
		if (!this._client) {
			// this.mnemonic may be null
			let chainIds = this.util.chainIds; // must have called util.toInit() before
			let network = this.util.network;
			let phrase = this.mnemonic;
			this._client = new Client({chainIds, network, phrase});
		}
		return this._client;
	}
	set client(client) {
		this._client = client;
	}
	get address() {
		if (!this._address && this.mnemonic) {
			let {index} = this;
			this._address = this.client.getAddress(index);
		}
		return this._address;
	}
	set address(address) {
		this._address = address;
	}
	get key() {
		if (!this._key && this.mnemonic) {
			let {index} = this;
			this._key = this.client.getPrivateKey(index).key.toString("hex");
		}
		return this._key;
	}
	set key(key) {
		this._key = key;
	}
	get pub() {
		if (!this._pub && this.mnemonic) {
			let {index} = this;
			this._pub = Buffer.from(this.client.getPubKey(index).key).toString("hex");
		}
		return this._pub;
	}
	set pub(pub) {
		this._pub = pub;
	}
	async toGetBalances() {
		this._balances = await this.client.getBalance(this.address);
		this.balances = {};
		this.balances_ = {};
		for (let {asset, amount} of this._balances) {
			let {chain, symbol} = asset;
			let key = `${chain}.${symbol}`;
			let value_ = amount.amount().toString();
			let {decimal} = amount;
			let value = new BigNumber(value_).multipliedBy(new BigNumber(10).pow(-decimal)).toNumber();
			this.balances[key] = value;
			this.balances_[key] = value_;
		}
		return this._balances;
	}
	get balance() {
		return this.balances["THOR.RUNE"];
	}
	async toGetTransactions() {
		let {address} = this;
		this.txs = await this.client.getTransactions({address});
		return this.txs;
	}
	async toGetTransaction(hash) {
		let {address} = this;
		let tx = await this.client.getTransaction(hash, address);
		return tx;
	}
}
cutil.extend(Account.prototype, {
	_util: null,
	mnemonic: null,
	index: 0,
	_client: null,
	_address: null,
	_key: null,
	_pub: null,
	_balances: null,
	balances_: null,
	balances: null,
	txs: null,
});

export {Account};
