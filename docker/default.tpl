## Version 2020/03/05 - Changelog: https://github.com/linuxserver/docker-letsencrypt/commits/master/root/defaults/default

# redirect all traffic to https
server {
	listen 80 default_server;
	listen [::]:80 default_server;
	server_name _;
	return 301 https://$host$request_uri;
}

# main server block
server {
	listen 443 ssl http2 default_server;
	listen [::]:443 ssl http2 default_server;

	root /config/www;
	index index.html index.htm index.php;

	server_name _;

	# enable subfolder method reverse proxy confs
	include /config/nginx/proxy-confs/*.subfolder.conf;

	# all ssl related config moved to ssl.conf
	include /config/nginx/ssl.conf;

	# enable for ldap auth
	#include /config/nginx/ldap.conf;

	client_max_body_size 0;

    location / {
        proxy_pass http://php-docker:80/;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

# sample reverse proxy config for password protected couchpotato running at IP 192.168.1.50 port 5050 with base url "cp"
# notice this is within the same server block as the base
# don't forget to generate the .htpasswd file as described on docker hub
#	location ^~ /cp {
#		auth_basic "Restricted";
#		auth_basic_user_file /config/nginx/.htpasswd;
#		include /config/nginx/proxy.conf;
#		proxy_pass http://192.168.1.50:5050/cp;
#	}

}

# sample reverse proxy config without url base, but as a subdomain "cp", ip and port same as above
# notice this is a new server block, you need a new server block for each subdomain
#server {
#	listen 443 ssl http2;
#	listen [::]:443 ssl http2;
#
#	root /config/www;
#	index index.html index.htm index.php;
#
#	server_name cp.*;
#
#	include /config/nginx/ssl.conf;
#
#	client_max_body_size 0;
#
#	location / {
#		auth_basic "Restricted";
#		auth_basic_user_file /config/nginx/.htpasswd;
#		include /config/nginx/proxy.conf;
#		proxy_pass http://192.168.1.50:5050;
#	}
#}

# sample reverse proxy config for "heimdall" via subdomain, with ldap authentication
# ldap-auth container has to be running and the /config/nginx/ldap.conf file should be filled with ldap info
# notice this is a new server block, you need a new server block for each subdomain
#server {
#	listen 443 ssl http2;
#	listen [::]:443 ssl http2;
#
#	root /config/www;
#	index index.html index.htm index.php;
#
#	server_name heimdall.*;
#
#	include /config/nginx/ssl.conf;
#
#	include /config/nginx/ldap.conf;
#
#	client_max_body_size 0;
#
#	location / {
#		# the next two lines will enable ldap auth along with the included ldap.conf in the server block
#		auth_request /auth;
#		error_page 401 =200 /login;
#
#		include /config/nginx/proxy.conf;
#		resolver 127.0.0.11 valid=30s;
#		set $upstream_app heimdall;
#		set $upstream_port 443;
#		set $upstream_proto https;
#		proxy_pass $upstream_proto://$upstream_app:$upstream_port;
#	}
#}

# enable subdomain method reverse proxy confs
include /config/nginx/proxy-confs/*.subdomain.conf;
# enable proxy cache for auth
proxy_cache_path cache/ keys_zone=auth_cache:10m;
