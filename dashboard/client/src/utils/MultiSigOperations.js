import Web3 from 'web3'
import store from '../store'

const jsonInterface = [{"constant":true,"inputs":[],"name":"operationsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"permissionRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"prova","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"registryAddress","type":"address"}],"name":"setPermissionRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"provaFunction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"identity","type":"address"},{"name":"intParams","type":"uint256[]"},{"name":"stringParams","type":"string"},{"name":"addressParams","type":"address[]"},{"name":"bytesParams","type":"bytes32[]"}],"name":"submitOperation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"opId","type":"uint256"}],"name":"confirmOperation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

const contract_address = store.state.contracts.multiSigOperations

const web3 = new Web3(Web3.givenProvider || null)

const multiSigOperations = new web3.eth.Contract(jsonInterface, contract_address)

export async function submitAddDelegate(data) {
    multiSigOperations.methods.submitOperation(data.identity, [1], '', [contract_address, data.delegate, data.permission], []).send({from: data.from})
} 

export async function submitRevokeDelegate(data){
    multiSigOperations.methods.submitOperation(data.identity, [2], '', [contract_address, data.delegate, data.permission], []).send({from: data.from})
}

export async function confirmAddDelegate(){}
export async function confirmRevokeDelegate(){}

export async function submitSetCredentialStatus(data) {} 
export async function confirmSetCredentialStatus(){}
