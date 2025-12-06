module movelist::board;

use movelist::task;

use std::option;
use std::string::String;
use std::address;

public struct MemberRole has store {
    role: String,
}

public struct Board has key {
    id: UID,
    name: String,
    tasks: vector<task::Task>,
    owner: address,
    members: vector<address>,
}

public struct BoardAdminCap has key {
    id: UID,
    board_id: ID,
}

public fun create_board(
    ctx: &mut TxContext, 
    name: String,
): Board {
    let board: Board = Board { 
        id: object::new(ctx),
        name: name,
        tasks: vector::empty<task::Task>(), 
        owner: ctx.sender(), 
        members: vector::empty<address>(),
    };
    transfer::transfer(board, ctx.sender());
    
    board
}