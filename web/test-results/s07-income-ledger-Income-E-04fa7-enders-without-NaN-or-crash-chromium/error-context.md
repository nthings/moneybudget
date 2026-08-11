# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s07-income-ledger.spec.ts >> Income Entries Ledger (/allocator) >> UAT-S07-01: empty income state renders without NaN or crash
- Location: e2e/s07-income-ledger.spec.ts:68:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_string: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_unset: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_double: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strcmp0: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_notify: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_object: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_get_version: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ascii_strcasecmp: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_float: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_character_count: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_ref: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_float: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_int: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_int64: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_string: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_slist_reverse: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_attribute_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_malloc: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_slist_prepend: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ptr_array_new_with_free_func: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ptr_array_add: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_remove_weak_pointer: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_add_weak_pointer: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_signal_query: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strconcat: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_quark_to_string: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_add_global_event_listener: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_no_op_object_new: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_remove_global_event_listener: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_role: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_pointer: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_double: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_object: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_uint: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strdup_value_contents: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_ref_state_set: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_state_set_contains_state: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_state_type_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_init: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_listener_new: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_listener_register: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_clear_error: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_listener_deregister: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_application: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_process_id: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_attributes: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_lookup: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_unref: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_role: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_state_set: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_state_set_get_states: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_array_free: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_boxed_free: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_get_type: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_child_count: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_child_at_index: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_relation_set: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_relation_get_relation_type: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_relation_get_n_targets: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_relation_get_target: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_get_desktop: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_iter_init: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_iter_next: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_array_unref: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_role_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_description: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_parent: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_interfaces: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_text: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hypertext_get_n_links: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hypertext_get_link: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hyperlink_get_start_index: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_utf8_offset_to_pointer: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_caret_offset: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_selection: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_run_attributes: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_slist_foreach: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_attribute_set_free: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_action_get_n_actions: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_action_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_ref_relation_set: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_set_contains: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_set_get_relation_by_type: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_type_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_get_target: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_value_get_current_value: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_value_get_minimum_value: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_value_get_maximum_value: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_n_columns: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_column_description: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_n_rows: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_row_description: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_caption: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_row_extent_at: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_column_extent_at: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_cell_get_row_column_span: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_cell_get_column_header_cells: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ptr_array_unref: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_cell_get_row_header_cells: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_description: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_attributes: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_open: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_id: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_set_client_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_create_simple_port: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_subscribe_sizeof: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_subscribe_set_sender: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_subscribe_set_dest: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_subscribe_port: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_no_status: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_encode_byte: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_event_output_direct: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_poll_descriptors: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_event_input: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_event_input_pending: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_decode: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_sizeof: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_get_any_client_info: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_get_type: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_sizeof: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_get_any_port_info: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_capability: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_type: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_sizeof: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_hwdep_info_sizeof: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_open: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_close: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_get_name: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_get_longname: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_get_driver: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_rawmidi_next_device: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_hwdep_next_device: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_hwdep_info: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_hwdep_info_get_iface: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_set_client: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_query_next_client: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_get_client: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_set_client: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_set_port: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_query_next_port: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_addr: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_delete_simple_port: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_new: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_close: symbol not found
[pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_free: symbol not found
Call log:
  - <launching> /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,BlockOriginHeaderModificationOnRedirect,Translate,AutoDeElevate,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/tmp/playwright_chromiumdev_profile-NhOknn --remote-debugging-pipe --no-startup-window
  - <launched> pid=255
  - [pid=255][err] Error loading shared library libglib-2.0.so.0: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libgobject-2.0.so.0: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libnspr4.so: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libnss3.so: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libnssutil3.so: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libgio-2.0.so.0: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libatk-1.0.so.0: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libatk-bridge-2.0.so.0: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libdbus-1.so.3: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libX11.so.6: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libXcomposite.so.1: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libXdamage.so.1: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libXext.so.6: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libXfixes.so.3: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libXrandr.so.2: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libgbm.so.1: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libexpat.so.1: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libxcb.so.1: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libxkbcommon.so.0: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libudev.so.1: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libasound.so.2: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error loading shared library libatspi.so.0: No such file or directory (needed by /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell)
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_schema_source_get_default: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_schema_source_lookup: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_new_full: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_schema_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_is_floating: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_ref_sink: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_modifier: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_destroy: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_create_device: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_plane_count: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_device: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_device_get_fd: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_handle_for_plane: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_stride_for_plane: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_offset: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_handle: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_map: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_width: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_get_height: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_unmap: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_create: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_create_with_modifiers: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_bo_import: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_device_is_format_supported: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: gbm_device_destroy: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XMissingExtension: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: _XGetRequest: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: _XReply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: _XEatData: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: _XRead: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XextFindDisplay: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XextAddDisplay: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XextRemoveDisplay: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: _XSetLastRequestRead: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_connect: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_connection_has_error: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_disconnect: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_query_tree: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_query_tree_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_setup_roots_iterator: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_setup: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_input_focus_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_input_focus: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_screen_allowed_depths_iterator: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_depth_visuals_iterator: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_visualtype_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_depth_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_geometry: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_geometry_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_window_attributes: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_window_attributes_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XOpenDisplay: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFree: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetVisualInfo: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCloseDisplay: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetGeometry: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XSetErrorHandler: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetWindowAttributes: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XSync: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFlush: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XDestroyWindow: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCreateColormap: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCreateWindow: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XMapWindow: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFreeColormap: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XResizeWindow: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetErrorText: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: posix_fallocate64: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_add_poll: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_set_can_recurse: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_context_get_thread_default: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_context_default: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_attach: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_set_priority: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_destroy: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_open: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_device_name_hint: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_device_name_get_hint: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_device_name_free_hint: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_card_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_close: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_prepare: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_drain: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_drop: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_delay: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_resume: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_writei: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_readi: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_recover: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_set_params: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_get_params: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_malloc: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_any: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_can_resume: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_set_rate_resample: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_set_rate_near: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_test_format: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_format_size: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_get_channels_min: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_set_format: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_set_access: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_set_channels: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_set_buffer_size_near: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_set_period_size_near: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_hw_params_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_sw_params_malloc: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_sw_params_current: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_sw_params_set_start_threshold: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_sw_params_set_avail_min: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_sw_params: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_sw_params_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_avail_update: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_state: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_strerror: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_pcm_start: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_open: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_attach: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_register: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_detach: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_close: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_load: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_first_elem: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_elem_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_is_active: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_set_capture_volume_all: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_get_capture_volume: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_has_capture_volume: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_get_capture_volume_range: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_elem_get_callback_private: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_elem_set_callback: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_elem_set_callback_private: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_find_selem: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_handle_events: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_poll_descriptors: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_poll_descriptors_count: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_get_playback_switch: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_get_playback_volume: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_get_playback_volume_range: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_ask_playback_vol_dB: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_ask_playback_dB_vol: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_has_playback_switch: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_has_playback_volume: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_id_set_index: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_id_set_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_set_playback_switch: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_set_playback_switch_all: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_set_playback_volume_all: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_id_malloc: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_mixer_selem_id_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_log_set_handler: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_context_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_context_push_thread_default: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_source_set_callback: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_context_iteration: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_depth: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_context_pop_thread_default: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_main_context_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_FreeSlot: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_get_child: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_signal_connect_data: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_check_instance_cast: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_get_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_get_boolean: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_get_int: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_settings_get_strv: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_DestroyCertList: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_CreateSubjectCertList: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_GetDefaultCertDB: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PR_Now: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_ListCertsInSlot: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_ListCerts: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_FindCertByDERCert: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_GetCertTrust: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_GetModule: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_FindGenericObjects: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECITEM_FreeItem: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECITEM_AllocItem: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_ReadRawAttribute: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_GetNextGenericObject: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_IsUserCert: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_DestroyCertificate: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECMOD_GetDefaultModuleList: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_IsPresent: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_FindCertInSlot: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_ReferenceSlot: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_HasRootCerts: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_HasAttributeSet: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_DestroyGenericObjects: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: CERT_DupCertificate: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_GetTokenName: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: NSS_VersionCheck: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECMOD_GetDefaultModuleListLock: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECMOD_GetReadLock: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECMOD_ReleaseReadLock: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECMOD_LoadUserModule: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: SECMOD_DestroyModule: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PR_GetErrorTextLength: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PR_GetErrorText: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PR_GetError: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: NSS_InitReadWrite: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: NSS_NoDB_Init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_SetPasswordFunc: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_GetInternalKeySlot: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_NeedUserInit: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PK11_InitPin: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: NSS_SetAlgorithmPolicy: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PR_GetOSError: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: PR_Init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFixesQueryExtension: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFixesSelectCursorInput: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XQueryPointer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XTranslateCoordinates: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFixesGetCursorImage: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XQueryTree: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCreateGC: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XSelectInput: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XDamageQueryExtension: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XDamageCreate: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFixesCreateRegion: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XDamageDestroy: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XRRQueryExtension: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XRRQueryVersion: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XRRSelectInput: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetAtomName: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XRRUpdateConfiguration: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XDamageSubtract: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFixesFetchRegionAndBounds: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFreeGC: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFixesDestroyRegion: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XPending: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XNextEvent: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCompositeQueryExtension: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCompositeQueryVersion: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCompositeRedirectWindow: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XRaiseWindow: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XInternAtom: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XSendEvent: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetWMName: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: Xutf8TextPropertyToTextList: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFreeStringList: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XScreenCount: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XRootWindow: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetClassHint: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XFreePixmap: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XShmDetach: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XShmQueryVersion: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XShmCreateImage: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XShmAttach: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XShmPixmapFormat: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XShmCreatePixmap: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XShmGetImage: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XCopyArea: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetImage: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XGetWindowProperty: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_cancellable_cancel: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_get_connection: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_cancellable_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_new_finish: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_error_matches: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_io_error_quark: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_call_finish: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_get_child: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_get: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_lookup_value: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_get_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_connection_signal_subscribe: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_builder_init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_builder_add: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_new_uint32: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_new_boolean: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_get_cached_property: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_new_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strdup_printf: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_random_int_range: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_call: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_lookup: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_iter_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_call_with_unix_fd_list: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_call_with_unix_fd_list_finish: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_unix_fd_list_get: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_error_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_iter_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_connection_get_unique_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_connection_signal_unsubscribe: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_proxy_new_for_bus: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_message_new_method_call: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_connection_send_message: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_get_language_names: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_SetHashSalt: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_SetUserData: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_SetElementHandler: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_SetCharacterDataHandler: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_SetEntityDeclHandler: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_Parse: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_GetBuffer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_ParseBuffer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_ParserFree: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_ParserCreate_MM: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: XML_StopParser: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_poll_for_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_get_file_descriptor: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_parse_display: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_flush: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_poll_for_queued_event: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_poll_for_event: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_send_fd: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_send_request: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_wait_for_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_request_check: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xcb_generate_id: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_context_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_context_include_path_append: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_new_from_buffer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_min_keycode: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_max_keycode: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_num_layouts_for_key: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_num_levels_for_key: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_key_get_syms_by_level: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_update_mask: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_num_mods: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_get_keymap: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_mod_index_is_active: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_key_get_syms: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_key_get_one_sym: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_key_get_utf32: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_context_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_state_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: xkb_keymap_mod_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_threads_init_default: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_open_private: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_open: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_get_private: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_get: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_register: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_set_exit_on_disconnect: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_close: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_request_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_release_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_set_watch_functions: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_set_timeout_functions: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_set_dispatch_status_function: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_send_with_reply_and_block: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_type_to_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_path: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_interface: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_member: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_send_with_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_send: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_add_filter: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_remove_filter: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_add_match: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_remove_match: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_try_register_object_path: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_try_register_fallback: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_unregister_object_path: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_get_dispatch_status: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_connection_dispatch: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_bus_get_unique_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_watch_get_data: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_timeout_get_data: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_ref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_is_signal: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_watch_set_data: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_watch_get_enabled: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_watch_get_unix_fd: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_watch_get_flags: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_watch_handle: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_timeout_set_data: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_timeout_get_enabled: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_timeout_handle: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_timeout_get_interval: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_get_version: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_validate_bus_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_set_destination: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_set_path: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_validate_interface: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_set_interface: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_validate_member: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_set_member: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_destination: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_error_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_sender: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_signature: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_serial: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_get_reply_serial: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_new_method_return: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_new_error: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_init_append: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_open_container: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_close_container: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_append_fixed_array: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_append_basic: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_get_arg_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_get_fixed_array: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_get_signature: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_get_basic: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_message_iter_recurse: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_pending_call_cancel: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_pending_call_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_pending_call_set_notify: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_pending_call_steal_reply: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_error_init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_error_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: dbus_error_is_set: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_action: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_devnode: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_devtype: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_driver: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_parent: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_parent_with_subsystem_devtype: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_properties_list_entry: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_property_value: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_subsystem: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_sysattr_value: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_sysname: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_get_syspath: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_new_from_devnum: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_new_from_subsystem_sysname: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_new_from_syspath: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_device_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_enumerate_add_match_subsystem: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_enumerate_get_list_entry: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_enumerate_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_enumerate_scan_devices: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_enumerate_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_list_entry_get_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_list_entry_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_monitor_enable_receiving: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_monitor_filter_add_match_subsystem_devtype: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_monitor_get_fd: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_monitor_new_from_netlink: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_monitor_receive_device: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_monitor_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: udev_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_from_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_register_static: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_add_interface_static: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_component_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_action_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_document_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_image_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_value_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hyperlink_impl_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hypertext_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_window_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_selection_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_cell_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_initialize: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_return_if_fail_warning: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_once_init_enter: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hyperlink_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_once_init_leave: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_check_class_cast: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_class_peek_parent: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_class_add_private: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strdup: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_check_instance_is_a: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_instance_get_private: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_bus_get_sync: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_dbus_connection_call_sync: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_variant_get_boolean: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_class_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_class_ref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_bridge_adaptor_init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_register_static_simple: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_util_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_intern_static_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_class_adjust_private_offset: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_type_class_peek: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_state_type_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_state_set_add_state: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_type_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_set_add_relation_by_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_set_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_notify_state_change: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_signal_emit_by_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_unset: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_double: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strcmp0: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_notify: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_object: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_get_version: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ascii_strcasecmp: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_set_float: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_character_count: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_ref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_float: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_int: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_int64: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_slist_reverse: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_attribute_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_malloc: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_slist_prepend: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ptr_array_new_with_free_func: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ptr_array_add: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_remove_weak_pointer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_object_add_weak_pointer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_signal_query: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strconcat: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_quark_to_string: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_add_global_event_listener: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_no_op_object_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_remove_global_event_listener: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_role: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_pointer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_double: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_object: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_value_get_uint: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_strdup_value_contents: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_ref_state_set: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_state_set_contains_state: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_state_type_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_listener_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_listener_register: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_clear_error: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_listener_deregister: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_application: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_process_id: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_attributes: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_lookup: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_role: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_state_set: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_state_set_get_states: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_array_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_boxed_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_event_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_child_count: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_child_at_index: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_relation_set: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_relation_get_relation_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_relation_get_n_targets: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_relation_get_target: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_get_desktop: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_iter_init: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_hash_table_iter_next: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_array_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_role_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_description: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_parent: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atspi_accessible_get_interfaces: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_text: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hypertext_get_n_links: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hypertext_get_link: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_hyperlink_get_start_index: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_utf8_offset_to_pointer: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_caret_offset: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_selection: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_text_get_run_attributes: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_slist_foreach: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_attribute_set_free: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_action_get_n_actions: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_action_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_ref_relation_set: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_set_contains: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_set_get_relation_by_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_type_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_relation_get_target: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_value_get_current_value: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_value_get_minimum_value: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_value_get_maximum_value: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_n_columns: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_column_description: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_n_rows: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_row_description: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_caption: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_row_extent_at: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_get_column_extent_at: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_cell_get_row_column_span: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_cell_get_column_header_cells: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: g_ptr_array_unref: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_table_cell_get_row_header_cells: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_description: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: atk_object_get_attributes: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_open: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_id: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_set_client_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_create_simple_port: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_subscribe_sizeof: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_subscribe_set_sender: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_subscribe_set_dest: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_subscribe_port: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_no_status: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_encode_byte: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_event_output_direct: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_poll_descriptors: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_event_input: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_event_input_pending: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_decode: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_sizeof: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_get_any_client_info: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_sizeof: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_get_any_port_info: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_capability: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_type: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_sizeof: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_hwdep_info_sizeof: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_open: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_close: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_get_name: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_get_longname: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_card_info_get_driver: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_rawmidi_next_device: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_hwdep_next_device: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_ctl_hwdep_info: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_hwdep_info_get_iface: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_set_client: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_query_next_client: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_client_info_get_client: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_set_client: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_set_port: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_query_next_port: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_port_info_get_addr: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_delete_simple_port: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_new: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_seq_close: symbol not found
  - [pid=255][err] Error relocating /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell: snd_midi_event_free: symbol not found
  - [pid=255] <gracefully close start>
  - [pid=255] <kill>
  - [pid=255] <will force kill>
  - [pid=255] <process did exit: exitCode=127, signal=null>
  - [pid=255] starting temporary directories cleanup
  - [pid=255] finished temporary directories cleanup
  - [pid=255] <gracefully close end>

```

```
TypeError: Cannot read properties of undefined (reading 'close')
```

# Test source

```ts
  1   | /**
  2   |  * S07 UAT — Income Entries Ledger
  3   |  *
  4   |  * Tests the income_entries CRUD flow on /allocator:
  5   |  *   - Empty state (no entries) → no NaN, empty-state copy, add form visible
  6   |  *   - Add first entry → appears in list
  7   |  *   - Add second entry → both visible
  8   |  *   - Delete entry → removed from list
  9   |  *   - Budget/Actual Balance cards never show NaN throughout
  10  |  *
  11  |  * Preconditions:
  12  |  *   - Stack running: docker compose up -d (project root)
  13  |  *   - User account exists (run S01 UAT or sign up first)
  14  |  *
  15  |  * Run: cd web && npx playwright test e2e/s07-income-ledger.spec.ts
  16  |  *   Or: BASE_URL=http://192.168.68.12:3010 npx playwright test e2e/s07-income-ledger.spec.ts
  17  |  */
  18  | 
  19  | import { test, expect, type Page } from "@playwright/test"
  20  | 
  21  | const USER = { email: "E2E_TEST_USER_EMAIL", password: "REDACTED" }
  22  | 
  23  | async function signIn(page: Page): Promise<void> {
  24  |   await page.goto("/sign-in")
  25  |   await page.getByLabel("Email").fill(USER.email)
  26  |   await page.getByLabel("Password").fill(USER.password)
  27  |   await page.getByRole("button", { name: "Sign in" }).click()
  28  |   await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  29  | }
  30  | 
  31  | /** Returns a date string in YYYY-MM-DD format for the given day in the current month. */
  32  | function currentMonthDate(day: number): string {
  33  |   const d = new Date()
  34  |   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  35  | }
  36  | 
  37  | test.describe("Income Entries Ledger (/allocator)", () => {
  38  |   test.describe.configure({ mode: "serial" })
  39  | 
  40  |   // pg is assigned in beforeAll before any test in this describe block runs.
  41  |   // eslint-disable-next-line prefer-const
  42  |   let pg!: Page
  43  | 
  44  |   test.beforeAll(async ({ browser }) => {
  45  |     pg = await browser.newPage()
  46  |     await signIn(pg)
  47  |     await pg.goto("/allocator")
  48  |     await expect(pg).toHaveURL(/\/allocator/)
  49  | 
  50  |     // ── Cleanup: delete all pre-existing income entries ────────────────────
  51  |     // aria-label starts with "Delete income entry:" — force:true bypasses
  52  |     // the opacity-0 group-hover visibility gate.
  53  |     const deleteButtons = pg.getByRole("button", { name: /^Delete income entry:/i })
  54  |     let count = await deleteButtons.count()
  55  |     while (count > 0) {
  56  |       await deleteButtons.first().click({ force: true })
  57  |       await expect(deleteButtons).toHaveCount(count - 1, { timeout: 5_000 })
  58  |       count -= 1
  59  |     }
  60  |   })
  61  | 
  62  |   test.afterAll(async () => {
> 63  |     await pg.close()
      |              ^ TypeError: Cannot read properties of undefined (reading 'close')
  64  |   })
  65  | 
  66  |   // ─── UAT-S07-01: Empty state ──────────────────────────────────────────────
  67  | 
  68  |   test("UAT-S07-01: empty income state renders without NaN or crash", async () => {
  69  |     // Empty-state copy
  70  |     await expect(pg.getByText(/No income recorded this month/)).toBeVisible()
  71  |     // Add form is still accessible
  72  |     await expect(
  73  |       pg.getByPlaceholder("Description (e.g. Salary, Freelance)"),
  74  |     ).toBeVisible()
  75  |     // No NaN anywhere on the page
  76  |     await expect(pg.locator("body")).not.toContainText("NaN")
  77  |   })
  78  | 
  79  |   // ─── UAT-S07-02: Add first income entry ────────────────────────────────────
  80  | 
  81  |   test("UAT-S07-02: add first entry — appears in list", async () => {
  82  |     await pg
  83  |       .getByPlaceholder("Description (e.g. Salary, Freelance)")
  84  |       .fill("Salary Aug 1st")
  85  |     await pg.getByPlaceholder("0.00").fill("2500")
  86  |     await pg.locator('input[type="date"]').fill(currentMonthDate(1))
  87  |     await pg.getByRole("button", { name: "Add" }).click()
  88  | 
  89  |     await expect(pg.getByText("Income entry added.")).toBeVisible({ timeout: 5_000 })
  90  |     await expect(pg.getByText("Salary Aug 1st")).toBeVisible()
  91  |     await expect(pg.locator("body")).not.toContainText("NaN")
  92  |   })
  93  | 
  94  |   // ─── UAT-S07-03: Add second entry — both visible, counter accumulates ──────
  95  | 
  96  |   test("UAT-S07-03: add second entry — both entries visible in list", async () => {
  97  |     await pg
  98  |       .getByPlaceholder("Description (e.g. Salary, Freelance)")
  99  |       .fill("Freelance Aug 5th")
  100 |     await pg.getByPlaceholder("0.00").fill("800")
  101 |     await pg.locator('input[type="date"]').fill(currentMonthDate(5))
  102 |     await pg.getByRole("button", { name: "Add" }).click()
  103 | 
  104 |     await expect(pg.getByText("Income entry added.")).toBeVisible({ timeout: 5_000 })
  105 |     await expect(pg.getByText("Freelance Aug 5th")).toBeVisible()
  106 |     await expect(pg.getByText("Salary Aug 1st")).toBeVisible()
  107 |     await expect(pg.locator("body")).not.toContainText("NaN")
  108 |   })
  109 | 
  110 |   // ─── UAT-S07-04: Delete entry — removed from list ─────────────────────────
  111 | 
  112 |   test("UAT-S07-04: delete an entry — removed from list, other entry remains", async () => {
  113 |     const freelanceRow = pg.locator("li").filter({ hasText: "Freelance Aug 5th" })
  114 |     await freelanceRow.hover()
  115 |     await freelanceRow
  116 |       .getByRole("button", { name: /Delete income entry: Freelance Aug 5th/i })
  117 |       .click({ force: true })
  118 | 
  119 |     await expect(pg.getByText("Freelance Aug 5th")).not.toBeVisible({ timeout: 5_000 })
  120 |     // Salary entry still present
  121 |     await expect(pg.getByText("Salary Aug 1st")).toBeVisible()
  122 |     await expect(pg.locator("body")).not.toContainText("NaN")
  123 |   })
  124 | 
  125 |   // ─── UAT-S07-05: ZBB counter cards free of NaN ────────────────────────────
  126 | 
  127 |   test("UAT-S07-05: Budget Balance and Actual Balance cards show without NaN", async () => {
  128 |     await expect(pg.getByText("Budget Balance")).toBeVisible()
  129 |     await expect(pg.getByText("Actual Balance")).toBeVisible()
  130 |     await expect(pg.locator("body")).not.toContainText("NaN")
  131 |   })
  132 | })
  133 | 
```