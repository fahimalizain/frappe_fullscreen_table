# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe

__version__ = '0.0.1'

@frappe.whitelist()
def save_column_order(key, value, override = False):
	
	from frappe.defaults import clear_default, set_default
	if override:
		clear_default(key=key)
	
	set_default(key, value, "__default" if override else frappe.session.user)
	return True