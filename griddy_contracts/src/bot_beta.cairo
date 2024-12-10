#[starknet::interface]
trait ICallMine<TContractState> {
    fn call_mine(self: @TContractState) -> u128;
}

#[starknet::interface]
trait IMineContract<TContractState> {
    fn increment(ref self: TContractState) -> u128;
    fn decrement(ref self: TContractState) -> u128;
    fn increment_by(ref self: TContractState, amount: u128) -> u128;
}

#[starknet::contract]
pub mod BotBeta {
    use super::ICallMine;
    use super::IMineContractDispatcher;
    use super::IMineContractDispatcherTrait;

    use starknet::contract_address::ContractAddress;

    pub const INVALID_CALLER: felt252 = 'Account: not an executor';

    #[storage]
    struct Storage {
        executor_contract: ContractAddress,
        mine_contract: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, mine_contract: ContractAddress, executor_contract: ContractAddress) {
        self.executor_contract.write(executor_contract);
        self.mine_contract.write(mine_contract);
    }

    #[abi(embed_v0)]
    impl MineImpl of ICallMine<ContractState> {
        fn call_mine(self: @ContractState) -> u128 {
            let caller_address = starknet::get_caller_address();
            assert(caller_address == self.executor_contract.read(), INVALID_CALLER);
            let mine_contract = IMineContractDispatcher {
                contract_address: self.mine_contract.read()
            };
            mine_contract.increment_by(1);
            0
        }
    }
}