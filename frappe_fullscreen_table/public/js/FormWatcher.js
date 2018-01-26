frappe.provide("frappe_fullscreen_table");

$.extend(frappe_fullscreen_table, {
	setup_form: function(event) {
		var route = frappe.get_route();	
		
		if (route[0] === "Form") {
			frappe.ui.form.on(route[1], "onload", function() {
				$.each(cur_frm.fields_dict, function(i, field) {
					if (field.df.fieldtype === "Table" && field.grid != null) {
						field.grid.add_custom_button("Full Screen Edit", function() 
						{
							// d.table is gird obj ref
							var d = new frappe.ui.Dialog({
								fields : [
									{'fieldname': 'table', 'fieldtype': 'HTML'},
									{'label': __("Customize"), 'fieldname': 'customize', 'fieldtype': 'Button' }
								]
							});
							// customize button
							d.field = field;
							d.fields_dict.customize.onclick = function() { frappe_fullscreen_table.customize_columns(d); };
							frappe_fullscreen_table.set_parent_dialog_attr(d);
							frappe_fullscreen_table.setup_grid_table(d);
							
							var refresh_table_fn = function() {						
								// for any link fields server fetch
								setTimeout(function() {							
									frappe.after_ajax(function() {
										table.refresh();
									});
								}, 500);
							}
							// refresh table on any change
							// depends on https://github.com/frappe/frappe/blob/develop/frappe/public/js/frappe/model/model.js#L416
							// frappe.model.events[doc.doctype]['*'] - this line should be there
							frappe.model.on(field.df.options, "*", refresh_table_fn);
							
							// event fn called from frappe.ui.dialog.make() https://github.com/frappe/frappe/blob/develop/frappe/public/js/frappe/ui/dialog.js#L57
							// Triggers on hide:
							// me.onhide && me.onhide();
							// me.on_hide && me.on_hide();
							d.onhide = function() {
								// unsubscribe
								// indexOf may not work in some browsers?
								$.each(frappe.model.events[field.df.options]["*"], function(i, handler) {
									if (handler == refresh_table_fn) {
										frappe.model.events[field.df.options]["*"].splice(i, 1);
									}
								});
								
								delete table;
							}
							
							// check from inspect
							d.$wrapper.find(".modal-dialog").width("95%");
							d.size = "large";
							d.show();
						});
					}
				}); 
			});
		}
	},
	
	setup_grid_table: function(d) {
		d.fields_dict.table.$wrapper.empty();
		var table = frappe.ui.form.make_control({						
			df: d.field.df,
			parent: d.fields_dict.table.$wrapper,
			frm: cur_frm
		});
		d.table = table;
		frappe_fullscreen_table.setup_custom_visible_columns(d);
		// Set grid.visible_columns before make and refresh
		table.refresh();
		table.make();
	},
	
	set_parent_dialog_attr: function(d) {
		var key = frappe_fullscreen_table.get_default_key_string(d.field);
		var data_columns = frappe.defaults.get_default(key);
		if (!data_columns) {
			data_columns = frappe_fullscreen_table.get_default_visible_columns(d.field);
			frappe_fullscreen_table.save_column_order(key, data_columns, true);
		}
		
		// meta details on d.$wrapper
		d.$wrapper.attr("data-doctype", d.field.df.options);
		d.$wrapper.attr("data-label", d.field.df.label);
		d.$wrapper.attr("data-columns", data_columns);
	},
	
	get_parent_dialog_attr: function(d) {
		var parent = d.$wrapper;
		var attrs = { 
			doctype: parent.attr("data-doctype"),
			label: parent.attr("data-label"),
			columns: parent.attr("data-columns").split(","),
			widths: {}
		};
		
		attrs.column_names = $.map(attrs.columns, function(v) { return v.split("|")[0]; });
		
		$.each(attrs.columns, function(i, v) {
			var parts = v.split("|");
			attrs.widths[parts[0]] = parts[1] || "";
		});
		
		return attrs;
	},
	
	setup_custom_visible_columns: function(d) {
		
		d.table.grid.visible_columns = [];
		var attrs = frappe_fullscreen_table.get_parent_dialog_attr(d);
		
		var doc_fields = frappe.get_meta(attrs.doctype).fields;
		var docfields_by_name = {};
		
		$.each(doc_fields, function(j, f) {
			if(f) docfields_by_name[f.fieldname] = f;
		});
		
		$.each(attrs.column_names, function(i, name) {
			d.table.grid.visible_columns.push([docfields_by_name[name], attrs.widths[name]]);
		});
	},
	
	get_default_visible_columns: function(field) {
		// take from cur_frm table
		var data = "";
		$.each(cur_frm.fields_dict[field.df.fieldname].grid.visible_columns, function(i, obj) {
			if (i > 0)
				data += ",";
			data += obj[0].fieldname + "|" + obj[1];
		});
		return data;
	},
	
	get_default_key_string: function(field) {
		return frappe.model.scrub("ffe-" + field.doctype + "-" + field.df.fieldname);
	},
	
	customize_columns: function(parent_d) {
		var parent = parent_d.$wrapper;
		var attrs = frappe_fullscreen_table.get_parent_dialog_attr(parent_d);

		var d = new frappe.ui.Dialog({
			title: __("Select Table Columns for {0}", [attrs.label]),
		});

		var $body = $(d.body);

		var doc_fields = frappe.get_meta(attrs.doctype).fields;
		var docfields_by_name = {};

		// docfields by fieldname
		$.each(doc_fields, function(j, f) {
			if(f) docfields_by_name[f.fieldname] = f;
		})

		// add field which are in column_names first to preserve order
		var fields = [];
		$.each(attrs.column_names, function(i, v) {
			if(in_list(Object.keys(docfields_by_name), v)) {
				fields.push(docfields_by_name[v]);
			}
		})
		// add remaining fields
		$.each(doc_fields, function(j, f) {
			if (f && !in_list(attrs.column_names, f.fieldname)
				&& !in_list(["Section Break", "Column Break"], f.fieldtype) && f.label) {
				fields.push(f);
			}
		})
		// render checkboxes
		$(frappe.render_template("ffe_column_selector", {
			fields: fields,
			column_names: attrs.column_names,
			widths: attrs.widths
		})).appendTo(d.body);

		Sortable.create($body.find(".column-selector-list").get(0));

		var get_width_input = function(fieldname) {
			return $body.find(".column-width[data-fieldname='"+ fieldname +"']")
		}

		// update data-columns property on update
		d.set_primary_action(__("Update"), function() {
			var visible_columns = [];
			$body.find("input:checked").each(function() {
				var fieldname = $(this).attr("data-fieldname"),
					width = get_width_input(fieldname).val() || "";
				visible_columns.push(fieldname + "|" + width);
			});
			
			var column_order = visible_columns.join(",");
			frappe_fullscreen_table.save_column_order(frappe_fullscreen_table.get_default_key_string(parent_d.field), column_order);
			parent.attr("data-columns", column_order);
			frappe_fullscreen_table.setup_grid_table(parent_d);
			d.hide();
		});

		// enable / disable input based on selection
		$body.on("click", "input[type='checkbox']", function() {
			var disabled = !$(this).prop("checked"),
				input = get_width_input($(this).attr("data-fieldname"));

			input.prop("disabled", disabled);
			if(disabled) input.val("");
		});

		d.show();
	},
	
	save_column_order: function(key, value, override = false) {
		// update local
		frappe.defaults.﻿﻿set_user_default_local(key, value);
		// update server
		frappe.call({
			method: "frappe_fullscreen_table.save_column_order",
			args: {
				key: key,
				value: value,
				override: override
			},
			callback: function(r) {
				if (r.message)
					frappe.show_alert({message: __("Saved"), indicator: "green"});
			}
		});
	}
});

// d -> frappe.ui.Dialog
function customize_columns(parent_d) {
	
}

function calc_visible_columns(d) {
	
}

// Only on desktop
if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	$(window).on('hashchange', frappe_fullscreen_table.setup_form);
	$(window).on('load', frappe_fullscreen_table.setup_form);
}