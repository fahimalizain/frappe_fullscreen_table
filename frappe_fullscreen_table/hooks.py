# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "frappe_fullscreen_table"
app_title = "Frappe Fullscreen Table"
app_publisher = "faztp12"
app_description = "Provides fullscreen table edit support for Frappe Framewokr"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "faztp12@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/frappe_fullscreen_table/css/frappe_fullscreen_table.css"
# app_include_js = "/assets/frappe_fullscreen_table/js/frappe_fullscreen_table.js"
app_include_js = "/assets/js/frappe_fullscreen_table.min.js"

# include js, css files in header of web template
# web_include_css = "/assets/frappe_fullscreen_table/css/frappe_fullscreen_table.css"
# web_include_js = "/assets/frappe_fullscreen_table/js/frappe_fullscreen_table.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "frappe_fullscreen_table.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "frappe_fullscreen_table.install.before_install"
# after_install = "frappe_fullscreen_table.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "frappe_fullscreen_table.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"frappe_fullscreen_table.tasks.all"
# 	],
# 	"daily": [
# 		"frappe_fullscreen_table.tasks.daily"
# 	],
# 	"hourly": [
# 		"frappe_fullscreen_table.tasks.hourly"
# 	],
# 	"weekly": [
# 		"frappe_fullscreen_table.tasks.weekly"
# 	]
# 	"monthly": [
# 		"frappe_fullscreen_table.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "frappe_fullscreen_table.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "frappe_fullscreen_table.event.get_events"
# }

