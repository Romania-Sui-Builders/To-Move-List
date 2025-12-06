module movelist::board;

// Imports
use movelist::task;
use std::string::String;

// Errors
const EUnauthorized: u64 = 1;

// Version
const VERSION: u8 = 1;

// Structures

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

// Mint board

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

public fun board_id(cap: &BoardMemberCap): ID {
    cap.board_id
}

public fun add_task(
    _: &BoardMemberCap,
    board: &mut Board,
    task_id: ID,
) {
    assert!(_.board_id == object::id(board), EUnauthorized);
    vector::push_back(&mut board.tasks, task_id);
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
