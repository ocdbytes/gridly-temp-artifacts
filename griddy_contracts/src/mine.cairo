#[starknet::interface]
trait ICounter<TContractState> {
    fn get_count(self: @TContractState) -> u128;
    fn increment(ref self: TContractState) -> u128;
    fn decrement(ref self: TContractState) -> u128;
    fn increment_by(ref self: TContractState, amount: u128) -> u128;
}

#[starknet::contract]
pub mod Mine {
    use super::ICounter;

    #[storage]
    struct Storage {
        count: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_count: u128) {
        self.count.write(initial_count);
    }

    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState> {
        fn get_count(self: @ContractState) -> u128 {
            self.count.read()
        }

        fn increment(ref self: ContractState) -> u128 {
            let previous_count = self.count.read();
            let new_count = previous_count + 1;
            self.count.write(new_count);
            new_count
        }

        fn decrement(ref self: ContractState) -> u128 {
            let previous_count = self.count.read();
            let new_count = previous_count - 1;
            self.count.write(new_count);
            new_count
        }
        
        fn increment_by(ref self: ContractState, amount: u128) -> u128 {
            let previous_count = self.count.read();
            let new_count = previous_count + amount;
            self.count.write(new_count);            
            new_count
        }
    }
}