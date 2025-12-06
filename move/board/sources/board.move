module movelist::board;

// Imports
use movelist::task;
// use sui::test_scenario;
// use sui::test_utils::assert_eq;
use std::string::String;

// Errors
const EUnauthorized: u64 = 1;

// Versioning
const VERSION: u8 = 1;

// #[test_only]
// use sui::test_scenario;
// use sui::test_scenario::Scenario;
// use sui::test_utils

public struct MemberRole has store {
    role: String,
}

public struct Board has key {
    id: UID,
    version: u8,
    name: String,
    tasks: vector<ID>,
    owner: address,
    members: vector<address>,
}

public struct BoardAdminCap has key {
    id: UID,
    board_id: ID,
}

public struct BoardMemberCap has key {
    id: UID,
    board_id: ID,
}

public fun mint_board(
    name: String,
    ctx: &mut TxContext, 
) {
    let board: Board = Board { 
        id: object::new(ctx),
        version: VERSION,
        name: name,
        tasks: vector::empty<ID>(), 
        owner: ctx.sender(), 
        members: vector::empty<address>(),
    };

    transfer::transfer(BoardAdminCap { 
        id: object::new(ctx), 
        board_id: object::id(&board),
    }, ctx.sender());

    transfer::transfer(BoardMemberCap { 
        id: object::new(ctx), 
        board_id: object::id(&board),
    }, ctx.sender());
    
    transfer::share_object(board);
}

public fun add_member(
    _: &BoardAdminCap,
    board: &mut Board,
    dest: address,
    ctx: &mut TxContext,
) {
    assert!(_.board_id == object::id(board), EUnauthorized);
    vector::push_back(&mut board.members, dest);   

    let member_cap: BoardMemberCap = BoardMemberCap { 
        id: object::new(ctx), 
        board_id: object::id(board),
    };

    transfer::transfer(member_cap, dest);
}




// #[test]
// public fun test_create_board_and_become_admin() {
//     let sender = @0xCAFE;
//     let name = b"My First Board".to_string();

//     let mut scenario: Scenario = test_scenario::begin(sender);
//     movelist::board::mint_board(name, scenario.ctx());
    
    
// }

// #[test]
// public fun test_add_member() {
//     let test: Scenario = test_scenario::begin(@0xCAFE);
    
// }