FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=SQLInjectionPlayground
#ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=rootpassword

# Copy custom MySQL configuration
COPY my.cnf /etc/mysql/conf.d/

# Create directory for persistent data
RUN mkdir -p /var/lib/mysql-data

# Expose MySQL port
EXPOSE 3306

# Set the entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start MySQL server
CMD ["mysqld"] 