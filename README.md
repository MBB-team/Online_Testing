# Online_testing
Codes for Online Testing Using JavaScript and JsPsych 

# Installation
```bash
# Copy .env.tpl to .env. Then :
docker system prune --all --force # Reset docker
docker-compose up --force-recreate # Start docker images : see docker-compose.yml
```
Wait for mariadb initialization before connecting with a client :   
mariadb-docker_1  | 2020-05-06 11:24:35 0 [Note] mysqld: ready for connections.   

# Command line to php or mariadb
```bash
docker-compose exec php bash
```

# Debug
To debug php, use Vscode with Xdebug.   
To debug js, use Chrome debug tool.   
To debug sql, use Dbeaver.

# Information
https://github.com/MBB-team/Online_Testing   
experiment_RSVP.html : main app entry point.   
write_data.php : get data and write to db.   
create_tableemo.sql : create table.   
jsPsych-master : web framework.   
