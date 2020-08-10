FROM mysql:5

ENV MYSQL_ROOT_PASSWORD=reliable

ENV innodb_temp_data_file_path = ibtmp1:12M:autoextend:max:5G

COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d
