// SPDX-License-Identifier: MIT
#[starknet::contract]
mod BotAlpha {
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use starknet::ClassHash;
    // Import the BotComponent instead of AccountComponent
    use griddy_contracts::bot::BotComponent;

    // Declare the components
    component!(path: BotComponent, storage: bot, event: BotEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // Implement the mixins
    #[abi(embed_v0)]
    impl BotMixinImpl = BotComponent::AccountMixinImpl<ContractState>;

    // Internal implementations
    impl BotInternalImpl = BotComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        bot: BotComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        BotEvent: BotComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, 
        public_key: felt252,
        sequencer_public_key: felt252
    ) {
        self.bot.initializer(public_key);
        self.bot._set_sequencer_key(sequencer_public_key);
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.bot.assert_only_self();
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}