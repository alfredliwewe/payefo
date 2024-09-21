```sql
ALTER TABLE `lessons` ADD `active_from` TEXT NULL AFTER `date_added`, ADD `active_to` TEXT NULL AFTER `active_from`;
UPDATE `lessons` SET active_from = date_added, active_to = date_added + (24*7*3600) WHERE 1;
```