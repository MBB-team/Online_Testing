# Online_testing
Codes for Online Testing Using JavaScript and JsPsych.

# Installation
1. Clone the project
2. Copy Online_Testing/.env.tpl to Online_Testing/.env
3. Replace variables such as gitlab username and token in Online_Testing/.env
4. Ensure passwords are set in Online_Testing/portailLib/database_config.php and Online_Testing/src/portailLib/backofficeSecrets.php
5. Execute this :   
```bash
cd Online_Testing
./start.sh init
```
(Optional) Wait for mariadb initialization before connecting with a client :   
mariadb-docker_1  | 2020-05-06 11:24:35 0 [Note] mysqld: ready for connections.   
(Optional) Connect with a browser
```bash
google-chrome http://localhost:80/backofficeDashboard.php
google-chrome http://localhost:80/index.php
google-chrome http://localhost:80/Emotion_Regulation_JS/index.php
```

# SQL
Put all migration files in the folder ./migration

# Gitlab
All the CI (continuous integration) is managed by gitlab (./.gitlab-ci.yml).   
On each commit, 3 docker images (Base, Dev and Prod) are built and pushed to a private gitlab registry.
![Alt text](docs/infra/infra_doc.drawio.png?raw=true "Infrastructure")

# Command line to php or mariadb
```bash
docker-compose exec php bash
```

# Debug
To debug php, use Vscode with Xdebug. Find and replace your docker ip with `ip addr show docker0` in docker-compose.yml, section XDEBUG_CONFIG.   
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
```bash
# Install Docker
yum update -y
amazon-linux-extras install docker epel -y
systemctl start docker.service
systemctl enable docker
groupadd docker
usermod -aG docker $USER
newgrp docker

# Install Docker-Compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version

# Set Timezone
sudo rm /etc/localtime   
sudo ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime
```

## 3. Clone source code
```bash
git clone https://gitlab.com/icm-institute/mbb/cogmood/cogmood
cd cogmood/
git checkout develop
```

## 4. Config
```bash
cp .env.tpl .env
vim .env # set database password
cp src/portailLib/database_config_session_template.php src/portailLib/database_config_session.php
vim src/portailLib/database_config_session.php # set database password
cp src/portailLib/backofficeSecrets_template.php src/portailLib/backofficeSecrets.php
vim src/portailLib/backofficeSecrets.php # set backend password
```

## 5. Open ports on aws
New security group -> Allow https and mariadb port   
Assign security group

## 6. Connect to the url
google-chrome https://cogmood-staging.icm-institute.org/


# Create dump
```bash
docker-compose exec -T mariadb-docker bash -c "mysqldump -u root --password=${SQLpassword} databaseEmo > /save/dumps/${NOW}_refresh_dump.sql"
```

# Restore dump
```bash
docker-compose exec -T mariadb-docker bash -c "mysqladmin -u root --password=${SQLpassword} -h localhost drop databaseEmo --force"
sleep 10
docker-compose exec -T mariadb-docker bash -c "mysql -u root --password=${SQLpassword} -h localhost -e 'create database databaseEmo;'"
sleep 3
docker-compose exec -T mariadb-docker bash -c "mysql -u root --password=${SQLpassword} -h localhost databaseEmo < /dumps/${NOW}_refresh_dump.sql"
countverifafter=`docker-compose exec -T mariadb-docker bash -c "mysql -u root --password=${SQLpassword} -h localhost -e 'select count(*) from databaseEmo.tableEmo;'" |tail -1`
```

# Deploy a new version
```bash
cd ~/Online_Testing   
docker-compose down
git checkout prod   
git pull   
docker-compose up -d   
```
