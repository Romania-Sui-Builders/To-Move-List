module movelist::board;

// Imports
use std::string::String;
use sui::table::{Self, Table};

// Errors
const EUnauthorized: u64 = 1;
const EMemberNotActive: u64 = 2;
const EMemberNotFound: u64 = 3;

// Version
const VERSION: u8 = 1;

// Member Roles
const ROLE_CONTRIBUTOR: u8 = 0;
const ROLE_ADMINISTRATOR: u8 = 1;

// Structures

public struct Board has key {
    id: UID,
    version: u8,
    name: String,
    description: option::Option<String>,
    tasks: vector<ID>,
    owner: address,
    active_members: Table<address, bool>, // Registry of active memberships
}

public struct BoardAdminCap has key {
    id: UID,
    board_id: ID,
}

public struct BoardMemberCap has key {
    id: UID,
    board_id: ID,
    member: address,
    role: u8, // 0 = Contributor, 1 = Administrator
}

// Mint board

public fun mint_board(
    name: String,
    description: option::Option<String>,
    ctx: &mut TxContext, 
) {
    let mut board: Board = Board { 
        id: object::new(ctx),
        version: VERSION,
        name: name,
        description: description,
        tasks: vector::empty<ID>(), 
        owner: ctx.sender(), 
        active_members: table::new(ctx),
    };

    // Add creator as active administrator
    table::add(&mut board.active_members, ctx.sender(), true);

    // Grant AdminCap to creator
    transfer::transfer(BoardAdminCap { 
        id: object::new(ctx), 
        board_id: object::id(&board),
    }, ctx.sender());

    // Grant MemberCap to creator with Administrator role
    transfer::transfer(BoardMemberCap { 
        id: object::new(ctx), 
        board_id: object::id(&board),
        member: ctx.sender(),
        role: ROLE_ADMINISTRATOR,
    }, ctx.sender());
    
    transfer::share_object(board);
}

// Accessor functions

public fun board_id(cap: &BoardAdminCap): ID {
    cap.board_id
}

public fun board_id_from_member(cap: &BoardMemberCap): ID {
    cap.board_id
}

public fun member_address(cap: &BoardMemberCap): address {
    cap.member
}

public fun get_role(cap: &BoardMemberCap): u8 {
    cap.role
}

public fun role_administrator(): u8 {
    ROLE_ADMINISTRATOR
}

public fun is_administrator(cap: &BoardMemberCap): bool {
    cap.role == ROLE_ADMINISTRATOR
}

public fun is_active_member(board: &Board, member: address): bool {
    if (table::contains(&board.active_members, member)) {
        *table::borrow(&board.active_members, member)
    } else {
        false
    }
}

// Member management

public fun add_member(
    admin_cap: &BoardAdminCap,
    board: &mut Board,
    dest: address,
    role: u8,
    ctx: &mut TxContext,
) {
    assert!(admin_cap.board_id == object::id(board), EUnauthorized);
    assert!(role == ROLE_CONTRIBUTOR || role == ROLE_ADMINISTRATOR, EUnauthorized);
    
    // Add to active members registry
    if (table::contains(&board.active_members, dest)) {
        // Update existing entry to active
        *table::borrow_mut(&mut board.active_members, dest) = true;
    } else {
        table::add(&mut board.active_members, dest, true);
    };
    
    // Create and transfer MemberCap
    let member_cap: BoardMemberCap = BoardMemberCap { 
        id: object::new(ctx), 
        board_id: object::id(board),
        member: dest,
        role: role,
    };
    
    transfer::transfer(member_cap, dest);
}

public fun remove_member(
    admin_cap: &BoardAdminCap,
    board: &mut Board,
    member: address,
) {
    assert!(admin_cap.board_id == object::id(board), EUnauthorized);
    assert!(table::contains(&board.active_members, member), EMemberNotFound);
    
    // Set member as inactive (don't remove from table, just mark as false)
    *table::borrow_mut(&mut board.active_members, member) = false;
}

public fun reactivate_member(
    admin_cap: &BoardAdminCap,
    board: &mut Board,
    member: address,
) {
    assert!(admin_cap.board_id == object::id(board), EUnauthorized);
    assert!(table::contains(&board.active_members, member), EMemberNotFound);
    
    // Reactivate member
    *table::borrow_mut(&mut board.active_members, member) = true;
}

// Task management

public fun add_task(
    member_cap: &BoardMemberCap,
    board: &mut Board,
    task_id: ID,
) {
    assert!(member_cap.board_id == object::id(board), EUnauthorized);
    assert!(is_active_member(board, member_address(member_cap)), EMemberNotActive);
    vector::push_back(&mut board.tasks, task_id);
}

public fun remove_task(
    admin_cap: &BoardAdminCap,
    board: &mut Board,
    task_id: ID,
) {
    assert!(admin_cap.board_id == object::id(board), EUnauthorized);
    
    let tasks = &mut board.tasks;
    let len = vector::length(tasks);
    let mut i = 0;
    while (i < len) {
        if (*vector::borrow(tasks, i) == task_id) {
            vector::remove(tasks, i);
            return
        };
        i = i + 1;
    };
}

// Board configuration

public fun set_name(
    admin_cap: &BoardAdminCap,
    board: &mut Board,
    new_name: String,
) {
    assert!(admin_cap.board_id == object::id(board), EUnauthorized);
    board.name = new_name;
}

public fun set_description(
    admin_cap: &BoardAdminCap,
    board: &mut Board,
    new_description: option::Option<String>,
) {
    assert!(admin_cap.board_id == object::id(board), EUnauthorized);
    board.description = new_description;
}
