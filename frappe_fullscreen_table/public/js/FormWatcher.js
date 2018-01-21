// Only on desktop
if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	$(window).on('hashchange', setup_form);
	$(window).on('load', setup_form);
}

function setup_form(event) {
	var route = frappe.get_route();	
	
	if (route[0] === "Form") {
		frappe.ui.form.on(route[1], "onload", function() {
			$.each(cur_frm.fields_dict, function(i, field) {
				if (field.df.fieldtype === "Table" && field.grid != null) {
					field.grid.add_custom_button("Full Screen Edit", function() 
					{
						var d = new frappe.ui.Dialog({
							'fields' : [
								{'fieldname': 'table', 'fieldtype': 'HTML'}
							]
						});
						
						var table = frappe.ui.form.make_control({						
							df: field.df,
							parent: d.fields_dict.table.$wrapper,
							frm: cur_frm
						});
						table.make();
						// in
						table.refresh();
						
						
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
}