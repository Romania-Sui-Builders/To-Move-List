module movelist::task;

use std::option;
use std::string::String;

const EVersionMismatch: u64 = 0;

const VERSION: u8 = 1;

public struct Task has key,  store {
    id: UID,
    version: u8,
    parent: Option<address>,
    title: String,
    description: Option<String>,
    due_date: option::Option<u64>,
    assignees: Option<vector<address>>,
}