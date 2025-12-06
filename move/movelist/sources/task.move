module movelist::task;

// Imports

use movelist::board::{Self, Board, BoardMemberCap};
use std::string::String;

// Error Codes

const EVersionMismatch: u64 = 0;
const EUnauthorized: u64 = 1;

// V

const VERSION: u8 = 1;

// Structures

public enum TaskStatus has copy, drop, store {
    Backlog,
    InProgress,
    InReview,
    Done,
}

public struct Task has key {
    id: UID,
    version: u8,
    board_id: ID,
    parent: Option<address>,
    title: String,
    description: Option<String>,
    due_date: option::Option<u64>,
    assignees: vector<address>,
    status: TaskStatus,
}

// Mint task

public fun new_task(
    member_cap: &BoardMemberCap,
    title: String,
    description: option::Option<String>,
    due_date: option::Option<u64>,
    ctx: &mut TxContext,
): Task {
    
    let mut task = Task {
        id: object::new(ctx),
        version: VERSION,
        board_id: member_cap.board_id(),
        parent: option::none<address>(),
        title: title,
        description: description,
        due_date: due_date, 
        assignees: vector::empty<address>(),
        status: TaskStatus::Backlog,
    };

    task.assignees.push_back(ctx.sender());

    task
}

public fun mint_task(
    member_cap: &BoardMemberCap,
    board: &mut Board,
    title: String,
    description: option::Option<String>,
    due_date: option::Option<u64>,
    ctx: &mut TxContext,
) {
    // Create the task
    let mut task = Task {
        id: object::new(ctx),
        version: VERSION,
        board_id: member_cap.board_id(),
        parent: option::none<address>(),
        title: title,
        description: description,
        due_date: due_date,
        assignees: vector::empty<address>(),
        status: TaskStatus::Backlog,
    };
    
    vector::push_back(&mut task.assignees, ctx.sender());
    
    board::add_task(member_cap, board, object::id(&task));
    
    transfer::share_object(task);
}

// Setters

public fun set_title(
    _member_cap: &BoardMemberCap,
    task: &mut Task,
    new_title: String,
) {
    task.title = new_title;
}

public fun set_status(
    _member_cap: &BoardMemberCap,
    task: &mut Task,
    new_status: TaskStatus,
) {
    task.status = new_status;
}

public fun set_description(
    _member_cap: &BoardMemberCap,
    task: &mut Task,
    new_description: option::Option<String>,
) {
    task.description = new_description;
}

public fun set_due_date(
    _member_cap: &BoardMemberCap,
    task: &mut Task,
    new_due_date: option::Option<u64>,
) {
    task.due_date = new_due_date;
}

public fun set_parent(
    _member_cap: &BoardMemberCap,
    task: &mut Task,
    new_parent: Option<address>,
) {
    task.parent = new_parent;
}

public fun add_assignee(
    _member_cap: &BoardMemberCap,
    task: &mut Task,
    assignee: address,
) {
    // Check if assignee is already in the list
    let assignees = &task.assignees;
    let len = vector::length(assignees);
    let mut i = 0;
    while (i < len) {
        if (*vector::borrow(assignees, i) == assignee) {
            return // Already assigned
        };
        i = i + 1;
    };
    
    vector::push_back(&mut task.assignees, assignee);
}

public fun remove_assignee(
    _member_cap: &BoardMemberCap,
    task: &mut Task,
    assignee: address,
) {
    let assignees = &mut task.assignees;
    let len = vector::length(assignees);
    let mut i = 0;
    while (i < len) {
        if (*vector::borrow(assignees, i) == assignee) {
            vector::remove(assignees, i);
            return
        };
        i = i + 1;
    };
}

