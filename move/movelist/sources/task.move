module movelist::task;

// Imports
use movelist::board::{Self, Board, BoardMemberCap, BoardAdminCap, is_active_member, member_address, board_id_from_member, get_role};
use std::string::String;

// Error Codes
const EUnauthorized: u64 = 1;
const EMemberNotActive: u64 = 2;
const ENotAssignee: u64 = 3;

// Version
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
    parent: option::Option<ID>, // Parent task ID for subtasks
    title: String,
    description: option::Option<String>,
    due_date: option::Option<u64>,
    effort_estimation: option::Option<u64>, // Effort estimation
    assignees: vector<address>,
    status: TaskStatus,
    subtasks: vector<ID>, // References to subtasks
}

// Mint task

public fun mint_task(
    member_cap: &BoardMemberCap,
    board: &mut Board,
    title: String,
    description: option::Option<String>,
    due_date: option::Option<u64>,
    effort_estimation: option::Option<u64>,
    ctx: &mut TxContext,
) {
    // Check member is active
    assert!(is_active_member(board, member_address(member_cap)), EMemberNotActive);
    
    // Create the task
    let task = Task {
        id: object::new(ctx),
        version: VERSION,
        board_id: board_id_from_member(member_cap),
        parent: option::none<ID>(),
        title: title,
        description: description,
        due_date: due_date,
        effort_estimation: effort_estimation,
        assignees: vector::empty<address>(),
        status: TaskStatus::Backlog,
        subtasks: vector::empty<ID>(),
    };
    
    board::add_task(member_cap, board, object::id(&task));
    
    transfer::share_object(task);
}

// Create subtask

public fun mint_subtask(
    member_cap: &BoardMemberCap,
    board: &mut Board,
    parent_task: &mut Task,
    title: String,
    description: option::Option<String>,
    due_date: option::Option<u64>,
    effort_estimation: option::Option<u64>,
    ctx: &mut TxContext,
) {
    // Check member is active
    assert!(is_active_member(board, member_address(member_cap)), EMemberNotActive);
    assert!(board_id_from_member(member_cap) == parent_task.board_id, EUnauthorized);
    
    // Create the subtask
    let subtask_id = object::new(ctx);
    let subtask = Task {
        id: subtask_id,
        version: VERSION,
        board_id: parent_task.board_id,
        parent: option::some(object::id(parent_task)),
        title: title,
        description: description,
        due_date: due_date,
        effort_estimation: effort_estimation,
        assignees: vector::empty<address>(),
        status: TaskStatus::Backlog,
        subtasks: vector::empty<ID>(),
    };
    
    // Add subtask reference to parent
    vector::push_back(&mut parent_task.subtasks, object::id(&subtask));
    
    board::add_task(member_cap, board, object::id(&subtask));
    
    transfer::share_object(subtask);
}

// Delete task (AdminCap only)

public fun delete_task(
    admin_cap: &BoardAdminCap,
    board: &mut Board,
    task: Task,
) {
    assert!(board::board_id(admin_cap) == task.board_id, EUnauthorized);
    assert!(board::board_id(admin_cap) == object::id(board), EUnauthorized);
    
    board::remove_task(admin_cap, board, object::id(&task));
    let Task { id, version: _, board_id: _, parent: _, title: _, description: _, due_date: _, effort_estimation: _, assignees: _, status: _, subtasks: _ } = task;
    object::delete(id);
}

// Setters with proper authorization

public fun set_title(
    admin_cap: &BoardAdminCap,
    board: &Board,
    task: &mut Task,
    new_title: String,
) {
    assert!(board::board_id(admin_cap) == object::id(board), EUnauthorized);
    assert!(board::board_id(admin_cap) == task.board_id, EUnauthorized);
    task.title = new_title;
}

public fun set_description(
    admin_cap: &BoardAdminCap,
    board: &Board,
    task: &mut Task,
    new_description: option::Option<String>,
) {
    assert!(board::board_id(admin_cap) == object::id(board), EUnauthorized);
    assert!(board::board_id(admin_cap) == task.board_id, EUnauthorized);
    task.description = new_description;
}

public fun set_due_date(
    admin_cap: &BoardAdminCap,
    board: &Board,
    task: &mut Task,
    new_due_date: option::Option<u64>,
) {
    assert!(board::board_id(admin_cap) == object::id(board), EUnauthorized);
    assert!(board::board_id(admin_cap) == task.board_id, EUnauthorized);
    task.due_date = new_due_date;
}

public fun set_effort_estimation(
    admin_cap: &BoardAdminCap,
    board: &Board,
    task: &mut Task,
    new_effort: option::Option<u64>,
) {
    assert!(board::board_id(admin_cap) == object::id(board), EUnauthorized);
    assert!(board::board_id(admin_cap) == task.board_id, EUnauthorized);
    task.effort_estimation = new_effort;
}

// Status editing with proper rules

public fun set_status(
    member_cap: &BoardMemberCap,
    board: &Board,
    task: &mut Task,
    new_status: TaskStatus,
) {
    assert!(board_id_from_member(member_cap) == task.board_id, EUnauthorized);
    assert!(is_active_member(board, member_address(member_cap)), EMemberNotActive);
    
    let assignees_len = vector::length(&task.assignees);
    
    // If task has no assignees, any member may update status
    if (assignees_len == 0) {
        task.status = new_status;
        return
    };
    
    // If task has assignees, only assignees or AdminCap may update status
    // Check if member is an assignee
    let member_addr = member_address(member_cap);
    let mut is_assignee = false;
    let mut i = 0;
    while (i < assignees_len) {
        if (*vector::borrow(&task.assignees, i) == member_addr) {
            is_assignee = true;
            break
        };
        i = i + 1;
    };
    
    // Also allow administrators
    let is_admin = get_role(member_cap) == board::role_administrator();
    
    assert!(is_assignee || is_admin, ENotAssignee);
    task.status = new_status;
}

// Assignment (AdminCap only)

public fun assign_task(
    admin_cap: &BoardAdminCap,
    board: &Board,
    task: &mut Task,
    assignee: address,
) {
    assert!(board::board_id(admin_cap) == object::id(board), EUnauthorized);
    assert!(board::board_id(admin_cap) == task.board_id, EUnauthorized);
    
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

public fun unassign_task(
    admin_cap: &BoardAdminCap,
    board: &Board,
    task: &mut Task,
    assignee: address,
) {
    assert!(board::board_id(admin_cap) == object::id(board), EUnauthorized);
    assert!(board::board_id(admin_cap) == task.board_id, EUnauthorized);
    
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

// Helper functions

public fun is_assignee(task: &Task, member: address): bool {
    let assignees = &task.assignees;
    let len = vector::length(assignees);
    let mut i = 0;
    while (i < len) {
        if (*vector::borrow(assignees, i) == member) {
            return true
        };
        i = i + 1;
    };
    false
}
