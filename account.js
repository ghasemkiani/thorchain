import d from "decimal.js";
import core from "@cosmos-client/core";
const {default: cosmosclient} = core;

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {util} from "./util.js";
import {Client as ClientMidgard} from "@ghasemkiani/midgard-api";

class Account extends Obj {
	static {
		cutil.extend(this.prototype, {
			_util: null,
			mnemonic: null,
			index: 0,
			_client: null,
			_midgard: null,
			_address: null,
			_key: null,
			_pub: null,
			_balances: null,
			balances_: null,
			balances: null,
			txs: null,
		});
	}
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
			let phrase = this.mnemonic;
			this._client = this.util.createClient({phrase});
		}
		return this._client;
	}
	set client(client) {
		this._client = client;
	}
	get midgard() {
		if (!this._midgard) {
			this._midgard = new ClientMidgard();
		}
		return this._midgard;
	}
	set midgard(midgard) {
		this._midgard = midgard;
	}
	get address() {
		if (!this._address) {
			if (this.mnemonic) {
				let {index} = this;
				this._address = this.client.getAddress(index);
			} else if (this.key) {
				let {key} = this;
				this._address = this.client.cosmosClient.getAddressFromPrivKey(new cosmosclient.proto.cosmos.crypto.secp256k1.PrivKey({key: Uint8Array.from(Buffer.from(key, "hex"))}));
			}
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
			let value = d(value_).div(d(10).pow(decimal)).toNumber();
			this.balances[key] = value;
			this.balances_[key] = value_;
		}
		return this._balances;
	}
	async toGetBalance_() {
		let account = this;
		let {address} = account;
		let balance_ = await account.midgard.toGetBalance_(address);
		let balance = await account.midgard.toGetBalance(address);
		account.balances_ ||= {};
		account.balances ||= {};
		account.balances_["THOR.RUNE"] = balance_;
		account.balances["THOR.RUNE"] = balance;
		return balance_;
	}
	async toGetBalance() {
		let account = this;
		await account.toGetBalance_();
		return account.balances["THOR.RUNE"];
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
		let tx = await this.client.getTransactionData(hash, address);
		return tx;
	}
}

export {Account};
