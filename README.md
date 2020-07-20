# Online_testing
Codes for Online Testing Using JavaScript and JsPsych 

# Installation
1. Copy Online_Testing/.env.tpl to Online_Testing/.env   
2. Copy Online_Testing/portailLib/database_config_template.php to Online_Testing/portailLib/database_config.php   
3. Execute this :   
```bash
cd Online_Testing
sudo rm -rf Online_Testing/docker/letsencrypt
docker system prune --all --force # Reset docker
docker-compose up --force-recreate # Start docker images : see docker-compose.yml
```
4. Wait for mariadb initialization before connecting with a client :   
mariadb-docker_1  | 2020-05-06 11:24:35 0 [Note] mysqld: ready for connections.   
5. Connect with a browser
```bash
firefox http://localhost:50195/index.php
firefox http://localhost:50195/Emotion_Regulation_JS/index.php
```

# SQL
Exemple 1 : I want to INSERT new data in an existing table. => Use /sql/02.insert.xx_test.sql with INSERT statements.
Exemple 2 : I want to CREATE a new table. => Use /sql/01.create.xx_newtable.sql with CREATE statements.
Exemple 3 : I want to add or remove a column from an existing table. => Use /migration/01.alter.xx_alter.sql with ALTER statements.

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
sql : all sql files executed on start.   
src/index.php : main app entry point.   
src/task : tasks.   
src/task/jsPsych-master : web framework.   


# AWS
## 1. Config sur console aws
Amazon Linux 2 AMI (HVM), SSD Volume Type -(64-bit x86) / (64-bit Arm)   
t2-medium   
Network = ICONICS_VPC  
Subnet ICONICS_SUB_FRONT   
Auto assign pulic ip : Enabled (required for internet connection)   
8Go ssd (default)   
Security group : ICONICS_SG_WEB_FRONT   
Key pair : econics-staging : iconics-staging.pem   
Elastic ip : associer l'adresse

## 2. SSH
ssh -i "iconics-staging.pem" ec2-user@172.21.2.249 # replace ip with private ip
### Install and start Docker
sudo yum update -y   
sudo amazon-linux-extras install docker -y   
sudo service docker start   
### Add ec2-user to the Docker group
sudo usermod -a -G docker ec2-user  
sudo systemctl enable docker   
### Install Docker-Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose   
sudo chmod +x /usr/local/bin/docker-compose   
docker-compose --version   
### Set Timezone
sudo rm /etc/localtime   
sudo ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime
### Install git
sudo yum install -y git

## 3. Clone source code
git clone https://github.com/MBB-team/Online_Testing   
cd Online_Testing/   
git checkout prod

## 4. Config
cp .env.tpl .env
vim .env
cp src/portailLib/database_config_session_template.php src/portailLib/database_config_session.php
vim src/portailLib/database_config_session.php
cp src/portailLib/backofficeSecrets_template.php src/portailLib/backofficeSecrets.php
vim src/portailLib/backofficeSecrets.php

## 5. Configure letsencrypt
cd Online_Testing/   
docker-compose down --rmi all --volumes --remove-orphans   
docker system prune --all --force
docker volume prune -f
sudo rm -rf docker/letsencrypt
docker-compose -f docker-compose-prod.yml up --force-recreate
sudo vim /home/ec2-user/Online_Testing/docker/letsencrypt/nginx/site-confs/default
Change :
location / {
try_files $uri $uri/ /index.html /index.php?$args =404;
}
To :
location / {
  proxy_pass http://php-docker:80/;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
Delete section
location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        include /etc/nginx/fastcgi_params;
}
Then restart docker-compose :
docker-compose -f docker-compose-prod.yml up --force-recreate

## 6. Open ports on aws
New security group -> Allow https and mariadb port   
Assign security group

## 7. Connect to the url
firefox https://mbb-sondage.icm-institute.org/


# Create dump
docker-compose exec -T mariadb-docker bash -c "mysqldump -u root --password=${SQLpassword} databaseEmo > /save/dumps/${NOW}_refresh_dump.sql"

# Restaure dump
docker-compose exec -T mariadb-docker bash -c "mysqladmin -u root --password=${SQLpassword} -h localhost drop databaseEmo --force"
sleep 10
docker-compose exec -T mariadb-docker bash -c "mysql -u root --password=${SQLpassword} -h localhost -e 'create database databaseEmo;'"
sleep 3
docker-compose exec -T mariadb-docker bash -c "mysql -u root --password=${SQLpassword} -h localhost databaseEmo < /save/dumps/${NOW}_refresh_dump.sql"
countverifafter=`docker-compose exec -T mariadb-docker bash -c "mysql -u root --password=${SQLpassword} -h localhost -e 'select count(*) from databaseEmo.tableEmo;'" |tail -1`

# Deploy a new version
cd ~/Online_Testing   
docker-compose down
git checkout prod   
git pull   
docker-compose up -d   
